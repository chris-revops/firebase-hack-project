import { getRandomName } from "../DealEditor/getRandomName";
import { SKUModel } from "../models/SKUModel";

export const createURL = () => `${baseURL}/create`;

const baseURL = "http://localhost:5001/deal-api-ae7e6/us-west4/app";

export const createDeal = async (type = "free") => {
  const res = await fetch(createURL(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      name: getRandomName(),
      skus: Options[type],
    }),
  });

  const json = await res.json();
  return json.deal._id;
};

const randomPrice = (): string => {
  return String(Math.floor(Math.random() * 1000));
};

type SKUOptions = {
  [key: string]: SKUModel[];
};

const Options: SKUOptions = {
  free: [
    new SKUModel({ name: "10 users included", listPrice: randomPrice() }),
    new SKUModel({ name: "2 GB of storage", listPrice: randomPrice() }),
    new SKUModel({ name: "Help center access", listPrice: randomPrice() }),
    new SKUModel({ name: "Email support", listPrice: randomPrice() }),
  ],
  pro: [
    new SKUModel({ name: "20 users included", listPrice: randomPrice() }),
    new SKUModel({ name: "10 GB of storage", listPrice: randomPrice() }),
    new SKUModel({ name: "Help center access", listPrice: randomPrice() }),
    new SKUModel({ name: "Priority email support", listPrice: randomPrice() }),
  ],
  enterprise: [
    new SKUModel({ name: "50 users included", listPrice: randomPrice() }),
    new SKUModel({ name: "30 GB of storage", listPrice: randomPrice() }),
    new SKUModel({ name: "Help center access", listPrice: randomPrice() }),
    new SKUModel({ name: "Phone & email support", listPrice: randomPrice() }),
  ],
};
