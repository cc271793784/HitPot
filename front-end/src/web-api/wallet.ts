import axios from 'axios'

import { WalletInfo } from 'typings/WalletInfo'

import config from './config'

interface WalletResponse {
  code: number
  data: WalletInfo
  msg: string
}

export async function detail(walletAddress: string): Promise<WalletResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<WalletResponse>(`${config.getApiServer()}/api/wallet`, {
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

interface DepositToContentResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function depositToContent(
  adLink: string,
  adTitle: string,
  amountHit: number,
  contentId: number,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<DepositToContentResponse>(
        `${config.getApiServer()}/api/wallet/deposit-to-content`,
        {
          adLink,
          adTitle,
          amountHit,
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

interface ExchangeHitResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function exchangeHit(amountHit: number, priceHit: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<ExchangeHitResponse>(
        `${config.getApiServer()}/api/wallet/exchange-hit`,
        {
          amountHit,
          priceHit,
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

interface PurchaseContentNFTResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function purchaseContentNFT(amountPot: number, contentId: number, count: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<PurchaseContentNFTResponse>(
        `${config.getApiServer()}/api/wallet/purchase-content-nft`,
        {
          amountPot,
          contentId,
          count,
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

interface PriceOfHitResponse {
  code: number
  data: {
    amountHitLeft: number
    endTime: string
    price: number
    startTime: string
  }
  msg: string
}

export async function priceOfHit(): Promise<PriceOfHitResponse['data']> {
  return new Promise((resolve, reject) => {
    axios
      .get<PriceOfHitResponse>(`${config.getApiServer()}/api/wallet/price-of-hit`, {
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

interface WithdrawResponse {
  code: number
  data: {
    success: boolean
  }
  msg: string
}

export async function withdraw(amountPot: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .post<WithdrawResponse>(
        `${config.getApiServer()}/api/wallet/withdraw`,
        {
          amountPot,
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
