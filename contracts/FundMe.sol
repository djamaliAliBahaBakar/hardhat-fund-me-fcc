//Get Fund from users
//Withdraw
//Set a minimum funding value in USD
// SPDX-License-Identifier: MIT
//pragma
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//import
import "./PriceConverter.sol";

//Error Codes
error FundMe_NotOwner();

//Interfaces, libraries, Contracts

// Ticker and try to pinpoint exactly what's going on (15mn)
// Google the exact error
// Go to our github repo discussion and/or updates
// Ask a question on a forum like Stack Exchange ETH and Stack overflow

/// @title A contract for crowdfunding
/// @author Djamli Ali B Bakar
/// @notice This contract is to demo a simple fundMe contract
/// @dev This implements price feed as our library
/// @custom:experimental This is an experimental contract.
contract FundMe {
     //Type declaration
     using PriceConverter for uint256;
     // 931,261
     // 809 792

     //States variables
     uint256 public constant MINIMUM_USD = 50 * 1e18;
     address[] public funders;
     mapping(address => uint256) public addressToAmountFunded;
     address private immutable i_owner;

     AggregatorV3Interface public priceFeed;

     //modifiers
     modifier onlyOwner() {
          //require(msg.sender==i_owner,"Not the owner");
          if (msg.sender != i_owner) {
               revert FundMe_NotOwner();
          }
          _;
     }

     //functions
     //  constructor
     //  receive function (if exists)
     //  fallback function (if exists)
     //  external
     //  public
     //  internal
     //  private

     constructor(address priceFeedAdr) {
          i_owner = msg.sender;
          priceFeed = AggregatorV3Interface(priceFeedAdr);
     }

     receive() external payable {
          fund();
     }

     fallback() external payable {
          fund();
     }

     /// @notice This function funds this contract
     /// @dev The Alexandr N. Tetearing algorithm could increase precision
     function fund() public payable {
          //Want to be able to set a minimum ount in USD
          require(
               msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
               "Did not send enough!"
          );

          addressToAmountFunded[msg.sender] += msg.value;
          funders.push(msg.sender);
     }

     function withdraw() public onlyOwner {
          for (
               uint256 funderIndex = 0;
               funderIndex < funders.length;
               funderIndex++
          ) {
               address funder = funders[funderIndex];
               addressToAmountFunded[funder] = 0;
          }
          //reset the array
          funders = new address[](0);

          //transfer
          //payable(msg.sender).transfer(address(this).balance);
          //send
          //bool sendSuccess = payable(msg.sender).send(address(this).balance);
          //require(sendSuccess,"Send failed");
          //call
          (bool callSuccess, ) = payable(msg.sender).call{
               value: address(this).balance
          }("");
          require(callSuccess, "Call failed");
     }

     function getPriceFeed() public view returns (AggregatorV3Interface) {
          return priceFeed;
     }

     function getFunder(uint256 index) public view returns (address) {
          return funders[index];
     }

     function getAddressToAmountFunded(
          address fundingAddress
     ) public view returns (uint256) {
          return addressToAmountFunded[fundingAddress];
     }

     function getOwner() public view returns (address) {
          return i_owner;
     }
}
