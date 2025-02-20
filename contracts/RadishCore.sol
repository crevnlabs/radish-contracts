// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./PredictionMarket.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./YesToken.sol";
import "./NoToken.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract RadishCore is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public marketCount;

    address public priceToken;
    address public yesToken;
    address public noToken;

    YesToken public yesTokenContract;
    NoToken public noTokenContract;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    event MarketCreated(
        uint256 id,
        string question,
        uint256 endTime,
        address marketContract,
        address priceToken,
        address yesToken,
        address noToken
    );

    function initialize(
        address _priceToken,
        address _yesToken,
        address _noToken
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        
        marketCount = 0;
        priceToken = _priceToken;
        yesToken = _yesToken;
        noToken = _noToken;
        yesTokenContract = YesToken(_yesToken);
        noTokenContract = NoToken(_noToken);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function setPriceToken(address _priceToken) public onlyOwner {
        priceToken = _priceToken;
    }

    function setYesToken(address _yesToken) public onlyOwner {
        yesToken = _yesToken;
    }

    function setNoToken(address _noToken) public onlyOwner {
        noToken = _noToken;
    }

    function createMarket(string memory _question, uint256 _endtime) public {
        // Create the market first
        PredictionMarket market = new PredictionMarket(
            priceToken,
            yesToken,
            noToken,
            marketCount,
            _question,
            _endtime,
            msg.sender
        );

        // Register the market with the token contracts
        yesTokenContract.addPredictionMarket(marketCount, address(market));
        noTokenContract.addPredictionMarket(marketCount, address(market));

        // Initialize the market after registration
        market.initializeLiquidity();

        emit MarketCreated(marketCount, _question, _endtime, address(market), priceToken, yesToken, noToken);
        marketCount++;
    }
}
