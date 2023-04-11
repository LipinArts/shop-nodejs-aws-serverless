import type { NotValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from "@libs/lambda";
import { getProductById } from "src/services/productService";

export const getProductsById: NotValidatedEventAPIGatewayProxyEvent = async (event) => {
  try {
    const product = await getProductById(event.pathParameters.productId);
    if (!product) {
      return formatJSONResponse({ message: "Product not found" }, 404);
    }
    return formatJSONResponse(product);
  } catch (error) {
    return formatJSONResponse({ message: error }, 500);
  }
};

export const main = middyfy(getProductsById);
