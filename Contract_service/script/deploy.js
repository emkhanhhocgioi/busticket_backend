const { ethers } = require("hardhat");

async function main() {
  console.log("Starting BusTicket contract deployment...");

  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy the BusTicket contract
  const BusTicket = await ethers.getContractFactory("BusTicket");
  console.log("Deploying BusTicket contract...");
  
  const busTicket = await BusTicket.deploy();
  await busTicket.waitForDeployment();
  
  const contractAddress = await busTicket.getAddress();
  console.log("BusTicket contract deployed to:", contractAddress);
  
  // Verify the deployment
  console.log("Verifying deployment...");
  const name = await busTicket.name();
  const symbol = await busTicket.symbol();
  const owner = await busTicket.owner();
  
  console.log("Contract Name:", name);
  console.log("Contract Symbol:", symbol);
  console.log("Contract Owner:", owner);
  console.log("Deployer Address:", deployer.address);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    contractName: "BusTicket",
    symbol: symbol,
    owner: owner,
    deployer: deployer.address,
    network: await deployer.provider.getNetwork(),
    deploymentTime: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber()
  };
  
  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  return busTicket;
}


// Function to deploy the contract only
async function deploy() {
  try {
    const busTicket = await main();
    console.log("\n=== Deployment Complete ===");
    console.log("Contract is ready to use!");
    return busTicket;
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  }
}

async function addTicketToBlock(ticketdata) {


    
}

// Function to print ABI of BusTicket contract
async function printABI() {
  const BusTicket = await ethers.getContractFactory("BusTicket");
  console.log("\n=== BusTicket ABI ===");
  console.log(JSON.stringify(BusTicket.interface.format(ethers.FormatTypes.json), null, 2));
}

// Export functions for use in other scripts
module.exports = {
  main,
  deploy,
  addTicketToBlock,
  printABI
};

// Run deployment if this script is executed directly
if (require.main === module) {
  deploy();
}