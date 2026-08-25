import type {
    Product,
    ProductsResponse
} from "./types";

const PRODUCTS_API =
    "https://dummyjson.com/products";


/* =========================
   FETCH 15 PRODUCTS
========================= */

export async function fetchProducts(): Promise<Product[]> {

    const response = await fetch(
        `${PRODUCTS_API}?limit=15`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch products"
        );
    }

    const data: ProductsResponse =
        await response.json();

    return data.products;
}


/* =========================
   UPDATE PRODUCT
========================= */

export async function updateProduct(
    productId: number,
    product: {
        title: string;
        price: number;
        stock: number;
    }
): Promise<Product> {

    const response = await fetch(
        `${PRODUCTS_API}/${productId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(product)
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to update product"
        );
    }

    const data: Product =
        await response.json();

    return data;
}