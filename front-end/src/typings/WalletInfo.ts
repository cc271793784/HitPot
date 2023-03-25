export interface WalletInfo {
  balanceHit: number
  balancePot: number
  nfts: {
    contentId: string
    coverImage: string
    title: string
    amount: number
  }[]
}
