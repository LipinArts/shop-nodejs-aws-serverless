import { SNSClient } from "@aws-sdk/client-sns";
import * as dotenv from "dotenv";
dotenv.config();

export const snsClient = new SNSClient({ region: process.env.REGION });