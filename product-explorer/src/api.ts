import type { Product } from "./types";

interface ProductsResponse {
    products: Product[];
}

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(
        "https://dummyjson.com/products"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const data: ProductsResponse = await response.json();

    return data.products;
}