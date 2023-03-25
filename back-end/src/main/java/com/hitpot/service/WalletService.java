package com.hitpot.service;

import cn.hutool.core.util.StrUtil;
import com.hitpot.common.exception.HitpotExceptionEnum;
import com.hitpot.common.exception.HitpotException;
import com.hitpot.domain.*;
import com.hitpot.enums.BalanceType;
import com.hitpot.enums.StockType;
import com.hitpot.enums.TransactionStatus;
import com.hitpot.enums.TransactionType;
import com.hitpot.repo.*;
import com.hitpot.service.vo.ContentHitLeftVO;
import com.hitpot.service.vo.ContentNftDetailVO;
import com.hitpot.service.vo.ContentNftVO;
import com.hitpot.service.vo.WalletVO;
import com.hitpot.web.controller.req.ContentCollectForm;
import com.hitpot.web.controller.req.ContentPurchaseNftForm;
import com.hitpot.web.controller.req.ExchangeHitForm;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WalletService {
    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private ContentStockRepository contentStockRepository;
    @Autowired
    private ContentHitBalanceRepository contentHitBalanceRepository;
    @Autowired
    private UserTransactionRepository userTransactionRepository;
    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private ContentService contentService;
    @Autowired
    private MaterialService materialService;
    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    public WalletVO detailWallet(String userId) {
        Wallet wallet = walletRepository.findFirstByUserId(userId);
        QContentStock qContentStock = QContentStock.contentStock;
        List<Tuple> resultList = jpaQueryFactory
            .selectFrom(qContentStock)
            .select(
                qContentStock.contentId,
                qContentStock.userId,
                qContentStock.countIpNft.sum().as("amountIpNft")
            )
            .where(qContentStock.userId.eq(userId))
            .groupBy(qContentStock.contentId, qContentStock.userId)
            .fetch();

        return WalletVO.builder()
            .userId(userId)
            .balancePot(wallet.getBalancePot())
            .balanceHit(wallet.getBalanceHit())
            .nfts(resultList.stream()
                .map(tuple -> {
                    Long contentId = tuple.get(0, Long.class);
                    Long amount = tuple.get(2, Long.class);
                    Content content = contentService.getByContentId(contentId);
                    return ContentNftVO.builder()
                        .contentId(content.getId())
                        .title(content.getTitle())
                        .coverImgUrl(materialService.getMaterialUrl(content.getCoverImg()))
                        .amount(amount)
                        .build();
                })
                .sorted(Comparator.comparing(ContentNftVO::getContentId).reversed())
                .collect(Collectors.toList()))
            .build();
    }

    public void withdrawPot(String userId, Long amountPot) {
        Wallet wallet = walletRepository.findFirstByUserId(userId);
        if (wallet.getBalancePot() > 0 && wallet.getBalancePot() > amountPot) {
            wallet.setBalancePot(wallet.getBalancePot() - amountPot);
            walletRepository.save(wallet);
            // 保存提现记录
            UserTransaction userTransaction = UserTransaction.builder()
                .userId(userId)
                .transactionType(TransactionType.USER_POT_WITHDRAW_FROM_PLATFORM.getId())
                .status(TransactionStatus.PROCESSING.getId())
                .amountPot(amountPot)
                .amountHit(0L)
                .build();
            userTransactionRepository.save(userTransaction);

            // TODO 调用合约
        } else {
            throw new HitpotException(HitpotExceptionEnum.BALANCE_POT_NO_SUFFICIENT);
        }
    }

    public void contentCollectHit(String userId, ContentCollectForm contentCollectForm) {
        Wallet wallet = walletRepository.findFirstByUserId(userId);
        Content content = contentRepository.findById(contentCollectForm.getContentId()).orElse(null);
        if (content == null) {
            throw new HitpotException(HitpotExceptionEnum.CONTENT_NOT_EXIST);
        }

        if (wallet.getBalanceHit() > 0 && wallet.getBalanceHit() > contentCollectForm.getAmountHit()) {
            wallet.setBalanceHit(wallet.getBalanceHit() - contentCollectForm.getAmountHit());
            walletRepository.save(wallet);

            // 视频HIT增加, 保存注入HIT记录
            ContentHitBalance contentHitBalance = ContentHitBalance.builder()
                .userId(userId)
                .contentId(contentCollectForm.getContentId())
                .amountHit(contentCollectForm.getAmountHit())
                .balanceHit(contentCollectForm.getAmountHit())
                .balanceType(BalanceType.FUND_FOR_AD.getId())
                .adTitle(contentCollectForm.getAdTitle())
                .adLink(contentCollectForm.getAdLink())
                .build();
            if (StrUtil.isBlank(contentCollectForm.getAdLink()) && StrUtil.isBlank(contentCollectForm.getAdTitle())) {
                contentHitBalance.setBalanceType(BalanceType.FUND_FOR_PRESENT.getId());
            }
            contentHitBalanceRepository.save(contentHitBalance);
        } else {
            throw new HitpotException(HitpotExceptionEnum.BALANCE_HIT_NO_SUFFICIENT);
        }
    }

    public void purchaseContentNft(String userId, ContentPurchaseNftForm contentPurchaseNftForm) {
        Wallet wallet = walletRepository.findFirstByUserId(userId);
        Content content = contentService.getByContentId(contentPurchaseNftForm.getContentId());

        // TODO 判断NFT是否有剩余
        if (getLeftHit(content.getId()).getAmountHit() < contentPurchaseNftForm.getCount()) {
            throw new HitpotException(HitpotExceptionEnum.BALANCE_NFT_NO_SUFFICIENT);
        }

        // TODO 判断单投资者购买NFT的数量是否超过限制
        QContentStock qContentStock = QContentStock.contentStock;
        List<ContentStock> contentStockList = jpaQueryFactory.selectFrom(qContentStock)
            .from(qContentStock)
            .where(qContentStock.userId.eq(userId).and(qContentStock.contentId.eq(content.getId())))
            .fetchAll()
            .fetch();
        long totalCount = contentStockList.stream().mapToLong(ContentStock::getCountIpNft).sum();
        if (content.getCountIpNftForInvestor() > (totalCount + contentPurchaseNftForm.getCount())) {
            throw new HitpotException(HitpotExceptionEnum.NFT_EXCEED_LIMIT_PER_INVESTOR);
        }


        // 判断钱包的余额是否充足
        if (contentPurchaseNftForm.getAmountPot() > wallet.getBalancePot()) {
            throw new HitpotException(HitpotExceptionEnum.BALANCE_POT_NO_SUFFICIENT);
        }

        // 判断使用的amount是否符合限制
        long minimumAmount = content.getPriceIpNft() * contentPurchaseNftForm.getCount();
        if (contentPurchaseNftForm.getAmountPot() < minimumAmount) {
            throw new HitpotException(HitpotExceptionEnum.BALANCE_POT_NO_SUFFICIENT);
        }

        // 添加NFT购买记录
        ContentStock contentStock = ContentStock.builder()
            .userId(userId)
            .contentId(contentPurchaseNftForm.getContentId())
            .stockType(StockType.STOCKHOLDER.getId())
            .countIpNft(contentPurchaseNftForm.getCount())
            .priceIpNft(content.getPriceIpNft())
            .amountPot(contentPurchaseNftForm.getAmountPot())
            .build();
        contentStockRepository.save(contentStock);

        // 扣除余额
        wallet.setBalancePot(wallet.getBalancePot() - contentPurchaseNftForm.getAmountPot());
        walletRepository.save(wallet);

        // 更新创作者的NFT
        ContentStock creatorContentStock = contentStockRepository.findFirstByUserIdAndContentId(userId, content.getId());
        creatorContentStock.setCountIpNft(creatorContentStock.getCountIpNft() - contentStock.getCountIpNft());
        contentStockRepository.save(creatorContentStock);
    }

    /**
     * 创作者上传视频后, 将铸造的NFT分配给自己
     */
    protected void presentContentNftToCreator(String userId, ContentPurchaseNftForm contentPurchaseNftForm) {
        // 添加NFT购买记录
        ContentStock contentStock = ContentStock.builder()
            .userId(userId)
            .contentId(contentPurchaseNftForm.getContentId())
            .stockType(StockType.AUTHOR.getId())
            .countIpNft(contentPurchaseNftForm.getCount())
            .priceIpNft(0L)
            .amountPot(0L)
            .build();
        contentStockRepository.save(contentStock);
    }

    public void exchangeHit(String userId, ExchangeHitForm exchangeHitForm) {
        Wallet wallet = walletRepository.findFirstByUserId(userId);
    }

    /**
     * 获取视频的NFT信息
     */
    protected ContentNftDetailVO detailContentNft(Content content) {
        QContentStock qContentStock = QContentStock.contentStock;
        List<ContentStock> contentStockList = jpaQueryFactory.selectFrom(qContentStock)
            .from(qContentStock)
            .where(qContentStock.contentId.eq(content.getId()))
            .fetchAll()
            .fetch();
        Long soldCount = contentStockList.stream()
            .filter(contentStock -> StockType.STOCKHOLDER.getId() == contentStock.getStockType())
            .mapToLong(ContentStock::getCountIpNft).sum();
        return ContentNftDetailVO.builder()
            .contentId(content.getId())
            .countIpNftLeft(content.getCountIpNft())
            .countIpNftLeft(content.getCountIpNftForInvestor() - soldCount)
            .build();
    }

    /**
     * 获取视频的HIT余额
     */
    protected ContentHitLeftVO getLeftHit(Long contentId) {
        QContentHitBalance qContentHitBalance = QContentHitBalance.contentHitBalance;
        List<ContentHitBalance> contentHitBalanceList = jpaQueryFactory.selectFrom(qContentHitBalance)
            .from(qContentHitBalance)
            .where(qContentHitBalance.contentId.eq(contentId))
            .fetchAll()
            .fetch();
        long amountHitLeft = contentHitBalanceList.stream().mapToLong(ContentHitBalance::getBalanceHit).sum();
        return ContentHitLeftVO.builder().amountHit(amountHitLeft).contentId(contentId).build();
    }
}
