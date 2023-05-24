import { handlerPath } from "@libs";
import * as dotenv from "dotenv";
dotenv.config();

export const basicAuthorizer = {
  handler: `${handlerPath(__dirname)}/handler.basicAuthorizer`,
};
