import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import * as dotenv from "dotenv";
dotenv.config();

export const importProductsFile = async (event: APIGatewayProxyEvent) => {
  try {
    console.log(`Lambda function 'importProductsFile' invoked with event: ${JSON.stringify(event)}`);
    const client = new S3Client({ region: process.env.REGION });
    const { name: fileName } = event.queryStringParameters;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploaded/${fileName}`,
    };
    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    return formatJSONResponse(url);
  } catch (error) {
    return formatJSONResponse({ error: error }, 500);
  }
};
