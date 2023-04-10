import { products } from "src/mocks/products";
import { Product } from "src/types";

export const getAllProducts = async (): Promise<Product[]> => await Promise.resolve(products);

export const getProductById = async (id: string): Promise<Product | null> => {
    const product = products.find(item => item.id === id);
    if (product) {
        return await Promise.resolve(product)
    }
    return await Promise.resolve(null);
};