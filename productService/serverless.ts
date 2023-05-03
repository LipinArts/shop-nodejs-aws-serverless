import type { AWS } from "@serverless/typescript";
import getProductsList from "@functions/getProductsList";
import getProductById from "@functions/getProductById";
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";

import * as dotenv from "dotenv";
dotenv.config();

const serverlessConfiguration: AWS = {
  service: "productService",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-auto-swagger"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCTS_TABLE_NAME: process.env.PRODUCTS_TABLE_NAME,
      STOCKS_TABLE_NAME: process.env.STOCKS_TABLE_NAME,
      SQS_URL: { Ref: "SQSQueue" },
      SNS_ARN: { Ref: "SNSTopic" }
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:*"],
            Resource: [
              process.env.PRODUCTS_TABLE,
              process.env.STOCKS_TABLE,
            ],
          },
          {
            Effect: "Allow",
            Action: ["sqs:*"],
            Resource: {
              "Fn::GetAtt": ["SQSQueue", "Arn"]
            }
          },
          {
            Effect: "Allow",
            Action: ["sns:*"],
            Resource: {
              Ref: "SNSTopic"
            }
          }
        ],
      },
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: process.env.SQS_CATALOG_ITEMS_NAME
        }
      },
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: process.env.SNS_CREATE_PRODUCT_TOPIC_NAME
        }
      },
      createProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          Endpoint: process.env.MAIN_EMAIL,
          TopicArn: { Ref: "SNSTopic" },
        },
      },
      filteredPolicySubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: process.env.ADDITIONAL_EMAIL,
          Protocol: "email",
          TopicArn: { Ref: "SNSTopic" },
          FilterPolicyScope: "MessageBody",
          FilterPolicy: { "price": [{ "numeric": [">=", 100] }] }
        }
      },
    }
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
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
    autoswagger: {
      apiType: "http",
      typefiles: ["./src/types/index.ts"],
      basePath: "/dev",
    },
  },
};

module.exports = serverlessConfiguration;
