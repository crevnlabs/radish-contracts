const { ethers } = require("hardhat");

async function main() {
  const wallet = ethers.Wallet.createRandom();
  console.log("New wallet generated:");
  console.log("Address:", wallet.address);
  console.log("Private Key:", wallet.privateKey);
  console.log(
    "\nIMPORTANT: Save these credentials securely and never share your private key!"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
