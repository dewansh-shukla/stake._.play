const main = async() => {
    const contestContractFactory = await hre.ethers.getContractFactory("ContestD");
    const contestContract = await contestContractFactory.deploy();
    await contestContract.deployed();
    console.log("Contract deployed to:", contestContract.address);
}

const runMain = async() => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

runMain();