import axios from 'axios'
import { FeedRecommendStrategy } from 'typings/FeedRecommendStrategy'

import { UserInfo } from 'typings/UserInfo'

import config from './config'

interface DetailResponse {
  code: number
  data: UserInfo
  msg: string
}

export async function detail(walletAddress: string): Promise<DetailResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<DetailResponse>(`${config.getApiServer()}/api/user/detail`, {
        params: {
          walletAddress,
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

interface LoginResponse {
  code: number
  data: {
    accessToken: string
  }
  msg: string
}

export async function login(message: string, signature: string, walletAddress: string): Promise<string> {
  return new Promise((resolve, reject) => {
    axios
      .post<LoginResponse>(`${config.getApiServer()}/api/user/login`, {
        message,
        signature,
        walletAddress,
      })
      .then((res) => {
        if (res.data.code === config.getSuccessCode()) {
          resolve(res.data.data.accessToken)
        } else {
          reject(new Error(`failed: ${res.data.code}`))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

interface SubscribeResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function subscribe(creatorId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<SubscribeResponse>(
        `${config.getApiServer()}/api/user/subscribe`,
        {
          creatorId,
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

interface UnsubscribeResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function unsubscribe(creatorId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<UnsubscribeResponse>(
        `${config.getApiServer()}/api/user/unsubscribe`,
        {
          creatorId,
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

interface UpdateResponse {
  code: number
  data: UserInfo
  msg: string
}

export async function update(
  avatarImg: string,
  nickname: string,
  feedSettingType: FeedRecommendStrategy,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<UpdateResponse>(
        `${config.getApiServer()}/api/user/update`,
        {
          avatarImg,
          nickname,
          feedSettingType,
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

interface UpgradeLevelResponse {
  code: number
  data: UserInfo
  msg: string
}

export async function upgradeLevel(level: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<UpgradeLevelResponse>(
        `${config.getApiServer()}/api/user/upgrade-level`,
        {
          level,
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
