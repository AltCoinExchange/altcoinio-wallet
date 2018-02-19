import axios from "axios";
import {TransactionBuilder, Transaction, ECPair, Satoshi, networks} from "bitcoinjs-lib";
// tslint:disable-next-line
let coinSelect = require('coinselect');
import * as querystring from "querystring";

export class WalletServices {
    protected configuration: any;

    // TODO: add return type, should be satoshis
    public async getBalance(address: string): Promise<any> {
        return await axios.get("https://chain.so/api/v2/get_address_balance/BTCTEST/" + address).then((response) => {
            return response.data.data.confirmed_balance;
        });
    }

    public async publishTx(txHex: string) {
        const url = "http://ec2-54-212-204-230.us-west-2.compute.amazonaws.com:3001/insight-api/tx/send/";
        const data = querystring.stringify({rawtx: txHex});
        // try {
        //     axios.post(url, data).then((res) => res.data.txid).catch((err) => console.log(err.response.data));
        //     // axios.post(url, data).then((res) => res.data.txid).catch((err) => {throw(err); });
        // } catch (err) {
        //     // tslint:disable-next-line
        //     console.log(err);
        // }
        // tslint:disable-next-line
        return axios.post(url, data).then((res) => res.data.txid).catch((err) => console.log(err.response.data));
    }

    public async send(sendToAddressBase58check: string, privateKey: string, amount: number): Promise<any> {

        // TODO: check available balance before proceding
        // const availableBalance =  this.getBalance
        // if (validAmount!){
        //     throw (new Error("invalidAmount"));
        // }

        const transactionBuilder = new TransactionBuilder(networks.testnet);

        transactionBuilder.addOutput(sendToAddressBase58check, amount);

        const privateKeyEC = ECPair.fromWIF(privateKey, networks.testnet);
        const fundFromAddress = privateKeyEC.getAddress();

        const fee = await WalletServices.fundTransaction(fundFromAddress, transactionBuilder);

        await WalletServices.signTransaction(transactionBuilder, privateKeyEC);

        const tx = transactionBuilder.build();
        const txHex = tx.toHex();

        return txHex;
    }

    public static async getUnspentOutputs(addressBase58check) {
        const numOfConfirmations = 1;
        const urlQuery = "https://chain.so/api/v2/get_tx_unspent/BTCTEST/" + addressBase58check + "/" + numOfConfirmations;
        const res = await axios.get(urlQuery);
        // const unspentOutputs = res.data.data.txs;
        // const utxos = []

        return res.data.data.txs;
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
                value
            };
            utxos.push(utxo);
            // txb.addInput(utxo)
        }

        const feeRate = 900;

        const {inputs, outputs, fee} = coinSelect(utxos, txb.tx.outs, feeRate);

        if (!inputs || !outputs) {
            throw new Error("Insufficient funds");
        }

        inputs.forEach((input) => txb.addInput(input.txHash, input.vout, undefined, Buffer.from(input.prevOutScript, "hex")));

        outputs.forEach((output) => {
            if (typeof output.script === "undefined") {
                // TODO: refactor, for now send to the same address from which you fund the tx
                const testChangeAddress = fundFromAddress;
                output.address = testChangeAddress;
                txb.addOutput(output.address, output.value);
            }
        });

        return fee;

    }

    public static async signTransaction(txb: TransactionBuilder, privateKeyEC: ECPair) {
        for (let i = 0; i < txb.tx.ins.length; i++) {
            txb.sign(i, privateKeyEC);
        }

    }

}
