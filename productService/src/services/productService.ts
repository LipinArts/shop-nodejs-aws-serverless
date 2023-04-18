import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "src/clients/dynamodDBClient";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Product, Stock } from "src/types";
import * as productRepository from "src/data-access/productRepository";
import * as stockRepository from "src/data-access/stockRepository";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
dotenv.config();

export const getAllProducts = async (): Promise<Product[]> => {
    const products = await productRepository.getAll();
    const stocks = await stockRepository.getAll();

    return products.map(product => {
        const stock: Stock = stocks.find(stock => stock.product_id === product.id)
        return ({ ...product, count: stock?.count })
    });
};

export const getProductById = async (productId: string): Promise<Product> => {
    const product = await productRepository.getById(productId);
    const stock = await stockRepository.getById(productId);

    if (product && stock) {
        return ({ ...product, count: stock.count });
    }
    return null;
};

export const createNewProduct = async (body: any): Promise<string> => {
    const { title, description, price, count } = body;
    const id = uuidv4();
    await ddbClient.send(
        new TransactWriteItemsCommand({
            TransactItems: [
                { Put: { TableName: process.env.PRODUCTS_TABLE_NAME, Item: marshall({ id, title, description, price }) } },
                { Put: { TableName: process.env.STOCKS_TABLE_NAME, Item: marshall({ product_id: id, count }) } }
            ]
        })
    );

    return id;
};