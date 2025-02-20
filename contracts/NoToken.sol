// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NoToken is ERC1155, Ownable, ERC1155Burnable {
    mapping(uint256 => address) public PredictionMarketContracts;

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        require(
            msg.sender == PredictionMarketContracts[id],
            "Only the Prediction Market contract can mint this token"
        );
        _mint(account, id, amount, data);
    }

    function burn(address account, uint256 id, uint256 amount) public override {
        require(
            msg.sender == PredictionMarketContracts[id],
            "Only the Prediction Market contract can burn this token"
        );
        _burn(account, id, amount);
    }

    function balanceOf(
        address account,
        uint256 id
    ) public view override returns (uint256) {
        return super.balanceOf(account, id);
    }

    function transfer(address to, uint256 id, uint256 amount) public {
        require(balanceOf(msg.sender, id) >= amount, "Insufficient balance");
        safeTransferFrom(msg.sender, to, id, amount, "");
    }

    function addPredictionMarket(
        uint256 id,
        address marketContract
    ) external onlyOwner {
        require(marketContract != address(0), "Invalid address");
        require(
            PredictionMarketContracts[id] == address(0),
            "Market already exists for this ID"
        );
        PredictionMarketContracts[id] = marketContract;
    }

    function updatePredictionMarket(
        uint256 id,
        address marketContract
    ) external onlyOwner {
        require(marketContract != address(0), "Invalid address");
        PredictionMarketContracts[id] = marketContract;
    }

    function removePredictionMarket(uint256 id) external onlyOwner {
        require(
            PredictionMarketContracts[id] != address(0),
            "Market does not exist"
        );
        delete PredictionMarketContracts[id];
    }
}
