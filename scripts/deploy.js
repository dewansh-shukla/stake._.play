const main = async () => {
  const streamContractFactory = await hre.ethers.getContractFactory("Stream")
  const streamContract = await streamContractFactory.deploy()
  await streamContract.deployed()
  console.log("Contract deployed to:", streamContract.address)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()
