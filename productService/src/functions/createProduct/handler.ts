import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { createNewProduct } from "src/services/productService";
import { productSchema } from "./validationSchema";

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log(`Lambda function 'createProduct' invoked with event: ${JSON.stringify(event)}`);
    const parsedBody = JSON.parse(event.body);
    // Validate the product data using Joi
    const { error } = productSchema.validate(parsedBody);
    if (error) {
      return formatJSONResponse({ error: error.message }, 400);
    }
    const createdProductId = await createNewProduct(parsedBody);
    return formatJSONResponse({ id: createdProductId });
  } catch (error) {
    return formatJSONResponse({ error: error.message }, 500);
  }
};

export const main = middyfy(createProduct);
