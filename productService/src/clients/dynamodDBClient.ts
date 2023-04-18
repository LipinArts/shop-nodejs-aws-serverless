import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import * as dotenv from "dotenv";
dotenv.config();

export const ddbClient = new DynamoDBClient({ region: process.env.REGION });