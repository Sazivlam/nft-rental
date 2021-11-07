import React from "react";

import { makeStyles, GridList, GridListTile } from "@material-ui/core";
import ItemCard from "./itemCard";

import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  gridList: {
    padding: "auto",
    margin: "auto",
  },
  gridListTile: {
    height: "auto !important", // remove this and increase 505 height in cellHeight in GridList as alternative
  },
}));

const ItemCardList = (props) => {
  const classes = useStyles();
  // console.log(props.marketCards);

  const getGridListCols = () => {
    if (isWidthUp("xl", props.width)) {
      return 4;
    }

    if (isWidthUp("lg", props.width)) {
      return 3;
    }

    if (isWidthUp("md", props.width)) {
      return 2;
    }
    if (isWidthUp("sm", props.width)) {
      return 2;
    }

    return 1;
  };

  return (
    <GridList
      spacing={15}
      cellHeight={505}
      cols={getGridListCols()}
      className={classes.gridList}
    >

      {props.itemCards.map((cardItem, index) => {
        if (cardItem === undefined) {
          return
        }
        // console.log(currentNftData.lender.toString().toLowerCase())
        // console.log(zeroAddress)
        // console.log(cardItem)
        // console.log(
        //   cardItem.name,
        //   cardItem.rarity,
        //   cardItem.cid,
        //   cardItem.sellPrice,
        //   cardItem.maxBid,
        //   cardItem.clothType
        // );
        return (
          <GridListTile key={index} className={classes.gridListTile}>
            <ItemCard
              name={cardItem.name}
              owner={cardItem.owner}
              imageUrl={"images/" + cardItem.imageUrl}
              dailyPrice={cardItem.dailyPrice}
              collateral={cardItem.collateral}
              rentSeconds={cardItem.rentSeconds}
              rentEndTime={cardItem.rentEndTime}
              id={cardItem.id}
              isProfile={props.isProfile}
              viewType={cardItem.viewType}
              lender={cardItem.lender}
            />
          </GridListTile>
        );
      })}
    </GridList>
  );
};

{
  /* <GridList cellHeight={180} className={classes.gridList}>
  <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
    <ListSubheader component="div">December</ListSubheader>
  </GridListTile>
  {tileData.map((tile) => (
    <GridListTile key={tile.img}>
      <img src={tile.img} alt={tile.title} />
      <GridListTileBar
        title={tile.title}
        subtitle={<span>by: {tile.author}</span>}
        actionIcon={
          <IconButton
            aria-label={`info about ${tile.title}`}
            className={classes.icon}
          >
            <InfoIcon />
          </IconButton>
        }
      />
    </GridListTile>
  ))}
</GridList>; */
}

export default withWidth()(ItemCardList);
