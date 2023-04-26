import { handlerPath } from "@libs/handler-resolver";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: process.env.S3_BUCKET_NAME,
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: "uploaded/" }],
        existing: true
      },
    },
  ],
};
