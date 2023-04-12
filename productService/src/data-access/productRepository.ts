import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Product } from "src/types";
import { ddbClient } from "src/clients/dynamodDBClient";
import * as dotenv from "dotenv";
dotenv.config();

export const getAll = async (): Promise<Product[]> => {
    const result = await ddbClient.send(new ScanCommand({ TableName: process.env.PRODUCTS_TABLE_NAME }));
    return result.Items as Product[];
};

export const getById = async (productId: string): Promise<Product | undefined> => {
    const result = await ddbClient.send(new GetCommand({
        TableName: process.env.PRODUCTS_TABLE_NAME,
        Key: { "id": productId }
    }));
    return result.Item as Product;
};
