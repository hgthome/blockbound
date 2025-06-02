const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing network connection and signer configuration...");
  
  try {
    // Test network connection
    const network = await ethers.provider.getNetwork();
    console.log("✅ Network connected:", network.name, `(Chain ID: ${network.chainId})`);
    
    // Test signer retrieval
    console.log("🔍 Getting signers...");
    const signers = await ethers.getSigners();
    console.log("📊 Number of signers found:", signers.length);
    
    if (signers.length === 0) {
      console.log("❌ No signers found! Check your PRIVATE_KEY in .env.local");
      console.log("💡 Make sure your private key is set without the '0x' prefix");
      return;
    }
    
    const deployer = signers[0];
    console.log("✅ Deployer address:", deployer.address);
    
    // Test balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "SepoliaETH");
    
    if (balance === 0n) {
      console.log("⚠️  WARNING: Your account has 0 SepoliaETH!");
      console.log("🚰 Get free SepoliaETH from: https://faucets.chain.link/ethereum-sepolia");
    }
    
    console.log("✅ All checks passed! Ready to deploy.");
    
  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
    
    if (error.message.includes("invalid private key")) {
      console.log("💡 Fix: Check your PRIVATE_KEY format in .env.local");
    } else if (error.message.includes("network")) {
      console.log("💡 Fix: Check your SEPOLIA_RPC_URL in .env.local");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }); 