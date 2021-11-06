import React, { useMemo, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import FaceIcon from "@material-ui/icons/Face";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import PropTypes from "prop-types";

import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import {
  getMyUsername,
  getHeads,
  getMiddles,
  getBottoms,
  getAllItemsFiltered,
} from "../../recoils/selectors";
import {
  myUsername,
  myAddress,
  allItems,
  isBiddable,
  isOnSale,
  rarityLevel,
} from "../../recoils/atoms";

import {
  Typography,
  Tabs,
  Tab,
  AppBar,
  Box,
  Button,
  Grid,
  Container,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  IconButton,
  Switch,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import ItemCardList from "./itemCardList";

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const StyledTabs = withStyles({
  indicator: {
    top: 5,
    bottom: 5,
    marginLeft: 4,
    height: "80%",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      borderRadius: 10,
      width: "100%",
      backgroundColor: "#000",
      opacity: 0.15,
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#000000",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
    },
    alignSelf: "center",
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const ItemTab = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const items = useRecoilValue(allItems);  
  // const heads = useRecoilValue(getHeads);
  // const middles = useRecoilValue(getMiddles);
  // const bottoms = useRecoilValue(getBottoms);
  // const allItemsFiltered = useRecoilValue(getAllItemsFiltered);

  const [marketRariryLevel, setMarketRariryLevel] = useRecoilState(rarityLevel);

  const [isOwner, setIsOwner] = useState(false); //useRecoilState(isBiddable)
  const [isRented, setIsRented] = useState(false); //useRecoilState(isOnSale)
  const [isRentedOut, setIsRentedOut] = useState(false); //useRecoilState(isOnSale)

  const getDisplayedItems = useMemo(() => {
    if (isOwner || isRented || isRentedOut) {
      let displayedItems = [];
  
      if (isOwner) {
        const ownerItems = items.filter(item => item?.viewType === 'owner');
        displayedItems = displayedItems.concat(ownerItems);
      }
      if (isRented) {
        const rentedItems = items.filter(item => item?.viewType === 'rented');
        displayedItems = displayedItems.concat(rentedItems);
      }
      if (isRentedOut) {
        const rentedOutItems = items.filter(item => item?.viewType === 'rentedOut');
        displayedItems = displayedItems.concat(rentedOutItems);
      }
  
      return displayedItems;
    }

    return items;
  }, [items, isOwner, isRented, isRentedOut]);

  // console.log("allItems", items);
  // console.log("heads", heads);
  // console.log("middles", middles);
  // console.log("bottoms", bottoms);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div style={{ marginTop: 20, marginLeft: 45, marginRight: 60 }}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={10}>
            <Grid
              container
              direction="column"
              justify="space-between"
              alignItems="flex-start"
            >
              <Grid item>Filter By:</Grid>
              <Grid item>
                <FormGroup row style={{ marginLeft: -16 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isOwner}
                        onChange={() => {
                          setIsOwner(!isOwner);
                        }}
                        name="Mine"
                      />
                    }
                    label="Mine"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isRented}
                        onChange={() => {
                          setIsRented(!isRented);
                        }}
                        name="Rented"
                      />
                    }
                    label="Rented"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isRentedOut}
                        onChange={() => {
                          setIsRentedOut(!isRentedOut);
                        }}
                        name="Rented out"
                      />
                    }
                    label="Rented out"
                    labelPlacement="start"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
      </div>
      {getDisplayedItems.length == 0 ? (
        <div>No Items Found</div>
      ) : (
        <>
          <TabPanel value={value} index={0}>
            {getDisplayedItems.length ? <ItemCardList itemCards={getDisplayedItems} /> : <>No Items Found</>}
          </TabPanel>
        </>
      )}
    </div>
  );
  return;
};

export default ItemTab;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
