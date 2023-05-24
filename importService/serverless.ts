import type { AWS } from "@serverless/typescript";
import importProductsFile from "@functions/importProductsFile";
import importFileParser from "@functions/importFileParser";

import * as dotenv from "dotenv";
dotenv.config();

const serverlessConfiguration: AWS = {
  service: "importservice",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
      SQS_ARN: process.env.SQS_ARN,
      SQS_URL: process.env.SQS_URL,
      AUTHORIZER_ARN: process.env.AUTHORIZER_ARN
    },
    iam: {
      role: {
        statements: [{
          Effect: "Allow",
          Action: ["s3:*"],
          Resource: [
            `arn:aws:s3:::${process.env.S3_BUCKET_NAME}`,
            `arn:aws:s3:::${process.env.S3_BUCKET_NAME}/*`,
          ],
        },
        {
          Effect: "Allow",
          Action: ["sqs:*"],
          Resource: [
            process.env.SQS_ARN
          ],
        }]
      }
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      GatewayResponseUnauthorized: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
          },
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          },
          ResponseType: "UNAUTHORIZED",
          StatusCode: "401"
        }
      },
      GatewayResponseAccesDenied: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
          },
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          },
          ResponseType: "ACCESS_DENIED",
          StatusCode: "403"
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
