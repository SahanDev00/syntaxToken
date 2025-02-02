const { expect } = require("chai");
const hre = require("hardhat");

describe("SyntaxToken", function () {
    let SyntaxToken;
    let syntaxToken;
    let owner;
    let addr1;
    let addr2;
    let cap = 100000000; // 100 million tokens
    let reward = 50; // 50 tokens per block reward

    beforeEach(async function () {
        // Get the ContractFactory and Signers
        SyntaxToken = await hre.ethers.getContractFactory("SyntaxToken");
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        // Deploy the contract
        syntaxToken = await SyntaxToken.deploy(cap, reward);
        // No need for .deployed() in Hardhat + Ethers.js
    });

    it("Should return the correct name, symbol, and decimals", async function () {
        expect(await syntaxToken.name()).to.equal("SyntaxToken");
        expect(await syntaxToken.symbol()).to.equal("SXT");
        expect(await syntaxToken.decimals()).to.equal(18);
    });

    it("Should mint the initial supply to the owner", async function () {
        const ownerBalance = await syntaxToken.balanceOf(owner.address);
        expect(ownerBalance).to.equal(70000000n * 10n ** 18n); // 70 million tokens
    });

    it("Should enforce the token cap", async function () {
        const cap = await syntaxToken.cap();
        expect(cap).to.equal(100000000n * 10n ** 18n); // 100 million tokens
    });

    it("Should mint block reward to the miner on transfer", async function () {
        // Transfer tokens from owner to addr1
        await syntaxToken.transfer(addr1.address, 1000);

        // Check if the miner (block.coinbase) received the block reward
        const miner = await hre.ethers.provider.getBlock("latest").then(block => block.miner);
        const minerBalance = await syntaxToken.balanceOf(miner);
        expect(minerBalance).to.equal(BigInt(reward) * 10n ** 18n);
    });

    it("Should allow the owner to change the block reward", async function () {
        const newReward = 100; // 100 tokens
        await syntaxToken.connect(owner).setBlockReward(newReward);

        // Verify the block reward was updated
        expect(await syntaxToken.blockReward()).to.equal(BigInt(newReward) * 10n ** 18n);
    });

    it("Should allow the owner to disable minting", async function () {
        await syntaxToken.connect(owner).disableMinting();

        // Verify the block reward is set to 0
        expect(await syntaxToken.blockReward()).to.equal(0);
    });

    it("Should prevent non-owners from changing the block reward", async function () {
        await expect(
            syntaxToken.connect(addr1).setBlockReward(100)
        ).to.be.revertedWith("Only the owner can call this function!!!");
    });

    it("Should prevent non-owners from disabling minting", async function () {
        await expect(
            syntaxToken.connect(addr1).disableMinting()
        ).to.be.revertedWith("Only the owner can call this function!!!");
    });
});