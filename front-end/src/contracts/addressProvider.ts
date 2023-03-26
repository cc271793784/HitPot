const contractAddresses = {
  okt: {
    POTToken: '0xe2B933a8051a3e4926Ba4ffa403fFaFec210c598',
    HitpotBridge: '0xd2413974239c9134A7dd6724B83783983f7DAa5c',
  },
  private: {
    POTToken: '0xDF08ccb1109fDEE727E2B847ae64021D1d5639A2',
    HitpotBridge: '0x84876A9221802a52aaE1534d087EdC5d486dCB92',
  },
}

export function getContractAddresses() {
  return contractAddresses.okt
}
