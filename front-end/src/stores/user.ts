import { makeAutoObservable } from 'mobx'

import defaultAvatar from 'statics/images/default-avatar.svg'

import { UserInfo } from 'typings/UserInfo'

class UserStore {
  constructor() {
    makeAutoObservable(this)
  }

  private _isLoggedIn: boolean = false

  get isLoggedIn() {
    return this._isLoggedIn
  }

  set isLoggedIn(flag: boolean) {
    this._isLoggedIn = flag
  }

  private _walletAddress = ''

  get walletAddress() {
    return this._walletAddress
  }

  set walletAddress(address: string) {
    this._walletAddress = address
  }

  private _userInfo: UserInfo = {
    level: 0,
    nickname: '',
    userId: '',
    avatarImgUrl: '',
    feedSettingType: 0,
  }

  get userInfo() {
    return Object.assign({}, this._userInfo)
  }

  updateUserInfo(info: Partial<UserInfo>) {
    const cloneInfo = { ...info }
    cloneInfo.avatarImgUrl = cloneInfo.avatarImgUrl ?? defaultAvatar
    return Object.assign(this._userInfo, cloneInfo)
  }

  reset() {
    this._isLoggedIn = false
    this._walletAddress = ''
    this._userInfo = {
      level: 0,
      nickname: '',
      userId: '',
      avatarImgUrl: '',
      feedSettingType: 0,
    }
  }
}

const userStore = new UserStore()

export default userStore
