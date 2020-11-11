import {
  AppBar,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";

import styled from "styled-components";
import { useParams } from "react-router-dom";
import { SKURow } from "../SKU/SKURow";
import { SKUModel } from "../models/SKUModel";
import { getRandomName } from "./getRandomName";

const firebaseConfig = {
  apiKey: "AIzaSyCuNKiJ-uwrnTcgV7Ujlk2UTILfqppq2Mk",
  authDomain: "deal-api-ae7e6.firebaseapp.com",
  databaseURL: "https://deal-api-ae7e6.firebaseio.com",
  projectId: "deal-api-ae7e6",
  storageBucket: "deal-api-ae7e6.appspot.com",
  messagingSenderId: "800885027289",
  appId: "1:800885027289:web:cada34263e0d892643a9c8",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const dealRef = db.collection("deals");

const DealWrapper = styled(Paper)`
  min-height: 90vh;
  padding: 1rem;
`;

const addSkuUrl = (dealId: string) =>
  `http://localhost:5001/deal-api-ae7e6/us-west4/app/${dealId}/add`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const DealEditor = () => {
  const classes = useStyles();

  const [currentDeal, setCurrentDeal] = React.useState<any | undefined>(
    undefined,
  );

  let { id } = useParams<{ id: string }>();
  React.useEffect(() => {
    let unsubscribe: any;
    if (id) {
      unsubscribe = dealRef.doc(id).onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
        const deal = doc.data();
        setCurrentDeal(deal);
      });
    }
    return () => {
      unsubscribe();
    };
  }, [id]);

  const addRandomSKU = () => {
    const newSKU = new SKUModel({
      name: getRandomName(),
      listPrice: String(Math.floor(Math.random() * 1000)),
    });
    fetch(addSkuUrl(id), {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(newSKU),
    });
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {currentDeal?.dealName ?? "Deal Name"}
          </Typography>
        </Toolbar>
      </AppBar>
      <DealWrapper elevation={3}>
        <div>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              style={{ margin: 8 }}
              label="Net Price"
              value={currentDeal?._netPrice ?? ""}
              variant="outlined"
            />
            <TextField
              style={{ margin: 8 }}
              label="Adjusted Net Price"
              value={currentDeal?._adjustedNetPrice ?? ""}
              variant="outlined"
            />
            <TextField
              style={{ margin: 8 }}
              label="Adjusted Monthly Price"
              value={currentDeal?._adjustedMonthlyPrice ?? ""}
              variant="outlined"
            />
            <TextField
              style={{ margin: 8 }}
              label="Adjusted Annual Price"
              value={currentDeal?._adjustedAnnualPrice ?? ""}
              variant="outlined"
            />
          </form>
        </div>
        <Typography variant="h6" className={classes.title}>
          SKUs
        </Typography>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Price</TableCell>
              <TableCell align="left">Quantity</TableCell>
              <TableCell align="right">Monthly Price</TableCell>
              <TableCell align="right">Annual Price</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentDeal?.skus?.map((sku: any) => (
              <SKURow key={sku.id} deal={{ id }} sku={sku} />
            ))}
          </TableBody>
        </Table>
        <br />
        <Button variant="contained" color="primary" onClick={addRandomSKU}>
          Add random SKU
        </Button>
      </DealWrapper>
    </Container>
  );
};
