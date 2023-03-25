import { parseUnits } from 'ethers'

import { HitpotBridgeAddress } from './deployAddress'
import HitpotBridge from './HitpotBridge'
import PotToken from './PotToken'

class Service {
  async depositPot(count: number) {
    const potToken = new PotToken()
    const hitpotBridge = new HitpotBridge()

    potToken.init()
    hitpotBridge.init()

    await Promise.all([potToken.initPromise, hitpotBridge.initPromise])

    const decimals = await potToken.decimals()
    const tokens = parseUnits(count.toString(), decimals)
    await potToken.approve(HitpotBridgeAddress, tokens)
    await hitpotBridge.deposit(tokens)
  }
}

export default Service
