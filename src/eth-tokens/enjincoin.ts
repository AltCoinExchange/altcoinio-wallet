/**
 * EnjinCoin token interface
 */
import { EthEngine } from "../eth/eth-engine";
import { TokenConfig } from "../config/tokens/tokenconfig";
import { TokenAtomicSwap } from "../eth/tokens/token-atomic-swap";
import { TokenConfigMain } from "../config/tokens/tokenconfigmain";

export class EnjinCoinTokenTestnet extends TokenAtomicSwap {
    constructor(ethEngine: EthEngine) {
        super(TokenConfig.EnjinCoin.contractAddress, ethEngine);
    }
}

export class EnjinCoinTokenMainnet extends TokenAtomicSwap {
    constructor(ethEngine: EthEngine) {
        super(TokenConfigMain.EnjinCoin.contractAddress, ethEngine);
    }
}