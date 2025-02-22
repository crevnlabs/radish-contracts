const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const owner = "0xC235f79955B155769b7e4597e93ce7eDFc4c315b";
  const YesToken = await ethers.getContractFactory("YesToken");
  const NoToken = await ethers.getContractFactory("NoToken");

  // Deploy the contract
  const yestoken = await YesToken.deploy(owner);
  const notoken = await NoToken.deploy(owner);

  // Wait for the deployment to be mined
  await yestoken.waitForDeployment();
  await notoken.waitForDeployment();
  const yestokenAddress = await yestoken.getAddress();
  const notokenAddress = await notoken.getAddress();
  console.log("yes token deployed to:", yestokenAddress);
  console.log("no token deployed to:", notokenAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
