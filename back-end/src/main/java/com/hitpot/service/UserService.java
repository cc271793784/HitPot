package com.hitpot.service;

import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.util.StrUtil;
import com.hitpot.common.DateUtils;
import com.hitpot.common.SignatureUtils;
import com.hitpot.common.exception.HitpotException;
import com.hitpot.common.exception.HitpotExceptionEnum;
import com.hitpot.domain.SubscriptionCreator;
import com.hitpot.domain.User;
import com.hitpot.domain.Wallet;
import com.hitpot.enums.FeedSettingType;
import com.hitpot.enums.LevelType;
import com.hitpot.repo.SubscriptionCreatorRepository;
import com.hitpot.repo.UserRepository;
import com.hitpot.repo.WalletRepository;
import com.hitpot.service.vo.LoginNonceVO;
import com.hitpot.service.vo.LoginResultVO;
import com.hitpot.service.vo.SubscribeVO;
import com.hitpot.service.vo.UserVO;
import com.hitpot.web.controller.req.LoginForm;
import com.hitpot.web.controller.req.SubscribeCheckForm;
import com.hitpot.web.controller.req.UserForm;
import com.alibaba.fastjson2.JSON;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService {
    private static final String KEY_LOGIN_USER_PREFIX = "login:user:";

    private static final Long FIVE_MINUTES = 60 * 24 * 12L;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private SubscriptionCreatorRepository subscriptionCreatorRepository;

    @Autowired
    private MaterialService materialService;

    public LoginNonceVO genRandomNonce(String walletAddress) {
        LoginNonceVO loginNonceVO = LoginNonceVO.builder()
            .nonce(UUID.randomUUID().toString().replace("-", ""))
            .timestamp(DateUtils.toMillis(LocalDateTime.now()))
            .build();
        String key = KEY_LOGIN_USER_PREFIX + walletAddress.trim();
        stringRedisTemplate.opsForValue().set(key, JSON.toJSONString(loginNonceVO));
        stringRedisTemplate.expire(key, Duration.ofMinutes(FIVE_MINUTES));
        return loginNonceVO;
    }

    public LoginResultVO login(LoginForm loginForm) throws HitpotException {
        if (StrUtil.isBlank(loginForm.getWalletAddress())) {
            // 如果钱包地址为null，则返回错误
            throw new HitpotException(HitpotExceptionEnum.LOGIN_WALLET_ADDRESS_IS_NULL);
        }

        String walletAddress = loginForm.getWalletAddress().trim().toLowerCase();

        // String key = KEY_LOGIN_USER_PREFIX + walletAddress;
        // String loginNonceVOJson = stringRedisTemplate.opsForValue().get(key);
        // LoginNonceVO loginNonceVO = JSON.parseObject(loginNonceVOJson, LoginNonceVO.class);
        // if (StrUtil.isBlank(loginNonceVOJson)) {
        //     // 如果登录随机码为null, 则返回错误
        //     throw new HitpotException(HitpotExceptionEnum.LOGIN_NONCE_IS_NULL);
        // }

        User user = userRepository.findFirstByUserId(walletAddress);
        if (user == null) {
            // 如果用户不存在，则创建用户
            user = User.builder()
                .userId(walletAddress)
                .nickname("Unnamed")
                .level(LevelType.NONE.getId())
                .deleted(false)
                .disabled(false)
                .build();
            userRepository.save(user);

            // 创建用户钱包
            Wallet wallet = Wallet.builder()
                .userId(user.getUserId())
                .balanceHit(0L)
                .balancePot(0L)
                .build();
            walletRepository.save(wallet);
        }

        // 说明是合法的用户
        log.info("user login, login form: {}, login nonce: {}", JSON.toJSONString(loginForm), loginForm.getMessage());
        if (!SignatureUtils.verifySignature(walletAddress, loginForm.getMessage(), loginForm.getSignature().trim())) {
            // 如果签名出错，则返回错误
            throw new HitpotException(HitpotExceptionEnum.LOGIN_SIGNATURE_ERROR);
        }

        // 校验签名，如果签名正确则登录成功
        StpUtil.login(walletAddress);
        return LoginResultVO.builder()
            .accessToken(StpUtil.getTokenValue())
            .build();
    }

    public UserVO upgradeLevel(String userId, Integer level) throws HitpotException {
        if (level == null || LevelType.getById(level) == null) {
            throw new HitpotException(HitpotExceptionEnum.PARAMETER_ERROR);
        }
        User user = userRepository.findFirstByUserId(userId);
        user.setLevel(level);
        userRepository.save(user);
        return transToUserVO(null, user);
    }

    public Boolean subscribeCreator(String userId, String creatorId) throws HitpotException {
        User creator = userRepository.findFirstByUserId(creatorId);
        if (creator == null) {
            // 如果创作者不存在抛出异常
            throw new HitpotException(HitpotExceptionEnum.PARAMETER_ERROR);
        }
        // 检查是否已经订阅过
        SubscriptionCreator subscriptionCreator = subscriptionCreatorRepository.findFirstByUserIdAndCreatorId(userId, creatorId);
        if (subscriptionCreator == null) {
            subscriptionCreator = SubscriptionCreator.builder()
                .userId(userId)
                .creatorId(creatorId)
                .disabled(false)
                .deleted(false)
                .build();
            subscriptionCreatorRepository.save(subscriptionCreator);
        }
        return true;
    }

    public Boolean unSubscribeCreator(String userId, String creatorId) throws HitpotException {
        User creator = userRepository.findFirstByUserId(creatorId);
        if (creator == null) {
            // 如果创作者不存在抛出异常
            throw new HitpotException(HitpotExceptionEnum.PARAMETER_ERROR);
        }
        // 检查是否已经订阅过
        SubscriptionCreator subscriptionCreator = subscriptionCreatorRepository.findFirstByUserIdAndCreatorId(userId, creatorId);
        if (subscriptionCreator != null) {
            subscriptionCreatorRepository.deleteById(subscriptionCreator.getId());
        }
        return true;
    }

    public User getUserByUserId(String userId) {
        return userRepository.findFirstByUserId(userId);
    }

    public UserVO detailUser(String userId, String creatorId) {
        User user = userRepository.findFirstByUserId(creatorId);
        return transToUserVO(userId, user);
    }

    public List<SubscribeVO> subscribeCheck(String userId, SubscribeCheckForm subscribeCheckForm) {
        List<SubscribeVO> subscribeVOList = new ArrayList<>();
        if (subscribeCheckForm.getCreatorId().isEmpty()) {
            return subscribeVOList;
        }
        List<SubscriptionCreator> subscriptionCreatorList = subscriptionCreatorRepository.findAllByUserIdAndCreatorIdIn(userId, subscribeCheckForm.getCreatorId());
        for (SubscriptionCreator subscriptionCreator : subscriptionCreatorList) {
            subscribeVOList.add(SubscribeVO.builder().creatorId(subscriptionCreator.getCreatorId()).subscribe(true).build());
        }
        List<String> tempCreatorIdList = Lists.newCopyOnWriteArrayList(subscribeCheckForm.getCreatorId());
        tempCreatorIdList.removeAll(subscriptionCreatorList.stream().map(SubscriptionCreator::getCreatorId).collect(Collectors.toList()));
        for (String creatorId : tempCreatorIdList) {
            subscribeVOList.add(SubscribeVO.builder().creatorId(creatorId).subscribe(false).build());
        }
        return subscribeVOList;
    }

    public UserVO updateProfile(String userId, UserForm userForm) {
        User user = userRepository.findFirstByUserId(userId);
        String nickname = userForm.getNickname();
        String avatarImg = userForm.getAvatarImg();
        Integer feedSettingType = userForm.getFeedSettingType();
        if (StrUtil.isNotBlank(nickname)) {
            user.setNickname(nickname.trim());
        }
        if (StrUtil.isNotBlank(avatarImg)) {
            user.setAvatarImg(avatarImg.trim());
        }
        if (feedSettingType != null) {
            FeedSettingType fst = FeedSettingType.getById(feedSettingType);
            user.setFeedSettingType(feedSettingType);
        }
        userRepository.save(user);
        return transToUserVO(null, user);
    }

    private UserVO transToUserVO(String userId, User user) {
        UserVO userVO = UserVO.builder()
            .nickname(user.getNickname())
            .userId(user.getUserId())
            .level(user.getLevel())
            .feedSettingType(user.getFeedSettingType())
            .build();

        if (StrUtil.isNotBlank(user.getAvatarImg())) {
            userVO.setAvatarImgUrl(materialService.getMaterialUrl(user.getAvatarImg()));
        }

        if (userId != null) {
            SubscriptionCreator subscriptionCreator = subscriptionCreatorRepository.findFirstByUserIdAndCreatorId(userId, user.getUserId());
            userVO.setSubscribe(subscriptionCreator != null);
        } else {
            userVO.setSubscribe(false);
        }

        return userVO;
    }
}
