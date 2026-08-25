export interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    stock: number;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}