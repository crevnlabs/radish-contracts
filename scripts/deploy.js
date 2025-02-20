// const { ethers } = require("hardhat");
// const hre = require("hardhat");

// async function main() {
//   // Get the contract factory
//   const priceTokenAddress = "0x3d8354A338775B181EB989f53646D5BFc9DD90dA";

//   const yesTokenAddress = "0x7482101aE633eC79aB78610df449EB9D35Ae1480";
//   const noTokenAddress = "0x4E893bC398F44B7d14545650339caC397d7A8991";
//   const marketId = 0;
//   const question = "Will BTC be above 110 k by the end of the year?";
//   const endTime = 1630454400;
//   const PredictionMarket = await ethers.getContractFactory("PredictionMarket");

//   // Deploy the contract
//   const predictionMarket = await PredictionMarket.deploy(
//     priceTokenAddress,
//     yesTokenAddress,
//     noTokenAddress,
//     marketId,
//     question,
//     endTime
//   );

//   // Wait for the deployment to be mined
//   await predictionMarket.waitForDeployment();
//   const predictionMarketAddress = await predictionMarket.getAddress();
//   console.log("MyContract deployed to:", predictionMarketAddress);

//   // Verify the contract after deployment
//   console.log("Verifying contract...");
//   await hre.run("verify:verify", {
//     address: predictionMarketAddress,
//     constructorArguments: [
//       priceTokenAddress,
//       yesTokenAddress,
//       noTokenAddress,
//       marketId,
//       question,
//       endTime,
//     ],
//   });
//   console.log("Contract verified");
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

const { ethers, upgrades } = require("hardhat");

async function main() {
  // Deploy YesToken
  console.log("Deploying YesToken...");
  const YesToken = await ethers.getContractFactory("YesToken");
  const yesToken = await YesToken.deploy();
  await yesToken.deployed();
  console.log("YesToken deployed to:", yesToken.address);

  // Deploy NoToken
  console.log("Deploying NoToken...");
  const NoToken = await ethers.getContractFactory("NoToken");
  const noToken = await NoToken.deploy();
  await noToken.deployed();
  console.log("NoToken deployed to:", noToken.address);

  // Deploy Price Token (for example, using a mock ERC20)
  console.log("Deploying Mock Price Token...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const priceToken = await MockERC20.deploy("Price Token", "PRICE");
  await priceToken.deployed();
  console.log("Price Token deployed to:", priceToken.address);

  // Deploy RadishCore with UUPS proxy
  console.log("Deploying RadishCore...");
  const RadishCore = await ethers.getContractFactory("RadishCore");
  const radishCore = await upgrades.deployProxy(
    RadishCore,
    [priceToken.address, yesToken.address, noToken.address],
    { kind: "uups", initializer: "initialize" }
  );
  await radishCore.deployed();
  console.log("RadishCore Proxy deployed to:", radishCore.address);

  // Get implementation address
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    radishCore.address
  );
  console.log("RadishCore Implementation deployed to:", implementationAddress);

  // Create a test market
  const question = "Will ETH reach $5000 by end of 2024?";
  const endTime = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days from now

  console.log("Creating test market...");
  const tx = await radishCore.createMarket(question, endTime);
  await tx.wait();
  console.log("Test market created!");

  // Print all deployment addresses
  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("YesToken:", yesToken.address);
  console.log("NoToken:", noToken.address);
  console.log("Price Token:", priceToken.address);
  console.log("RadishCore Proxy:", radishCore.address);
  console.log("RadishCore Implementation:", implementationAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
