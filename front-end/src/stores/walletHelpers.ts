import * as walletApi from 'web-api/wallet'
import walletStore from './wallet'
import userStore from './user'

export function syncWalletInfoFromWebApi() {
  walletApi
    .detail(userStore.walletAddress)
    .then((info) => {
      walletStore.updateWalletInfo(info)
    })
    .catch(() => {})
}
