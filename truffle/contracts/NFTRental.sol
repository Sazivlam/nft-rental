pragma solidity ^0.5.12;

import "../dependencies/ERC721Full.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0-beta.0/contracts/token/ERC721/ERC721Full.sol";

contract NFTRental is ERC721Full {
    uint private _tokenIds = 0;

    struct nftData {
        string name;
        uint256 id;
        string imageUrl;
        bool isOnSale;
        bool isOnRent;
        uint256 sellPrice;
        uint256 rentPrice;
        uint256 rentEndTime;
        uint256 rentSeconds;
        address actualOwner;
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
    
    // Constants
    uint constant DAY_IN_SECONDS = 86400;

    uint constant HOUR_IN_SECONDS = 3600;
    uint constant MINUTE_IN_SECONDS = 60;
    
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
        require(msg.sender == this.ownerOf(_tokenId), "You cannot put this item on sale, because you are not the owner of it");
        require(msg.sender == nfts[_tokenId - 1].actualOwner, "You cannot put this item on sale, because you are not its actual owner");
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
       
        require (nfts[_tokenId - 1].sellPrice <= msg.value, "The amount you sent, is less than sell price.");
       
        require(this.getApproved(_tokenId) == address(this), "Seller did not give the allowance for us to sell this item");
        
        nfts[_tokenId - 1].isOnSale = false;
        nfts[_tokenId - 1].isOnRent = false;
        nfts[_tokenId - 1].sellPrice = 0;
        nfts[_tokenId - 1].rentPrice = 0;
        nfts[_tokenId - 1].rentEndTime = 0;
        nfts[_tokenId - 1].rentSeconds = 0;
        nfts[_tokenId - 1].actualOwner = msg.sender;
        
        address sellerAddress = this.ownerOf(_tokenId);
        this.safeTransferFrom(sellerAddress, msg.sender, _tokenId);

        users[sellerAddress].userBalance += msg.value; 

        emit nftTransaction(
            _tokenId,
            "Sold",
            sellerAddress,
            msg.sender,
            msg.value
        );
    }
    
    function putOnRent(uint256 _tokenId, uint256 _rentPrice, uint256 _days, uint256 _hours, uint256 _minutes, uint256 _seconds) public {
        require(msg.sender == this.ownerOf(_tokenId), "You cannot put this item on rent, because you are not the owner of it.");
        require(msg.sender == nfts[_tokenId - 1].actualOwner, "You cannot rent this item out, because you are not its actual owner");
        require(nfts[_tokenId - 1].isOnRent == false, "Item is already on rent!");
        
        nfts[_tokenId - 1].isOnRent = true;
        nfts[_tokenId - 1].rentPrice = _rentPrice;
        nfts[_tokenId - 1].rentSeconds = _days * DAY_IN_SECONDS + _hours * HOUR_IN_SECONDS + _minutes * MINUTE_IN_SECONDS + _seconds;
        approve(address(this), _tokenId);

        emit nftTransaction(
            _tokenId,
            "On Rent",
            msg.sender,
            address(0x0),
            _rentPrice
        ); 
    }
    
    function cancelRent(uint256 _tokenId) public {
        require(nfts[_tokenId - 1].isOnRent == true, "Item should be put on rent first, to be cancelled.");
        require(msg.sender == this.ownerOf(_tokenId), "You cannot cancel the renting of this item, because you are not the owner.");
        
        nfts[_tokenId - 1].isOnRent = false;
        nfts[_tokenId - 1].rentPrice = 0;
        nfts[_tokenId - 1].rentSeconds = 0;
        

        emit nftTransaction(
            _tokenId,
            "Rent Cancelled",
            msg.sender,
            address(0x0),
            0
        ); 
    }
    
    function rent(uint256 _tokenId) public payable {
        require(msg.sender != this.ownerOf(_tokenId), "You cannot rent your own item!");
        
        require(nfts[_tokenId - 1].isOnRent == true, "Item should be on rent for you to rent it out.");
       
        require (nfts[_tokenId - 1].rentPrice <= msg.value, "The amount you sent, is less than the rent price.");
       
        require(this.getApproved(_tokenId) == address(this), "Renter did not give the allowance for us to rent this item");
        
        nfts[_tokenId - 1].isOnRent = false;
        nfts[_tokenId - 1].isOnSale = false; 
        nfts[_tokenId - 1].sellPrice = 0;
        nfts[_tokenId - 1].rentPrice = 0;
        nfts[_tokenId - 1].rentEndTime = now + nfts[_tokenId - 1].rentSeconds;
        
        address sellerAddress = this.ownerOf(_tokenId);
        this.safeTransferFrom(sellerAddress, msg.sender, _tokenId);

        users[sellerAddress].userBalance += msg.value; 
        approve(address(this), _tokenId);   // Allows current owner return item to actual owner

        emit nftTransaction(
            _tokenId,
            "Rented out",
            sellerAddress,
            msg.sender,
            msg.value
        );
    }
    
    function returnRented(uint256 _tokenId) public {
        require(msg.sender != this.ownerOf(_tokenId), "You cannot return rented item, because you are already its owner");
        require(msg.sender == nfts[_tokenId - 1].actualOwner, "You cannot return rented item, because you are not its actual owner.");
        require(nfts[_tokenId - 1].rentEndTime < now, "You can not return item which rent time has not ended");
        
        nfts[_tokenId - 1].isOnRent = false;
        nfts[_tokenId - 1].rentPrice = 0;
        nfts[_tokenId - 1].rentSeconds = 0;
        nfts[_tokenId - 1].rentEndTime = 0;
        
        address currentOwnerAddress = this.ownerOf(_tokenId);
        this.safeTransferFrom(currentOwnerAddress, nfts[_tokenId - 1].actualOwner, _tokenId);

        emit nftTransaction(
            _tokenId,
            "Rented item returned",
            msg.sender,
            address(0x0),
            0
        ); 
    }

    function withdrawMoney(uint256 _amount) public {

        require(users[msg.sender].userBalance >= _amount, "You do not have enough balance to withdraw this amount");

        users[msg.sender].userBalance -= _amount;
        msg.sender.transfer(_amount);
        
    }
        
    function mint(string memory _name, string memory _imageUrl) public returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        require(exists[newItemId] == false, "Item id should be unique, for you to mint it");
        require(this.totalSupply() < maxSupply, "You cannot mint any more item since you already reached the maximum supply");
        require(msg.sender == owner, "Only owner of the contract can mint");
        
        nfts.push(
            nftData(
                _name,
                newItemId,
                _imageUrl,
                false,
                false,
                0,
                0,
                0,
                0,
                msg.sender
            )
        );
        _mint(msg.sender, newItemId);
        exists[newItemId] = true;
        
        emit nftTransaction(newItemId, "claimed", address(0x0), msg.sender, 0);
       
        return newItemId;
    }
    
    function transfer(address from, uint256 nft) public {}
    
    // TODO: data structures:
                // vault with posted NFTs
                // keeping track of borrowers and their deadlines
    // TODO: liquidate borrowers (checks that time is up) -- callable by lenders
    // TODO: get remaining time of rentals (callable by lenders)
    // TODO: post NFT for rental    DONE
    // TODO: rent NFT               DONE
    // TODO: detach rent and sell data from nftData
}