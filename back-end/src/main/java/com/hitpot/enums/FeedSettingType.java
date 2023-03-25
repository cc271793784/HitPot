package com.hitpot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@Getter
public enum FeedSettingType {
    LATEST(0),
    LOCATION_BASE(1),
    SOCIAL_LINKAGE(2)
    ;
    private final int id;

    private static final Map<Integer, FeedSettingType> levelMap = new HashMap<>();

    static {
        levelMap.put(LATEST.id, LATEST);
        levelMap.put(LOCATION_BASE.id, LOCATION_BASE);
        levelMap.put(SOCIAL_LINKAGE.id, SOCIAL_LINKAGE);
    }

    public static FeedSettingType getById(int id) {
        return levelMap.get(id);
    }
}
