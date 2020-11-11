import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Decimal from "decimal.js";
import React from "react";

type Deal = {
  id: string;
};

type SKU = {
  id: string;
  name: string;
  adjustedPrice: string;
  listPrice: string;
  quantity: string;
  defaultQuantity: string;
  adjustedMonthlyPrice: string;
  monthlyPrice: string;
  adjustedNetPrice: string;
  netPrice: string;
  adjustedAnnualPrice: string;
  annualPrice: string;
};

interface SKURowProps {
  deal: Deal;
  sku: SKU;
}

const calculatePercentage = (
  base: string | number = 0,
  adjustedBase: string | number,
) => {
  // divide by 0 is OK but must be checked using the `!isFinite` before return
  return new Decimal(base)
    .minus(adjustedBase ?? base)
    .div(base)
    .times(-1)
    .toDecimalPlaces(2)
    .toNumber();
};

const updateURL = (dealId: string) =>
  `http://localhost:5001/deal-api-ae7e6/us-west4/app/${dealId}/update`;
const deleteURL = (dealId: string) =>
  `http://localhost:5001/deal-api-ae7e6/us-west4/app/${dealId}/remove`;

export const SKURow = ({ deal, sku }: SKURowProps) => {
  const [price, setPrice] = React.useState(sku?.adjustedPrice ?? sku.listPrice);
  const [quantity, setQuantity] = React.useState(
    sku?.quantity ?? sku.defaultQuantity,
  );
  const [priceLock, setPriceLock] = React.useState(false);
  const [quantityLock, setQuantityLock] = React.useState(false);

  const handleDelete = () => {
    fetch(deleteURL(deal.id), {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(sku),
    });
  };

  const handleListPriceChange = (value: string) => {
    setPrice(value);
    fetch(updateURL(deal.id), {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        id: sku.id,
        property: "adjustedPrice",
        value,
      }),
    });
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    fetch(updateURL(deal.id), {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        id: sku.id,
        property: "quantity",
        value,
      }),
    });
  };

  React.useEffect(() => {
    if (!priceLock) {
      setPrice(sku?.adjustedPrice ?? sku.listPrice);
    }
    if (!quantityLock) {
      setQuantity(sku?.quantity ?? sku.defaultQuantity);
    }
  }, [priceLock, quantityLock, sku]);

  return (
    <TableRow key={sku.id}>
      <TableCell align="left">{sku.name}</TableCell>
      <TableCell align="right">
        <FormControl fullWidth>
          <TextField
            value={price}
            size="small"
            onFocus={() => setPriceLock(true)}
            onChange={(e) => handleListPriceChange(e.target.value)}
            onBlur={() => setPriceLock(false)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            margin="dense"
          />
          {/* <FormHelperText>
            {`Dev: ${calculatePercentage(sku.listPrice, sku.adjustedPrice) *
              100}%`}
          </FormHelperText> */}
        </FormControl>
      </TableCell>
      <TableCell align="right">
        <FormControl fullWidth>
          <TextField
            fullWidth
            type="number"
            onFocus={() => setQuantityLock(true)}
            onChange={(e) => handleQuantityChange(e.target.value)}
            onBlur={() => setQuantityLock(false)}
            value={quantity}
            size="small"
            margin="dense"
          />
        </FormControl>
      </TableCell>
      <TableCell align="right">
        <Typography>
          ${sku?.adjustedMonthlyPrice ?? sku.monthlyPrice}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>${sku?.adjustedAnnualPrice ?? sku.annualPrice}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>${sku?.adjustedNetPrice ?? sku.netPrice}</Typography>
      </TableCell>
      <TableCell align="left">
        <IconButton
          color="secondary"
          aria-label="delete"
          onClick={handleDelete}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
