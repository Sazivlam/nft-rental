import React from "react";
import { Container, Typography, Button } from "@material-ui/core";
import ItemTab from "../../components/itemCard/itemTab";
import Web3 from "web3";
import * as fs from "fs";

import NftRental from "../../abis/NFTRental.json";


import addresses from "../../constants/contracts";
import { useRecoilCallback } from "recoil";
import {
  allItems,
  isBiddable,
  isOnSale,
  rarityLevel,
} from "../../recoils/atoms";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

// const username_abi = JSON.parse(contractJson);

const Items = () => {
  const [address, setAddress] = React.useState();
  const [data, setData] = useRecoilState(allItems);
  const [zeroAddress] = React.useState("0x0000000000000000000000000000000000000000");

  const isMine = (owner, myAddress) => {
    return owner.toLowerCase() == myAddress.toLowerCase();
  }

  const isNotRented = (currentNftData, myAddress) => {
    return currentNftData.lender.toLowerCase() == zeroAddress || 
    currentNftData.lender.toLowerCase() == myAddress.toLowerCase();
  }

  const isRentedOut = (currentNftData, myAddress) => {
    return currentNftData.lender.toLowerCase() == myAddress.toLowerCase();
  }

  if (!window.eth && !window.ethereum) {
    window.location.href = window.location.origin;
  }

  // var web3 = new Web3("http://localhost:8545");

  // React.useEffect(async () => {
  //   var smart_contract_interface = new window.web3.eth.Contract(
  //     Username.abi,
  //     "0x3635497D85eD625239632bfB8f25A3c06eBd6a77"
  //   );
  //   console.log("methods:", smart_contract_interface.methods);
  // }, [window.web3.eth]);

  React.useEffect(async () => {
    let accounts = await window.ethereum.enable();
    let myAddress = await window.ethereum.selectedAddress;
    setAddress(myAddress);

    var nft_contract_interface = new window.web3.eth.Contract(
      NftRental.abi,
      addresses.NFT_CONTRACTS_ADDRESS
    );

    nft_contract_interface.methods
      .totalSupply()
      .call()
      .then((totalNftCount) => {
        let nftIds = [];
        for (var i = 0; i < totalNftCount; i++) {
          nftIds.push(i);
        }
        Promise.all(
          nftIds.map((index) => {
            return Promise.resolve(
              nft_contract_interface.methods
                .tokenByIndex(index)
                .call()
                .then((currentTokenId) => {
                  return nft_contract_interface.methods
                    .nfts(currentTokenId - 1)
                    .call()
                    .then((currentNftData) => {
                      //the request below can be send with
                      //the same time of methods.nfts()
                      //but need to do promise again
                      //however it makes the code more efficient

                      if (!currentNftData.isOnSale) {
                        return nft_contract_interface.methods
                          .ownerOf(currentTokenId)
                          .call()
                          .then((owner) => {
                            if (isMine(owner, myAddress)) {
                              if (isNotRented(currentNftData, myAddress)) {
                                return {
                                  ...currentNftData,
                                  id: currentTokenId - 1,
                                  owner: owner,
                                  viewType: "owner"
                                };
                              } else {
                                return {
                                  ...currentNftData,
                                  id: currentTokenId - 1,
                                  owner: owner,
                                  viewType: "rented"
                                };
                              }
                              // if(currentNftData.)

                            } else if (isRentedOut(currentNftData, myAddress)) {
                              return {
                                ...currentNftData,
                                id: currentTokenId - 1,
                                owner: owner,
                                viewType: "rentedOut"
                              };
                            }
                            // else {
                            //   return {
                            //     ...currentNftData,
                            //     id: currentTokenId - 1,
                            //     owner: owner,
                            //     ownerView: false
                            //   };
                            // }
                          });
                      }
                    });

                })
            );
          })
        )
          .then((values) => {
            setData(values);
          })
          .catch((err) => console.log("err", err));
      });
  }, [window.web3.eth]);

  //console.log("data", data);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" style={{ marginBottom: 20, marginTop: 30 }}>
        My items
      </Typography>
      {/* {address && <> {address}</>} */}

      <ItemTab style={{ marginTop: 10 }} />
      {/* <div>
        {data.map((item) => {
          //console.log("item", item);
          return item.name;
        })}
      </div> */}
      {/* <div>{data.length}</div>
      <Button onClick={() => console.log("button data", data)}>mybutton</Button> */}
    </Container>
  );
};

export default Items;
