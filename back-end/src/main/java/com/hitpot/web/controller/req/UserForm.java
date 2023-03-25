package com.hitpot.web.controller.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel(value = "用户信息表单")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserForm {
    @ApiModelProperty(value = "用户昵称")
    private String nickname;
    @ApiModelProperty(value = "用户头像")
    private String avatarImg;
    @ApiModelProperty(value = "信息流设置: 0 Latest, 1 LocationBase, 2 SocialLinkage")
    private Integer feedSettingType;
}
