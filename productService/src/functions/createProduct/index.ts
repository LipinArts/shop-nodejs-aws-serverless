import { handlerPath } from "@libs/handler-resolver";
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      http: {
        method: "post",
        path: "products",
        cors: true,
        request: {
          schemas: {
            "application/json": schema,
          }
        },
      },
    },
  ],
};
