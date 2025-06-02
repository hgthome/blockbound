const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  console.log("Deploying GameItemNFT contract...");

  // Get the signer (deployer account)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // Get the ContractFactory with the signer
  const GameItemNFT = await ethers.getContractFactory("GameItemNFT", deployer);
  
  console.log("Deploying contract...");
  
  // Deploy the contract
  const gameItemNFT = await GameItemNFT.deploy();
  
  // Wait for the contract to be deployed
  await gameItemNFT.waitForDeployment();
  
  const contractAddress = await gameItemNFT.getAddress();
  const network = await ethers.provider.getNetwork();
  
  console.log("✅ GameItemNFT deployed to:", contractAddress);
  console.log("🌐 Network:", network.name, `(Chain ID: ${network.chainId})`);
  
  // Determine which API key to use based on network
  const isPolygonAmoy = network.chainId === 80002n;
  const apiKey = isPolygonAmoy ? process.env.POLYGONSCAN_API_KEY : process.env.ETHERSCAN_API_KEY;
  const explorerName = isPolygonAmoy ? "PolygonScan" : "Etherscan";
  
  // Verify the contract (optional)
  if (apiKey) {
    console.log("⏳ Waiting for block confirmations...");
    await gameItemNFT.deploymentTransaction().wait(6);
    
    console.log(`🔍 Verifying contract on ${explorerName}...`);
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
        network: hre.network.name,
      });
      console.log(`✅ Contract verified successfully on ${explorerName}`);
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log(`✅ Contract already verified on ${explorerName}`);
      } else {
        console.log(`❌ Error verifying contract on ${explorerName}:`, error.message);
      }
    }
  } else {
    console.log(`⚠️  Skipping verification - no ${explorerName} API key found`);
  }
  
  console.log("\n🎉 === Deployment Summary ===");
  console.log(`📄 Contract Address: ${contractAddress}`);
  console.log(`🌐 Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`💰 Gas Used: ${(await gameItemNFT.deploymentTransaction()).gasLimit}`);
  
  if (isPolygonAmoy) {
    console.log(`🔗 View on PolygonScan: https://amoy.polygonscan.com/address/${contractAddress}`);
  } else {
    console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
  }
  
  console.log("\n📝 Next Steps:");
  console.log("1. Update CONTRACT_ADDRESSES in app/lib/web3Config.ts with this address");
  console.log("2. Test your contract deployment");
  console.log("3. Start minting some epic NFTs! 🎮");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 