import "jest";
import {AtomicSwapScriptTemplates} from "../../src/btc-forks-sw/atomic-swap-script-templates";
import {AtomicSwapTxBuilder} from "../../src/btc-forks-sw/atomic-swap-tx-builder";
import {SecretGenerator} from "../../src/common/hashing";
import {TransactionBuilder, crypto, script as bscript, address as addressUtil, networks} from "bitcoinjs-lib";

const assert = require("assert");

import {WalletServices} from "../../src/btc-forks-sw/wallet-services";

it("getUnspentOutputs return the valid number of transactions", async () => {
    const walletServices = new WalletServices();
    const address = "mooAa4RLVdTmVcq96h5devGRbPcWuGgySM";
    const privateKey = "cPB8bqYuK9w7WNKH4CNvMDvHtAQDwom63d8NzgCkvpj5mtRNAnep";
    const utxos = await WalletServices.getUnspentOutputs(address);
    // console.log(utxos)
    assert(utxos.length, 3);
});

const address = "mnopGXXKQdt6mXnwHeRcdWNsaksoqKcvwZ";
const privateKey = "cQ63rjfvri2EHn6WvR5F9KGbgaGNRMvb7y9ra8ZuTyQVeteLZ66a";

const address1 = "mnw7yBjxmEtKtHn3HJaqsYtmbztq3eKc6U";
const privateKey1 = "cUfKPZw418973NhJ7sxH99XSjnqDVJYyzx3m6mmg5neaYb15NZf5";

it("create valid send transaction", async () => {
    const walletServices = new WalletServices();
    const txHex = await walletServices.send("mnw7yBjxmEtKtHn3HJaqsYtmbztq3eKc6U", privateKey, 1000000);

    console.log(txHex);

});

it("should publish tx", async () => {
    const walletServices = new WalletServices();
    const txHex = "010000000101730e6da440d04f309946171608d5e36f0bf5409436415beb1c55ff10614522010000006b483045022100f2ad89e3af8e52a706a9e4cae2809bbf6a2c9db84d9e1a6a89fbed33a36ea246022009071fdf25e64bc996ca2064c8111e64cf6e99112c9496d2103bc332ecf77f3601210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f00000000001976a914515af089301b8ccf876e78607b57f5196a4a642288ac50324d03000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac00000000";
    const txIdHex = await walletServices.publishTx(txHex);

    console.log(txIdHex);

});

// TODO: finnish writing this test, IT ISN'T WORKING NOW
// it("fundTransaction, should fund the transaction passed by reference", async () => {
//
//     const lockTime: number = AtomicSwapTxBuilder.getLockTimeForXhours()
//     const secretHashHexStr: string = SecretGenerator.generateSecret().secretHash
//
//     // TODO: pass refundAddressBase58check to initiate
//     const testPrivateKey = "cQwJ4qiBcK4vpXEiCGcwV8cNoabuxmXt7CLj4ZwwhTyoMR686ZtC"
//     const testAddress = "muFLuY5NUd3bh828Wv2xiorU963gqqurNu"
//     const refundAddressBase58check: string = testAddress
//     const recipientAddressBase58check = address1
//     const lockScript = AtomicSwapScriptTemplates.lockScript(refundAddressBase58check, recipientAddressBase58check, lockTime, secretHashHexStr)
//
//     const witnessScript = lockScript
//     const witnessScriptHash = crypto.sha256(witnessScript)
//
//     const redeemScript = bscript.witnessScriptHash.output.encode(witnessScriptHash)
//     const redeemScriptHash = crypto.hash160(redeemScript)
//
//     const scriptPubKey = bscript.scriptHash.output.encode(redeemScriptHash)
//     const P2SHaddress = addressUtil.fromOutputScript(scriptPubKey, networks.testnet)
//
//     const amount = 100000000
//
//
//     const transactionBuilder = new TransactionBuilder(networks.testnet)
//
//     transactionBuilder.addOutput(scriptPubKey, amount)
//
//     WalletServices.fundTransaction(address, transactionBuilder)
//
//     const lockTxHex = transactionBuilder.tx.toHex()
//
//     console.log(lockTxHex);
//
//
// });
