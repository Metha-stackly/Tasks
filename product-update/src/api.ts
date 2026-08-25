import type { Product } from "./types";

export async function fetchProduct(
    productId: number
): Promise<Product> {
    const response = await fetch(
        `https://dummyjson.com/products/${productId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }

    return response.json();
}

export async function updateProduct(
    productId: number,
    product: {
        title: string;
        price: number;
        stock: number;
    }
): Promise<Product> {
    const response = await fetch(
        `https://dummyjson.com/products/${productId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update product");
    }

    return response.json();
}