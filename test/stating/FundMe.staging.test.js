const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

developmentChains.includes(network.name)
     ? describe.skip
     : describe("FundMe", async function () {
            let fundMe
            let deployer
            let sendValue = ethers.utils.parseEther("1") //1 ETH

            beforeEach(async function () {
                 deployer = (await getNamedAccounts()).deployer
                 fundMe = await ethers.getContract("FundMe", deployer)
            })

            it("Allows people to fund and withdraw", async function () {
                 await fundMe.fund({ value: sendValue })
                 await fundMe.withdraw()
                 const endingBalance = await fundMe.provider.getBalance(
                      fundMe.address
                 )
                 assert.equal(endingBalance.toString(), "0")
            })
       })
