// scripts/deploy.js

const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Step 1: Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Step 2: Deploy the MockERC20 (USDC)
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockUSDC = await MockERC20.deploy("USD Coin", "USDC");
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("MockERC20 (USDC) deployed to:", mockUSDCAddress);

  // Step 3: Deploy YesToken and NoToken
  const YesToken = await ethers.getContractFactory("YesToken");
  const NoToken = await ethers.getContractFactory("NoToken");

  const yesToken = await YesToken.deploy(deployer.address);
  await yesToken.waitForDeployment();
  const yesTokenAddress = await yesToken.getAddress();

  const noToken = await NoToken.deploy(deployer.address);
  await noToken.waitForDeployment();
  const noTokenAddress = await noToken.getAddress();

  console.log("YesToken deployed to:", yesTokenAddress);
  console.log("NoToken deployed to:", noTokenAddress);

  // Step 4: Deploy the RadishCore contract with UUPS proxy
  console.log("Deploying RadishCore with proxy...");
  const RadishCore = await ethers.getContractFactory("RadishCore");

  // Initialize parameters for the proxy deployment
  const initializeParams = [mockUSDCAddress, yesTokenAddress, noTokenAddress];

  try {
    const radishCore = await upgrades.deployProxy(
      RadishCore,
      initializeParams,
      {
        kind: "uups",
        initializer: "initialize",
      }
    );
    await radishCore.waitForDeployment();
    const radishCoreAddress = await radishCore.getAddress();
    console.log("RadishCore Proxy deployed to:", radishCoreAddress);

    // Get implementation address
    const implementationAddress =
      await upgrades.erc1967.getImplementationAddress(radishCoreAddress);
    console.log(
      "RadishCore Implementation deployed to:",
      implementationAddress
    );

    // Step 5: Transfer ownership of YesToken and NoToken to RadishCore Proxy
    await yesToken.transferOwnership(radishCoreAddress);
    await noToken.transferOwnership(radishCoreAddress);
    console.log(
      "Ownership of YesToken and NoToken transferred to RadishCore Proxy"
    );

    // Step 6: Create a market in RadishCore
    const question =
      "Will MrBeast reach 200M YouTube subscribers by March 2024?";
    const endTime = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days from now

    const createMarketTx = await radishCore.createMarket(question, endTime);
    console.log("Market creation transaction:", createMarketTx.hash);

    // Wait for the transaction to be mined
    await createMarketTx.wait();
    console.log("Market creation confirmed");

    // Print deployment summary
    console.log("\nDeployment Summary:");
    console.log("===================");
    console.log("Deployer:", deployer.address);
    console.log("USDC Token:", mockUSDCAddress);
    console.log("Yes Token:", yesTokenAddress);
    console.log("No Token:", noTokenAddress);
    console.log("RadishCore Proxy:", radishCoreAddress);
    console.log("RadishCore Implementation:", implementationAddress);

    // Step 7: Verify contracts on Etherscan (if on a live network)
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
      console.log("\nVerifying contracts on Etherscan...");

      // Verify implementation contract first
      await hre.run("verify:verify", {
        address: implementationAddress,
        contract: "contracts/RadishCore.sol:RadishCore",
      });

      // Verify the other contracts
      await hre.run("verify:verify", {
        address: yesTokenAddress,
        constructorArguments: [deployer.address],
      });

      await hre.run("verify:verify", {
        address: noTokenAddress,
        constructorArguments: [deployer.address],
      });

      await hre.run("verify:verify", {
        address: mockUSDCAddress,
        constructorArguments: ["USD Coin", "USDC"],
      });

      console.log("All contracts verified on Etherscan");
    } else {
      console.log("\nSkipping Etherscan verification on local network");
    }

    // Optional: Mint and approve some tokens for testing
    const mintAmount = ethers.parseEther("1000");
    await mockUSDC.mint(deployer.address, mintAmount);
    await mockUSDC.approve(radishCoreAddress, mintAmount);
    console.log("\nMinted and approved 1000 USDC for testing");
  } catch (error) {
    console.error("Error deploying proxy:", error);
    throw error;
  }
}

// Run the main function and handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
