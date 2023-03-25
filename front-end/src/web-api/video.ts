import axios from 'axios'

import { UserLevel } from 'typings/UserLevel'

import config from './config'

interface DetailResponse {
  code: number
  data: VideoDetailInfo
  msg: string
}

export async function detail(contentId: number | string): Promise<DetailResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<DetailResponse>(`${config.getApiServer()}/api/content/detail`, {
        params: {
          contentId,
        },
        headers: {
          Authorization: config.getAccessToken(),
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

interface LikeResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function like(contentId: number | string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<LikeResponse>(
        `${config.getApiServer()}/api/content/like`,
        {
          contentId,
        },
        {
          headers: {
            Authorization: config.getAccessToken(),
          },
        },
      )
      .then((res) => {
        resolve(res.data.code === config.getSuccessCode())
      })
      .catch((error) => {
        reject(error)
      })
  })
}

interface MarkResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function mark(contentId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<MarkResponse>(
        `${config.getApiServer()}/api/content/mark`,
        {
          contentId,
        },
        {
          headers: {
            Authorization: config.getAccessToken(),
          },
        },
      )
      .then((res) => {
        resolve(res.data.code === config.getSuccessCode())
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export interface VideoDetailInfo {
  ads: {
    adLink: string
    adTitle: string
    balanceHit: number
  }[]
  balanceHit: number
  contentId: number
  countIpNft: number
  countIpNftForInvestor: number
  countIpNftLeft: number
  countMaxLimitPerInvestor: number // 每个股东购买的最大NFT数量
  coverImg: string
  coverImgUrl: string
  createTime: string
  creator: {
    avatarImgUrl: string
    feedSettingType: 0 | 1 | 2 // 信息流设置: 0 Latest, 1 LocationBase, 2 SocialLinkage
    level: UserLevel
    nickname: string
    userId: string
  }
  description: string
  duration: number
  liked: boolean
  marked: boolean
  priceIpNft: number
  title: string
  videoFilename: string
  videoUrl: string
  watcherLevel: UserLevel
  yieldRateOfInfluencer: number
  yieldRateOfViewer: number
}

export interface VideoList {
  items: VideoDetailInfo[]
  pageNo: number
  pageSize: number
  total: number
  totalPages: number
}

interface PageContentByLevelResponse {
  code: number
  data: VideoList
  msg: string
}

export async function pageContentByLevel(
  pageSize: number,
  pageNo: number,
): Promise<PageContentByLevelResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<PageContentByLevelResponse>(`${config.getApiServer()}/api/content/page-content-by-level`, {
        params: {
          pageSize,
          pageNo,
        },
        headers: {
          Authorization: config.getAccessToken(),
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

interface PageContentByLikedResponse {
  code: number
  data: VideoList
  msg: string
}

export async function pageContentByLiked(
  pageSize: number,
  pageNo: number,
): Promise<PageContentByLikedResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<PageContentByLikedResponse>(`${config.getApiServer()}/api/content/page-content-by-liked`, {
        params: {
          pageSize,
          pageNo,
        },
        headers: {
          Authorization: config.getAccessToken(),
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

interface PageContentByMarkedResponse {
  code: number
  data: VideoList
  msg: string
}

export async function pageContentByMarked(
  pageSize: number,
  pageNo: number,
): Promise<PageContentByMarkedResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<PageContentByMarkedResponse>(`${config.getApiServer()}/api/content/page-content-by-marked`, {
        params: {
          pageSize,
          pageNo,
        },
        headers: {
          Authorization: config.getAccessToken(),
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

interface PageContentBySharedResponse {
  code: number
  data: VideoList
  msg: string
}

export async function pageContentByShared(
  pageSize: number,
  pageNo: number,
): Promise<PageContentBySharedResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<PageContentBySharedResponse>(`${config.getApiServer()}/api/content/page-content-by-shared`, {
        params: {
          pageSize,
          pageNo,
        },
        headers: {
          Authorization: config.getAccessToken(),
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

interface PageContentByStockResponse {
  code: number
  data: VideoList
  msg: string
}

export async function pageContentByStock(
  pageSize: number,
  pageNo: number,
): Promise<PageContentByStockResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<PageContentByStockResponse>(`${config.getApiServer()}/api/content/page-content-by-stock`, {
        params: {
          pageSize,
          pageNo,
        },
        headers: {
          Authorization: config.getAccessToken(),
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

interface PageContentBySubscribeResponse {
  code: number
  data: VideoList
  msg: string
}

export async function pageContentBySubscribe(
  pageSize: number,
  pageNo: number,
): Promise<PageContentBySubscribeResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<PageContentBySubscribeResponse>(`${config.getApiServer()}/api/content/page-content-by-subscribe`, {
        params: {
          pageSize,
          pageNo,
        },
        headers: {
          Authorization: config.getAccessToken(),
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

interface PageContentByStockingResponse {
  code: number
  data: VideoList
  msg: string
}

export async function pageContentByStocking(
  pageSize: number,
  pageNo: number,
): Promise<PageContentByStockingResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<PageContentByStockingResponse>(`${config.getApiServer()}/api/content/page-content-by-stocking`, {
        params: {
          pageSize,
          pageNo,
        },
        headers: {
          Authorization: config.getAccessToken(),
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

interface PageContentByWatchedResponse {
  code: number
  data: VideoList
  msg: string
}

export async function pageContentByWatched(
  pageSize: number,
  pageNo: number,
): Promise<PageContentByWatchedResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<PageContentByWatchedResponse>(`${config.getApiServer()}/api/content/page-content-by-watched`, {
        params: {
          pageSize,
          pageNo,
        },
        headers: {
          Authorization: config.getAccessToken(),
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

interface PageMyContentResponse {
  code: number
  data: VideoList
  msg: string
}

export async function pageMyContent(pageSize: number, pageNo: number): Promise<PageMyContentResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<PageMyContentResponse>(`${config.getApiServer()}/api/content/page-my-content`, {
        params: {
          pageSize,
          pageNo,
        },
        headers: {
          Authorization: config.getAccessToken(),
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

interface ReleaseResponse {
  code: number
  data: VideoDetailInfo
  msg: string
}

export async function release(
  videoFilename: string,
  coverImg: string,
  title: string,
  description: string,
  watchLevel: UserLevel,
  amountHit: number,
  yieldRateOfInfluencer: number,
  yieldRateOfViewer: number,
  enabledIpNft: boolean,
  countIpNft: number,
  priceIpNft: number,
  ipNftRatioForInvestor: number,
  maxCountIpNftForPerInvestor: number,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<ReleaseResponse>(
        `${config.getApiServer()}/api/content/release`,
        {
          videoFilename,
          coverImg,
          title,
          description,
          watchLevel,
          amountHit,
          yieldRateOfInfluencer,
          yieldRateOfViewer,
          enabledIpNft,
          countIpNft,
          priceIpNft,
          ipNftRatioForInvestor,
          maxCountIpNftForPerInvestor,
        },
        {
          headers: {
            Authorization: config.getAccessToken(),
          },
        },
      )
      .then((res) => {
        resolve(res.data.code === config.getSuccessCode())
      })
      .catch((error) => {
        reject(error)
      })
  })
}

interface ShareResponse {
  code: number
  data: {
    contentId: number
    comment: string
    shareType: string
    utmContent: string
  }
  msg: string
}

export async function share(contentId: number, comment: string, shareType: number): Promise<ShareResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .post<ShareResponse>(
        `${config.getApiServer()}/api/content/share`,
        {
          contentId,
          comment,
          shareType,
        },
        {
          headers: {
            Authorization: config.getAccessToken(),
          },
        },
      )
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

interface UnlikeResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function unlike(contentId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<UnlikeResponse>(
        `${config.getApiServer()}/api/content/unlike`,
        {
          contentId,
        },
        {
          headers: {
            Authorization: config.getAccessToken(),
          },
        },
      )
      .then((res) => {
        resolve(res.data.code === config.getSuccessCode())
      })
      .catch((error) => {
        reject(error)
      })
  })
}

interface UnmarkResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function unmark(contentId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<UnmarkResponse>(
        `${config.getApiServer()}/api/content/unmark`,
        {
          contentId,
        },
        {
          headers: {
            Authorization: config.getAccessToken(),
          },
        },
      )
      .then((res) => {
        resolve(res.data.code === config.getSuccessCode())
      })
      .catch((error) => {
        reject(error)
      })
  })
}

interface WatchResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function watch(
  contentId: number,
  duration: number,
  referrerContentId: string,
  referrerUserId: string,
  utmContent: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<WatchResponse>(
        `${config.getApiServer()}/api/content/watch`,
        {
          contentId,
          duration,
          referrerContentId,
          referrerUserId,
          utmContent,
        },
        {
          headers: {
            Authorization: config.getAccessToken(),
          },
        },
      )
      .then((res) => {
        resolve(res.data.code === config.getSuccessCode())
      })
      .catch((error) => {
        reject(error)
      })
  })
}
