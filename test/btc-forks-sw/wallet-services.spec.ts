import "jest";
import {AtomicSwapScriptTemplates} from "../../src/btc-forks-sw/atomic-swap-script-templates"
import {AtomicSwapTxBuilder} from "../../src/btc-forks-sw/atomic-swap-tx-builder"
import {SecretGenerator} from "../../src/common/hashing";
import {TransactionBuilder, crypto, script as bscript, address as addressUtil, networks} from "bitcoinjs-lib"

const assert = require('assert');

import {WalletServices} from "../../src/btc-forks-sw/wallet-services"


it("getUnspentOutputs return the valid number of transactions", async () => {
    const walletServices = new WalletServices();
    const address = "mooAa4RLVdTmVcq96h5devGRbPcWuGgySM";
    const privateKey = "cPB8bqYuK9w7WNKH4CNvMDvHtAQDwom63d8NzgCkvpj5mtRNAnep";
    const utxos = await WalletServices.getUnspentOutputs(address);
    // console.log(utxos)
    assert(utxos.length, 3)
});

const address = "mnopGXXKQdt6mXnwHeRcdWNsaksoqKcvwZ";
const privateKey = "cQ63rjfvri2EHn6WvR5F9KGbgaGNRMvb7y9ra8ZuTyQVeteLZ66a";

const address1 = "mnw7yBjxmEtKtHn3HJaqsYtmbztq3eKc6U";
const privateKey1 = "cUfKPZw418973NhJ7sxH99XSjnqDVJYyzx3m6mmg5neaYb15NZf5";

//TODO: finnish writing this test, IT ISN'T WORKING NOW
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
