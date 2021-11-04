# nft-rental
BBD class group project

To start project run ```docker-compose up```

To deploy smart contract to our local blockchain go to ```truffle``` folder and run ```truffle migrate``` or ```truffle migrate --reset```. If smart contract code was changed, recompile it by running ```truffle compile``` and the run ```truffle migrate```

After deployment check in terminal what contract address is e.g. 
```contract address:    0xd3940973a3173E48f3ace3A1928bB24d08aDEaF4```
Then put contract address to ```website/src/constants/contracts.js```. WITHOUT IT UI WILL NOT BE ABLE TO INTERACT WITH DEPLOYED CONTRACT

Contract owner ```0x5fe9dD4c80ab7742B62Fb40CE1fBE37D226645A1```
Contract owner private key ``````

React client can be accessed by going to ```localhost:3000```