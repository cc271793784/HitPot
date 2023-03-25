// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract PotToken is ERC20, Ownable {
    constructor() ERC20("POT Token", "POT") Ownable() {
        _mint(address(this), 1_000_000 ether);
        _mint(msg.sender, 100 ether);
    }

    // 挖矿
    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    // 燃烧
    function burn(address account, uint256 amount) internal onlyOwner {
        _burn(account, amount);
    }

    fallback() external payable {}

    receive() external payable {}
}
