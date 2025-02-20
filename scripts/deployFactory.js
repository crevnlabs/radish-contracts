const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const priceTokenAddress = "0x3d8354A338775B181EB989f53646D5BFc9DD90dA";

  const yesTokenAddress = "0x078AEb3De101c29e05A505F15cEB423bCBa1f38B";
  const noTokenAddress = "0xa1A8933534E91edE0Ae1923a68812b380cFbBe9f";
  const MarketContract = await ethers.getContractFactory("RadishCore");

  // Deploy the contract
  const predictionMarket = await MarketContract.deploy(
    priceTokenAddress,
    yesTokenAddress,
    noTokenAddress
  );

  // Wait for the deployment to be mined
  await predictionMarket.waitForDeployment();
  const predictionMarketAddress = await predictionMarket.getAddress();
  console.log("MyContract deployed to:", predictionMarketAddress);

  // Verify the contract after deployment
  console.log("Verifying contract...");
  await hre.run("verify:verify", {
    address: predictionMarketAddress,
    constructorArguments: [priceTokenAddress, yesTokenAddress, noTokenAddress],
  });
  console.log("Contract verified");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
