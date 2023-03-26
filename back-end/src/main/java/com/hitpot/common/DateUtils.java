package com.hitpot.common;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public final class DateUtils {

    private static final ZoneOffset ZONE_OFFSET_8 = ZoneOffset.of("+8");

    private static final ZoneId ZONE_ID_SHANGHAI = ZoneId.of("Asia/Shanghai");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public static final DateTimeFormatter DATE_TIME_HOUR_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHH");

    public static long toMillis(LocalDateTime time) {
        return time.toInstant(ZONE_OFFSET_8).toEpochMilli();
    }

    public static LocalDateTime toLocalDateTime(long timestamp) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZONE_OFFSET_8);
    }

    public static String formatLocalDateTime(LocalDateTime time) {
        return time.format(DATE_TIME_FORMATTER);
    }

    public static LocalDateTime fromString(String timeText) {
        return LocalDateTime.parse(timeText, DATE_TIME_FORMATTER);
    }

    public static long retrieveMills(String timeFormat) {
        String[] array = timeFormat.trim().split("[:.]");
        long duration = 1000 * 60 * 60 * Long.parseLong(array[0]) + 1000 * 60 * Long.parseLong(array[1]) + 1000 * Long.parseLong(array[2]);
        if (array.length == 4) {
            return duration + Long.parseLong(array[3]);
        } else {
            return duration;
        }
    }
}
