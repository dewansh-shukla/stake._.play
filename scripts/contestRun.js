const main = async () => {
    const contestContractFactory = await hre.ethers.getContractFactory("ContestD");
    const contestContract = await contestContractFactory.deploy();
    await contestContract.deployed();
    console.log("Contract deployed to:", contestContract.address);

    const [owner, addr1, addr2, addr3] = await hre.ethers.getSigners();

    let txn = await contestContract.createContest("1","6","cona","desc");
    await txn.wait();

    txn = await contestContract.connect(addr1).stakeInContest("a","cona", {value: hre.ethers.utils.parseEther("0.1")});
    await txn.wait();
    
    console.log("Address 1 Balance:", await hre.ethers.provider.getBalance(addr1.address));

    txn = await contestContract.connect(addr2).stakeInContest("b","cona", {value: hre.ethers.utils.parseEther("0.1")});
    await txn.wait();

    console.log("Address 2 Balance :", await hre.ethers.provider.getBalance(addr2.address));

    txn = await contestContract.connect(addr3).stakeInContest("b","cona", {value: hre.ethers.utils.parseEther("0.1")});
    await txn.wait();

    console.log("Address 3 Balance :", await hre.ethers.provider.getBalance(addr3.address));

    txn = await contestContract.releaseFunds("cona");

    console.log("Balance after the contract ends");
    console.log("Address 1 Balance:", await hre.ethers.provider.getBalance(addr1.address));
    console.log("Address 2 Balance:", await hre.ethers.provider.getBalance(addr2.address));
    console.log("Address 3 Balance:", await hre.ethers.provider.getBalance(addr3.address));

    txn = await contestContract.getVideosInContest("cona");
    console.log("Videos in contest", txn);

    txn = await contestContract.addVideosInContest("a","cona");

    txn = await contestContract.addVideosInContest("b","cona");

    txn = await contestContract.getVideosInContest("cona");
    
    console.log("Videos in contest", txn);

    txn = await contestContract.fetchAllContests();
    console.log("All Contests", txn);
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

runMain();