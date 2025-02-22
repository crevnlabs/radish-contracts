const { ethers } = require("hardhat");

async function main() {
  const overrides = {
    gasLimit: 3000000,
  };

  // Deploy MockERC20
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  console.log("Deploying MockERC20...");
  const mockERC20 = await MockERC20.deploy("Test Token", "TEST", overrides);
  await mockERC20.waitForDeployment();
  console.log("MockERC20 deployed to:", await mockERC20.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
