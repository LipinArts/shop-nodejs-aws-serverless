import type { NotValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from "@libs/lambda";
import { getAllProducts } from "src/services/productService";

export const getProductsList: NotValidatedEventAPIGatewayProxyEvent = async () => {
  try {
    console.log(`Lambda function 'getProductsList' invoked`);
    const products = await getAllProducts();
    return formatJSONResponse(products);
  } catch (error) {
    return formatJSONResponse({ error: error }, 500);
  }
};

export const main = middyfy(getProductsList);
