var NFTRental = artifacts.require("./NFTRental.sol");

module.exports = function(deployer) {
  deployer.deploy(NFTRental);
};