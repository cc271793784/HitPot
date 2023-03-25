package com.hitpot.web.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.hitpot.common.PageChunk;
import com.hitpot.service.ContentService;
import com.hitpot.service.vo.ContentVO;
import com.hitpot.service.vo.ReturnBooleanVO;
import com.hitpot.service.vo.ShareVO;
import com.hitpot.service.vo.TimelineVO;
import com.hitpot.web.controller.req.ContentForm;
import com.hitpot.web.controller.req.ContentIdForm;
import com.hitpot.web.controller.req.ShareForm;
import com.hitpot.web.controller.req.WatchForm;
import com.hitpot.web.result.RestResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/content")
@Slf4j
@Api(tags = "视频数据接口")
public class ContentController {

    @Autowired
    private ContentService contentService;

    @ResponseBody
    @PostMapping("/release")
    @ApiOperation("发布视频内容")
    public RestResult<ContentVO> postContent(@RequestBody ContentForm contentForm) {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(contentService.postContent(userId, contentForm));
    }

    @ResponseBody
    @GetMapping("/detail")
    @ApiOperation("获取视频详情")
    public RestResult<ContentVO> detailContent(@ApiParam("视频id") Long contentId) throws Exception {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(contentService.detailContent(userId, contentId));
    }

    @ResponseBody
    @PostMapping("/watch")
    @ApiOperation("观看视频的打点信息")
    public RestResult<ReturnBooleanVO> watchVideo(@RequestBody WatchForm watchForm) throws Exception {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(ReturnBooleanVO.builder().success(contentService.watchVideo(userId, watchForm)).build());
    }

    @ResponseBody
    @PostMapping("/like")
    @ApiOperation("点赞视频")
    public RestResult<ReturnBooleanVO> likeVideo(@RequestBody ContentIdForm contentIdForm) {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(ReturnBooleanVO.builder().success(contentService.likeVideo(userId, contentIdForm.getContentId())).build());
    }

    @ResponseBody
    @PostMapping("/unlike")
    @ApiOperation("取消点赞视频")
    public RestResult<ReturnBooleanVO> unlikeVideo(@RequestBody ContentIdForm contentIdForm) {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(ReturnBooleanVO.builder().success(contentService.unlikeVideo(userId, contentIdForm.getContentId())).build());
    }

    @ResponseBody
    @PostMapping("/mark")
    @ApiOperation("收藏视频")
    public RestResult<ReturnBooleanVO> markVideo(@RequestBody ContentIdForm contentIdForm) {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(ReturnBooleanVO.builder().success(contentService.markVideo(userId, contentIdForm.getContentId())).build());
    }

    @ResponseBody
    @PostMapping("/unmark")
    @ApiOperation("取消收藏视频")
    public RestResult<ReturnBooleanVO> unmarkVideo(@RequestBody ContentIdForm contentIdForm) {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(ReturnBooleanVO.builder().success(contentService.unmarkVideo(userId, contentIdForm.getContentId())).build());
    }

    @ResponseBody
    @PostMapping("/share")
    @ApiOperation("分享视频")
    public RestResult<ShareVO> shareContent(@RequestBody ShareForm shareForm) {
        String userId = StpUtil.getLoginIdAsString();
        return RestResult.success(contentService.shareContent(userId, shareForm));
    }

    @ResponseBody
    @GetMapping("/page-my-content")
    @ApiOperation("获取我上传的视频列表")
    public RestResult<PageChunk<ContentVO>> listMyContent(
        @ApiParam("每页条目数") @RequestParam(defaultValue = "20", required = false) Integer pageSize,
        @ApiParam("页数") @RequestParam(defaultValue = "20", required = false) Integer pageNo
    ) {
        String userId = StpUtil.getLoginIdAsString();
        PageRequest pageRequest = PageRequest.of(pageNo - 1, pageSize, Sort.by("id").descending());
        return RestResult.success(contentService.pageMyContent(userId, pageRequest));
    }

    @ResponseBody
    @GetMapping("/page-content-by-level")
    @ApiOperation("根据登录用户等级，获取其可观看的视频列表")
    public RestResult<PageChunk<ContentVO>> listContentByLevel(
        @ApiParam("每页条目数") @RequestParam(defaultValue = "20", required = false) Integer pageSize,
        @ApiParam("页数") @RequestParam(defaultValue = "1", required = false) Integer pageNo
    ) {
        String userId = StpUtil.getLoginIdAsString();
        PageRequest pageRequest = PageRequest.of(pageNo - 1, pageSize , Sort.by("id").descending());
        return RestResult.success(contentService.pageByLevel(userId, pageRequest));
    }

    @ResponseBody
    @GetMapping("/page-content-by-subscribe")
    @ApiOperation("获取我订阅的视频列表")
    public RestResult<PageChunk<ContentVO>> listContentBySubscribe(
        @ApiParam("每页条目数") @RequestParam(defaultValue = "20", required = false) Integer pageSize,
        @ApiParam("页数") @RequestParam(defaultValue = "20", required = false) Integer pageNo
    ) {
        String userId = StpUtil.getLoginIdAsString();
        PageRequest pageRequest = PageRequest.of(pageNo - 1, pageSize , Sort.by("id").descending());
        return RestResult.success(contentService.pageBySubscribe(userId, pageRequest));
    }

    @ResponseBody
    @GetMapping("/page-content-by-watched")
    @ApiOperation("获取我看过的视频列表")
    public RestResult<PageChunk<ContentVO>> listContentByWatched(
        @ApiParam("每页条目数") @RequestParam(defaultValue = "20", required = false) Integer pageSize,
        @ApiParam("页数") @RequestParam(defaultValue = "20", required = false) Integer pageNo
    ) {
        String userId = StpUtil.getLoginIdAsString();
        PageRequest pageRequest = PageRequest.of(pageNo - 1, pageSize , Sort.by("id").descending());
        return RestResult.success(contentService.pageByWatched(userId, pageRequest));
    }

    @ResponseBody
    @GetMapping("/page-content-by-stock")
    @ApiOperation("获取我投资的视频列表")
    public RestResult<PageChunk<ContentVO>> listContentByStock(
        @ApiParam("每页条目数") @RequestParam(defaultValue = "20", required = false) Integer pageSize,
        @ApiParam("页数") @RequestParam(defaultValue = "20", required = false) Integer pageNo
    ) {
        String userId = StpUtil.getLoginIdAsString();
        PageRequest pageRequest = PageRequest.of(pageNo - 1, pageSize , Sort.by("id").descending());
        return RestResult.success(contentService.pageByStock(userId, pageRequest));
    }

    @ResponseBody
    @GetMapping("/page-content-by-shared")
    @ApiOperation("获取我分享过的视频列表")
    public RestResult<PageChunk<ContentVO>> listContentByShared(
        @ApiParam("每页条目数") @RequestParam(defaultValue = "20", required = false) Integer pageSize,
        @ApiParam("页数") @RequestParam(defaultValue = "20", required = false) Integer pageNo
    ) {
        String userId = StpUtil.getLoginIdAsString();
        PageRequest pageRequest = PageRequest.of(pageNo - 1, pageSize , Sort.by("id").descending());
        return RestResult.success(contentService.pageByShared(userId, pageRequest));
    }

    @ResponseBody
    @GetMapping("/page-content-by-liked")
    @ApiOperation("获取我赞过的视频列表")
    public RestResult<PageChunk<ContentVO>> listContentByLiked(
        @ApiParam("每页条目数") @RequestParam(defaultValue = "20", required = false) Integer pageSize,
        @ApiParam("页数") @RequestParam(defaultValue = "20", required = false) Integer pageNo
    ) {
        String userId = StpUtil.getLoginIdAsString();
        PageRequest pageRequest = PageRequest.of(pageNo - 1, pageSize , Sort.by("id").descending());
        return RestResult.success(contentService.pageByLiked(userId, pageRequest));
    }

    @ResponseBody
    @GetMapping("/page-content-by-marked")
    @ApiOperation("获取我收藏的视频列表")
    public RestResult<PageChunk<ContentVO>> listContentByMarked(
        @ApiParam("每页条目数") @RequestParam(defaultValue = "20", required = false) Integer pageSize,
        @ApiParam("页数") @RequestParam(defaultValue = "20", required = false) Integer pageNo
    ) {
        String userId = StpUtil.getLoginIdAsString();
        PageRequest pageRequest = PageRequest.of(pageNo - 1, pageSize , Sort.by("id").descending());
        return RestResult.success(contentService.pageByMarked(userId, pageRequest));
    }

    @ResponseBody
    @GetMapping("/page-content-by-timeline")
    @ApiOperation("获取我收藏的视频列表")
    public RestResult<PageChunk<TimelineVO>> listContentByTimeline(
        @ApiParam("每页条目数") @RequestParam(defaultValue = "20", required = false) Integer pageSize,
        @ApiParam("页数") @RequestParam(defaultValue = "20", required = false) Integer pageNo
    ) {
        String userId = StpUtil.getLoginIdAsString();
        PageRequest pageRequest = PageRequest.of(pageNo - 1, pageSize , Sort.by("id").descending());
        return RestResult.success(contentService.pageByTimeline(userId, pageRequest));
    }
}
