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
}
