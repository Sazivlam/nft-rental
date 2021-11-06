# nft-rental
## BBD class group project

To start project run ```docker-compose up```

React client can be accessed by going to ```localhost:3000```

To deploy smart contract to our local blockchain go to ```truffle``` folder and run ```truffle migrate``` or ```truffle migrate --reset```. 

If smart contract code was changed then run ```truffle compile``` and the run ```truffle migrate```

After deployment check in terminal what contract address is e.g. 
```contract address:    0xd3940973a3173E48f3ace3A1928bB24d08aDEaF4```
Then put contract address into ```website/src/constants/contracts.js```. WITHOUT IT UI WILL NOT BE ABLE TO INTERACT WITH DEPLOYED CONTRACT

## Truffle console scenario
### Get deployed contract and loaded accounts
```
let instance = await NFTRental.deployed()
let accounts = await web3.eth.getAccounts()
```
### Mint NFTs
```
instance.mintNFT("AK-47 | Bloodsport", "ak47_bloodsport.png")
instance.mintNFT("AK-47 | Case Hardened", "ak47_case_hardened.png")
instance.mintNFT("AK-47 | Jaguar", "ak47_jaguar.png")
instance.mintNFT("AWP | Atheris", "awp_atheris.png")
instance.mintNFT("AWP | Corticera", "awp_corticera.png")
instance.mintNFT("AWP | PAW", "awp_paw.png")
instance.mintNFT("M4A1-S | Basilisk", "m4a1s_basilisk.png")
instance.mintNFT("M4A1-S | Cyrex", "m4a1s_cyrex.png")
instance.mintNFT("M4A1-S | Guardian", "m4a1s_guardian.png")
```
### Give 3 items to 2nd account
```
instance.safeTransferFrom(accounts[0], accounts[1], 7)
instance.safeTransferFrom(accounts[0], accounts[1], 8)
instance.safeTransferFrom(accounts[0], accounts[1], 9)
```
### 1st account rents out 3 items
```
instance.putOnSale(1, 2, 100000, 200000)
instance.putOnSale(2, 3, 300000, 900000)
instance.putOnSale(3, 3, 300000, 900000)
```

### 2nd account buys 1 item from 1st account
```
instance.buyFromSale(1, {from: accounts[1], value: 400000})
```

### 2nd account rents out 2 items
```
instance.putOnSale(7, 3, 300000, 900000, {from: accounts[1]})
instance.putOnSale(8, 2, 200000, 400000, {from: accounts[1]})
```

### 1st account buys 1 item from 2nd account
```
instance.buyFromSale(7, {from: accounts[0], value: 2200000})
```

## Blockchain loaded data
Gas Price - 20000000000
### Available Accounts:
0. 0x5fe9dD4c80ab7742B62Fb40CE1fBE37D226645A1 (100 ETH) - Owner of the contract
1. 0xfB3Ce1611272f443B406BcE2e2dd1eEA85Ad340E (100 ETH)
2. 0x72A4Bbe493FC0A724460C9940eE6FAE5f9209D61 (100 ETH)
3. 0x52CF8bDea5BAd21DFE627Bef7a5efc4558665884 (100 ETH)
4. 0x7005eae3556cba0A81c2bf486d98a1a033CEa180 (100 ETH)
5. 0x807dC7A1dDC10350E8197607e267650369ed5033 (100 ETH)
6. 0x8a0d5408cCCe5F6d7496515C960Aa6D83c352651 (100 ETH)
7. 0x2C84990BbF49D95d9c826D061aDd2b538ffFda1B (100 ETH)
8. 0xAF508a3EC6A80c6f6Bd916e346ECc0b6937B60bB (100 ETH)
9. 0x388Ef493FaD03e3C73844Be82317017dEfdf6899 (100 ETH)

### Private Keys
0. 0xb2c488b68a775c823263a436bbb8876c4ba64c4b21a0713c5fede5ad369ef89b - Owner's private key
1. 0x5202280f7887b8962a7351b037eb76392fd6dec3d979a6312933a160271fb266
2. 0xfc69e6be7682c78b985bddc4d35c149313c03f122529e76d1666397533f1a480
3. 0xb9010af24dc60e6566cf34beda73be9e706d49e18e13916fb6d475cea432118b
4. 0xb04ebd6ac8c8fd8331d818128f9506816db26f80bf0dc992a8db987fb25fef8c
5. 0x0a7f2d5ab35209dd138933297a411a93226284980fa541d36376eff313b4c428
6. 0xbf177ef6f776c127fd172f236e82fcc5911ef055f551c5f6ac3b0c33a100c509
7. 0x0591fa96aefe23911faba79f3cc699c9d104dfa49097b81ef2560cccc7775fb3
8. 0xa72626308bbe1c4ea491b1f4a861636b008b25d743deb912f70b2ff9678cf97e
9. 0x357304b1e6db5691b6102341f28c676905535d1c17cc64ef4d591c009776d742