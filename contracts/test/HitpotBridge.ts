import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("HitpotBridge", function () {

    const deployFixture = async () => {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
        console.log(`owner: ${owner}, otherAccount: ${otherAccount}`)

        const PotToken = await ethers.getContractFactory("PotToken");
        const HitpotBridge = await ethers.getContractFactory("HitpotBridge");

        const potToken = await PotToken.deploy();
        const hitpotBridge = await HitpotBridge.deploy(potToken.address);

        return { potToken, hitpotBridge, owner, otherAccount };
    }

    describe("deposit2", () => {
        it("balanceOfOwner", async () => {
            const {potToken, hitpotBridge, owner, otherAccount} = await loadFixture(deployFixture);
            expect(await potToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("100"));
        });
        it("deposit", async () => {
            const depositAmount = ethers.utils.parseEther("1");
            const {potToken, hitpotBridge, owner, otherAccount} = await loadFixture(deployFixture);
            await potToken.approve(hitpotBridge.address, depositAmount);
            expect(await hitpotBridge.deposit(depositAmount)).not.to.be.reverted;
            expect(await potToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("99"));
            expect(await potToken.balanceOf(hitpotBridge.address)).to.equal(depositAmount);
            expect(await potToken.totalSupply()).to.equal(ethers.utils.parseEther("1000100"));
        });
        it("deposit2", async () => {
            const depositAmount = ethers.utils.parseEther("1");
            const {potToken, hitpotBridge, owner, otherAccount} = await loadFixture(deployFixture);
            await potToken.approve(hitpotBridge.address, depositAmount);
            await expect(hitpotBridge.deposit(depositAmount)).to.emit(hitpotBridge, "DepositEvent").withArgs(owner.address, depositAmount);
            expect(await potToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("99"));
            expect(await potToken.balanceOf(hitpotBridge.address)).to.equal(depositAmount);
            expect(await potToken.totalSupply()).to.equal(ethers.utils.parseEther("1000100"));
        });
    });

    describe("withdraw2", () => {
        it("withdraw1", async () => {
            const withdrawAmount = ethers.utils.parseEther("1");
            const {potToken, hitpotBridge, owner, otherAccount} = await loadFixture(deployFixture);
            expect(await potToken.totalSupply()).to.equal(ethers.utils.parseEther("1000100"));
            await expect(potToken.mint(hitpotBridge.address, withdrawAmount)).not.to.be.reverted;
            expect(await potToken.totalSupply()).to.equal(ethers.utils.parseEther("1000101"));
            await expect(hitpotBridge.withdraw(otherAccount.address, withdrawAmount, "1")).not.to.be.reverted;
            expect(await potToken.balanceOf(otherAccount.address)).to.equal(withdrawAmount);
            expect(await potToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("100"));
        });
        it("withdraw2", async () => {
            const withdrawAmount = ethers.utils.parseEther("1");
            const {potToken, hitpotBridge, owner, otherAccount} = await loadFixture(deployFixture);
            expect(await potToken.totalSupply()).to.equal(ethers.utils.parseEther("1000100"));
            await expect(potToken.mint(hitpotBridge.address, withdrawAmount)).not.to.be.reverted;
            expect(await potToken.totalSupply()).to.equal(ethers.utils.parseEther("1000101"));
            expect(await potToken.owner()).to.equal(owner.address);
            expect(await hitpotBridge.owner()).to.equal(owner.address);
            await expect(hitpotBridge.withdraw(otherAccount.address, withdrawAmount, "1"))
                .to.emit(hitpotBridge, "WithdrawEvent").withArgs(otherAccount.address, withdrawAmount, "1");
            expect(await potToken.balanceOf(otherAccount.address)).to.equal(withdrawAmount);
            expect(await potToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("100"));
        });
    });
})
