package com.hitpot.service;

import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.RuntimeUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.digest.DigestUtil;
import com.hitpot.common.DateUtils;
import com.hitpot.common.exception.HitpotException;
import com.hitpot.common.exception.HitpotExceptionEnum;
import com.hitpot.domain.Material;
import com.hitpot.enums.MaterialType;
import com.hitpot.repo.MaterialRepository;
import com.hitpot.service.vo.MaterialVO;
import com.hitpot.web.controller.req.UploadForm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
@Slf4j
public class MaterialService {

    @Value("${material.upload.saveDir}")
    private String savePath;

    @Value("${material.baseUrl}")
    private String baseUrl;

    @Value("${material.ffmpeg_command}")
    private String ffmpegCommand;

    @Autowired
    private MaterialRepository materialRepository;

    public MaterialVO uploadMaterial(String userId, UploadForm uploadForm) throws HitpotException, IOException {
        MultipartFile file = uploadForm.getFile();
        Integer materialType = uploadForm.getMaterialType();

        if (file.isEmpty() || materialType == null) {
            throw new HitpotException(HitpotExceptionEnum.PARAMETER_ERROR);
        }

        String filenamePrefix;
        if (materialType == MaterialType.IMAGE.getId()) {
            filenamePrefix = "image" + File.separator;
        } else if (materialType == MaterialType.VIDEO.getId()) {
            filenamePrefix = "video" + File.separator;
        } else {
            throw new HitpotException(HitpotExceptionEnum.PARAMETER_ERROR);
        }

        String filename = filenamePrefix + IdUtil.simpleUUID() + "." + FileNameUtil.getSuffix(file.getOriginalFilename());
        // 保存文件
        String filePath = savePath + File.separator + filename;
        File saveFile = new File(filePath);
        file.transferTo(saveFile);
        // 计算文件的md5值
        String md5 = DigestUtil.md5Hex(saveFile);

        long duration = fetchVideoDuration(filePath);
        // 保存文件到数据库中
        Material material = Material.builder()
            .userId(userId)
            .filename(filename)
            .originalFilename(file.getOriginalFilename())
            .md5(md5)
            .size(saveFile.length())
            .materialType(materialType)
            .duration(duration)
            .disabled(false)
            .deleted(false)
            .build();
        materialRepository.save(material);

        return MaterialVO.builder()
            .filename(material.getFilename())
            .originalFilename(material.getOriginalFilename())
            .md5(material.getMd5())
            .materialType(materialType)
            .url(baseUrl + material.getFilename())
            .size(material.getSize())
            .duration(material.getDuration())
            .build();
    }

    /**
     * 生成资源的url
     */
    public String getMaterialUrl(String filename) {
        return baseUrl + filename;
    }

    public Material detailMaterial(String filename) {
        return materialRepository.findFirstByFilename(filename);
    }

    public long fetchVideoDuration(String file) {
        try {
            String command = ffmpegCommand + " -i " + file + " 2>&1 | grep Duration | awk '{print $2}' | awk -F , '{print $1}'";
            Process process = RuntimeUtil.exec("sh", "-c", command);
            String result = RuntimeUtil.getResult(process);
            log.info("command: {}, result: {}", command, result);
            if (StrUtil.isBlank(result)) {
                return -1;
            } else {
                return DateUtils.retrieveMills(result);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return 0L;
        }
    }
}
