import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PotToken", () => {
    const deployFixture = async () => {
        const [owner, accountA, accountB] = await ethers.getSigners();
        const PotToken = await ethers.getContractFactory("PotToken");
        const potToken = await PotToken.deploy();
        await potToken.deployed();
        return { PotToken, potToken, owner, accountA, accountB };
    };

    it("deploy and tranfer", async () => {
        const { PotToken, potToken, owner } = await loadFixture(deployFixture);

        const ownerBalance = await potToken.balanceOf(owner.address);
        const contractBalance = await potToken.balanceOf(potToken.address);
        const totalSupply = await potToken.totalSupply();
        console.log(`total:${totalSupply}\n   owner(${owner.address}):${ownerBalance}\ncontract(${potToken.address}):${contractBalance}`);
    });

    it("deploy and transfer2", async () => {
        const { PotToken, potToken, owner, accountA, accountB } = await loadFixture(deployFixture);

        const ownerBalance = await potToken.balanceOf(owner.address);
        const contractBalance = await potToken.balanceOf(potToken.address);
        const totalSupply = await potToken.totalSupply();
        console.log(`total:${totalSupply}\n   owner(${owner.address}):${ownerBalance}\ncontract(${potToken.address}):${contractBalance}`);

        // transfer to A
        await potToken.transfer(accountA.address, 100);
        let balance = await potToken.balanceOf(potToken.address);
        let balanceOwner = await potToken.balanceOf(owner.address);
        let balanceA = await potToken.balanceOf(accountA.address);
        let balanceB = await potToken.balanceOf(accountB.address);
        console.log(
            `\ncontract(${potToken.address}):${balance}\n   owner(${owner.address}):${balanceOwner}\n       A(${accountA.address}):${balanceA}\n       B(${accountB.address}):${balanceB}`
        );

        await potToken.connect(accountA).transfer(accountB.address, 50);
        balance = await potToken.balanceOf(potToken.address);
        balanceOwner = await potToken.balanceOf(owner.address);
        balanceA = await potToken.balanceOf(accountA.address);
        balanceB = await potToken.balanceOf(accountB.address);
        console.log(
            `\ncontract(${potToken.address}):${balance}\n   owner(${owner.address}):${balanceOwner}\n       A(${accountA.address}):${balanceA}\n       B(${accountB.address}):${balanceB}`
        );
    });

    it("deploy and approve", async () => {
        const { PotToken, potToken, owner, accountA } = await loadFixture(deployFixture);

        potToken.approve(accountA.address, 50);
        let allowance = await potToken.allowance(owner.address, accountA.address);
        let balanceOwner = await potToken.balanceOf(owner.address);
        let balanceA = await potToken.balanceOf(accountA.address);
        console.log(`  balance: ${balanceOwner}\nallowance: ${allowance}\n balanceA: ${balanceA}`);

        potToken.connect(accountA).transferFrom(owner.address, accountA.address, 50);
        balanceOwner = await potToken.balanceOf(owner.address);
        balanceA = await potToken.balanceOf(accountA.address);
        allowance = await potToken.allowance(owner.address, accountA.address);
        console.log(`\n  balance: ${balanceOwner}\nallowance: ${allowance}\n balanceA: ${balanceA}`);

        allowance = await potToken.allowance(owner.address, accountA.address);
        console.log(`\nhello world: ${allowance}`);

        potToken.connect(accountA).transferFrom(owner.address, accountA.address, 50);
        allowance = await potToken.allowance(owner.address, accountA.address);
        balanceOwner = await potToken.balanceOf(owner.address);
        balanceA = await potToken.balanceOf(accountA.address);
        console.log(`\n  balance: ${balanceOwner}\nallowance: ${allowance}\n balanceA: ${balanceA}`);
    });

    it("approve and cancel", async () => {
        const { PotToken, potToken, owner, accountA } = await loadFixture(deployFixture);
        potToken.approve(accountA.address, 50);

        let allowance = await potToken.allowance(owner.address, accountA.address);
        let balanceOwner = await potToken.balanceOf(owner.address);
        let balanceA = await potToken.balanceOf(accountA.address);
        console.log(`  balance: ${balanceOwner}\nallowance: ${allowance}\n balanceA: ${balanceA}`);

        potToken.approve(accountA.address, 0);
        balanceOwner = await potToken.balanceOf(owner.address);
        balanceA = await potToken.balanceOf(accountA.address);
        allowance = await potToken.allowance(owner.address, accountA.address);
        console.log(`\n  balance: ${balanceOwner}\nallowance: ${allowance}\n balanceA: ${balanceA}`);

        potToken.connect(accountA).transferFrom(owner.address, accountA.address, 50);
        allowance = await potToken.allowance(owner.address, accountA.address);
        balanceOwner = await potToken.balanceOf(owner.address);
        balanceA = await potToken.balanceOf(accountA.address);
        console.log(`\n  balance: ${balanceOwner}\nallowance: ${allowance}\n balanceA: ${balanceA}`);
    });
});
