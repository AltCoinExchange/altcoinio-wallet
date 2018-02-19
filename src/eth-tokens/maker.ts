/**
 * Maker token interface
 */
import { EthEngine } from "../eth/eth-engine";
import { TokenConfig } from "../config/tokens/tokenconfig";
import { TokenAtomicSwap } from "../eth/tokens/token-atomic-swap";
import { TokenConfigMain } from "../config/tokens/tokenconfigmain";

export class MakerTokenTestnet extends TokenAtomicSwap {
    constructor(ethEngine: EthEngine) {
        super(TokenConfig.Maker.contractAddress, ethEngine);
    }
}

export class MakerTokenMainnet extends TokenAtomicSwap {
    constructor(ethEngine: EthEngine) {
        super(TokenConfigMain.Maker.contractAddress, ethEngine);
    }
}