const main = async () => {
    // const [owner, randomPerson] = await hre.ethers.getSigners();
    const streamContractFactory = await hre.ethers.getContractFactory("Stream");
    const streamContract = await streamContractFactory.deploy();
    await streamContract.deployed();
    console.log("Contract deployed to:", streamContract.address);
    console.log("Contract deployed by:", streamContract.owner);
  

    // let txn  = await streamContract.addVideo("abcd","regular");
    // await txn.wait();
    // console.log("Owner balance", await hre.ethers.provider.getBalance(owner.address));
  
    // txn = await streamContract.connect(randomPerson).addDonations("abcd", {value: hre.ethers.utils.parseEther("0.1")});
    // await txn.wait();
  
    // txn = await streamContract.getDonations("abcd");  
    // console.log("Donation", txn);
  
    // console.log("Owner balance", await hre.ethers.provider.getBalance(owner.address));

    let txn = await streamContract.addVideo("abcd","regular");
    await txn.wait();

    txn = await streamContract.addVideo("efgh","regular");
    await txn.wait();

    txn = await streamContract.addDonations("abcd","Woah", {value: hre.ethers.utils.parseEther("0.1")});
    await txn.wait();

    txn = await streamContract.addVideo("abc","stream");
    await txn.wait();

    txn = await streamContract.addVideo("cde","stream");
    await txn.wait();

    txn = await streamContract.addDonations("abc","Woah", {value: hre.ethers.utils.parseEther("0.2")});

    txn = await streamContract.getStreamVideos();

    console.log("Stream Videos", txn);

    txn = await streamContract.getDonations("abcd");
    console.log("Donations", txn);

    txn = await streamContract.getRegularVideos();
    console.log("Regular Videos", txn);

    txn = await streamContract.getDonations("abc");
    console.log("Donations", txn);
  }
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); 
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  
  runMain();