package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "content_marked")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentMarked extends BaseEntity {
    private String userId;
    private Long contentId;
    private String utmContent;
    private Boolean liked;
    private Boolean marked;
    private Boolean disabled;
    private Boolean deleted;
}
