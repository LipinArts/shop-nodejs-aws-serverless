import { ddbClient } from "../clients/dynamodDBClient";
import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { products } from "../mocks/products";
import { stocks } from "../mocks/stocks";

import * as dotenv from "dotenv";
dotenv.config();


const getProducts = () => {
  return products.map((product) => {
    return {
      PutRequest: {
        Item: {
          id: { S: product.id },
          title: { S: product.title },
          description: { S: product.description },
          price: { N: `${product.price}` },
        }
      }
    }
  })
};

const getStocks = () => {
  return stocks.map((stock) => {
    return {
      PutRequest: {
        Item: {
          product_id: { S: stock.product_id },
          count: { N: `${stock.count}` },
        }
      }
    }
  })
};

const seedData = async () => {
  await ddbClient.send(
    new BatchWriteItemCommand({
      RequestItems: {
        [process.env.PRODUCTS_TABLE_NAME]: getProducts(),
        [process.env.STOCKS_TABLE_NAME]: getStocks(),
      }
    })
  );
};

seedData();