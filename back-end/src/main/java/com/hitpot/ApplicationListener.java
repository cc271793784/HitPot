package com.hitpot;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationEvent;

@Slf4j
public class ApplicationListener implements org.springframework.context.ApplicationListener<ApplicationEvent> {

    public static long start = System.currentTimeMillis();

    @Value("${spring.profiles.active:default}")
    private String profile;

    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        try {
            if(!"prod".equals(profile)) {
                return;
            }

            if(event instanceof ApplicationStartedEvent) {
                start = System.currentTimeMillis();
            }
            if(event instanceof ApplicationReadyEvent) {
                float secUse = (System.currentTimeMillis() - start) / 1000F;
                log.info("----------------[{}]系统部署完毕, 用时{}秒", profile, secUse);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

}
