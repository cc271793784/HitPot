package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "user")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {
    private String userId;
    private String nickname;
    private Integer level;
    private Boolean disabled;
    private Boolean deleted;
    private String avatarImg;
    private Integer feedSettingType;
}
