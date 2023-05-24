import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
      },
      authorizer: {
        name: "basicAuthorizer",
        arn: process.env.AUTHORIZER_ARN,
        identitySource: "method.request.header.Authorization",
        type: "token",
      },
    },
  ],
};
