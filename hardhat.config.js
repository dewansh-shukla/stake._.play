require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.8",
  networks: {
    mumbai :{ 
      url : "https://palpable-twilight-snow.matic-testnet.discover.quiknode.pro/2f68e9a22770eeebc0f33eda050d6e40b7bb5c2d/",
      accounts : ["fd52513a4ea7bbf8ea7867ea9f5ace7ee1cf5f14d930af522b68b39a67b3ac93"],
    }
  }
};

