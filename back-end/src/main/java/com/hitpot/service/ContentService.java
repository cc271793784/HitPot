package com.hitpot.service;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.hitpot.common.PageChunk;
import com.hitpot.common.PageUtils;
import com.hitpot.common.exception.HitpotException;
import com.hitpot.common.exception.HitpotExceptionEnum;
import com.hitpot.domain.*;
import com.hitpot.enums.LevelType;
import com.hitpot.repo.*;
import com.hitpot.service.vo.*;
import com.hitpot.web.controller.req.*;
import com.hitpot.domain.*;
import com.hitpot.repo.*;
import com.hitpot.service.vo.*;
import com.hitpot.web.controller.req.*;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
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
    private ContentWatchRepository contentWatchRepository;
    @Autowired
    private WalletService walletService;
    @Autowired
    private ContentService contentService;

    // 设置每个等级可观看的时长
    public static final Map<LevelType, UserLevelPermission> LEVEL_TYPE_USER_LEVEL_PERMISSION_MAP = Map.of(
        LevelType.GOLD, UserLevelPermission.builder().duration(3600L * 8).amountHitPerSecond(4).amountSecPerSecond(4).build(),
        LevelType.SILVER, UserLevelPermission.builder().duration(3600L * 4).amountHitPerSecond(2).amountSecPerSecond(2).build(),
        LevelType.NONE, UserLevelPermission.builder().duration(3600L * 2).amountHitPerSecond(1).amountSecPerSecond(1).build()
    );

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
            .priceIpNft(walletService.convertToMweiFromEther(contentForm.getPriceIpNft()))
            .yieldRateInfluencer(contentForm.getYieldRateOfInfluencer())
            .yieldRateViewer(contentForm.getYieldRateOfViewer())
            .deleted(false)
            .disabled(false)
            .build();

        content.setCountIpNftLeft(content.getCountIpNft() - content.getCountIpNftForInvestor());

        if (!contentForm.getEnabledIpNft()) {
            content.setCountIpNft(0L);
            content.setPriceIpNft(0L);
            content.setCountIpNftForInvestor(0L);
        }

        contentRepository.save(content);

        // 给创作者分配IP NFT
        walletService.presentContentNftToCreator(userId,
            ContentPurchaseNftForm.builder()
                .contentId(content.getId())
                .amountPot(content.getCountIpNft())
                .build()
        );

        if (contentForm.getAmountHit() > 0) {
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

    public void updateNftLeft(Long contentId, Long ipNftLeft) {
        Optional<Content> optional = contentRepository.findById(contentId);
        optional.get().setCountIpNftLeft(ipNftLeft);
        contentRepository.save(optional.get());
    }

    public ContentVO detailContent(String userId, Long contentId) throws HitpotException {
        Optional<Content> optional = contentRepository.findById(contentId);
        if (optional.isEmpty()) {
            throw new HitpotException(HitpotExceptionEnum.CONTENT_NOT_EXIST);
        }
        return buildContent(userId, optional.get());
    }

    // 判断当前用户已观看的时长是否符合挖矿限制: 金卡=8小时, 银卡=4小时, 无卡=2小时(单位秒)
    private Long getWatchableDurationByUser(User user) {
        String userId = user.getUserId();
        Integer userLevel = user.getLevel();
        Date startTime = DateTime.now().withTime(0, 0, 0, 0).toDate();
        Date endTime = DateTime.now().withTime(23, 59, 59, 999).toDate();
        QContentWatch qContentWatch = QContentWatch.contentWatch;
        Long duration = jpaQueryFactory
            .selectFrom(qContentWatch)
            .select(
                qContentWatch.duration.sum()
            )
            .where(qContentWatch.createTime.between(startTime, endTime).eq(qContentWatch.userId.eq(userId)))
            .fetchOne();
        if (duration == null) {
            duration = 0L;
        }
        return LEVEL_TYPE_USER_LEVEL_PERMISSION_MAP.get(LevelType.getById(userLevel)).getDuration() - duration;
    }

    public ContentHitLeftVO watchVideo(String userId, WatchForm watchForm) throws HitpotException {
        // 判断视频是否存在
        Optional<Content> optional = contentRepository.findById(watchForm.getContentId());
        if (optional.isEmpty()) {
            throw new HitpotException(HitpotExceptionEnum.CONTENT_NOT_EXIST);
        }

        User user = userService.getUserByUserId(userId);
        if (user == null) {
            throw new HitpotException(HitpotExceptionEnum.USER_NOT_EXIST);
        }
        // 判断当前用户已观看的时长是否符合挖矿限制: 金卡=8小时, 银卡=4小时, 无卡=2小时
        Long watchableDuration = getWatchableDurationByUser(user);
        if (watchableDuration <= 0) {
            throw new HitpotException(HitpotExceptionEnum.WATCH_TIME_SUFFICIENT);
        }

        // 如果观看时长小于观看时长，则将可观看时长扣到0
        Long duration = watchForm.getDuration();
        if (watchableDuration < duration) {
            duration = watchableDuration;
        }

        String utmContent = null;
        String referrerUserId = null;
        if (StrUtil.isNotBlank(watchForm.getUtmContent())) {
            ContentMarked contentMarked = contentMarkedRepository.findFirstByContentIdAndUtmContent(watchForm.getContentId(), watchForm.getUtmContent());
            if (contentMarked != null) {
                utmContent = watchForm.getUtmContent().trim();
                referrerUserId = contentMarked.getUserId();
            }
        }

        UserLevelPermission userLevelPermission =  LEVEL_TYPE_USER_LEVEL_PERMISSION_MAP.get(LevelType.getById(user.getLevel()));
        ContentWatch contentWatch = ContentWatch.builder()
            .userId(userId)
            .contentId(watchForm.getContentId())
            .amountHit(walletService.convertToMweiFromEther(userLevelPermission.getAmountHitPerSecond() * duration))
            .amountSec(walletService.convertToMweiFromEther(userLevelPermission.getAmountSecPerSecond() * duration))
            .duration(duration)
            .userLevel(user.getLevel())
            .utmContent(utmContent)
            .referrerUserId(referrerUserId)
            .build();
        contentWatchRepository.save(contentWatch);

        // 扣费
        watchForm.setDuration(duration);
        walletService.watchConsume(user, contentWatch, watchForm);

        // 返回广告列表
        return walletService.getLeftHit(watchForm.getContentId());
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


    public PageChunk<ContentVO> pageByStocking(String userId, PageRequest pageRequest) {
        QContent qContent = QContent.content;
        BooleanExpression queryExpression = qContent.countIpNftLeft.lt(0);
        Page<Content> pagination = contentRepository.findAll(queryExpression, pageRequest);
        Page<ContentVO> paginationVO = pagination.map(content -> buildContent(userId, content));
        return PageUtils.buildContentVOPageChunk(paginationVO);
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
                .createTime(userTimeline.getCreateTime())
                .build());
        return PageUtils.buildContentVOPageChunk(paginationVO);
    }

    public List<ContentVO> listMostPopularContent() {
        QContentWatch qContentWatch = QContentWatch.contentWatch;
        List<Tuple> resultList = jpaQueryFactory
            .selectFrom(qContentWatch)
            .select(
                qContentWatch.contentId,
                qContentWatch.amountSec.sum().as("amountSec1")
            )
            .groupBy(qContentWatch.contentId)
            .orderBy(Expressions.numberPath(Long.class, "amountSec1").desc())
            .limit(3)
            .fetch();
        return resultList.stream()
            .map(tuple -> {
                Long contentId = tuple.get(0, Long.class);
                Optional<Content> optional = contentRepository.findById(contentId);
                return buildContent(null, optional.get());
            })
            .collect(Collectors.toList());
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

    private ContentVO buildContent(String userId, Content content) {
        ContentHitLeftVO contentHitLeftVO = walletService.getLeftHit(content.getId());
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
            .priceIpNft(walletService.convertToEtherFromMwei(content.getPriceIpNft()))
            .balanceHit(contentHitLeftVO.getAmountHit())
            .ads(contentHitLeftVO.getAds())
            .liked(false)
            .marked(false)
            .yieldRateOfViewer(content.getYieldRateViewer())
            .yieldRateOfInfluencer(content.getYieldRateInfluencer())
            .createTime(content.getCreateTime())
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
