/**
 * QASH token interface
 */
import { EthEngine } from "../eth/eth-engine";
import { TokenConfig } from "../config/tokens/tokenconfig";
import { TokenAtomicSwap } from "../eth/tokens/token-atomic-swap";
import { TokenConfigMain } from "../config/tokens/tokenconfigmain";

export class QASHTokenTestnet extends TokenAtomicSwap {
    constructor(ethEngine: EthEngine) {
        super(TokenConfig.QASH.contractAddress, ethEngine);
    }
}

export class QASHTokenMainnet extends TokenAtomicSwap {
    constructor(ethEngine: EthEngine) {
        super(TokenConfigMain.QASH.contractAddress, ethEngine);
    }
}