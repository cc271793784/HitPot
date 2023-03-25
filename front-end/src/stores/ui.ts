import { makeAutoObservable } from 'mobx'

class UIStore {
  constructor() {
    makeAutoObservable(this)
  }

  private _shouldShowConnectWalletModal = false

  get shouldShowConnectWalletModal() {
    return this._shouldShowConnectWalletModal
  }

  set shouldShowConnectWalletModal(flag: boolean) {
    this._shouldShowConnectWalletModal = flag
  }

  private _shouldShowUpgradeMemberCardLevel = false

  get shouldShowUpgradeMemberCardLevel() {
    return this._shouldShowUpgradeMemberCardLevel
  }

  set shouldShowUpgradeMemberCardLevel(flag: boolean) {
    this._shouldShowUpgradeMemberCardLevel = flag
  }
}

const uiStore = new UIStore()

export default uiStore
