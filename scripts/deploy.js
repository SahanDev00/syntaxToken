const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const SyntaxToken = await ethers.getContractFactory("SyntaxToken");

  // Deploy the contract
  const syntaxToken = await SyntaxToken.deploy(1000000, 50);

  // Wait for the contract to be deployed
  await syntaxToken.waitForDeployment();

  console.log("SyntaxToken deployed to:", syntaxToken.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });