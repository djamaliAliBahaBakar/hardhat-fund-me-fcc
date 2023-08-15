const { assert, expect } = require("chai")
const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

describe("FundMe", async function () {
            let fundMe
            let deployer
            let mockV3Aggregator
            let sendValue = ethers.utils.parseEther("1") //1 ETH
            beforeEach(async function () {
                 //const accounts = await ethers.getSigners()
                 //const accountZero = accounts[0]
                 deployer = (await getNamedAccounts()).deployer
                 await deployments.fixture(["all"])
                 fundMe = await ethers.getContract("FundMe", deployer)
                 mockV3Aggregator = await ethers.getContract(
                      "MockV3Aggregator",
                      deployer
                 )
            })

            describe("contructor", async function () {
                 it("Set the aggregator addresses correctly", async function () {
                      const response = await fundMe.priceFeed()
                      assert.equal(response, mockV3Aggregator.address)
                 })
            })

            describe("fund", async function () {
                 it("Fails if you don't send enough ETH", async function () {
                      await expect(fundMe.fund()).to.be.revertedWith(
                           "Did not send enough!"
                      )
                 })

                 it("Update the amount of funded data structure", async function () {
                      await fundMe.fund({ value: sendValue })
                      const response = await fundMe.addressToAmountFunded(
                           deployer
                      )
                      assert.equal(response.toString(), sendValue.toString())
                 })

                 it("Add funder to array of funders", async function () {
                      await fundMe.fund({ value: sendValue })
                      const funder = await fundMe.funders(0)
                      assert.equal(funder, deployer)
                 })
            })

            describe("Withdraw", async function () {
                 beforeEach(async function () {
                      await fundMe.fund({ value: sendValue })
                 })

                 it("withdraw ETH from a single funder", async function () {
                      //Arange
                      const startingFundMeBalance =
                           await fundMe.provider.getBalance(fundMe.address)
                      const startingDeployertBalance =
                           await fundMe.provider.getBalance(deployer)
                      //Act
                      const transactionResponse = await fundMe.withdraw()
                      const transactionReceipt = await transactionResponse.wait(
                           1
                      )
                      const { gasUsed, effectiveGasPrice } = transactionReceipt
                      const gasCost = gasUsed.mul(effectiveGasPrice)
                      const endingFundMeBalance =
                           await fundMe.provider.getBalance(fundMe.address)
                      const endingDeployertBalance =
                           await fundMe.provider.getBalance(deployer)
                      //Assert
                      assert.equal(endingFundMeBalance, 0)
                      assert.equal(
                           startingFundMeBalance
                                .add(startingDeployertBalance)
                                .toString(),
                           endingDeployertBalance.add(gasCost).toString()
                      )
                 })

                 it("is allows us to withdraw with multiple funders", async () => {
                      // Arrange
                      const accounts = await ethers.getSigners()
                      for (i = 1; i < 6; i++) {
                           const fundMeConnectedContract = await fundMe.connect(
                                accounts[i]
                           )
                           await fundMeConnectedContract.fund({
                                value: sendValue,
                           })
                      }
                      const startingFundMeBalance =
                           await fundMe.provider.getBalance(fundMe.address)
                      const startingDeployerBalance =
                           await fundMe.provider.getBalance(deployer)

                      // Act
                      const transactionResponse = await fundMe.withdraw()
                      // Let's comapre gas costs :)
                      // const transactionResponse = await fundMe.withdraw()
                      const transactionReceipt =
                           await transactionResponse.wait()
                      const { gasUsed, effectiveGasPrice } = transactionReceipt
                      const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
                      console.log(`GasCost: ${withdrawGasCost}`)
                      console.log(`GasUsed: ${gasUsed}`)
                      console.log(`GasPrice: ${effectiveGasPrice}`)
                      const endingFundMeBalance =
                           await fundMe.provider.getBalance(fundMe.address)
                      const endingDeployerBalance =
                           await fundMe.provider.getBalance(deployer)
                      // Assert
                      assert.equal(
                           startingFundMeBalance
                                .add(startingDeployerBalance)
                                .toString(),
                           endingDeployerBalance.add(withdrawGasCost).toString()
                      )
                      // Make a getter for storage variables
                      await expect(fundMe.getFunder(0)).to.be.reverted

                      for (i = 1; i < 6; i++) {
                           assert.equal(
                                await fundMe.getAddressToAmountFunded(
                                     accounts[i].address
                                ),
                                0
                           )
                      }
                 })
            })

            it("Only allows the owner to withdraw", async () => {
                 const accounts = await ethers.getSigners()
                 const attacker = accounts[1]
                 const attackerConnectedContract = await fundMe.connect(
                      attacker
                 )
                 await expect(attackerConnectedContract.withdraw()).to.be
                      .reverted
            })
       })
