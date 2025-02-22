const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokensModule = require("./TokensModule");

module.exports = buildModule("RadishCoreModule", (m) => {
  // Get token deployments from TokensModule
  const tokensModule = m.useModule(TokensModule);

  // Deploy RadishCore factory
  const radishCore = m.contract("RadishCore", [
    tokensModule.priceToken,
    tokensModule.yesToken,
    tokensModule.noToken,
  ]);

  // Transfer ownership of YES and NO tokens to RadishCore
  m.call(tokensModule.yesToken, "transferOwnership", [radishCore]);
  m.call(tokensModule.noToken, "transferOwnership", [radishCore]);

  return { radishCore };
});
