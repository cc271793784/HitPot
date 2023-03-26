import EventEmitter from 'events'
import { ethers, BrowserProvider, Signer } from 'ethers'

interface MetamaskEvents {
  accountsChanged: (accounts: string[]) => void
}

declare interface MetaMaskWrapper {
  on<U extends keyof MetamaskEvents>(event: U, cb: MetamaskEvents[U]): this
  off<U extends keyof MetamaskEvents>(event: U, cb: MetamaskEvents[U]): this
  emit<U extends keyof MetamaskEvents>(event: U, ...args: Parameters<MetamaskEvents[U]>): boolean
}

class MetaMaskWrapper extends EventEmitter {
  private provider: BrowserProvider | undefined

  private signer: Signer | undefined

  isMetaMaskInstalled = (): boolean => {
    return window.ethereum?.isMetaMask === true
  }

  init = async () => {
    // @ts-ignore
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      this.emit('accountsChanged', accounts)
    })
  }

  getProvider = (): BrowserProvider => {
    this.provider = this.provider ?? new ethers.BrowserProvider(window.ethereum)
    return this.provider
  }

  getSigner = async (): Promise<Signer> => {
    const provider = this.getProvider()
    this.signer = this.signer ?? (await provider.getSigner())
    return this.signer
  }

  ethAccounts = async (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      if (this.isMetaMaskInstalled() === false) {
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
      if (this.isMetaMaskInstalled() === false) {
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
      if (this.isMetaMaskInstalled() === false) {
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
    if (this.isMetaMaskInstalled() === false) {
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

const metamask = new MetaMaskWrapper()

export default metamask
