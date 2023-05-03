import { SQSEvent } from "aws-lambda";
import { snsClient } from "src/clients/SNSClient";
import { PublishCommand } from "@aws-sdk/client-sns";
import { formatJSONResponse } from "@libs/api-gateway";
import { createNewProduct } from "src/services/productService";;
import { productSchema } from "src/functions/createProduct/validationSchema";


export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    console.log(`Lambda function 'catalogBatchProcess' invoked with event: ${JSON.stringify(event)}`);
    for (const record of event.Records) {
      const parsedRecord = JSON.parse(record.body);
      const { title, description, price, count } = parsedRecord;
      const { error } = productSchema.validate(parsedRecord);
      if (error) {
        return formatJSONResponse({ error: error.message }, 400);
      }

      const createdProductId = await createNewProduct(parsedRecord);

      await snsClient.send(
        new PublishCommand({
          Subject: "New product created",
          Message: JSON.stringify({ title, description, price: parseInt(price), count: parseInt(count), id: createdProductId }),
          TopicArn: process.env.SNS_ARN,
        })
      )
    };
  } catch (error) {
    return formatJSONResponse({ error: error.message }, 500);
  }
};