import axios, {AxiosResponse} from "axios";
import {TransactionBuilder, Transaction, ECPair} from "bitcoinjs-lib"
// import {coinSelect} from "coinselect"
// let accumulative = require('coinselect/accumulative')
let coinSelect = require('coinselect');

// import {BtcRefundData} from "./atomic-swap";
// import {BtcAtomicSwapContractData} from "./atomic-swap/btc-atomic-swap-contract-data";
// import {BtcContractBuilder} from "./btc-contract-builder";
// import {Util} from "./util";


export class WalletServices {
    protected configuration: any;


    public async publishTx() {

    }

    public static async getUnspentOutputs(addressBase58check) {
        const numOfConfirmations = 1;
        const urlQuery = "https://chain.so/api/v2/get_tx_unspent/BTCTEST/" + addressBase58check + "/" + numOfConfirmations;
        const res = await axios.get(urlQuery);
        // const unspentOutputs = res.data.data.txs;
        // const utxos = []


        return res.data.data.txs
    }

    public static async fundTransaction(addressBase58check: string, txb: TransactionBuilder) {
        const fundFromAddress = addressBase58check;
        const unspentOutputs = await this.getUnspentOutputs(fundFromAddress);
        const utxos = [];

        // function sumTxInsOrOuts(insOrOuts:Array<any>){
        //   let sum = 0
        //   insOrOuts.forEach((inOrOut)=>sum+=inOrOut.value)
        // }

        for (const output of unspentOutputs) {
            const value = Math.round(output.value * 100000000);
            const utxo = {
                txHash: output.txid,
                vout: output.output_no,
                prevOutScript: output.script_hex,
                value: value
            };
            utxos.push(utxo)
            // txb.addInput(utxo)
        }


        const feeRate = 900;

        let {inputs, outputs, fee} = coinSelect(utxos, txb.tx.outs, feeRate);


        if (!inputs || !outputs) {
            throw new Error("Insufficient funds")
        }


        inputs.forEach(input => txb.addInput(input.txHash, input.vout, undefined, Buffer.from(input.prevOutScript, "hex")));

        outputs.forEach(output => {
            if (typeof output.script == "undefined") {
                //TODO: refactor, for now send to the same address from which you fund the tx
                const testChangeAddress = fundFromAddress;
                output.address = testChangeAddress;
                txb.addOutput(output.address, output.value)
            }
        });

        return fee

    }

    public static async signTransaction(txb: TransactionBuilder, privateKeyEC: ECPair) {
        for (let i = 0; i < txb.tx.ins.length; i++) {
            txb.sign(i, privateKeyEC)
        }

    }

}
