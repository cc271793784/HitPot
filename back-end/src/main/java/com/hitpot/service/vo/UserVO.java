package com.hitpot.service.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel(value = "用户信息")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserVO {
    @ApiModelProperty(value = "用户id")
    private String userId;
    @ApiModelProperty(value = "用户昵称")
    private String nickname;
    @ApiModelProperty(value = "用户等级")
    private Integer level;
    @ApiModelProperty(value = "用户头像")
    private String avatarImgUrl;
    @ApiModelProperty(value = "信息流设置: 0 Latest, 1 LocationBase, 2 SocialLinkage")
    private Integer feedSettingType;
}
