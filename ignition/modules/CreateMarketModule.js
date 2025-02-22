const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const RadishCoreModule = require("./RadishCoreModule");

module.exports = buildModule("CreateMarketModule", (m) => {
  // Get RadishCore deployment
  const { radishCore } = m.useModule(RadishCoreModule);

  // Create first market
  const question = "Will BTC reach $150k in 2024?";
  const endTime = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days from now

  const createMarketTx = m.call(radishCore, "createMarket", [
    question,
    endTime,
  ]);

  return { createMarketTx };
});
