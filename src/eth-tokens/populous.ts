/**
 * Populous token interface
 */
import { EthEngine } from "../eth/eth-engine";
import { TokenConfig } from "../config/tokens/tokenconfig";
import { TokenAtomicSwap } from "../eth/tokens/token-atomic-swap";
import { TokenConfigMain } from "../config/tokens/tokenconfigmain";

export class PopulousTokenTestnet extends TokenAtomicSwap {
    constructor(ethEngine: EthEngine) {
        super(TokenConfig.Populous.contractAddress, ethEngine);
    }
}

export class PopulousTokenMainnet extends TokenAtomicSwap {
    constructor(ethEngine: EthEngine) {
        super(TokenConfigMain.Populous.contractAddress, ethEngine);
    }
}