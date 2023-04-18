import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Stock } from "src/types";
import { ddbClient } from "src/clients/dynamodDBClient";
import * as dotenv from "dotenv";
dotenv.config();

export const getAll = async (): Promise<Stock[]> => {
    const result = await ddbClient.send(new ScanCommand({ TableName: process.env.STOCKS_TABLE_NAME }));
    return result.Items as Stock[];
};

export const getById = async (productId: string): Promise<Stock | undefined> => {
    const result = await ddbClient.send(new GetCommand({
        TableName: process.env.STOCKS_TABLE_NAME,
        Key: { "product_id": productId }
    }));
    return result.Item as Stock;
};