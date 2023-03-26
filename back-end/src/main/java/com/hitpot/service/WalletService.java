package com.hitpot.service;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;
import com.hitpot.common.DateUtils;
import com.hitpot.common.exception.HitpotException;
import com.hitpot.common.exception.HitpotExceptionEnum;
import com.hitpot.domain.*;
import com.hitpot.enums.*;
import com.hitpot.repo.*;
import com.hitpot.service.vo.*;
import com.hitpot.web.controller.req.*;
import com.hitpot.domain.*;
import com.hitpot.enums.*;
import com.hitpot.repo.*;
import com.hitpot.service.vo.*;
import com.hitpot.web.controller.req.*;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.utils.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class WalletService {
    @Autowired
    private UserRepository userRepository;
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
    @Autowired
    private ContentHitConsumeRepository contentHitConsumeRepository;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private BlockchainService blockchainService;

    // 当前hit的价格
    private static final String REDIS_KEY_PRICE_OF_HIT = "hitpot:price-of-hit";
    // 当前剩余兑换hit的数量   hour count
    private static final String REDIS_KEY_LEFT_HIT_PREFIX = "hitpot:left-of-hit:hour";

    @Value("${blockchain.price_of_hit}")
    private long PRICE_OF_HIT_DEFAULT;
    @Value("${blockchain.total_hit_for_per_hour}")
    private long TOTAL_HIT_FOR_PER_HOUR;

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
            .balancePot(convertToEtherFromSzabo(wallet.getBalancePot()))
            .balanceHit(convertToEtherFromSzabo(wallet.getBalanceHit()))
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

    public void depositPot(String userId, long amountPot, String transactionId) {
        synchronized (this) {
            User user = userRepository.findFirstByUserId(userId);
            if (user == null) {
                log.info("userId:{} 不存在", userId);
                return;
            }

            UserTransaction userTransaction = userTransactionRepository.findFirstByTransactionId(transactionId);
            if (userTransaction == null) {
                // 添加充值记录
                userTransaction = UserTransaction.builder()
                    .userId(userId)
                    .amountPot(amountPot)
                    .amountHit(0L)
                    .transactionType(TransactionType.USER_POT_DEPOSIT_TO_PLATFORM.getId())
                    .status(TransactionStatus.SUCCESS.getId())
                    .transactionId(transactionId)
                    .build();
                userTransactionRepository.save(userTransaction);

                // 更新钱包
                Wallet wallet = walletRepository.findFirstByUserId(userId);
                wallet.setBalancePot(wallet.getBalancePot() + amountPot);
                walletRepository.save(wallet);
            }
        }
    }

    public void withdrawPot(String userId, double amountPotOfEther) {
        long amountPot = convertToSzaboFromEther(amountPotOfEther);

        synchronized (this) {
            Wallet wallet = walletRepository.findFirstByUserId(userId);
            if (wallet.getBalancePot() > 0 && wallet.getBalancePot() > amountPot) {
                wallet.setBalancePot(wallet.getBalancePot() - amountPot);
                walletRepository.save(wallet);
            } else {
                throw new HitpotException(HitpotExceptionEnum.BALANCE_POT_NO_SUFFICIENT);
            }


            // 保存提现记录
            UserTransaction userTransaction = UserTransaction.builder()
                .userId(userId)
                .transactionType(TransactionType.USER_POT_WITHDRAW_FROM_PLATFORM.getId())
                .status(TransactionStatus.PROCESSING.getId())
                .amountPot(amountPot)
                .amountHit(0L)
                .build();
            userTransactionRepository.save(userTransaction);

            // 调用合约
            blockchainService.withdraw(userId, userTransaction.getAmountPot(), userTransaction.getId());
        }
    }

    /**
     * 更新提现状态
     */
    public void updateWithdrawPotStatus(String userId, long amountPot, long userTransactionId) {
        Optional<UserTransaction> optional = userTransactionRepository.findById(userTransactionId);
        if (optional.isPresent()) {
            UserTransaction userTransaction = optional.get();
            userTransaction.setStatus(TransactionStatus.SUCCESS.getId());
            userTransactionRepository.save(userTransaction);
            log.info("update withdraw transaction id:{}, amount:{} {}", userTransaction.getId(), userTransaction.getAmountPot(), amountPot);
        }
    }

    public void contentCollectHit(String userId, ContentCollectForm contentCollectForm) {
        synchronized (this) {
            Wallet wallet = walletRepository.findFirstByUserId(userId);
            Content content = contentRepository.findById(contentCollectForm.getContentId()).orElse(null);
            if (content == null) {
                throw new HitpotException(HitpotExceptionEnum.CONTENT_NOT_EXIST);
            }

            long amountHit = convertToSzaboFromEther(contentCollectForm.getAmountHit());
            if (wallet.getBalanceHit() > 0 && wallet.getBalanceHit() > amountHit) {
                wallet.setBalanceHit(wallet.getBalanceHit() - amountHit);
                walletRepository.save(wallet);

                // 视频HIT增加, 保存注入HIT记录
                ContentHitBalance contentHitBalance = ContentHitBalance.builder()
                    .userId(userId)
                    .contentId(contentCollectForm.getContentId())
                    .amountHit(amountHit)
                    .balanceHit(amountHit)
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
    }

    public void purchaseContentNft(String userId, ContentPurchaseNftForm contentPurchaseNftForm) {
        synchronized (this) {
            Wallet wallet = walletRepository.findFirstByUserId(userId);
            Content content = contentService.getByContentId(contentPurchaseNftForm.getContentId());

            // TODO 判断NFT是否有剩余
            ContentNftDetailVO contentNftDetailVO = detailContentNft(content);
            if (contentNftDetailVO.getCountIpNftLeft() < contentPurchaseNftForm.getCount()) {
                throw new HitpotException(HitpotExceptionEnum.BALANCE_NFT_NO_SUFFICIENT);
            }

            if (content.getUserId().equals(userId)) {
                throw new HitpotException(HitpotExceptionEnum.CANNOT_SELL_TO_SELF);
            }

            // TODO 判断单投资者购买NFT的数量是否超过限制
            QContentStock qContentStock = QContentStock.contentStock;
            List<ContentStock> contentStockList = jpaQueryFactory.selectFrom(qContentStock)
                .from(qContentStock)
                .where(qContentStock.userId.eq(userId).and(qContentStock.contentId.eq(content.getId())))
                .fetchAll()
                .fetch();
            long totalCount = contentStockList.stream().mapToLong(ContentStock::getCountIpNft).sum();
            if (content.getCountMaxLimitPerInvestor() < (totalCount + contentPurchaseNftForm.getCount())) {
                throw new HitpotException(HitpotExceptionEnum.NFT_EXCEED_LIMIT_PER_INVESTOR);
            }


            // 判断钱包的余额是否充足
            long amountPot = convertToSzaboFromEther(contentPurchaseNftForm.getAmountPot());
            if (amountPot > wallet.getBalancePot()) {
                throw new HitpotException(HitpotExceptionEnum.BALANCE_POT_NO_SUFFICIENT);
            }

            // 判断使用的amount是否符合限制
            long minimumAmount = content.getPriceIpNft() * contentPurchaseNftForm.getCount();
            if (amountPot < minimumAmount) {
                throw new HitpotException(HitpotExceptionEnum.PAYMENT_POT_NO_SUFFICIENT);
            }

            // 添加NFT购买记录
            ContentStock contentStock = ContentStock.builder()
                .userId(userId)
                .contentId(contentPurchaseNftForm.getContentId())
                .stockType(StockType.STOCKHOLDER.getId())
                .countIpNft(contentPurchaseNftForm.getCount())
                .priceIpNft(content.getPriceIpNft())
                .amountPot(amountPot)
                .build();
            contentStockRepository.save(contentStock);

            // 扣除余额
            wallet.setBalancePot(wallet.getBalancePot() - amountPot);
            walletRepository.save(wallet);

            // 更新创作者的余额
            Wallet creatorWallet = walletRepository.findFirstByUserId(content.getUserId());
            creatorWallet.setBalancePot(creatorWallet.getBalancePot() + amountPot);
            walletRepository.save(creatorWallet);

            // 更新创作者的NFT
            ContentStock creatorContentStock = contentStockRepository.findFirstByUserIdAndContentId(content.getUserId(), content.getId());
            creatorContentStock.setCountIpNft(creatorContentStock.getCountIpNft() - contentStock.getCountIpNft());
            contentStockRepository.save(creatorContentStock);

            // 更新NFT的剩余
            contentService.updateNftLeft(content.getId(), contentNftDetailVO.getCountIpNftLeft() - contentPurchaseNftForm.getCount());
        }
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
        synchronized (this) {
            LocalDateTime startTimeOfPrice = getStartTimeOfPrice();
            double amountHit = exchangeHitForm.getAmountHit();
            double priceOfHit = exchangeHitForm.getPriceHit();
            double amountPot = NumberUtil.mul(priceOfHit, amountHit);

            long amountHitOfMwei = convertToSzaboFromEther(amountHit);
            long amountPotOfMwei = convertToSzaboFromEther(amountPot);

            Wallet wallet = walletRepository.findFirstByUserId(userId);

            // 判断使用的amount是否符合限制
            if (amountPotOfMwei > wallet.getBalancePot()) {
                throw new HitpotException(HitpotExceptionEnum.BALANCE_POT_NO_SUFFICIENT);
            }

            // 扣除POT，添加HIT
            wallet.setBalancePot(wallet.getBalancePot() - amountPotOfMwei);
            // wallet.setBalanceHit(wallet.getBalanceHit() + amountHitOfMwei);
            walletRepository.save(wallet);


            // 保存交易记录
            UserTransaction userTransaction = UserTransaction.builder()
                .userId(userId)
                .transactionType(TransactionType.USER_POT_EXCHANGE_HIT.getId())
                .status(TransactionStatus.PROCESSING.getId())
                .amountPot(amountPotOfMwei)
                .amountHit(amountHitOfMwei)
                .paidTime(Date.from(startTimeOfPrice.atZone(ZoneId.systemDefault()).toInstant()))
                .build();
            userTransactionRepository.save(userTransaction);
        }
    }

    /**
     * 观看时长扣费
     */
    public void watchConsume(User user, ContentWatch contentWatch, WatchForm watchForm) {
        synchronized (this) {
            QContentHitBalance qContentHitBalance = QContentHitBalance.contentHitBalance;
            List<ContentHitBalance> contentHitBalanceList = jpaQueryFactory.selectFrom(qContentHitBalance)
                .from(qContentHitBalance)
                .where(qContentHitBalance.contentId.eq(watchForm.getContentId()).and(qContentHitBalance.balanceHit.gt(0)))
                .orderBy(qContentHitBalance.balanceType.asc(), qContentHitBalance.id.asc())
                .fetchAll()
                .fetch();
            long amountHitLeft = contentHitBalanceList.stream().mapToLong(ContentHitBalance::getBalanceHit).sum();
            Wallet wallet = walletRepository.findFirstByUserId(user.getUserId());

            UserLevelPermission userLevelPermission = ContentService.LEVEL_TYPE_USER_LEVEL_PERMISSION_MAP.get(LevelType.getById(user.getLevel()));
            long consumeHit = convertToSzaboFromEther(userLevelPermission.getAmountHitPerSecond() * watchForm.getDuration());
            if ((amountHitLeft + wallet.getBalanceHit()) < consumeHit) {
                // 视频账户的hit不足或用户账户的hit不足, 不能继续观看视频
                throw new HitpotException(HitpotExceptionEnum.BALANCE_HIT_NO_SUFFICIENT);
            }

            List<ContentHitConsume> updateContentHitConsumeList = Lists.newArrayList();
            List<ContentHitBalance> updateContentHitBalanceList = Lists.newArrayList();
            if (amountHitLeft > 0L) {
                // 视频中的hit余额充足，先扣除视频中的HIT
                for (ContentHitBalance hitBalance : contentHitBalanceList) {
                    if (consumeHit == 0) {
                        break;
                    }
                    // 消费金额
                    long tempHit;
                    if (hitBalance.getBalanceHit() >= consumeHit) {
                        tempHit = consumeHit;
                        consumeHit = 0L;
                    } else {
                        consumeHit = consumeHit - hitBalance.getBalanceHit();
                        tempHit = hitBalance.getBalanceHit();
                    }
                    // 更新视频余额表
                    hitBalance.setBalanceHit(hitBalance.getBalanceHit() - tempHit);
                    updateContentHitBalanceList.add(hitBalance);
                    // 添加消费记录
                    ContentHitConsume contentHitConsume = ContentHitConsume.builder()
                        .userId(user.getUserId())
                        .contentId(watchForm.getContentId())
                        .contentWatchId(contentWatch.getId())
                        .amountHit(tempHit)
                        .contentHitBalanceId(hitBalance.getId())
                        .consumeType(ConsumeType.CONSUME_FROM_CONTENT.getId())
                        .build();
                    updateContentHitConsumeList.add(contentHitConsume);
                }
            }

            if (consumeHit > 0L) {
                // 如果视频中的HIT已消耗完，需要从用户账户中扣除hit
                if (wallet.getBalanceHit() < consumeHit) {
                    throw new HitpotException(HitpotExceptionEnum.BALANCE_HIT_NO_SUFFICIENT);
                }
                wallet.setBalanceHit(wallet.getBalanceHit() - consumeHit);
                walletRepository.save(wallet);

                // 添加消费记录
                ContentHitConsume contentHitConsume = ContentHitConsume.builder()
                    .userId(user.getUserId())
                    .contentId(watchForm.getContentId())
                    .contentWatchId(contentWatch.getId())
                    .amountHit(consumeHit)
                    .consumeType(ConsumeType.CONSUME_FROM_SELF.getId())
                    .build();
                updateContentHitConsumeList.add(contentHitConsume);
            }

            if (!updateContentHitConsumeList.isEmpty()) {
                contentHitConsumeRepository.saveAll(updateContentHitConsumeList);
            }
        }
    }

    public HitPriceVO getPriceOfHit() {
        LocalDateTime startTime = getStartTimeOfPrice();

        String hitLeftAmountRedisKey = REDIS_KEY_LEFT_HIT_PREFIX + ":" + DateUtils.DATE_TIME_HOUR_FORMATTER.format(startTime);
        String hitLeftStr = stringRedisTemplate.opsForValue().get(hitLeftAmountRedisKey);
        long hitLeft = TOTAL_HIT_FOR_PER_HOUR;
        if (hitLeftStr != null && StrUtil.isNotBlank(hitLeftStr)) {
            hitLeft = Long.parseLong(hitLeftStr.trim());
        }

        return HitPriceVO.builder()
            .startTime(Date.from(startTime.atZone(ZoneId.systemDefault()).toInstant()))
            .endTime(Date.from(startTime.plusSeconds(5).atZone(ZoneId.systemDefault()).toInstant()))
            .price(convertToEtherFromSzabo(getHitPrice()))
            .amountHitLeft(convertToEtherFromSzabo(hitLeft))
            .build();
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
            .countIpNft(content.getCountIpNft())
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
            .where(qContentHitBalance.contentId.eq(contentId).and(qContentHitBalance.balanceHit.gt(0)))
            .orderBy(qContentHitBalance.balanceType.asc(), qContentHitBalance.id.asc())
            .fetchAll()
            .fetch();
        long amountHitLeft = contentHitBalanceList.stream().mapToLong(ContentHitBalance::getBalanceHit).sum();

        List<AdVO> ads = contentHitBalanceList
            .stream().filter(contentHitBalance -> contentHitBalance.getBalanceType() == BalanceType.FUND_FOR_AD.getId())
            .map(contentHitBalance ->
                AdVO.builder()
                    .balanceHit(convertToEtherFromSzabo(contentHitBalance.getBalanceHit()))
                    .adLink(contentHitBalance.getAdLink())
                    .adTitle(contentHitBalance.getAdTitle())
                    .build())
            .collect(Collectors.toList());

        return ContentHitLeftVO.builder().amountHit(convertToEtherFromSzabo(amountHitLeft)).contentId(contentId).ads(ads).build();
    }

    /**
     * 水龙头领取pot
     */
    public boolean potFaucet(FaucetForm faucetForm) {
        blockchainService.potFaucet(faucetForm.getAddress(), convertToSzaboFromEther(faucetForm.getAmount()));
        return true;
    }

    /**
     * 将ether转为Mwei
     */
    public long convertToSzaboFromEther(double amount) {
        return Double.valueOf(amount * 1_000_000).longValue();
    }

    /**
     * 将Mwei转换为ether
     */
    public double convertToEtherFromSzabo(long amount) {
        return Long.valueOf(amount).doubleValue() / 1_000_000;
    }

    public long convertToSzaboFromWei(BigInteger amount) {
        return amount.divide(new BigInteger(Long.toString(1_000_000_000_000L))).longValue();
    }

    public BigInteger convertToWeiFromSzabo(long amount) {
        return new BigInteger(Long.toString(amount)).multiply(new BigInteger(Long.toString(1_000_000_000_000L)));
    }

    private LocalDateTime getStartTimeOfPrice() {
        LocalDateTime localDateTime = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        return localDateTime.withSecond(localDateTime.getSecond() / 5 * 5);
    }

    @Scheduled(cron = "*/5 * * * * ?")
    public void exchangeTask() {
        synchronized (this) {
            LocalDateTime endTime = getStartTimeOfPrice();
            LocalDateTime startTime = endTime.minusSeconds(5);

            Date start = Date.from(startTime.atZone(ZoneId.systemDefault()).toInstant());
            Date end = Date.from(endTime.atZone(ZoneId.systemDefault()).toInstant());

            QUserTransaction qUserTransaction = QUserTransaction.userTransaction;
            List<UserTransaction> userTransactionList = jpaQueryFactory.selectFrom(qUserTransaction)
                .from(qUserTransaction)
                .where(
                    qUserTransaction.status.eq(TransactionStatus.PROCESSING.getId())
                        .and(qUserTransaction.transactionType.eq(TransactionType.USER_POT_EXCHANGE_HIT.getId()))
                        .and(qUserTransaction.createTime.goe(Date.from(endTime.minusMinutes(1).atZone(ZoneId.systemDefault()).toInstant())))
                        .and(qUserTransaction.createTime.lt(Date.from(endTime.atZone(ZoneId.systemDefault()).toInstant())))
                )
                .orderBy(qUserTransaction.id.desc())
                .fetchAll()
                .fetch();

            if (userTransactionList.isEmpty()) {
                return;
            }

            // 将不再当前周期内的交易设置为交易失败
            List<UserTransaction> finalUserTransactionList = userTransactionList.stream()
                .filter(userTransaction -> !DateUtil.isSameTime(userTransaction.getPaidTime(), start))
                .collect(Collectors.toList());
            Map<String, Long> userHitDiff = new HashMap<>();
            Map<String, Long> userPotDiff = new HashMap<>();
            for (UserTransaction failureUserTransaction: finalUserTransactionList) {
                failureUserTransaction.setStatus(TransactionStatus.FAILURE.getId());

                // 退费
                long amountPot = userPotDiff.computeIfAbsent(failureUserTransaction.getUserId(), key -> 0L);
                userPotDiff.put(failureUserTransaction.getUserId(), amountPot + failureUserTransaction.getAmountPot());
            }

            // 当前计费周期内的交易
            List<UserTransactionWrap> currentTransactionWrapList = userTransactionList.stream()
                .filter(userTransaction -> DateUtil.isSameTime(userTransaction.getPaidTime(), start))
                .map(userTransaction ->
                    UserTransactionWrap.builder()
                        .userTransaction(userTransaction)
                        .createTime(userTransaction.getCreateTime())
                        .price(userTransaction.getAmountPot() / userTransaction.getAmountHit())
                        .build()
                )
                .sorted(Comparator.comparing(
                        UserTransactionWrap::getPrice, Comparator.reverseOrder())
                    .thenComparing(UserTransactionWrap::getCreateTime)
                )
                .collect(Collectors.toList());

            String hitLeftAmountRedisKey = REDIS_KEY_LEFT_HIT_PREFIX + ":" + DateUtils.DATE_TIME_HOUR_FORMATTER.format(startTime);
            String hitLeftStr = stringRedisTemplate.opsForValue().get(hitLeftAmountRedisKey);
            long hitLeft = TOTAL_HIT_FOR_PER_HOUR;
            if (hitLeftStr != null && StrUtil.isNotBlank(hitLeftStr)) {
                hitLeft = Long.parseLong(hitLeftStr.trim());
            }

            // 交易数量和交易金额
            long successAmountHit = 0;
            long successAmountPot = 0;
            for (UserTransactionWrap userTransactionWrap : currentTransactionWrapList) {
                UserTransaction userTransaction = userTransactionWrap.getUserTransaction();
                if (userTransaction.getAmountHit() <= hitLeft) {
                    hitLeft -= userTransaction.getAmountHit();
                    // 交易成功
                    userTransaction.setStatus(TransactionStatus.SUCCESS.getId());
                    // 添加hit
                    long amountHit = userHitDiff.computeIfAbsent(userTransaction.getUserId(), key -> 0L);
                    userHitDiff.put(userTransaction.getUserId(), amountHit + userTransaction.getAmountHit());
                    //
                    successAmountHit += userTransaction.getAmountHit();
                    successAmountPot += userTransaction.getAmountPot();
                } else {
                    // 交易失败
                    userTransaction.setStatus(TransactionStatus.FAILURE.getId());
                    // 退费
                    long amountPot = userPotDiff.computeIfAbsent(userTransaction.getUserId(), key -> 0L);
                    userPotDiff.put(userTransaction.getUserId(), amountPot + userTransaction.getAmountPot());
                }
                finalUserTransactionList.add(userTransaction);
            }

            Map<String, Wallet> walletMap = new HashMap<>();
            for (String userId : userPotDiff.keySet()) {
                Wallet wallet = walletRepository.findFirstByUserId(userId);
                wallet.setBalancePot(wallet.getBalancePot() + userPotDiff.get(userId));
                walletMap.put(userId, wallet);
            }
            for (String userId : userHitDiff.keySet()) {
                Wallet wallet = walletMap.getOrDefault(userId, walletRepository.findFirstByUserId(userId));
                wallet.setBalanceHit(wallet.getBalanceHit() + userHitDiff.get(userId));
                walletMap.put(userId, wallet);
            }

            // 更新用户交易状态
            if (!finalUserTransactionList.isEmpty()) {
                userTransactionRepository.saveAll(finalUserTransactionList);
            }
            // 更新用户钱包余额
            if (!walletMap.isEmpty()) {
                walletRepository.saveAll(walletMap.values());
            }

            // 更新当前小时的hit数量
            stringRedisTemplate.opsForValue().set(hitLeftAmountRedisKey, Long.toString(hitLeft));
            stringRedisTemplate.expire(hitLeftAmountRedisKey, Duration.ofMinutes(80));

            // 更新下个周期的单价
            if (successAmountHit != 0 && successAmountPot != 0) {
                long currentPrice = successAmountPot / successAmountHit;
                if (currentPrice > PRICE_OF_HIT_DEFAULT) {
                    stringRedisTemplate.opsForValue().set(REDIS_KEY_PRICE_OF_HIT, Long.toString(currentPrice));
                }
            } else {
                double lastPrice = getHitPrice();
                long currentPrice = Double.valueOf(lastPrice * 0.95).longValue();
                if (currentPrice < PRICE_OF_HIT_DEFAULT) {
                    currentPrice = PRICE_OF_HIT_DEFAULT;
                }
                stringRedisTemplate.opsForValue().set(REDIS_KEY_PRICE_OF_HIT, Long.toString(currentPrice));
            }
        }
    }

    private long getHitPrice() {
        String priceOfHit = stringRedisTemplate.opsForValue().get(REDIS_KEY_PRICE_OF_HIT);
        long price = PRICE_OF_HIT_DEFAULT;
        if (priceOfHit != null && StrUtil.isNotBlank(priceOfHit)) {
            price = Long.parseLong(priceOfHit.trim());
        }
        return price;
    }
}
