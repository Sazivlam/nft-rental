import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import LocalOfferSharpIcon from "@material-ui/icons/LocalOfferSharp";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { Grid, Container, Paper } from "@material-ui/core";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import NftRental from "../../abis/NFTRental.json";
import addresses from "../../constants/contracts";
import { getUsername } from "../../utils/getUsernameFromAddress";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#080808",
    maxWidth: 345,
    borderRadius: 8,
    color: "#f1ffe3",
    maxHeight: "100%",
  },
  media: {
    height: 220,
    width: "calc(100% - 50px)",
    margin: "0 auto",
    borderRadius: 5,
  },
  nftInfoContainer: {
    marginTop: 10,
  },
  nftOwnerContainer: {
    marginLeft: 25,
    marginBottom: 10
  },
  rentButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  rentButton: {
    color: "#FFF",
    backgroundColor: "#080808",
    height: 35,
    width: "calc(100% - 50px)",
    position: "relative",
    borderRadius: 15,
    border: "4px solid",
    borderColor: "#FFFFFF",
    marginTop: 5,
    "&:hover": {
      backgroundColor: "#16B421",
      borderColor: "#000",
      color: "#000",
    },
  },
  enabledReturnButton: {
    color: "#FFF",
    backgroundColor: "#080808",
    height: 35,
    width: "calc(100% - 50px)",
    position: "relative",
    borderRadius: 15,
    border: "4px solid",
    borderColor: "#FFFFFF",
    marginTop: 5,
    "&:hover": {
      backgroundColor: "#FF0000",
      borderColor: "#000",
      color: "#000",
    },
  },
  disabledReturnButton: {
    backgroundColor: "#080808",
    height: 35,
    width: "calc(100% - 50px)",
    position: "relative",
    borderRadius: 15,
    border: "4px solid",
    borderColor: "grey",
    marginTop: 5,
  },
  myButton: {
    color: "#FFF",
    backgroundColor: "#000",
    height: 23,
    position: "relative",
    top: 7,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 12,
    borderRadius: 5,
    border: "1px solid",
    borderColor: "#FFF",
    "&:hover": {
      backgroundColor: "#FFF",
      borderColor: "#000",
      color: "#000",
    },
  },
});


const MyTooltip = withStyles((theme) => ({
  tooltip: {
    // backgroundColor: '#f5f5f9',
    // color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 20,
    // maxWidth: 220,
    // fontSize: theme.typography.pxToRem(12),
    // border: '1px solid #dadde9',
  },
}))(Tooltip);

const ItemCard = ({
  name,
  owner,
  imageUrl,
  dailyPrice,
  collateral,
  rentSeconds,
  id,
  isProfile,
  viewType,
  lender,
  rentEndTime
}) => {
  const classes = useStyles();
  // var owner = ;

  const [usernameToBeShown, setUsernameToBeShown] = React.useState(
    owner.slice(0, 4) + "..." + owner.slice(owner.length - 2, owner.length)
  );

  const [lenderToBeShown, setLenderToBeShown] = React.useState(
    lender.slice(0, 4) + "..." + lender.slice(lender.length - 2, lender.length)
  );

  const daysFromSeconds = (seconds) => {
    return seconds / 86400;
  }

  const returnNFT = (id) => {
    var nft_contract_interface = new window.web3.eth.Contract(
      NftRental.abi,
      addresses.NFT_CONTRACTS_ADDRESS
    );
    nft_contract_interface.methods
      .returnNFT(id + 1)
      .send({ from: window.ethereum.selectedAddress })
      .then((result) => {
        console.log(result)
      })
      .catch((err) => console.log("err", err));
  }

  const putOnMarket = (id) => {
    var nft_contract_interface = new window.web3.eth.Contract(
      NftRental.abi,
      addresses.NFT_CONTRACTS_ADDRESS
    );
    nft_contract_interface.methods
      .putOnMarket(id + 1, 2, 1000000000000000, 2000000000000000)
      .send({ from: window.ethereum.selectedAddress })
      .then((result) => {
        console.log(result)
      })
      .catch((err) => console.log("err", err));
  }

  const claimCollateral = (id) => {
    var nft_contract_interface = new window.web3.eth.Contract(
      NftRental.abi,
      addresses.NFT_CONTRACTS_ADDRESS
    );
    nft_contract_interface.methods
      .claimCollateral(id + 1)
      .send({ from: window.ethereum.selectedAddress })
      .then((result) => {
        console.log(result)
      })
      .catch((err) => console.log("err", err));
  }

  const timeLeft = (rentEndTime) => {
    return rentEndTime - Math.floor(Date.now()/1000)
  }

  React.useEffect(async () => {
    var nft_contract_interface = new window.web3.eth.Contract(
      NftRental.abi,
      addresses.NFT_CONTRACTS_ADDRESS
    );

    getUsername(nft_contract_interface, owner).then((data) => {
      setUsernameToBeShown(data);
    });

    getUsername(nft_contract_interface, lender).then((data) => {
      setLenderToBeShown(data);
    });
  }, [window.web3.eth]);

  return (
    <Card className={classes.root} variant="outlined">
      <Grid container>
        <Grid item xs>
          <Grid container>
            <CardMedia
              className={classes.media}
              image={imageUrl}
              title={name}
            />
          </Grid>
          <Grid container direction="column" style={{ marginTop: 10 }}>
            <Grid item style={{ marginLeft: 25 }}>
              <Typography gutterbottom="true" variant="h6" component="h1">
                {name}
              </Typography>
            </Grid>
            {(viewType == "rentedOut" || viewType == "rented") &&
              <Grid item style={{ alignSelf: "flex-start", marginLeft: 25 }}>
                <div style={{ textAlign: "left" }}>
                  <div className={classes.nftInfoContainer}>
                    <LocalOfferSharpIcon
                      style={{
                        verticalAlign: "middle",
                        marginRight: 5,
                        fontSize: 20,
                      }}
                    />
                    <MyTooltip title={window.web3.utils.fromWei(dailyPrice).toString()} arrow>
                      <Typography variant="caption" style={{
                        verticalAlign: "middle"
                      }}>
                        Daily price [ETH]: {dailyPrice ? window.web3.utils.fromWei(dailyPrice.toString()) : "-"}
                      </Typography>
                    </MyTooltip>
                  </div>
                </div>
                <div className={classes.nftInfoContainer}>
                  <div>
                    <CalendarTodayIcon
                      style={{
                        verticalAlign: "middle",
                        marginRight: 5,
                        fontSize: 20,
                      }}
                    />
                    <MyTooltip title={daysFromSeconds(rentSeconds).toString()} arrow>
                      <Typography variant="caption" style={{
                        verticalAlign: "middle"
                      }}>
                        Max duration [days]: {rentSeconds ? daysFromSeconds(rentSeconds).toString() : "-"}
                      </Typography>
                    </MyTooltip>
                  </div>
                </div>
                <div className={classes.nftInfoContainer}>
                  <div>
                    <AccessTimeIcon
                      style={{
                        verticalAlign: "middle",
                        marginRight: 5,
                        fontSize: 20,
                      }}
                    />
                    <MyTooltip title={timeLeft(rentEndTime)} arrow>
                      <Typography variant="caption" style={{
                        verticalAlign: "middle"
                      }}>
                        Time left [seconds]: {rentEndTime ? timeLeft(rentEndTime) : "-"}
                      </Typography>
                    </MyTooltip>
                  </div>
                </div>
                <div className={classes.nftInfoContainer}>
                  <div>
                    <AccountBalanceIcon
                      style={{
                        verticalAlign: "middle",
                        marginRight: 5,
                        fontSize: 20,
                      }}
                    />
                    <MyTooltip title={window.web3.utils.fromWei(collateral).toString()} arrow>
                      <Typography variant="caption" style={{
                        verticalAlign: "middle"
                      }}>
                        Collateral [ETH]: {collateral ? window.web3.utils.fromWei(collateral.toString()) : "-"}
                      </Typography>
                    </MyTooltip>
                  </div>
                </div>
              </Grid>
            }
          </Grid>
          {(viewType == "rentedOut" || viewType == "rented") &&
            <Grid container style={{ marginTop: 10 }}>
              <div className={classes.nftOwnerContainer}>
                <AccountCircleIcon
                  style={{
                    verticalAlign: "middle",
                    marginRight: 4,
                    fontSize: 24,
                  }}
                />
                <Typography variant="caption" style={{
                  verticalAlign: "middle"
                }}>
                  Lender:
                </Typography>
                <Button
                  size="small"
                  className={classes.myButton}
                  onClick={() => {
                    isProfile
                      ? (window.location.href = lender)
                      : (window.location.href = "profile/" + lender);
                  }}
                >
                  {lenderToBeShown}
                </Button>
              </div>
            </Grid>
          }
          <Grid container className={classes.rentButtonContainer}>
            {viewType == "rented" &&
              <Button
                size="big"
                className={classes.enabledReturnButton}
                onClick={() => {
                  returnNFT(id);
                }}
              >
                Return to lender
              </Button>
            }
            {viewType == "rentedOut" &&
              <Button
                size="big"
                
                className={timeLeft(rentEndTime) < 0 ? classes.enabledReturnButton: classes.disabledReturnButton}
                disabled={timeLeft(rentEndTime) < 0 ? false : true}
                onClick={() => {
                  claimCollateral(id);
                }}
              >
                Liquidate borrower
              </Button>
            }
            {viewType == "owner" &&
              <Button
                size="big"
                className={classes.rentButton}
                onClick={() => {
                  putOnMarket(id);
                }}
              >
                Rent out
              </Button>
            }
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ItemCard;
