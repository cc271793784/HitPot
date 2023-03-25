package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "subscription_creator")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionCreator extends BaseEntity {
    private String userId;
    private String creatorId;
    private Boolean disabled;
    private Boolean deleted;
}
