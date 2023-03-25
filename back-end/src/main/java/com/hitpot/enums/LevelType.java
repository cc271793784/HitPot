package com.hitpot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@Getter
public enum LevelType {
    NONE(0),
    SILVER(1),
    GOLD(2)
    ;
    private final int id;

    private static final Map<Integer, LevelType> levelMap = new HashMap<>();

    static {
        levelMap.put(NONE.id, NONE);
        levelMap.put(SILVER.id, SILVER);
        levelMap.put(GOLD.id, GOLD);
    }

    public static LevelType getById(int id) {
        return levelMap.get(id);
    }
}
