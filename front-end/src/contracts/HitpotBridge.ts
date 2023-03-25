import { BrowserProvider, Contract } from 'ethers'

import ContractJson from './HitpotBridge.json'
import { HitpotBridgeAddress } from './deployAddress'
import { createPromiseReadyUtil } from 'utils/promiseReadyUtil'

class HitpotBridge {
  private contract: Contract | null = null

  private initReadyUtil = createPromiseReadyUtil()

  initPromise = this.initReadyUtil.promise

  async init() {
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(HitpotBridgeAddress, ContractJson.abi, signer)
    this.contract = contract
    this.initReadyUtil.resolve()
  }

  async deposit(count: BigInt) {
    if (this.contract === null) {
      throw new Error('contract is null')
    }
    const tx = await this.contract.deposit(count, { gasLimit: 3e7 })
    await tx.wait()
  }
}

export default HitpotBridge
