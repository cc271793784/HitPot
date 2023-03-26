import { BrowserProvider, Contract } from 'ethers'

import ContractJson from './PotToken.json'
import { getContractAddresses } from './addressProvider'
import { createPromiseReadyUtil } from 'utils/promiseReadyUtil'

class PotToken {
  private contract: Contract | null = null

  private initReadyUtil = createPromiseReadyUtil()

  initPromise = this.initReadyUtil.promise

  async init() {
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contractAddresses = getContractAddresses()
    const contract = new Contract(contractAddresses.POTToken, ContractJson.abi, signer)
    this.contract = contract
    this.initReadyUtil.resolve()
  }

  async decimals(): Promise<string> {
    if (this.contract === null) {
      throw new Error('contract is null')
    }
    return await this.contract.decimals()
  }

  async approve(address: string, count: BigInt) {
    if (this.contract === null) {
      throw new Error('contract is null')
    }
    const tx = await this.contract.approve(address, count, { gasLimit: 3e7 })
    await tx.wait()
  }
}

export default PotToken
