const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokensModule", (m) => {
  // Deploy MockERC20 as USDC
  const mockUSDC = m.contract("MockERC20", ["USD Coin", "USDC"]);

  // Deploy YES and NO tokens
  const yesToken = m.contract("YesToken", [m.getAccount(0)]);
  const noToken = m.contract("NoToken", [m.getAccount(0)]);

  return { priceToken: mockUSDC, yesToken, noToken };
});
