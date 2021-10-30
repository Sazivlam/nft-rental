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
import { Grid, Container, Paper } from "@material-ui/core";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import NftContract from "../../abis/nft.json";
import addresses from "../../constants/contracts";
import { getUsername } from "../../utils/getUsernameFromAddress";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#080808",
    maxWidth: 345,
    borderRadius: 8,
    color: "#f1ffe3",
    maxHeight: 555,
    // "&:hover": {
    //   boxShadow:
    //     "0 1px 3px rgba(255,255,255,0.12), 0 1px 3px rgba(255,255,255,0.24)",
    //   transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    // },
  },
  media: {
    height: 220,
    width: "100%",
    borderRadius: 5,
    // transition: "transform 0.15s ease-in-out",
    // "&:hover": {
    //   transform: "scale3d(1.05, 1.05, 1)",
    // },
  },
  nftInfoContainer: {
    marginTop: 10,
  },
  nftOwnerContainer: {
    marginLeft: 10,
    marginBottom: 10
  },
  rentButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  rentButton: {
    // position: "relative",
    // justifyContent: 'center',

    color: "#FFF",
    backgroundColor: "#080808",
    height: 35,
    width: "90%",
    position: "relative",
    // top: 7,
    // marginLeft: 120,
    // marginRight: 10,
    // marginBottom: 12,
    borderRadius: 15,
    border: "4px solid",
    borderColor: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#FFF",
      borderColor: "#000",
      color: "#000",
    },
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

const MarketCard = ({
  name,
  frequency,
  owner,
  imgUrl,
  price,
  auctionPrice,
  type,
  isBiddable,
  isOnSale,
  id,
  isProfile,
}) => {
  const classes = useStyles();
  // var owner = ;

  const [usernameToBeShown, setUsernameToBeShown] = React.useState(
    owner.slice(0, 4) + "..." + owner.slice(owner.length - 2, owner.length)
  );

  React.useEffect(async () => {
    var nft_contract_interface = new window.web3.eth.Contract(
      NftContract.abi,
      addresses.NFT_CONTRACTS_ADDRESS
    );

    getUsername(nft_contract_interface, owner).then((data) => {
      setUsernameToBeShown(data.username);
    });
  }, [window.web3.eth]);

  return (
    <Card className={classes.root} variant="outlined">
      <Grid container>
        <Grid item xs>
          <Grid container>
            <CardMedia
              className={classes.media}
              image={imgUrl}
              title={name}
            />
          </Grid>
          <Grid container direction="column" style={{ marginTop: 10 }}>
            <Grid item style={{ marginLeft: 15 }}>
              <Typography gutterbottom="true" variant="h6" component="h1">
                {name}
              </Typography>
            </Grid>
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
                  <MyTooltip title={window.web3.utils.fromWei(price).toString()} arrow>
                    <Typography variant="caption" style={{
                      verticalAlign: "middle"
                    }}>
                      Daily price [ETH]: {isOnSale ? window.web3.utils.fromWei(price.toString()).slice(0, 5) + " Ξ" : "-"}
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
                  <MyTooltip title={window.web3.utils.fromWei(auctionPrice).toString()} arrow>
                    <Typography variant="caption" style={{
                      verticalAlign: "middle"
                    }}>
                      Max duration [days]: {isBiddable ? window.web3.utils.fromWei(auctionPrice.toString()).slice(0, 5) + " Ξ" : "-"}
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
                  <MyTooltip title={window.web3.utils.fromWei(auctionPrice).toString()} arrow>
                    <Typography variant="caption" style={{
                      verticalAlign: "middle"
                    }}>
                      Collateral [ETH]: {isBiddable ? window.web3.utils.fromWei(auctionPrice.toString()).slice(0, 5) + " Ξ" : "-"}
                    </Typography>
                  </MyTooltip>
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: 10, marginBottom: 5 }}>
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
                Owner:
              </Typography>
              <Button
                size="small"
                className={classes.myButton}
                onClick={() => {
                  isProfile
                    ? (window.location.href = owner)
                    : (window.location.href = "profile/" + owner);
                }}
              >
                {usernameToBeShown}
              </Button>
            </div>
          </Grid>
          <Grid container className={classes.rentButtonContainer}>

            <Button
              size="big"
              className={classes.rentButton}
              onClick={() => {
                isProfile
                  ? (window.location.href = owner)
                  : (window.location.href = "profile/" + owner);
              }}
            >
              Return
            </Button>

          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default MarketCard;
