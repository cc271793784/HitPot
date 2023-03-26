import { Contract } from 'ethers'

import ContractJson from './PotToken.json'
import { getContractAddresses } from './addressProvider'
import { createPromiseReadyUtil } from 'utils/promiseReadyUtil'
import { getWallet } from 'wallets/walletProvider'

class PotToken {
  private contract: Contract | null = null

  private initReadyUtil = createPromiseReadyUtil()

  initPromise = this.initReadyUtil.promise

  async init() {
    const wallet = getWallet()
    const signer = await wallet.getSigner()
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
