import { SQSClient } from "@aws-sdk/client-sqs";
import * as dotenv from "dotenv";
dotenv.config();

export const sqsClient = new SQSClient({ region: process.env.REGION });