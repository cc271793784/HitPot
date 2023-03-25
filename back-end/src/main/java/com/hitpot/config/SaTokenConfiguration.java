// package com.hitpot.config;
//
// import cn.dev33.satoken.dao.SaTokenDao;
// import cn.dev33.satoken.dao.SaTokenDaoRedisJackson;
// import cn.dev33.satoken.jwt.StpLogicJwtForSimple;
// import cn.dev33.satoken.stp.StpInterface;
// import cn.dev33.satoken.stp.StpInterfaceDefaultImpl;
// import cn.dev33.satoken.stp.StpLogic;
// import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Primary;
// import org.springframework.data.redis.connection.RedisConnectionFactory;
//
// @Configuration
// public class SaTokenConfiguration {
//     @Bean
//     public StpLogic getStpLogicJwt() {
//         return new StpLogicJwtForSimple();
//     }
//
//     @Bean
//     @ConditionalOnMissingBean
//     @Primary
//     public SaTokenDao redisJacksonSaTokenDao(RedisConnectionFactory redisConnectionFactory) {
//         SaTokenDaoRedisJackson daoRedisJackson = new SaTokenDaoRedisJackson();
//         daoRedisJackson.init(redisConnectionFactory);
//         return daoRedisJackson;
//     }
//
//     @Bean
//     @ConditionalOnMissingBean
//     public StpInterface redisStpInterfaceImpl() {
//         return new StpInterfaceDefaultImpl();
//     }
// }
