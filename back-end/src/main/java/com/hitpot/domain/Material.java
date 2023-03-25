package com.hitpot.domain;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "material")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Material extends BaseEntity {
    private String userId;
    private String filename;
    private String md5;
    private Long size;
    private Long duration;
    private String originalFilename;
    private Integer materialType;
    private Boolean disabled;
    private Boolean deleted;
}
