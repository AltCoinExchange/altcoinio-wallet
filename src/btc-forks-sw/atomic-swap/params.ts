import {InitiateParams, ExtractSecretParams, ParticipateParams, RedeemParams, RefundParams} from "../../atomic-swap";


export class BtcInitiateParams extends InitiateParams {
    //refundTime in hours
    //TODO: rename privKey to privateKey
    constructor(public refundTime, public privKey, public address, public amount, public extendedParams?) {
        super();
    }
}


export class BtcExtractSecretParams extends ExtractSecretParams {
    constructor(public unlockTx: string, public secretHash: string) {
        super();
    }


}


export class BtcParticipateParams extends ParticipateParams {
    constructor(public refundTime: number, public privateKey: string, public address: string, public amount: number, public secretHash: string) {
        super();
    }

}

//TODO: refactor
export class BtcRedeemParams extends RedeemParams {
    constructor(secretHex: string, secretHashHex: string, public lockScriptHex: string, public txHex: string, public privateKey:string, public extendedParams?: any,) {
        super(secretHex, secretHashHex);
    }



}

export class BtcRefundParams extends RefundParams {
    constructor(public lockScriptHex: string, public txHex: string, public privateKey: string) {
        super();
    }
}

export class BtcAuditContractParams {
    constructor(public lockScriptHex: string, public lockTxHex: string) {

    }


}


//TODO: remove this??
// export class BtcRefundParams extends RefundParams {
//     public hashedSecret;
//     public extendedParams;
// }




