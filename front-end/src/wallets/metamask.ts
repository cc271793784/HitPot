import EventEmitter from 'events'
import { ethers, BrowserProvider, Signer } from 'ethers'

class MetaMaskWrapper extends EventEmitter {
  private provider: BrowserProvider | undefined

  private signer: Signer | undefined

  isMetaMaskInstalled = (): boolean => {
    return window.ethereum.isMetaMask === true
  }

  initProvider = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    this.provider = provider
  }

  initSigner = async () => {
    this.signer = await this.provider?.getSigner()
  }

  ethAccounts = async (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      this.provider
        ?.send('eth_accounts', {})
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })

  ethRequestAccounts = async (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      if (this.isMetaMaskInstalled() === false) {
        reject(new Error('metamask not installed'))
        return
      }
      this.provider
        ?.send('eth_requestAccounts', {})
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })

  personalSign = async (msg: string, from: string): Promise<string> =>
    new Promise((resolve, reject) => {
      if (this.isMetaMaskInstalled() === false) {
        reject(new Error('metamask not installed'))
        return
      }
      this.provider
        ?.send('personal_sign', [msg, from])
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })
}

const metamask = new MetaMaskWrapper()

export default metamask
