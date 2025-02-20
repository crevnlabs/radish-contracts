require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "shanghai", // Add EVM version specification
      viaIR: true, // Enable IR-based code generation
    },
  },
  networks: {
    hardhat: {
      // Local network configuration
    },
    optimism_sepolia: {
      url: `https://opt-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    base_sepolia: {
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    neox_testnet: {
      url: "https://neoxt4seed1.ngd.network/",
      chainId: 12227332,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      maxFeePerGas: 60000000000,
      maxPriorityFeePerGas: 20000000000,
      gas: 3000000,
      verify: {
        explorer: "https://xt4scan.ngd.network/",
      },
    },
    neox_mainnet: {
      url: "https://mainnet-2.rpc.banelabs.org", //https://mainnet-2.rpc.banelabs.org/
      chainId: 47763,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      verify: {
        explorer: "https://xexplorer.neo.org",
      },
      gasPrice: 40000000000, // 40 GWEI
      maxPriorityFeePerGas: 20000000000,
      // timeout: 120000, // Increase timeout
      allowUnlimitedContractSize: true,
    },
    avax: {
      url: "https://endpoints.omniatech.io/v1/avax/fuji/public",
      chainId: 43113,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      optimism_sepolia: process.env.ETHERSCAN_API_KEY || "",
      neox_testnet: process.env.ETHERSCAN_API_KEY || "",
      neox_mainnet: process.env.ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "optimism_sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com/",
        },
      },
      {
        network: "neox_testnet",
        chainId: 12227332,
        urls: {
          apiURL: "https://xt4scan.ngd.network/api",
          browserURL: "https://xt4scan.ngd.network/",
        },
      },
      {
        network: "neox_mainnet",
        chainId: 47763,
        urls: {
          apiURL: "https://xexplorer.neo.org/api",
          browserURL: "https://xexplorer.neo.org/",
        },
      },
      {
        network: "avax",
        chainId: 43113,
        urls: {
          apiURL: "https://api.avax.network/ext/bc/C/rpc",
          browserURL: "https://explorer.avax.network/",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};
