import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import { HardhatNetworkAccountUserConfig } from "hardhat/types";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.17",
    },
    networks: {
        local: {
            url: "http://127.0.0.1:8545/",
            gasPrice: 1,
            gas: 4500000,
        },
        dev: {
            url: "http://poa-rpc.bestchain.fun:8545",
            chainId: 20230131,
            // accounts: {
            //     mnemonic: process.env["DEV_MNEMONIC"],
            // },
            accounts: [`${process.env["DEV_PRIVATE_KEY"]}`],
        },
        okcTest: {
            url: "https://exchaintestrpc.okex.org",
            chainId: 65,
            accounts: [`${process.env["DEV_PRIVATE_KEY"]}`],
        },
    },
    mocha: {
        timeout: 40000,
    },
};

export default config;
