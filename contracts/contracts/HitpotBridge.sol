// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

// 参考1 https://github.com/matter-labs/zksync/blob/master/contracts/contracts/ZkSync.sol
// 参考2 https://github.com/matter-labs/zksync/blob/master/contracts/contracts/Verifier.sol
// 参考3 https://github.com/matter-labs/zksync/blob/master/contracts/contracts/ReentrancyGuard.sol 可重入防护
// https://github.com/dexDev/DEx.top/blob/master/smart-contract/dextop.sol
// https://dodoex.github.io/docs/zh/docs/mining/
// https://juejin.cn/post/7190940017316298809
contract HitpotBridge is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address private potTokenAddress;
    uint256 private priceOfHit = 0.0001 ether;
    uint256 private balanceOfEth = 0;
    mapping(address => uint256) userPotTokenBalance;
    uint256 private index = 0;

    constructor(address _potTokenAddress) Ownable() {
        potTokenAddress = _potTokenAddress;
    }

    event DepositEvent(address indexed account, uint256 amount);
    event WithdrawEvent(address indexed account, uint256 amount, uint64 userTransactionId);

    function exchange(uint256 amount) external payable {}

    function deposit(uint256 amount) external {
        require(IERC20(potTokenAddress).balanceOf(msg.sender) >= amount, "Your token amount must be greater then you are trying to deposit");
        require(
            IERC20(potTokenAddress).allowance(msg.sender, address(this)) >= amount,
            "Your arpprove token amount must be greater then you are trying to deposit"
        );
        require(IERC20(potTokenAddress).transferFrom(msg.sender, address(this), amount), "move failure approve token");
        emit DepositEvent(msg.sender, amount);
    }

    function submitBatch(bytes calldata transactions) external onlyOwner {}

    function withdraw(address account, uint256 amount, uint64 userTransactionId) external onlyOwner {
        require(IERC20(potTokenAddress).transfer(account, amount), "the transfer failed");
        emit WithdrawEvent(account, amount, userTransactionId);
    }
}
