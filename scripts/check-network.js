const { ethers } = require("hardhat");

async function main() {
  const provider = ethers.provider;

  console.log("Checking network parameters...");

  const block = await provider.getBlock("latest");
  console.log("Latest block:", block);

  const gasPrice = await provider.getFeeData();
  console.log("Gas price data:", gasPrice);

  const network = await provider.getNetwork();
  console.log("Network:", network);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
