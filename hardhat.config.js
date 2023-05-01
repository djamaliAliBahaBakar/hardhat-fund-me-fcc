require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("solidity-coverage")

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
     defaultNetwork: "hardhat",
     networks: {
          goerli: {
               url: GOERLI_RPC_URL,
               accounts: [GOERLI_PRIVATE_KEY],
               chainId: 5,
               blockConfirmations: 6,
          },
          localhost: {
               url: "http://127.0.0.1:8545",
               chainId: 31337,
          },
     },
     etherscan: {
          // Your API key for Etherscan
          // Obtain one at https://etherscan.io/
          apiKey: ETHERSCAN_API_KEY,
     },
     gasReporter: {
          enabled: true,
          outputFile: "gas-report.txt",
          noColors: true,
          currency: "USD",
          //coinmarketcap: COINMARKETCAP_API_KEY,
     },
     namedAccounts: {
          deployer: {
               default: 0,
          },
     },
     //solidity: "0.8.18",
     solidity: {
          compilers: [{ version: "0.8.18" }, { version: "0.6.6" }],
     },
}
