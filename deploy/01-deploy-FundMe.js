const { network,get } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
     const { deploy, log } = deployments
     const { deployer } = await getNamedAccounts()
     const chainId = network.config.chainId

     //const networkConfigAddress = networkConfig[chainId]["ethUsdPriceFeed"]
     let ethUsdPriceFeedAddress
     if (developmentChains.includes(network.name)) {
          const ethUsdV3Aggregator = await deployments.get("MockV3Aggregator")
          ethUsdPriceFeedAddress = ethUsdV3Aggregator.address
     } else {
          ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
     }

     const args = [ethUsdPriceFeedAddress]
     const FundMe = await deploy("FundMe", {
          from: deployer,
          args: args,
          log: true,
          waitConfirmations: network.config.blockConfirmations || 1,
     })

     if (
          !developmentChains.includes(network.name) &&
          process.env.ETHERSCAN_API_KEY
     ) {
          //verify
          await verify(FundMe.address, args)
     }

     log("-----------------------------------------")
}

module.exports.tags = ["all", "fundme"]
