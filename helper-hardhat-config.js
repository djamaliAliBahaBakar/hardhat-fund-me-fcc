const networkConfig = {
     5: {
          name: "goerli",
          ethUsdPriceFeed: "0x44390589104C9164407A0E0562a9DBe6C24A0E05",
     },
     137: {
          name: "polygon",
          ethUsdPriceFeed: "0x73366Fe0AA0Ded304479862808e02506FE556a98",
     },
}

const developmentChains = ["hardhat", "localhost"]
const DECIMAL = 8
const INITIAL_ANSWER = 200000000000
module.exports = {
     networkConfig,
     developmentChains,
     DECIMAL,
     INITIAL_ANSWER,
}
