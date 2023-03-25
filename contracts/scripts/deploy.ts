import { ethers } from "hardhat";

async function main() {
    console.log("------------ hello world ------------")

    const PotToken = await ethers.getContractFactory("PotToken");
    const potToken = await PotToken.deploy();
    await potToken.deployed();
    const potTokenAddress = potToken.address;
    console.log(`deployed(PotToken) to ${potTokenAddress}`);

    const HitpotBridge = await ethers.getContractFactory("HitpotBridge");
    const hitpotBridge = await HitpotBridge.deploy(potTokenAddress);
    await hitpotBridge.deployed();

    console.log(`deployed(HitpotBridge) to ${hitpotBridge.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.log("----------------");
    console.error(error);
    process.exitCode = 1;
});
