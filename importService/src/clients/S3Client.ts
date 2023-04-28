import { S3Client } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
dotenv.config();

export const s3Client = new S3Client({ region: process.env.REGION });