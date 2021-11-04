import React from "react";
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

import MarketCardList from "./marketCardList";

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

const MarketTab = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const items = useRecoilValue(allItems);
  const heads = useRecoilValue(getHeads);
  const middles = useRecoilValue(getMiddles);
  const bottoms = useRecoilValue(getBottoms);
  const allItemsFiltered = useRecoilValue(getAllItemsFiltered);

  // console.log("allItems", items);
  // console.log("heads", heads);
  // console.log("middles", middles);
  // console.log("bottoms", bottoms);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      {allItemsFiltered.length == 0 ? (
        <div>No Items Found</div>
      ) : (
        <>
          <TabPanel value={value} index={0}>
            {allItemsFiltered.length ? <MarketCardList marketCards={allItemsFiltered} /> : <>No Items Found</>}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {heads.length ? <MarketCardList marketCards={heads} isProfile={false} /> : <>No Items Found</>}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {middles.length ? <MarketCardList marketCards={middles} isProfile={false} />: <>No Items Found</>}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {bottoms.length ? <MarketCardList marketCards={bottoms} isProfile={false} />: <>No Items Found</>}
          </TabPanel>
        </>
      )}
    </div>
  );
  return;
};

export default MarketTab;

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