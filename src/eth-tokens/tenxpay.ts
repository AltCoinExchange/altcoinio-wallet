/**
 * TenXPay token interface
 */
import { EthEngine } from "../eth/eth-engine";
import { TokenConfig } from "../config/tokens/tokenconfig";
import { TokenAtomicSwap } from "../eth/tokens/token-atomic-swap";
import { TokenConfigMain } from "../config/tokens/tokenconfigmain";

export class TenXPayTokenTestnet extends TokenAtomicSwap {
    constructor(ethEngine: EthEngine) {
        super(TokenConfig.TenXPay.contractAddress, ethEngine);
    }
}

export class TenXPayTokenMainnet extends TokenAtomicSwap {
    constructor(ethEngine: EthEngine) {
        super(TokenConfigMain.TenXPay.contractAddress, ethEngine);
    }
}