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
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    this.provider = provider
    this.signer = signer

    // @ts-ignore
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      this.emit('accountsChanged', accounts)
    })
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
      if (this.provider === undefined) {
        reject(new Error('not inited'))
        return
      }

      this.provider
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
      if (this.provider === undefined) {
        reject(new Error('not inited'))
        return
      }
      this.provider
        .send('personal_sign', [msg, from])
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })

  sendTransaction = async (address: string, count: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (this.isMetaMaskInstalled() === false) {
        reject(new Error('metamask not installed'))
        return
      }
      if (this.signer === undefined) {
        reject(new Error('not inited'))
        return
      }

      try {
        const tx = await this.signer.sendTransaction({
          to: address,
          value: count,
        })
        await tx.wait()
      } catch (error) {
        reject(error)
      }

      resolve()
    })
  }
}

const metamask = new MetaMaskWrapper()

export default metamask
