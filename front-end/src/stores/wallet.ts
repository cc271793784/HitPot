import { makeAutoObservable, toJS } from 'mobx'

import { WalletInfo } from 'typings/WalletInfo'

class WalletStore {
  constructor() {
    makeAutoObservable(this)
  }

  private _walletInfo: WalletInfo = {
    balanceHit: 0,
    balancePot: 0,
    nfts: [],
  }

  get walletInfo() {
    return toJS(this._walletInfo)
  }

  updateWalletInfo(info: Partial<WalletInfo>) {
    return Object.assign(this._walletInfo, info)
  }

  reset() {
    this._walletInfo = {
      balanceHit: 0,
      balancePot: 0,
      nfts: [],
    }
  }
}

const walletStore = new WalletStore()

export default walletStore
