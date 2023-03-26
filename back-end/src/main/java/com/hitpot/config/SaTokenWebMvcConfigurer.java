package com.hitpot.config;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.jwt.StpLogicJwtForMixin;
import cn.dev33.satoken.stp.StpLogic;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Order()
public class SaTokenWebMvcConfigurer implements WebMvcConfigurer {

    @Bean
    public StpLogic getStpLogicJwt() {
        return new StpLogicJwtForMixin();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册 Sa-Token 拦截器，校验规则为 StpUtil.checkLogin() 登录校验。
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))
            .addPathPatterns("/**")
            .excludePathPatterns(
                "/api/user/gen-nonce",
                "/api/user/login",
                "/api/content/page-content-by-level",
                "/api/content/list-most-popular-content",
                "/api/wallet/price-of-hit",
                "/api/wallet/faucet",
                "/inner/health",
                "/v3/api-docs",
                "/v3/api-docs/",
                "/v3/api-docs/*",
                "/v3/api-docs/**",
                "/swagger-ui/index.html",
                "/swagger-ui",
                "/swagger-ui/",
                "/swagger-ui/*",
                "/swagger-ui/**",
                "/swagger-resources",
                "/swagger-resources/",
                "/swagger-resources/*",
                "/swagger-resources/**"
            );
    }
}
