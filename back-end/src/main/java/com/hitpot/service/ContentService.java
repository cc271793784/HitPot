package com.hitpot.service;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.hitpot.common.PageChunk;
import com.hitpot.common.PageUtils;
import com.hitpot.common.exception.HitpotExceptionEnum;
import com.hitpot.common.exception.HitpotException;
import com.hitpot.domain.*;
import com.hitpot.enums.LevelType;
import com.hitpot.repo.ContentMarkedRepository;
import com.hitpot.repo.ContentRepository;
import com.hitpot.repo.SubscriptionCreatorRepository;
import com.hitpot.repo.UserTimelineRepository;
import com.hitpot.service.vo.ContentVO;
import com.hitpot.service.vo.PriceAndMintVO;
import com.hitpot.service.vo.ShareVO;
import com.hitpot.service.vo.TimelineVO;
import com.hitpot.web.controller.req.*;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContentService {

    @Autowired
    private MaterialService materialService;
    @Autowired
    private UserService userService;
    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    @Autowired
    private ContentRepository contentRepository;
    @Autowired
    private ContentMarkedRepository contentMarkedRepository;
    @Autowired
    private SubscriptionCreatorRepository subscriptionCreatorRepository;
    @Autowired
    private UserTimelineRepository userTimelineRepository;
    @Autowired
    private WalletService walletService;
    @Autowired
    private ContentService contentService;

    public ContentVO postContent(String userId, ContentForm contentForm) {
        Material material = materialService.detailMaterial(contentForm.getVideoFilename());

        Content content = Content.builder()
            .userId(userId)
            .videoFilename(contentForm.getVideoFilename())
            .coverImg(contentForm.getCoverImg())
            .title(contentForm.getTitle())
            .description(contentForm.getDescription())
            .duration(material.getDuration())
            .watcherLevel(contentForm.getWatchLevel())
            .countIpNft(contentForm.getCountIpNft())
            .countIpNftForInvestor(Double.valueOf(Math.floor(contentForm.getCountIpNft() * contentForm.getIpNftRatioForInvestor())).longValue())
            .countMaxLimitPerInvestor(contentForm.getMaxCountIpNftForPerInvestor())
            .priceIpNft(contentForm.getPriceIpNft())
            .yieldRateInfluencer(contentForm.getYieldRateOfInfluencer())
            .yieldRateViewer(contentForm.getYieldRateOfViewer())
            .deleted(false)
            .disabled(false)
            .build();
        contentRepository.save(content);

        // 给创作者分配IP NFT
        walletService.presentContentNftToCreator(userId,
            ContentPurchaseNftForm.builder()
                .contentId(content.getId())
                .amountPot(content.getCountIpNft())
                .build()
        );

        if (contentForm.getAmountHit() != null && contentForm.getAmountHit() > 0) {
            walletService.contentCollectHit(userId,
                ContentCollectForm.builder()
                    .amountHit(contentForm.getAmountHit())
                    .contentId(content.getId())
                    .adTitle("")
                    .adLink("")
                    .build());
        }

        return buildContent(null, content);
    }

    public ContentVO detailContent(String userId, Long contentId) throws HitpotException {
        Optional<Content> optional = contentRepository.findById(contentId);
        if (optional.isEmpty()) {
            throw new HitpotException(HitpotExceptionEnum.CONTENT_NOT_EXIST);
        }
        return buildContent(userId, optional.get());
    }

    public Boolean watchVideo(String userId, WatchForm watchForm) throws HitpotException {
        return true;
    }

    public Boolean likeVideo(String userId, Long contentId) {
        Optional<Content> optional = contentRepository.findById(contentId);
        if (optional.isEmpty()) {
            throw new HitpotException(HitpotExceptionEnum.CONTENT_NOT_EXIST);
        }
        ContentMarked contentMarked = contentMarkedRepository.findFirstByContentIdAndUserId(contentId, userId);
        if (contentMarked != null && contentMarked.getLiked().equals(Boolean.FALSE)) {
            contentMarked.setLiked(true);
            contentMarkedRepository.save(contentMarked);
        } else if (contentMarked == null) {
            contentMarked = ContentMarked.builder()
                .userId(userId)
                .contentId(contentId)
                .utmContent(null)
                .marked(false)
                .liked(true)
                .disabled(false)
                .disabled(false)
                .build();
            contentMarkedRepository.save(contentMarked);
        }
        return true;
    }

    public Boolean unlikeVideo(String userId, Long contentId) {
        Optional<Content> optional = contentRepository.findById(contentId);
        if (optional.isEmpty()) {
            throw new HitpotException(HitpotExceptionEnum.CONTENT_NOT_EXIST);
        }
        ContentMarked contentMarked = contentMarkedRepository.findFirstByContentIdAndUserId(contentId, userId);
        if (contentMarked != null && contentMarked.getLiked().equals(Boolean.TRUE)) {
            contentMarked.setLiked(false);
            contentMarkedRepository.save(contentMarked);
        }
        return true;
    }

    public Boolean markVideo(String userId, Long contentId) {
        Optional<Content> optional = contentRepository.findById(contentId);
        if (optional.isEmpty()) {
            throw new HitpotException(HitpotExceptionEnum.CONTENT_NOT_EXIST);
        }
        ContentMarked contentMarked = contentMarkedRepository.findFirstByContentIdAndUserId(contentId, userId);
        if (contentMarked != null && contentMarked.getMarked().equals(Boolean.FALSE)) {
            contentMarked.setMarked(true);
            contentMarkedRepository.save(contentMarked);
        } else if (contentMarked == null) {
            contentMarked = ContentMarked.builder()
                .userId(userId)
                .contentId(contentId)
                .utmContent(null)
                .marked(true)
                .liked(false)
                .disabled(false)
                .disabled(false)
                .build();
            contentMarkedRepository.save(contentMarked);
        }
        return true;
    }

    public Boolean unmarkVideo(String userId, Long contentId) {
        Optional<Content> optional = contentRepository.findById(contentId);
        if (optional.isEmpty()) {
            throw new HitpotException(HitpotExceptionEnum.CONTENT_NOT_EXIST);
        }
        ContentMarked contentMarked = contentMarkedRepository.findFirstByContentIdAndUserId(contentId, userId);
        if (contentMarked != null && contentMarked.getMarked().equals(Boolean.TRUE)) {
            contentMarked.setMarked(false);
            contentMarkedRepository.save(contentMarked);
        }
        return true;
    }

    public ShareVO shareContent(String userId, ShareForm shareForm) {
        Long contentId = shareForm.getContentId();
        Optional<Content> optional = contentRepository.findById(contentId);
        if (optional.isEmpty()) {
            throw new HitpotException(HitpotExceptionEnum.CONTENT_NOT_EXIST);
        }
        ContentMarked contentMarked = contentMarkedRepository.findFirstByContentIdAndUserId(contentId, userId);
        if (contentMarked != null && StrUtil.isBlank(contentMarked.getUtmContent())) {
            contentMarked.setUtmContent(IdUtil.simpleUUID());
            contentMarkedRepository.save(contentMarked);
        } else if (contentMarked == null) {
            contentMarked = ContentMarked.builder()
                .userId(userId)
                .contentId(contentId)
                .utmContent(IdUtil.simpleUUID())
                .marked(false)
                .liked(false)
                .disabled(false)
                .disabled(false)
                .build();
            contentMarkedRepository.save(contentMarked);
        }

        // 保存时间线
        UserTimeline userTimeline = UserTimeline.builder()
            .userId(userId)
            .contentId(contentId)
            .contentMarkedId(contentMarked.getId())
            .userComment(shareForm.getComment())
            .shareType(shareForm.getShareType())
            .build();
        userTimelineRepository.save(userTimeline);

        return ShareVO.builder()
            .contentId(contentMarked.getContentId())
            .utmContent(contentMarked.getUtmContent())
            .shareType(userTimeline.getShareType())
            .comment(userTimeline.getUserComment())
            .build();
    }

    public PageChunk<ContentVO> pageMyContent(String userId, PageRequest pageRequest) {
        QContent qContent = QContent.content;
        BooleanExpression queryExpression = qContent.userId.eq(userId);
        Page<Content> pagination = contentRepository.findAll(queryExpression, pageRequest);
        Page<ContentVO> paginationVO = pagination.map(content -> buildContent(userId, content));
        return PageUtils.buildContentVOPageChunk(paginationVO);
    }

    public PageChunk<ContentVO> pageByLevel(String userId, PageRequest pageRequest) {
        User user = userService.getUserByUserId(userId);
        List<Integer> levels = Arrays.asList(LevelType.NONE.getId(), LevelType.SILVER.getId(), LevelType.GOLD.getId());
        if (LevelType.SILVER.getId() == user.getLevel().intValue()) {
            levels = Arrays.asList(LevelType.SILVER.getId(), LevelType.GOLD.getId());
        } else if (LevelType.GOLD.getId() == user.getLevel().intValue()) {
            levels = Arrays.asList(LevelType.GOLD.getId());
        }

        QContent qContent = QContent.content;
        BooleanExpression queryExpression = qContent.watcherLevel.in(levels);
        Page<Content> pagination = contentRepository.findAll(queryExpression, pageRequest);
        Page<ContentVO> paginationVO = pagination.map(content -> buildContent(userId, content));
        return PageUtils.buildContentVOPageChunk(paginationVO);
    }

    public PageChunk<ContentVO> pageBySubscribe(String userId, PageRequest pageRequest) {
        List<SubscriptionCreator> subscriptionCreatorList = subscriptionCreatorRepository.findAllByUserId(userId);
        List<String> creatorIdList = subscriptionCreatorList.stream().map(item -> item.getCreatorId()).collect(Collectors.toList());
        if (creatorIdList.isEmpty()) {
            creatorIdList.add("hello");
        }
        QContent qContent = QContent.content;
        BooleanExpression queryExpression = qContent.userId.in(creatorIdList);
        Page<Content> pagination = contentRepository.findAll(queryExpression, pageRequest);
        Page<ContentVO> paginationVO = pagination.map(content -> buildContent(userId, content));
        return PageUtils.buildContentVOPageChunk(paginationVO);
    }

    public PageChunk<ContentVO> pageByWatched(String userId, PageRequest pageRequest) {
        QContentWatch qContentWatch = QContentWatch.contentWatch;
        List<Long> contentIdList = jpaQueryFactory.selectDistinct(qContentWatch.contentId)
            .from(qContentWatch)
            .where(qContentWatch.userId.eq(userId))
            .fetchAll()
            .fetch();

        return getContentVOPageChunk(userId, contentIdList, pageRequest);
    }

    public PageChunk<ContentVO> pageByStock(String userId, PageRequest pageRequest) {
        QContentStock qContentStock = QContentStock.contentStock;
        List<Long> contentIdList = jpaQueryFactory.selectDistinct(qContentStock.contentId)
            .from(qContentStock)
            .where(qContentStock.userId.eq(userId))
            .fetchAll()
            .fetch();

        return getContentVOPageChunk(userId, contentIdList, pageRequest);
    }

    public PageChunk<ContentVO> pageByShared(String userId, PageRequest pageRequest) {
        QContentMarked qContentMarked = QContentMarked.contentMarked;
        List<Long> contentIdList = jpaQueryFactory.selectDistinct(qContentMarked.contentId)
            .from(qContentMarked)
            .where(qContentMarked.userId.eq(userId).and(qContentMarked.utmContent.isNotNull()))
            .fetch();

        return getContentVOPageChunk(userId, contentIdList, pageRequest);
    }

    public PageChunk<ContentVO> pageByLiked(String userId, PageRequest pageRequest) {
        QContentMarked qContentMarked = QContentMarked.contentMarked;
        List<Long> contentIdList = jpaQueryFactory.selectDistinct(qContentMarked.contentId)
            .from(qContentMarked)
            .where(qContentMarked.userId.eq(userId).and(qContentMarked.liked.eq(true)))
            .fetch();

        return getContentVOPageChunk(userId, contentIdList, pageRequest);
    }

    public Content getByContentId(Long contentId) {
        return contentRepository.findById(contentId).orElse(null);
    }

    public PageChunk<ContentVO> pageByMarked(String userId, PageRequest pageRequest) {
        QContentMarked qContentMarked = QContentMarked.contentMarked;
        List<Long> contentIdList = jpaQueryFactory.selectDistinct(qContentMarked.contentId)
            .from(qContentMarked)
            .where(qContentMarked.userId.eq(userId).and(qContentMarked.marked.eq(true)))
            .fetchAll()
            .fetch();

        return getContentVOPageChunk(userId, contentIdList, pageRequest);
    }

    public PageChunk<TimelineVO> pageByTimeline(String userId, PageRequest pageRequest) {
        QUserTimeline qUserTimeline = QUserTimeline.userTimeline;
        BooleanExpression booleanExpression = qUserTimeline.userId.eq(userId);
        Page<UserTimeline> pagination = userTimelineRepository.findAll(booleanExpression, pageRequest);
        Page<TimelineVO> paginationVO = pagination.map(userTimeline ->
            TimelineVO.builder()
                .contentTimelineId(userTimeline.getId())
                .comment(userTimeline.getUserComment())
                .content(contentService.detailContent(userId, userTimeline.getContentId()))
                .build());
        return PageUtils.buildContentVOPageChunk(paginationVO);
    }

    private PageChunk<ContentVO> getContentVOPageChunk(String userId, List<Long> contentIdList, PageRequest pageRequest) {
        if (contentIdList.isEmpty()) {
            contentIdList.add(-1L);
        }

        BooleanExpression queryExpression = QContent.content.id.in(contentIdList);
        Page<Content> pagination = contentRepository.findAll(queryExpression, pageRequest);
        Page<ContentVO> paginationVO = pagination.map(content -> buildContent(userId, content));
        return PageUtils.buildContentVOPageChunk(paginationVO);
    }

    /**
     * 根据角色获取用户消费hit的速率和生成SEC的速率
     */
    private PriceAndMintVO priceOfWatchVideo(Integer level) {
        if (LevelType.NONE.getId() == level.intValue()) {
            return PriceAndMintVO.builder().price(1L).mint(1L).build();
        } else if (LevelType.SILVER.getId() == level.intValue()) {
            return PriceAndMintVO.builder().price(2L).mint(2L).build();
        } else if (LevelType.GOLD.getId() == level.intValue()) {
            return PriceAndMintVO.builder().price(4L).mint(4L).build();
        } else {
            throw new RuntimeException();
        }
    }

    private ContentVO buildContent(String userId, Content content) {
        ContentVO contentVO = ContentVO.builder()
            .contentId(content.getId())
            .creator(userService.detailUser(content.getUserId()))
            .videoFilename(content.getVideoFilename())
            .videoUrl(materialService.getMaterialUrl(content.getVideoFilename()))
            .coverImg(content.getCoverImg())
            .coverImgUrl(materialService.getMaterialUrl(content.getCoverImg()))
            .title(content.getTitle())
            .description(content.getDescription())
            .duration(content.getDuration())
            .watcherLevel(content.getWatcherLevel())
            .countIpNft(content.getCountIpNft())
            .countIpNftForInvestor(content.getCountIpNftForInvestor())
            .countIpNftLeft(walletService.detailContentNft(content).getCountIpNftLeft())
            .priceIpNft(content.getPriceIpNft())
            .balanceHit(walletService.getLeftHit(content.getId()).getAmountHit())
            .liked(false)
            .marked(false)
            .build();
        if (userId != null) {
            ContentMarked contentMarked = contentMarkedRepository.findFirstByContentIdAndUserId(content.getId(), userId);
            if (contentMarked != null) {
                contentVO.setLiked(contentMarked.getLiked());
                contentVO.setMarked(contentMarked.getMarked());
            }
        }
        return contentVO;
    }

}
