pragma solidity ^0.6.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0-beta.0/contracts/token/ERC721/ERC721Full.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0-beta.0/contracts/drafts/Counters.sol";

contract NFTRental is ERC721Full {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct nftData {
        string name;
        uint256 id;
        string imageUrl;
        bool isOnSale;
        uint256 sellPrice;
    }

    struct userData {
        string username;
        uint256 userBalance;
    }

    event nftTransaction(
        uint256 indexed id,
        string transactionType,
        address fromAddress,
        address toAddress,
        uint256 value
    );

    mapping(address => userData) public users;
    mapping(uint256 => bool) exists;
    nftData[] public nfts;

    address public owner;
    uint256 public maxSupply;
    
    // mapping (address => uint256) nftsPostedByUser;      // map from lenders to the tokens they have posted (aka available for renting)
    // mapping (address => uint256[4]) borrowerDeadlines;  // map from borrowers to the deadlines of their rentals (uint256[4] is a timestamp)
    
    constructor() public ERC721Full("NFTRental", "NFTR") {
        owner = msg.sender;
        maxSupply = 1000;
    }

    function setUsername(string memory _username) public {
        users[msg.sender].username = _username;
    }

    function tokensOfOwner(address _owner) public view returns (uint256[] memory)
    {
        return _tokensOfOwner(_owner);
    }

    function putOnSale(uint256 _tokenId, uint256 _sellPrice) public {
      
        require(msg.sender == this.ownerOf(_tokenId), "You cannot put this item on sale, because you are not the owner of it.");
        require(nfts[_tokenId - 1].isOnSale == false, "Item is already on sale!");
        
        nfts[_tokenId - 1].isOnSale = true;
        nfts[_tokenId - 1].sellPrice = _sellPrice; 
        approve(address(this), _tokenId);

        emit nftTransaction(
            _tokenId,
            "On Sale",
            msg.sender,
            address(0x0),
            _sellPrice
        ); 
    }

    function cancelSale(uint256 _tokenId) public {
        require(nfts[_tokenId - 1].isOnSale == true, "Item should be on sale first, to be cancelled.");
        require(msg.sender == this.ownerOf(_tokenId), "You cannot cancel the sale of this item, because you are not the owner.");
        
        nfts[_tokenId - 1].isOnSale = false; 
        nfts[_tokenId - 1].sellPrice = 0; 

        emit nftTransaction(
            _tokenId,
            "Sale Cancelled",
            msg.sender,
            address(0x0),
            0
        ); 
    }

    function buyFromSale(uint256 _tokenId) public payable {
       
        require(msg.sender != this.ownerOf(_tokenId), "You cannot buy your own item!");
        
        require(nfts[_tokenId - 1].isOnSale == true, "Item should be on sale for you to buy it.");
       
        require (nfts[_tokenId - 1].sellPrice <= msg.value, "The amount you tried to buy, is less than price.");
       
        require(this.getApproved(_tokenId) == address(this), "Seller did not give the allowance for us to sell this item, contact the seller.");
        address sellerAddress = this.ownerOf(_tokenId);
        this.safeTransferFrom(sellerAddress, msg.sender, _tokenId);
        nfts[_tokenId - 1].isOnSale = false; 
        nfts[_tokenId - 1].sellPrice = 0; 
        users[sellerAddress].userBalance += msg.value; 

        emit nftTransaction(
            _tokenId,
            "sold",
            sellerAddress,
            msg.sender,
            msg.value
        );
    }

    function withdrawMoney(uint256 _amount) public {

        require(users[msg.sender].userBalance >= _amount, "You do not have enough balance to withdraw this amount");

        users[msg.sender].userBalance -= _amount;
        msg.sender.transfer(_amount);
        
    }
        
    function mint(string memory _name, string memory _imageUrl) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        require(exists[newItemId] == false, "Item id should be unique, for you to mint it");
        require(this.totalSupply() < maxSupply, "You cannot mint any more item since you already reached the maximum supply");
        require(msg.sender == owner, "Only owner of the contract can mint");
        nfts.push(
            nftData(
                _name,
                newItemId,
                _imageUrl,
                false,
                0
            )
        );
        _mint(msg.sender, newItemId);
        exists[newItemId] = true;
        
        emit nftTransaction(newItemId, "claimed", address(0x0), msg.sender, 0);
        
        // putOnSale(newItemId, 10000000000000000);
       
        return newItemId;
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
    