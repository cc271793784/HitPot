import EventEmitter from 'events'
import { ethers, BrowserProvider, Signer } from 'ethers'

interface OkxWalletEvents {
  accountsChanged: (accounts: string[]) => void
}

declare interface OkxWalletWrapper {
  on<U extends keyof OkxWalletEvents>(event: U, cb: OkxWalletEvents[U]): this
  off<U extends keyof OkxWalletEvents>(event: U, cb: OkxWalletEvents[U]): this
  emit<U extends keyof OkxWalletEvents>(event: U, ...args: Parameters<OkxWalletEvents[U]>): boolean
}

class OkxWalletWrapper extends EventEmitter {
  private provider: BrowserProvider | undefined

  private signer: Signer | undefined

  isExtensionInstalled = (): boolean => {
    return window.okxwallet?.isOkxWallet === true
  }

  init = async () => {
    // @ts-ignore
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      this.emit('accountsChanged', accounts)
    })
  }

  getProvider = (): BrowserProvider => {
    this.provider = this.provider ?? new ethers.BrowserProvider(window.okxwallet)
    return this.provider
  }

  getSigner = async (): Promise<Signer> => {
    const provider = this.getProvider()
    this.signer = this.signer ?? (await provider.getSigner())
    return this.signer
  }

  ethAccounts = async (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      if (this.isExtensionInstalled() === false) {
        reject(new Error('metamask not installed'))
        return
      }

      const provider = this.getProvider()
      provider
        .send('eth_accounts', {})
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })

  ethRequestAccounts = async (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      if (this.isExtensionInstalled() === false) {
        reject(new Error('metamask not installed'))
        return
      }

      const provider = this.getProvider()
      provider
        .send('eth_requestAccounts', {})
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })

  personalSign = async (msg: string, from: string): Promise<string> =>
    new Promise((resolve, reject) => {
      if (this.isExtensionInstalled() === false) {
        reject(new Error('metamask not installed'))
        return
      }

      const provider = this.getProvider()
      provider
        .send('personal_sign', [msg, from])
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })

  sendTransaction = async (address: string, count: string): Promise<void> => {
    if (this.isExtensionInstalled() === false) {
      throw new Error('metamask not installed')
    }

    const signer = await this.getSigner()
    const tx = await signer.sendTransaction({
      to: address,
      value: count,
    })
    await tx.wait()
  }
}

const metamask = new OkxWalletWrapper()

export default metamask
