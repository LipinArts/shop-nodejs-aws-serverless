import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { createNewProduct } from "src/services/productService";
import schema from './schema';
import { productSchema } from './validationSchema';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    console.log(`Lambda function 'createProduct' invoked with event: ${JSON.stringify(event)}`);
    // Validate the product data using Joi
    const { error } = productSchema.validate(event.body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.message })
      };
    }

    return formatJSONResponse({ id: await createNewProduct(event.body) });
  } catch (error) {
    return formatJSONResponse({ error: error.message }, 500);
  }
};

export const main = middyfy(createProduct);
