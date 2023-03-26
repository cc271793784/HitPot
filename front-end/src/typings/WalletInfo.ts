import { NFTInfo } from './NFTInfo'

export interface WalletInfo {
  balanceHit: number
  balancePot: number
  nfts: NFTInfo[]
}
