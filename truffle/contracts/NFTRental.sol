pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTRental is Ownable, ERC721Enumerable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    uint constant DAY_IN_SECONDS = 86400;
    uint16 public constant MAX_NFT_SUPPLY = 1000;

    struct NFTRentData {
        string name;
        string imageUrl;
        uint256 id;
        bool isOnSale;
        address payable lender;
        //address custodian;     # for supporting NFTs from other contracts
        uint256 rentSeconds;
        uint256 rentEndTime;
        uint256 dailyPrice;
        uint256 collateral;
    }

    event Transaction(
        string transactionType,
        uint256 indexed id,
        uint8 maxDurationInDays,
        uint256 dailyPrice,
        uint256 collateral,
        uint256 rentEndTime,
        address fromAddress,
        address toAddress,
        uint256 value
    );

    mapping(address => string) public users;  // address => username

    NFTRentData[] public nfts;
    uint256 public maxSupply;
    uint256 public rentFee = 50; // in basis points, so 50 => 0.5%

    constructor() ERC721("NFTRental", "NFTR") {}
    
    
    function setRentFee(uint256 _rentFee) external onlyOwner {
        require(_rentFee < 10000, "Fee exceeds 100 percent.");
        rentFee = _rentFee;
    }
    
    
    function setUsername(string memory _username) public {
        users[msg.sender] = _username;
    }
    

    /* for general NFT support
    function safeTransfer(address _from, address _to, uint256 _tokenId) private {
        if (isERC721(_tokenId) {
            IERC721(_tokenId).transferFrom(_from, _to, _tokenId);
        } else {
            revert("We currently only support ERC721 tokens.");
        }
    }
    
    // Currently only support ERC721 tokens
    function isERC721(address _tokenId) private view returns (bool) {
        return IERC165(_tokenId).supportsInterface(type(IERC721).interfaceId);
    }
    */
    
    function putOnMarket(uint256 _tokenId, uint8 _maxDurationInDays, uint256 _dailyPrice, uint256 _collateral) public {
        require(msg.sender == this.ownerOf(_tokenId), "You cannot put this item on sale, because you are not the owner of it");
        //require(msg.sender == nfts[_tokenId - 1].custodian, "You cannot put this item on sale, because you are not its custodian");
        require(nfts[_tokenId - 1].isOnSale == false, "Item is already on sale.");
        require(_maxDurationInDays > 0, "You cannot lend the item for less than 0 days.");
        require(_dailyPrice >= 0, "Daily rent price can not be negative.");
        require(_collateral >= 0, "Collateral amount can not be negative.");

        nfts[_tokenId - 1].isOnSale = true;
        nfts[_tokenId - 1].lender = payable(msg.sender);
        nfts[_tokenId - 1].rentSeconds = _maxDurationInDays * DAY_IN_SECONDS;
        nfts[_tokenId - 1].dailyPrice = _dailyPrice;
        nfts[_tokenId - 1].collateral = _collateral;
        uint256 value = _dailyPrice * _maxDurationInDays + _collateral;

        approve(address(this), _tokenId);
        // safeTransfer(msg.sender, address(this), _tokenId);

        emit Transaction(
            "NFT On Market",
            _tokenId,
            _maxDurationInDays,
            _dailyPrice,
            _collateral,
            0,
            msg.sender,
            address(0x0),
            value
        ); 
    }

    function removeFromMarket(uint256 _tokenId) public {
        require(nfts[_tokenId - 1].isOnSale == true, "Item should be on sale to cancel sale.");
        require(msg.sender == this.ownerOf(_tokenId), "You cannot cancel the sale of this item, because you are not the owner.");
        //require(nfts[_tokenId - 1].custodian == msg.sender, "You cannot cancel the sale of this item, because you did not put it on sale.");

        nfts[_tokenId - 1].isOnSale = false;
        nfts[_tokenId - 1].lender = payable(address(0));

        //safeTransfer(address(this), msg.sender, _tokenId);

        emit Transaction(
            "NFT Removed",
            _tokenId,
            0,
            0,
            0,
            0,
            msg.sender,
            address(0),
            0
        ); 
    }

    function borrowFromMarket(uint256 _tokenId) public payable {
        require(msg.sender != this.ownerOf(_tokenId), "You cannot borrow your own item!");
        require(msg.sender != nfts[_tokenId - 1].lender, "You cannot borrow an item that you lend!");
        //require(nfts[_tokenId - 1].custodian != msg.sender, "You cannot buy your own item.");
        require(nfts[_tokenId - 1].isOnSale == true, "Item should be on sale for you to buy it.");
        
        uint256 initialPrice = nfts[_tokenId - 1].dailyPrice * (nfts[_tokenId - 1].rentSeconds / DAY_IN_SECONDS) + nfts[_tokenId - 1].collateral;
        require(initialPrice <= msg.value, "The amount you sent is less than the price of rental (which is the price of the full rental period plus collateral.)");
        
        require(this.getApproved(_tokenId) == address(this), "Seller did not give allowance for us to sell this item.");
        
        address sellerAddress = this.ownerOf(_tokenId);
        this.safeTransferFrom(sellerAddress, msg.sender, _tokenId);
            
        nfts[_tokenId - 1].isOnSale = false;
        //nfts[_tokenId - 1].custodian = msg.sender;
        uint256 rentEndTime = block.timestamp + nfts[_tokenId - 1].rentSeconds;
        nfts[_tokenId - 1].rentEndTime = rentEndTime;

        // Allows contract to return NFT back
        approve(address(this), _tokenId);

        emit Transaction(
            "NFT Sold",
            _tokenId,
            0,
            0,
            0,
            rentEndTime,
            nfts[_tokenId - 1].lender,
            msg.sender,
            initialPrice
        );
    }
    
    function returnNFT(uint256 _tokenId) public {
        require(msg.sender == this.ownerOf(_tokenId), "You must own the item to return it.");
        //require(nfts[_tokenId - 1].custodian == msg.sender, "Only the borrower can return the item.");
        require(nfts[_tokenId - 1].isOnSale == false, "Item must not be on sale.");

        // return some rent money to borrower when they return early along with their collateral
        uint256 secondsRented = block.timestamp - (nfts[_tokenId - 1].rentEndTime - nfts[_tokenId - 1].rentSeconds);
        uint256 moneyBack = nfts[_tokenId - 1].dailyPrice * ((nfts[_tokenId - 1].rentSeconds - secondsRented) / DAY_IN_SECONDS) + nfts[_tokenId - 1].collateral;
        (payable(msg.sender)).transfer(moneyBack); 
        
        // send rent to lender
        uint256 rentToLender = nfts[_tokenId - 1].dailyPrice / DAY_IN_SECONDS * secondsRented;
        (nfts[_tokenId - 1].lender).transfer(rentToLender*((10000-rentFee)/10000)); // small fee is taken and kept in contract

        emit Transaction(
            "NFT Returned",
            _tokenId,
            0,
            0,
            0,
            0,
            address(this),
            msg.sender,
            moneyBack
        );

        nfts[_tokenId - 1].isOnSale = false;
        
        require(this.getApproved(_tokenId) == address(this), "Borrower did not give allowance for us to return this item.");
        this.safeTransferFrom(msg.sender, nfts[_tokenId - 1].lender, _tokenId);        
    }
    
    function claimCollateral(uint256 _tokenId) public {
        //require(msg.sender != nfts[_tokenId - 1].custodian, "You cannot claim the collateral, because you are already the custodian of the item.");
        require(nfts[_tokenId - 1].isOnSale == false, "You cannot claim the collateral, because the item is on sale.");
        require(msg.sender == nfts[_tokenId - 1].lender, "You cannot claim the collateral, because you are not the lender of the item.");
        require(nfts[_tokenId - 1].rentEndTime < block.timestamp, "You can not claim the collateral, since the rent time has not ended.");
        
        //nfts[_tokenId - 1].custodian = address(0);
        nfts[_tokenId - 1].lender = payable(address(0));
        
        // Send the full rent + collateral to lender.
        uint256 moneyToLender = nfts[_tokenId - 1].dailyPrice / DAY_IN_SECONDS * nfts[_tokenId - 1].rentSeconds + nfts[_tokenId - 1].collateral;
        (payable(msg.sender)).transfer(moneyToLender*((10000-rentFee)/10000));  // small fee is taken and kept in contract

        emit Transaction(
            "Collateral Claimed",
            _tokenId,
            0,
            0,
            0,
            0,
            address(this),
            msg.sender,
            moneyToLender
        ); 
    }


    function mintNFT(string memory _name, string memory _imageUrl) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        require(newItemId < MAX_NFT_SUPPLY, "You cannot mint any more items since you already reached the maximum supply");

        nfts.push(
            NFTRentData(
                _name,
                _imageUrl,
                newItemId,
                false,
                payable(address(0x0)),
                //address(msg.sender),
                0,
                0,
                0,
                0
            )
        );
        
        _mint(msg.sender, newItemId);
        
        emit Transaction(
            "NFT Minted",
            newItemId,
            0,
            0,
            0,
            0,
            address(0x0),
            msg.sender, 
            0
        );
       
        return newItemId;
    }
}