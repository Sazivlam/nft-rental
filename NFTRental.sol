pragma solidity ^0.8.0;

contract NFTRental {
    address public owner;
    
    mapping (address => uint256) nftsPostedByUser;      // map from lenders to the tokens they have posted (aka available for renting)
    mapping (address => uint256[4]) borrowerDeadlines;  // map from borrowers to the deadlines of their rentals (uint256[4] is a timestamp)
    
    constructor() {
        owner = msg.sender;
    }
    
    function transfer(address from, uint256 nft) public {}
    
    // TODO: data structures:
                // vault with posted NFTs
                // keeping track of borrowers and their deadlines
    // TODO: liquidate borrowers (checks that time is up) -- callable by lenders
    // TODO: get remaining time of rentals (callable by lenders)
    // TODO: post NFT for rental
    // TODO: rent NFT
}
    