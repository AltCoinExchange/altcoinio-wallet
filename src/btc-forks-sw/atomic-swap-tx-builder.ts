import {ExtractSecretData, ExtractSecretParams, IAtomicSwap} from "../atomic-swap";
import {AtomicSwapScriptTemplates} from "./atomic-swap-script-templates";
import {WalletServices} from "./wallet-services";
import {SecretGenerator, Ripemd160} from "../common/hashing";

import {
  TransactionBuilder,
  script as bscript,
  opcodes,
  address,
  networks,
  crypto,
  ECPair,
  Transaction, payments, script
} from "bitcoinjs-lib";

import {
    BtcExtractSecretData,
    BtcInitiateData,
    BtcParticipateData,
    BtcRedeemData,
    BtcRefundData,
    BtcAuditContractData
} from "./atomic-swap/data";

import {
    BtcAuditContractParams,
    BtcExtractSecretParams,
    BtcInitiateParams,
    BtcParticipateParams,
    BtcRedeemParams,
    BtcRefundParams
} from "./atomic-swap/params";

export class AtomicSwapTxBuilder extends WalletServices implements IAtomicSwap {

    constructor(net = "") {
        super();
    }

    public async initiate(params: BtcInitiateParams): Promise<BtcInitiateData> {
        // TODO: remove
        // public static async initiate(recipientAddressBase58check: string, amount: number, privateKey: string) {

        const refundTime: number = params.refundTime;
        const privateKey: string = params.privKey;
        const amount: number = params.amount;
        const recipientAddressBase58check: string = params.address;

        const lockTime: number = this.getLockTimeForXhours(refundTime);
        const secretResult = SecretGenerator.generateSecret();
        const secretHashHex: string = secretResult.secretHash;
        const secretHex: string = secretResult.secret;

        // TODO: pass refundAddressBase58check to initiate
        // const testPrivateKey = "cQwJ4qiBcK4vpXEiCGcwV8cNoabuxmXt7CLj4ZwwhTyoMR686ZtC"
        // const testAddress = "muFLuY5NUd3bh828Wv2xiorU963gqqurNu"
        // const refundAddressBase58check: string = testAddress
        const privateKeyEC = ECPair.fromWIF(privateKey, networks.testnet);
        // const fundFromAddress = privateKeyEC.getAddress();
        const refundAddressBase58check = payments.p2pkh({ pubkey: privateKeyEC.publicKey, network: networks.testnet }).address;

        const lockData = await this.lockTxBuilder(refundAddressBase58check, recipientAddressBase58check, amount, lockTime, secretHashHex, privateKey);

        await this.publishTx(lockData.lockTxHex);

        // TODO:reexamine what initiate returns
        return new BtcInitiateData(lockData.fee, lockData.P2SHaddress, lockData.lockScriptHex, lockData.txId, lockData.lockTxHex, lockData.txId, secretHex, secretHashHex);
    }

    public async participate(params: BtcParticipateParams): Promise<BtcParticipateData> {
        const refundTime: number = params.refundTime;
        const privateKey: string = params.privateKey;
        const amount: number = params.amount;
        const recipientAddressBase58check: string = params.address;

        const lockTime: number = this.getLockTimeForXhours(refundTime);
        const secretHashHex: string = params.secretHash;

        // TODO: pass refundAddressBase58check to initiate
        // const testPrivateKey = "cQwJ4qiBcK4vpXEiCGcwV8cNoabuxmXt7CLj4ZwwhTyoMR686ZtC"
        // const testAddress = "muFLuY5NUd3bh828Wv2xiorU963gqqurNu"
        // const refundAddressBase58check: string = testAddress
        const privateKeyEC = ECPair.fromWIF(privateKey, networks.testnet);
        const refundAddressBase58check = payments.p2pkh({ pubkey: privateKeyEC.publicKey, network: networks.testnet }).address;

        const lockData = await this.lockTxBuilder(refundAddressBase58check, recipientAddressBase58check, amount, lockTime, secretHashHex, privateKey);

        await this.publishTx(lockData.lockTxHex);

        return new BtcParticipateData(lockData.fee, lockData.P2SHaddress, lockData.lockScriptHex, lockData.txId, lockData.lockTxHex, lockData.txId, undefined, secretHashHex);
    }

    public async redeem(params: BtcRedeemParams): Promise<BtcRedeemData> {

        const secret = params.secret;
        const lockScriptHex = params.lockScriptHex;
        const lockTxHex = params.txHex;
        const privateKey = params.privateKey;

        // TODO: why is this necessery?
        const lockParams = AtomicSwapScriptTemplates.extractLockParams(lockScriptHex);
        // TODO: is this necessery?? recipientAddressBase58check sase which address can do the redeem
        const recipientAddressBase58check = lockParams.recipientAddressBase58check;

        const lockScript = Buffer.from(lockScriptHex, "hex");

        const witnessScript = lockScript;
        const {redeemScript, P2SHaddress} = this.expandWitnessScript(witnessScript);

        const lockTx = Transaction.fromHex(lockTxHex);

        const lockScriptVout = this.findLockScriptOutputIndex(lockTx, P2SHaddress);

        // TODO:pass redeem address or redeem to wallet addres or redeem to same address??? You can redeem on a compleatly diffrent addres
        // const testPrivateKey = "cRAEqku3QK3ZSAiUU6Z2RHafb9pckQ6FkG8boYtkUfhbNUKrXcVD"
        // const testAddress = "mqxi5XsoUkL2u7oes9LFWjDjfZ1dhkG3uM"
        // const redeemToAddr = testAddress
        const privateKeyEC = ECPair.fromWIF(privateKey, networks.testnet);
        const redeemToAddr = payments.p2pkh({ pubkey: privateKeyEC.publicKey, network: networks.testnet }).address;

        const transactionBuilder = new TransactionBuilder(networks.testnet);

        // TODO: calculate proper fee's
        const fee = 200000;

        transactionBuilder.addOutput(redeemToAddr, lockTx.outs[lockScriptVout].value - fee);
        const tx = transactionBuilder.buildIncomplete();

        tx.addInput(lockTx.getHash(), lockScriptVout);

        const signatureHash = tx.hashForWitnessV0(0, witnessScript, lockTx.outs[lockScriptVout].value, Transaction.SIGHASH_ALL);

        const keyPair = ECPair.fromWIF(privateKey, networks.testnet);
        const signature = keyPair.sign(signatureHash);

        const signatureForScript = script.signature.decode(signature).signature;

        // const signatureForScript = signature.toScriptSignature(Transaction.SIGHASH_ALL);

        const unlockScript: any = AtomicSwapScriptTemplates.redeemScript(lockScript, signatureForScript, keyPair.publicKey, secret);

        tx.setInputScript(0, bscript.compile([redeemScript]));

        tx.setWitness(0, unlockScript);

        await this.publishTx(tx.toHex());

        // TODO: do we need to return the secret, secretHash?
        return new BtcRedeemData(tx.toHex(), tx.getId(), secret, params.hashedSecret);

    }

    public async refund(params: BtcRefundParams): Promise<BtcRefundData> {

        const lockScriptHex = params.lockScriptHex;
        const lockTxHex = params.txHex;
        const privateKey = params.privateKey;

        const lockParams = AtomicSwapScriptTemplates.extractLockParams(lockScriptHex);
        const lockTime = lockParams.lockTime;
        // TODO: is this necessery?? refundAddressBase58check sase which addres can do the redeem
        const refundAddressBase58check = lockParams.refundAddressBase58check;

        const lockScript = Buffer.from(lockScriptHex, "hex");

        const witnessScript = lockScript;
        const {redeemScript, P2SHaddress} = this.expandWitnessScript(witnessScript);

        const lockTx = Transaction.fromHex(lockTxHex);

        const lockScriptVout = this.findLockScriptOutputIndex(lockTx, P2SHaddress);

        const transactionBuilder = new TransactionBuilder(networks.testnet);

        // TODO: calculate proper fee's
        const fee = 200000;

        /* TODO: pay attention to this, you are refunding to the refund addres from the contract(addres which has the right to do the refund),
        you can refund to a completly diffrent addres if you want*/
        const refundToAddr = refundAddressBase58check;

        transactionBuilder.addOutput(refundToAddr, lockTx.outs[lockScriptVout].value - fee);
        const tx = transactionBuilder.buildIncomplete();

        tx.locktime = lockTime;

        tx.addInput(lockTx.getHash(), lockScriptVout, 0);

        const signatureHash = tx.hashForWitnessV0(0, witnessScript, lockTx.outs[lockScriptVout].value, Transaction.SIGHASH_ALL);

        const keyPair = ECPair.fromWIF(privateKey, networks.testnet);
        const signature = keyPair.sign(signatureHash);

        const signatureForScript = script.signature.decode(signature).signature;  // signature.toScriptSignature(Transaction.SIGHASH_ALL);

        const unlockScript: any = AtomicSwapScriptTemplates.refundScript(lockScript, signatureForScript, keyPair.publicKey);

        tx.setInputScript(0, bscript.compile([redeemScript]));

        tx.setWitness(0, unlockScript);

        await this.publishTx(tx.toHex());

        return new BtcRefundData(fee, tx.toHex());
    }

    public async audit(params: BtcAuditContractParams): Promise<BtcAuditContractData> {
        const lockScriptHex: string = params.lockScriptHex;
        const lockTxHex: string = params.lockTxHex;

        const lockTx = Transaction.fromHex(lockTxHex);

        const lockScript = Buffer.from(lockScriptHex, "hex");

        const witnessScript = lockScript;

        const {P2SHaddress} = this.expandWitnessScript(witnessScript);

        const lockScriptVout = this.findLockScriptOutputIndex(lockTx, P2SHaddress);

        const lockParams = AtomicSwapScriptTemplates.extractLockParams(lockScriptHex);

        const lockTime: number = lockParams.lockTime;
        const secretHashHex: string = lockParams.secretHashHexStr;
        const refundAddressBase58check: string = lockParams.refundAddressBase58check;
        const recipientAddressBase58check: string = lockParams.recipientAddressBase58check;
        // TODO: define type
        const value = lockTx.outs[lockScriptVout].value;

        return new BtcAuditContractData(P2SHaddress, value, recipientAddressBase58check,
            refundAddressBase58check, secretHashHex, lockTime);
    }

    // NOTE: something's not ite with the implementation bellow
    public extractSecret(params: ExtractSecretParams): Promise<ExtractSecretData> {
        return undefined;
    }

    // // public static async extractSecret(params: BtcExtractSecretParams): Promise<BtcExtractSecretData> {
    // public async extractSecret(params: BtcExtractSecretParams): Promise<string> {
    //     const secretHashHex: string = params.secretHash;
    //     const unlockTxHex: string = params.unlockTx;
    //
    //     const unlockTx = Transaction.fromHex(unlockTxHex);
    //
    //     const txData = unlockTx.ins.map((input) => {
    //         return input.witness;
    //     }).reduce((a, b) => {
    //         return a.concat(b);
    //     }, []);
    //
    //     const secretBuffer: Buffer = txData.find((potentialSecret) => {
    //         return new Ripemd160().buffer(potentialSecret).toString("hex") === secretHashHex;
    //     });
    //
    //     const secret = secretBuffer.toString("hex");
    //
    //     const extractSecretData = new BtcExtractSecretData(secret);
    //
    //     // return new Promise(function (resolve, reject) {
    //     //     resolve(extractSecretData);
    //     // });
    //     // TODO: something's not write with the linter can not return extractSecretData
    //     return undefined;
    // }

    public getLockTimeForXhours(appendHours = 48) {
        const currDate = new Date();
        currDate.setHours(currDate.getHours() + appendHours);
        return parseInt((currDate.getTime() / 1000).toFixed(0), 10);
    }

    public async sendCoins(toAddress, amount, WIF, fromAddress?) {
        const privateKey = ECPair.fromWIF(WIF, networks.testnet);
        if (!fromAddress) {
            const publicKey = privateKey.publicKey;
            fromAddress = payments.p2pkh( { pubkey: privateKey.publicKey, network: networks.testnet });
            // fromAddress = publicKey.toAddress(networks.testnet);
        }

        const value = Math.round(amount * 100000000);

        // Create transaction
        const transactionBuilder = new TransactionBuilder(networks.testnet);
        transactionBuilder.addOutput(toAddress, value);

        // transaction.to(toAddress, value)
        //  .change(fromAddress)
        //  .sign(privateKey);
        await AtomicSwapTxBuilder.fundTransaction(fromAddress, transactionBuilder);
        const transaction = transactionBuilder.build();

        for (const i of transaction.ins) {
            transactionBuilder.sign(i.index, privateKey);
        }

        // const finalTransaction = transactionBuilder.sign( privateKey, ).build();
        // const signatures = transaction.getSignatures(privateKey);
        // for (const signature of signatures) {
        //     transaction.applySignature(signature);
        // }
        return await this.publishTx(transactionBuilder.build().toString());
    }

    private async lockTxBuilder(refundAddressBase58check, recipientAddressBase58check, amount, lockTime, secretHashHex, privateKey) {

        const lockScript = AtomicSwapScriptTemplates.lockScript(refundAddressBase58check, recipientAddressBase58check, lockTime, secretHashHex);

        // TODO:write proper test then refactor
        // ------
        const witnessScript = lockScript;
        const witnessScriptHash = crypto.sha256(witnessScript);

        const redeemScript = bscript.signature.encode(witnessScriptHash, Transaction.SIGHASH_ALL);

        // const redeemScript = bscript.witnessScriptHash.output.encode(witnessScriptHash);
        const redeemScriptHash = crypto.hash160(redeemScript);

        // const scriptPubKey = bscript.scriptHash.output.encode(redeemScriptHash);
        const scriptPubKey = bscript.signature.encode(redeemScriptHash, Transaction.SIGHASH_ALL);

        const P2SHaddress = address.fromOutputScript(scriptPubKey, networks.testnet);

        // const witnessScript = lockScript
        // const {redeemScript, P2SHaddress} = this.expandWitnessScript(witnessScript)
        // ------

        const transactionBuilder = new TransactionBuilder(networks.testnet);

        transactionBuilder.addOutput(scriptPubKey, amount);

        const privateKeyEC = ECPair.fromWIF(privateKey, networks.testnet);
        const fundFromAddress = payments.p2pkh({ pubkey: privateKeyEC.publicKey, network: networks.testnet }).address;

        const fee = await WalletServices.fundTransaction(fundFromAddress, transactionBuilder);

        await WalletServices.signTransaction(transactionBuilder, privateKeyEC);

        const lockTx = transactionBuilder.build();

        const lockTxHex: string = lockTx.toHex();
        const lockScriptHex: string = lockScript.toString("hex");
        const txId = lockTx.getId();

        return {txId, lockTxHex, P2SHaddress, lockScriptHex, fee};
    }

    private expandWitnessScript(witnessScript: Buffer) {
        const witnessScriptHash = crypto.sha256(witnessScript);

        const redeemScript = bscript.signature.encode(witnessScriptHash, Transaction.SIGHASH_ALL);

        // const redeemScript = bscript.witnessScriptHash.output.encode(witnessScriptHash);

        const redeemScriptHash = crypto.hash160(redeemScript);

        // const scriptPubKey = bscript.scriptHash.output.encode(redeemScriptHash);
        const scriptPubKey = bscript.signature.encode(redeemScriptHash, Transaction.SIGHASH_ALL);
        const P2SHaddress = address.fromOutputScript(scriptPubKey, networks.testnet);

        return {witnessScriptHash, redeemScript, redeemScriptHash, scriptPubKey, P2SHaddress};
    }

    private findLockScriptOutputIndex(lockTx: Transaction, P2SHaddress: string) {

        let lockScriptVout = -1;

        for (let i = 0; i < lockTx.outs.length; i++) {
            const lockScriptAddress = address.fromOutputScript(lockTx.outs[i].script, networks.testnet);
            if (lockScriptAddress === P2SHaddress) {
                lockScriptVout = i;
            }
        }

        if (lockScriptVout === -1) {
            throw new Error("transaction does not contain a contract output");
        }

        return lockScriptVout;
    }

}
