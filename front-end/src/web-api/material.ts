import axios from 'axios'

import config from './config'

interface MaterialUploadResponse {
  code: number
  data: {
    filename: string
    materialType: number
    md5: string
    originalFilename: string
    size: number
    url: string
  }
  msg: string
}

type MaterialType = 0 | 1 // 0:表示视频, 1:表示图片

export type MaterialUploadedInfo = MaterialUploadResponse['data']

export async function materialUpload(file: File, materialType: MaterialType): Promise<MaterialUploadResponse['data']> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    axios
      .post<MaterialUploadResponse>(`${config.getApiServer()}/api/material/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: config.getAccessToken(),
        },
        params: {
          materialType,
        },
      })
      .then((res) => {
        if (res.data.code === config.getSuccessCode()) {
          resolve(res.data.data)
        } else {
          reject(new Error(`failed: ${res.data.code}`))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
