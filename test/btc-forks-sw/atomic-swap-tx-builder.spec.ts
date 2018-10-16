// 7200, "0x" + secret.hashedSecret, AppConfig.hosts[1].defaultWallet, 10, 2000000

import "jest";
import {AtomicSwapScriptTemplates} from "../../src/btc-forks-sw/atomic-swap-script-templates";
import {AtomicSwapTxBuilder} from "../../src/btc-forks-sw/atomic-swap-tx-builder";
import {TransactionBuilder} from "bitcoinjs-lib";

import {
    BtcAuditContractParams, BtcExtractSecretParams, BtcInitiateParams, BtcParticipateParams, BtcRedeemParams,
    BtcRefundParams
} from "../../src/btc-forks-sw/atomic-swap/params";
import {BtcAtomicSwapContractData} from "../../src/btc-forks-sw/atomic-swap/data";

// import {SecretGenerator} from "../src/common/hashing";

const phrase = "away stomach fire police satoshi wire entire awake dilemma average town napkin";
const hdPrivateKey = "tprv8ZgxMBicQKsPdxZqLMWLFLxJiYwSnP92WVXzkb3meDwix5nxQtNd21AHzn3Uv" +
    "mJAqEqGoYzR7vtZk8hrujhZVGBh1MMED8JnsNja8gEopYM";
const WIF = "cQ63rjfvri2EHn6WvR5F9KGbgaGNRMvb7y9ra8ZuTyQVeteLZ66a";

const pubKey = "0263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908";
const address = "mnopGXXKQdt6mXnwHeRcdWNsaksoqKcvwZ";
const privateKey = "cQ63rjfvri2EHn6WvR5F9KGbgaGNRMvb7y9ra8ZuTyQVeteLZ66a";

// no segwit
const testDataInitRedeem = {
    lockScript: "63a6143c5a49d68c7ddd765137b018d06f639ebfcb08848876a914566465fd4ac69a7e33fa834a1ca3eea88d97ed1967045e6d075ab17576a9147703cec6a6796638e9a4d39714e3115cac38a41b6888ac",
    initiateTx: "0100000001233d5a503748c99cdc8dfe86b2684491eb7a37c85c677b040ee1dd428f49410b010000006a4730440220251e130a82dbd22f04213a34a0ea4d3d5058e52f40ff935bbaa83b146ee9b863022059ca39c7506ace11ff5f8b365aa46a91ee37515175b69d5486edfaf18a091a1f012103434991e49764752a545089e6f511ba253e6573cca6c34fe72a962ffd2117eec9feffffff02a08601000000000017a914c48f86a979877fb1cb16b98c74259f6678b4098987c07d4001000000001976a914543fd13c40cfe696c8f350b1ebb0aea087b78af188ac00000000",
    secret: "e1499e82d400845d6a73b220fe2d49f533e8d775bfdfc309fa9e46fd99e873ae",
    redeemScript: "4730440220251e130a82dbd22f04213a34a0ea4d3d5058e52f40ff935bbaa83b146ee9b863022059ca39c7506ace11ff5f8b365aa46a91ee37515175b69d5486edfaf18a091a1f012103434991e49764752a545089e6f511ba253e6573cca6c34fe72a962ffd2117eec9",
    redeemTx: "0100000001233d5a503748c99cdc8dfe86b2684491eb7a37c85c677b040ee1dd428f49410b010000006a4730440220251e130a82dbd22f04213a34a0ea4d3d5058e52f40ff935bbaa83b146ee9b863022059ca39c7506ace11ff5f8b365aa46a91ee37515175b69d5486edfaf18a091a1f012103434991e49764752a545089e6f511ba253e6573cca6c34fe72a962ffd2117eec9feffffff02a08601000000000017a914c48f86a979877fb1cb16b98c74259f6678b4098987c07d4001000000001976a914543fd13c40cfe696c8f350b1ebb0aea087b78af188ac00000000"
};

// const freshWallet = new FreshBitcoinWallet(phrase);
// const regenerateWallet = new RegenerateBitcoinWallet(hdPrivateKey);

describe("AtomicSwapTxBuilder", () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    it("Should pass sanity", () => {
    });

    // it("getLockTimeForXhours sanity check", async () => {
    //
    //   const lockTime = AtomicSwapTxBuilder.getLockTimeForXhours()
    //
    //   console.log(lockTime)
    //
    // });

    const address1 = "mnw7yBjxmEtKtHn3HJaqsYtmbztq3eKc6U";
    const privateKey1 = "cUfKPZw418973NhJ7sxH99XSjnqDVJYyzx3m6mmg5neaYb15NZf5";

    it("Should return valid initiate data", async () => {

        console.log("initiate!!!!!!");

        const btcInitiateParams = new BtcInitiateParams(0, privateKey, address1, 1000000);
        const atomicSwapTxBuilder = new AtomicSwapTxBuilder();
        const initiateData = await atomicSwapTxBuilder.initiate(btcInitiateParams);

        console.log(initiateData);
    });

    it("Should return valid participate data", async () => {
        //UNSPENT
        // BtcParticipateData {
        //     secret: undefined,
        //         secretHash: '5e690840c5fe98d8f340f9921017e9cf12278ab8',
        //         fee: 200700,
        //         contract: '2N46jLDWW1oJyfmVunKajUkr9cvdpyJWkv3',
        //         contractHex: '63a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a64226704d6cc795ab17576a9144ff94075bfd8e49cd5bad195371a3389be5f19686888ac',
        //         contractTx: '69ae2163003547cb2dfbc743354f015167dc11b7e503cf236006b833e6a0e0d9',
        //         contractTxHex: '01000000018567308d898f003d259f783f90feb763a23b10f1e44a78b59cb44e01b1c2ced2010000006a4730440220577e5e703ac87f05eb054b45c525d58b1e8f565ed1fb793962e7af3192107a86022001f1adf9dd6088d1de346a17123bc947bee651c56e33c47c613f05eda9bf3f7201210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a914770e2283c0639b3c034d235181b0cecfd56266518750899603000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac00000000',
        //         rawTx: '69ae2163003547cb2dfbc743354f015167dc11b7e503cf236006b833e6a0e0d9' }

        // BtcParticipateData {
        //     secret: undefined,
        //         secretHash: '5e690840c5fe98d8f340f9921017e9cf12278ab8',
        //         fee: 200700,
        //         contract: '2N61RyGBMpgDEQj8P57F1NQjs7nmi2bzipE',
        //         contractHex: '63a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a642267047b49735ab17576a914969dfb1ec29287bf6d5004f1d0d16fae5240e1206888ac',
        //         ATTENTION: txId: efba83ab6397b9526be22b782bd2006c91a0aaa36bea5acda43fdaf47ed91821
        //         contractTx: '6f728251e500c8d74bdd8f25151b993a8171ef40915641aef32a7b819e2738dc',
        //         contractTxHex: '0100000001bcbb29e3caf11f97ef605d54f9fbd4b17740110dc0cb6b7a8b050336d060df55000000006a47304402203aed7ec6202700d72d68ff3bd5a5a84576feab1c78efaa1448bb9d9c30f9f72802202788c381f6086a993747a7f0a483e5c6f826d06ab76f68949527d330d3e7b21b01210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a9148bfdd06a15849946f0223e9129ce55fff0650bb4870480cd03000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac00000000',
        //         rawTx: '6f728251e500c8d74bdd8f25151b993a8171ef40915641aef32a7b819e2738dc' }

        const participateTestData = {
            txId: "6f728251e500c8d74bdd8f25151b993a8171ef40915641aef32a7b819e2738dc",
            refundTx: "0100000001bcbb29e3caf11f97ef605d54f9fbd4b17740110dc0cb6b7a8b050336d060df55000000006a47304402203aed7ec6202700d72d68ff3bd5a5a84576feab1c78efaa1448bb9d9c30f9f72802202788c381f6086a993747a7f0a483e5c6f826d06ab76f68949527d330d3e7b21b01210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a9148bfdd06a15849946f0223e9129ce55fff0650bb4870480cd03000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac00000000",
            refundScript: "63a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a642267047b49735ab17576a914969dfb1ec29287bf6d5004f1d0d16fae5240e1206888ac"
        };

        // the address bellow has a lot of funds
        const address1 = "mnw7yBjxmEtKtHn3HJaqsYtmbztq3eKc6U";
        const privateKey1 = "cUfKPZw418973NhJ7sxH99XSjnqDVJYyzx3m6mmg5neaYb15NZf5";

        const secretHash = "5e690840c5fe98d8f340f9921017e9cf12278ab8";

        const btcParticipateParams = new BtcParticipateParams(0, privateKey, address1, 1000000, secretHash);
        const atomicSwapTxBuilder = new AtomicSwapTxBuilder;
        const participateData = await atomicSwapTxBuilder.participate(btcParticipateParams);

        console.log(participateData);

        // need to fund from a wallet that has no traffic so the inputs stay the same
        // assert.equal(participateData.contractTxHex, participateTestData.refundTx)
        // assert.equal(participateData.contractHex, participateTestData.refundScript)
        // assert.equal(participateData.contractTx, participateTestData.txId)

    });

    it("Should return valid redeem data", async () => {

        console.log("redeem!!!!!!");

        // BtcParticipateData {
        //     secret: undefined,
        //         secretHash: '5e690840c5fe98d8f340f9921017e9cf12278ab8',
        //         fee: 200700,
        //         contract: '2Mz6vTLjZwu3YqZCaj4bhWCdYaLf3frxZyS',
        //         contractHex: '63a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a64226704f2b2795ab17576a9144ff94075bfd8e49cd5bad195371a3389be5f19686888ac',
        //         ATTENTION: txId: 256954eebf962b92750ddcf244a3ec3e16c520fc8d051612eaea10abe9de683a
        //         contractTx: 'cb70fc42e9231c9093db6a0d874f8b150f99021dde83432aa37c9610ac7cbe3b',
        //         contractTxHex: '01000000012118d97ef4da3fa4cd5aea6ba3aaa0916c00d22b782be26b52b99763ab83baef010000006a4730440220493f0572492e4919707403352d8aff15e1a7d3d59b9a2088eecfe60f61351a6602202c64b8cc0cd9697333f3394bc7ce0dd8ae5fb01fd3632061c3fa8e3ba8d9fe9a01210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a9144b36eaa3ff7667f8461fed670babb36acd0bde9287c82dbb03000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac00000000',
        //         rawTx: 'cb70fc42e9231c9093db6a0d874f8b150f99021dde83432aa37c9610ac7cbe3b' }

        const testLockTx = {
            txHexString: "01000000012118d97ef4da3fa4cd5aea6ba3aaa0916c00d22b782be26b52b99763ab83baef010000006a4730440220493f0572492e4919707403352d8aff15e1a7d3d59b9a2088eecfe60f61351a6602202c64b8cc0cd9697333f3394bc7ce0dd8ae5fb01fd3632061c3fa8e3ba8d9fe9a01210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a9144b36eaa3ff7667f8461fed670babb36acd0bde9287c82dbb03000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac00000000",
            lockScriptHex: "63a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a64226704f2b2795ab17576a9144ff94075bfd8e49cd5bad195371a3389be5f19686888ac",
            secret: "37d71ebbd08659bb4022ab09112cb99fde9311a199f1b9a2d92ec68f7ed5675d",
            secretHashHexStr: "5e690840c5fe98d8f340f9921017e9cf12278ab8"
        };

        // BtcRedeemData {
        //     secret: '37d71ebbd08659bb4022ab09112cb99fde9311a199f1b9a2d92ec68f7ed5675d',
        //         secretHash: '5e690840c5fe98d8f340f9921017e9cf12278ab8',
        //         contractBin: undefined,
        //         contractTx: undefined,
        //         redeemTx: '010000000001013a68dee9ab10eaea1216058dfc20c5163eeca344f2dc0d75922b96bfee54692500000000232200205c740935417cd2a5b6753346ea0cfd2893cd13860634e51cbbbdba95b5257802ffffffff0100350c00000000001976a914515af089301b8ccf876e78607b57f5196a4a642288ac05483045022100807ec9bd1f30bd20fee8327cd405b943252c272d7dcdd3c2c798534ad25ddad50220770612642c8678c494caf77ae32dd25d9e41131a34053a7a514106c683d9261701210360fd75fb951cda70ab6cdd6af3894dc53f233d93a483d904c4370a9eb667a6bf2037d71ebbd08659bb4022ab09112cb99fde9311a199f1b9a2d92ec68f7ed5675d01015163a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a64226704f2b2795ab17576a9144ff94075bfd8e49cd5bad195371a3389be5f19686888ac00000000',
        //         rawTx: '8247da326c9faae057e55e541cee1eb4250617e73484d1137fa871c85f77449f' }

        // const testLockTx = {
        //     txHexString: '0100000001c42321172f8e4ea3c67b27e951d40bd0e6f6df97a56d210543520203c5bcaa18000000006b483045022100e800f5c596772e642badc24b04009a1f6b2dfbc9e1f115bd0f9d1a2bbc5d8159022055ab07beac79b6713adfdc0ec239e68eb5374edc06889316aa2662823649182001210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a9142434a4fb37dc21b2b877272b39861bd1ffd94a108742daae07000000001976a914515af089301b8ccf876e78607b57f5196a4a642288ac00000000',
        //     lockScriptHex: '63a6142fa839ad57a160ba690e8fa85dff1b0de9b9a0a18876a914515af089301b8ccf876e78607b57f5196a4a64226704afa35f5ab17576a914969dfb1ec29287bf6d5004f1d0d16fae5240e1206888ac',
        //     secret: '7a92d6fe0bceb976ec5c36748313f5f9052f37b7b1f602cdb51fc1879436e98d',
        //     secretHashHexStr: '2fa839ad57a160ba690e8fa85dff1b0de9b9a0a1'
        // }

        const testLockTx1 = {
            txHexString: "0100000001bfe192338ac76721e268516f6cfe99a93faac6c9c31917f6aeb3feba34257749010000006b483045022100b4a093fef3a3f53425015ebb65aeda8d9de7b3cb1e91a4fb590de3d3aad2bcb802201ce3a589734394a90c1e6a1787d940bae3e2821d461343668d03abfd5410082301210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a914adbfeffcb420b5027fdb0a407322126d0712b46587ab045c01000000001976a914515af089301b8ccf876e78607b57f5196a4a642288ac00000000",
            lockScriptHex: "63a61421013bca67fd45d3ff8a46a02d9c86b8ff2ca0d38876a914515af089301b8ccf876e78607b57f5196a4a6422670455ad5f5ab17576a914969dfb1ec29287bf6d5004f1d0d16fae5240e1206888ac",
            secret: "25f1831a5bbf57506c17becd628b706f591c38ef1db0b167d5540c5f11a6ba67",
            secretHashHexStr: "21013bca67fd45d3ff8a46a02d9c86b8ff2ca0d3"
        };

        const testUnlockTx = {
            unlockTxId: "b58b92e39b0fa50177873473da4ec584668a6cca4c4c0dec0853ffdaa59e28c3",
            unlockTx: "01000000000101c4cd170dd4d86f9e46d72380b39e297e853f0c9678332959a3ca6db130941e4f00000000232200208bf522d1c1bc9b1b4c3e1a82aa7612e0445b7ab5013d5314bc7d27db0367174effffffff0100350c00000000001976a914729034be3dc1399c8f28b307cee59ad6db0a380f88ac05483045022100ceff8c2634813ea3986fd1b3db851d11a7b9617027640c60dd6b665235335618022042c99f39cc055c46ad2261b53da541a44c8a9bc6883eadc7b8b114ad3e683dfb01210360fd75fb951cda70ab6cdd6af3894dc53f233d93a483d904c4370a9eb667a6bf207a92d6fe0bceb976ec5c36748313f5f9052f37b7b1f602cdb51fc1879436e98d01015163a6142fa839ad57a160ba690e8fa85dff1b0de9b9a0a18876a914515af089301b8ccf876e78607b57f5196a4a64226704afa35f5ab17576a914969dfb1ec29287bf6d5004f1d0d16fae5240e1206888ac00000000",
            sig: "3045022100ceff8c2634813ea3986fd1b3db851d11a7b9617027640c60dd6b665235335618022042c99f39cc055c46ad2261b53da541a44c8a9bc6883eadc7b8b114ad3e683dfb01",
            pubKey: "0360fd75fb951cda70ab6cdd6af3894dc53f233d93a483d904c4370a9eb667a6bf",
            secret: "7a92d6fe0bceb976ec5c36748313f5f9052f37b7b1f602cdb51fc1879436e98d",
            elseSwitch: "01",
            unlockScript: "63a6142fa839ad57a160ba690e8fa85dff1b0de9b9a0a18876a914515af089301b8ccf876e78607b57f5196a4a64226704afa35f5ab17576a914969dfb1ec29287bf6d5004f1d0d16fae5240e1206888ac"
        };

        // the address bellow has a lot of funds
        const address1 = "mnw7yBjxmEtKtHn3HJaqsYtmbztq3eKc6U";
        const privateKey1 = "cUfKPZw418973NhJ7sxH99XSjnqDVJYyzx3m6mmg5neaYb15NZf5";

        const btcRedeemParams = new BtcRedeemParams(privateKey1, testLockTx.secret, testLockTx.secretHashHexStr, testLockTx.lockScriptHex, testLockTx.txHexString);
        const atomicSwapTxBuilder = new AtomicSwapTxBuilder;
        const redeemData = await atomicSwapTxBuilder.redeem(btcRedeemParams);

        console.log(redeemData);

        // TODO: adjust the test cases for the address change
        // assert.equal(redeemData.redeemTx, testUnlockTx.unlockTx)
        // assert.equal(redeemData.rawTx, testUnlockTx.unlockTxId)

    });

    it("Should return valid refund data", async () => {

        // BtcParticipateData {
        // 37d71ebbd08659bb4022ab09112cb99fde9311a199f1b9a2d92ec68f7ed5675d
        //
        //     secret: undefined,
        //         secretHash: '5e690840c5fe98d8f340f9921017e9cf12278ab8',
        //         fee: 200700,
        //         contract: '2MxTs4cNQJa8RrR7ksHMyua9Z4b1shR6heZ',
        //         contractHex: '63a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a64226704b6b9795ab17576a9144ff94075bfd8e49cd5bad195371a3389be5f19686888ac',
        //         ATTENTION: txId: d2cec2b1014eb49cb5784ae4f1103ba263b7fe903f789f253d008f898d306785
        //         contractTx: '8d6d960e5aea0039a5ded8ec6e8e0d7087ece2cb093e5b55988a1605c1d9ad8b',
        //         contractTxHex: '01000000013a68dee9ab10eaea1216058dfc20c5163eeca344f2dc0d75922b96bfee546925010000006a47304402202a7789205f8de785739ec0cf6638455938e9f984ee823288d9905edddcd0b8ba022056378e4d529ca68d53004e2f1b46d6d029d23603d500c494c6bb77aba97a131d01210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a914393c919b4f4bba870278fdd62e7b1e1c0e8be8d0878cdba803000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac00000000',
        //         rawTx: '8d6d960e5aea0039a5ded8ec6e8e0d7087ece2cb093e5b55988a1605c1d9ad8b' }

        // BtcRefundData {
        //     refundFee: 200000,
        //         refundTx: '010000000001018567308d898f003d259f783f90feb763a23b10f1e44a78b59cb44e01b1c2ced20000000023220020b0af71461928f3afc5c9652fca7e76345bee538e437cb658449d5e0b19fb2cc9000000000100350c00000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac04483045022100e59e3491a84a6626d9b756f24f399b679845df776c6a42411f67d28143fe239202203139786a7d8eef9c2a6bb69214519c09f490c3c254d7e33826f49d03058561de01210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908005163a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a64226704b6b9795ab17576a9144ff94075bfd8e49cd5bad195371a3389be5f19686888acb6b9795a' }

        const testLockTx = {
            lockScriptHex: "63a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a64226704b6b9795ab17576a9144ff94075bfd8e49cd5bad195371a3389be5f19686888ac",
            txHexString: "01000000013a68dee9ab10eaea1216058dfc20c5163eeca344f2dc0d75922b96bfee546925010000006a47304402202a7789205f8de785739ec0cf6638455938e9f984ee823288d9905edddcd0b8ba022056378e4d529ca68d53004e2f1b46d6d029d23603d500c494c6bb77aba97a131d01210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a914393c919b4f4bba870278fdd62e7b1e1c0e8be8d0878cdba803000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac00000000",
        };

        const address = "mnopGXXKQdt6mXnwHeRcdWNsaksoqKcvwZ";
        const privateKey = "cQ63rjfvri2EHn6WvR5F9KGbgaGNRMvb7y9ra8ZuTyQVeteLZ66a";

        const btcRefundParams = new BtcRefundParams(testLockTx.lockScriptHex, testLockTx.txHexString, privateKey);
        const atomicSwapTxBuilder = new AtomicSwapTxBuilder;
        const refundData = await atomicSwapTxBuilder.refund(btcRefundParams);

        console.log(refundData);

        // TODO: adjust the test cases for the address change
        // assert.equal(refundData.refundTx, testRefundData.refundTx)

    });

    it("Should parse/audit contract correctly, return valid audit contract data", async () => {
        // BtcParticipateData {
        //     secret: undefined,
        //         secretHash: '5e690840c5fe98d8f340f9921017e9cf12278ab8',
        //         fee: 200700,
        //         contract: '2Mz6vTLjZwu3YqZCaj4bhWCdYaLf3frxZyS',
        //         ATTENTION: txId: 256954eebf962b92750ddcf244a3ec3e16c520fc8d051612eaea10abe9de683a
        //                       63a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a64226704f2b2795ab17576a9144ff94075bfd8e49cd5bad195371a3389be5f19686888ac
        //         contractHex: '63a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a64226704f2b2795ab17576a9144ff94075bfd8e49cd5bad195371a3389be5f19686888ac',
        //         contractTx: 'cb70fc42e9231c9093db6a0d874f8b150f99021dde83432aa37c9610ac7cbe3b',
        //         contractTxHex: '01000000012118d97ef4da3fa4cd5aea6ba3aaa0916c00d22b782be26b52b99763ab83baef010000006a4730440220493f0572492e4919707403352d8aff15e1a7d3d59b9a2088eecfe60f61351a6602202c64b8cc0cd9697333f3394bc7ce0dd8ae5fb01fd3632061c3fa8e3ba8d9fe9a01210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a9144b36eaa3ff7667f8461fed670babb36acd0bde9287c82dbb03000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac00000000',
        //         rawTx: 'cb70fc42e9231c9093db6a0d874f8b150f99021dde83432aa37c9610ac7cbe3b' }

        const testLockTx = {
            txHexString: "01000000012118d97ef4da3fa4cd5aea6ba3aaa0916c00d22b782be26b52b99763ab83baef010000006a4730440220493f0572492e4919707403352d8aff15e1a7d3d59b9a2088eecfe60f61351a6602202c64b8cc0cd9697333f3394bc7ce0dd8ae5fb01fd3632061c3fa8e3ba8d9fe9a01210263a131db9f54c8bc19c5602cca56c0e156b17430b45a09081ec8405297060908ffffffff0240420f000000000017a9144b36eaa3ff7667f8461fed670babb36acd0bde9287c82dbb03000000001976a9144ff94075bfd8e49cd5bad195371a3389be5f196888ac00000000",
            lockScriptHex: "63a6145e690840c5fe98d8f340f9921017e9cf12278ab88876a914515af089301b8ccf876e78607b57f5196a4a64226704f2b2795ab17576a9144ff94075bfd8e49cd5bad195371a3389be5f19686888ac",
            secret: "37d71ebbd08659bb4022ab09112cb99fde9311a199f1b9a2d92ec68f7ed5675d",
            secretHashHexStr: "5e690840c5fe98d8f340f9921017e9cf12278ab8"
        };

        const testBtcAtomicSwapContractData = {
            // secretHash: 'ec85ea76a40aa66023b120b9a4b960bbcb67e13f',
            // contract: '2NDPaW15T3KBaZ6poPSs9Hzw4gj8rtZcWqT',
        };

        const btcAuditContractParams = new BtcAuditContractParams(testLockTx.lockScriptHex, testLockTx.txHexString);
        const atomicSwapTxBuilder = new AtomicSwapTxBuilder;
        const btcAtomicSwapContractData = await atomicSwapTxBuilder.audit(btcAuditContractParams);

        console.log(btcAtomicSwapContractData);

        // BtcAuditContractData {
        //     contractSH: '2Mz6vTLjZwu3YqZCaj4bhWCdYaLf3frxZyS',
        //         contractValue: 1000000,
        //         recipientAddress: 'mnw7yBjxmEtKtHn3HJaqsYtmbztq3eKc6U',
        //         refundAddress: 'mnopGXXKQdt6mXnwHeRcdWNsaksoqKcvwZ',
        //         secretHash: '5e690840c5fe98d8f340f9921017e9cf12278ab8',
        //         lockTime: 1517925106 }

    });

    it("Should parse unlockTx, return secret", async () => {

        const testUnlockTx = {
            unlockTxId: "b58b92e39b0fa50177873473da4ec584668a6cca4c4c0dec0853ffdaa59e28c3",
            unlockTx: "01000000000101c4cd170dd4d86f9e46d72380b39e297e853f0c9678332959a3ca6db130941e4f00000000232200208bf522d1c1bc9b1b4c3e1a82aa7612e0445b7ab5013d5314bc7d27db0367174effffffff0100350c00000000001976a914729034be3dc1399c8f28b307cee59ad6db0a380f88ac05483045022100ceff8c2634813ea3986fd1b3db851d11a7b9617027640c60dd6b665235335618022042c99f39cc055c46ad2261b53da541a44c8a9bc6883eadc7b8b114ad3e683dfb01210360fd75fb951cda70ab6cdd6af3894dc53f233d93a483d904c4370a9eb667a6bf207a92d6fe0bceb976ec5c36748313f5f9052f37b7b1f602cdb51fc1879436e98d01015163a6142fa839ad57a160ba690e8fa85dff1b0de9b9a0a18876a914515af089301b8ccf876e78607b57f5196a4a64226704afa35f5ab17576a914969dfb1ec29287bf6d5004f1d0d16fae5240e1206888ac00000000",
            sig: "3045022100ceff8c2634813ea3986fd1b3db851d11a7b9617027640c60dd6b665235335618022042c99f39cc055c46ad2261b53da541a44c8a9bc6883eadc7b8b114ad3e683dfb01",
            pubKey: "0360fd75fb951cda70ab6cdd6af3894dc53f233d93a483d904c4370a9eb667a6bf",
            secret: "7a92d6fe0bceb976ec5c36748313f5f9052f37b7b1f602cdb51fc1879436e98d",
            secretHash: "2fa839ad57a160ba690e8fa85dff1b0de9b9a0a1"
        };

        const btcExtractSecretParams = new BtcExtractSecretParams(testUnlockTx.unlockTx, testUnlockTx.secretHash);
        const atomicSwapTxBuilder = new AtomicSwapTxBuilder();
        const secret = await atomicSwapTxBuilder.extractSecret(btcExtractSecretParams);

        expect(secret).toBe(testUnlockTx.secret);
    });

});
