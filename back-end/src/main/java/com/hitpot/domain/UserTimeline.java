package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "user_timeline")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserTimeline extends BaseEntity {
    private String userId;
    private Long contentId;
    private String utmContent;
    private Long contentMarkedId;
    private String userComment;
    private Integer shareType;
    private Boolean disabled;
    private Boolean deleted;
}
