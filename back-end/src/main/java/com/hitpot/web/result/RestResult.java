package com.hitpot.web.result;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@ToString
@Setter
@Getter
@ApiModel(value = "restfulApi响应结果")
public class RestResult<T> implements Serializable {
    private static final long serialVersionUID = -5897234194040793245L;
    @ApiModelProperty(value = "错误码, 0表示成功, 非0表示失败")
    private Integer code;
    @ApiModelProperty(value = "信息")
    private String msg;
    @ApiModelProperty(value = "具体数据")
    private T data;

    public static <T> boolean isSuccess(RestResult<T> restResult) {
        return ResultEnum.SUCCESS.getCode().equals(restResult.getCode());
    }

    public static <T> RestResult<T> success(T object) {
        RestResult<T> resultVO = new RestResult<>();
        resultVO.setData(object);
        resultVO.setCode(ResultEnum.SUCCESS.getCode());
        resultVO.setMsg(ResultEnum.SUCCESS.getMsg());
        return resultVO;
    }

    public static <T> RestResult<T> success(Integer code, T object) {
        RestResult<T> resultVO = new RestResult<>();
        resultVO.setData(object);
        resultVO.setCode(code);
        resultVO.setMsg("成功");
        return resultVO;
    }

    public static RestResult success() {
        return success(null);
    }

    public static RestResult success(String key, Object value) {
        Map<String, Object> data = new HashMap<>();
        data.put(key, value);
        return success(data);
    }

    public static <T> RestResult<T> error(Integer code, String msg) {
        RestResult<T> resultVO = new RestResult<>();
        resultVO.setCode(code);
        resultVO.setMsg(msg);
        return resultVO;
    }

    public static <T> RestResult<T> error(Integer code, String msg, T obj) {
        RestResult<T> resultVO = new RestResult<>();
        resultVO.setCode(code);
        resultVO.setMsg(msg);
        resultVO.setData(obj);
        return resultVO;
    }

    public static <T> RestResult<T> error(ResultEnum resultEnum) {
        RestResult<T> resultVO = new RestResult<>();
        resultVO.setCode(resultEnum.getCode());
        resultVO.setMsg(resultEnum.getMsg());
        return resultVO;
    }

    public static <T> RestResult<T> error(ResultEnum resultEnum, String msg) {
        RestResult<T> resultVO = new RestResult<>();
        resultVO.setCode(resultEnum.getCode());
        resultVO.setMsg(resultEnum.getMsg() + ": " + msg);
        return resultVO;
    }

    public static <T> RestResult<T> errorWithData(ResultEnum resultEnum, T obj) {
        RestResult<T> resultVO = new RestResult<>();
        resultVO.setCode(resultEnum.getCode());
        resultVO.setMsg(resultEnum.getMsg());
        resultVO.setData(obj);
        return resultVO;
    }
}
