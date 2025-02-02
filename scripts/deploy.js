const { ethers } = require("hardhat");

async function main() {
    const SyntaxToken = await ethers.getContractFactory("SyntaxToken");

    try {
        // Deploy the contract with low gas price and reasonable gas limit
        const syntaxToken = await SyntaxToken.deploy(100, 1, {
            gasLimit: 100000,  // Set a reasonable gas limit
            gasPrice: 500000000 // 5 Gwei (in wei, no need for parseUnits)
        });

        // Check if the contract was deployed successfully
        if (!syntaxToken.deployTransaction) {
            console.error("Deployment failed: No deployTransaction found");
            return;
        }

        console.log("Deploy transaction hash:", syntaxToken.deployTransaction.hash);

        // Wait for the transaction to be mined
        const receipt = await syntaxToken.deployTransaction.wait();
        console.log("Transaction mined in block:", receipt.blockNumber);

        // Output the contract's address
        console.log("Syntax Token deployed at:", syntaxToken.address);
    } catch (error) {
        console.error("Deployment failed:", error);
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error("An error occurred:", error);
    process.exitCode = 1;
});
