import {RefundData, RedeemData, ExtractSecretData, InitiateData, ParticipateData} from "../../atomic-swap";

export class BtcRefundData extends RefundData {
    constructor(public refundFee: any, public refundTx: any) {
        super();
    }
}

// TODO: rename or remove or refactor this class, most likely remove
export class BtcAtomicSwapContractData extends BtcRefundData {
    public contract: any;
    public contractP2SH: any;
    public contractP2SHPkScript: any;
    public contractTxHash: any;
    public contractTx: any;
    public contractFee: any;

    constructor(contract: any, contractP2SH: any, contractP2SHPkScript: any, contractTxHash: any,
                contractTx: any, contractFee: any, refundFee: any, refundTx: any) {
        super(refundFee, refundTx);
        this.contract = contract;
        this.contractP2SH = contractP2SH;
        this.contractP2SHPkScript = contractP2SHPkScript;
        this.contractTxHash = contractTxHash;
        this.contractTx = contractTx;
        this.contractFee = contractFee;
    }
}

export class BtcAtomicSwapData {
    constructor(public secretHash: any, public recipientHash: any, public  lockTime: any, public refundHash160: any) {

    }
}

export class BtcExtractSecretData extends ExtractSecretData {
    constructor(public secret: string) {
        super();
    }
}

// TODO: refactor, remove secretHex and secretHashHex if unnecessary
export class BtcRedeemData extends RedeemData {
    public redeemTx: string;
    // TODO: rawTx to txId
    public rawTx: any;

    constructor(redeemTx: string, rawTx: any, secretHex: string, secretHashHex: string) {
        super(secretHex, secretHashHex);
        this.redeemTx = redeemTx;
        this.rawTx = rawTx;
    }
}

// TODO: refactor this class
export class BtcAuditContractData {
    public contractSH: any;
    public contractValue: any;
    public recipientAddress: string;
    // TODO: refund address dose not matter, we shouldn't care which address gets the money in care of a refund
    public refundAddress: string;
    public secretHash: any;
    public lockTime: number;

    constructor(contractSH: any, contractValue: any, recipientAddress: string,
                refundAddress: string, secretHash: any, lockTime: number) {
        this.contractSH = contractSH;
        this.contractValue = contractValue;
        this.recipientAddress = recipientAddress;
        this.refundAddress = refundAddress;
        this.secretHash = secretHash;
        this.lockTime = lockTime;
    }
}

// TODO:refactor
export class BtcInitiateData extends InitiateData {
    public fee: any;
    // P2SH address
    public contract: string;
    // lockScriptHex
    public contractHex: any;
    // lockTxHas/lockTxId ???
    public contractTx: any;
    // lockTxHex
    public contractTxHex: string;
    // lockTxId ???
    public rawTx: any;

    constructor(fee: any, contract: any, contractHex: string,
                contractTx: any, contractTxHex: string, rawTx: any, secret?: string, secretHash?: string) {
        super(secret, secretHash);
        this.fee = fee;
        this.contract = contract;
        this.contractHex = contractHex;
        this.contractTx = contractTx;
        this.contractTxHex = contractTxHex;
        this.rawTx = rawTx;
    }
}

// TODO: refactor
export class BtcParticipateData extends ParticipateData {
    public fee: any;
    // P2SH address
    public contract: string;
    // lockScriptHex
    public contractHex: any;
    // lockTxHas/lockTxId ???
    public contractTx: any;
    // lockTxHex
    public contractTxHex: string;
    // lockTxId ???
    public rawTx: any;

    constructor(fee: any, contract: any, contractHex: string,
                contractTx: any, contractTxHex: string, rawTx: any, secret?: string, secretHash?: string) {
        // super(secret, secretHash);
        super();
        this.fee = fee;
        this.contract = contract;
        this.contractHex = contractHex;
        this.contractTx = contractTx;
        this.contractTxHex = contractTxHex;
        this.rawTx = rawTx;
    }
}