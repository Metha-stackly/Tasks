import { useState } from "react";

import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import {
    fetchProducts,
    updateProduct
} from "./api";

import type { Product } from "./types";

import "./App.css";


function App() {

    const queryClient =
        useQueryClient();


    /* =========================
       SELECTED PRODUCT
    ========================= */

    const [selectedProductId, setSelectedProductId] =
        useState<number | null>(null);


    /* =========================
       FORM STATE
    ========================= */

    const [productName, setProductName] =
        useState("");

    const [price, setPrice] =
        useState("");

    const [stock, setStock] =
        useState("");


    const [successMessage, setSuccessMessage] =
        useState("");


    /* =========================
       FETCH ALL PRODUCTS
    ========================= */

    const {
        data: products,
        isLoading,
        isError,
        error
    } = useQuery<Product[], Error>({

        queryKey: ["products"],

        queryFn: fetchProducts
    });


    /* =========================
       UPDATE PRODUCT
    ========================= */

    const {
        mutate: updateProductMutation,
        isPending: isUpdating,
        isError: isUpdateError,
        error: updateError
    } = useMutation<
        Product,
        Error,
        {
            productId: number;
            title: string;
            price: number;
            stock: number;
        }
    >({

        mutationFn: (productData) =>
            updateProduct(
                productData.productId,
                {
                    title: productData.title,
                    price: productData.price,
                    stock: productData.stock
                }
            ),

        onSuccess: async (updatedProduct) => {

            /*
             * Update the selected product
             * immediately in the cache.
             */

            queryClient.setQueryData<Product[]>(
                ["products"],
                (oldProducts = []) =>
                    oldProducts.map((product) =>
                        product.id === updatedProduct.id
                            ? {
                                ...product,
                                ...updatedProduct
                            }
                            : product
                    )
            );


            /*
             * Required by Task 3.
             */

            await queryClient.invalidateQueries({
                queryKey: ["products"],
                refetchType: "none"
            });


            setSuccessMessage(
                "Product updated successfully!"
            );

            setSelectedProductId(null);
        }
    });


    /* =========================
       LOADING
    ========================= */

    if (isLoading) {

        return (
            <div className="page-center">

                <div className="loader"></div>

                <p>
                    Loading products...
                </p>

            </div>
        );
    }


    /* =========================
       ERROR
    ========================= */

    if (isError) {

        return (
            <div className="page-center error-page">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error.message}
                </p>

            </div>
        );
    }


    /* =========================
       EDIT PRODUCT
    ========================= */

    const handleEdit = (
        product: Product
    ) => {

        setSelectedProductId(product.id);

        setProductName(product.title);

        setPrice(String(product.price));

        setStock(String(product.stock));

        setSuccessMessage("");
    };


    /* =========================
       SUBMIT UPDATE
    ========================= */

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        if (
            selectedProductId === null ||
            !productName.trim() ||
            price === "" ||
            stock === ""
        ) {
            return;
        }


        updateProductMutation({

            productId: selectedProductId,

            title: productName.trim(),

            price: Number(price),

            stock: Number(stock)
        });
    };


    return (

        <main className="app">

            <div className="container">


                {/* =========================
                    HEADER
                ========================= */}

                <header className="page-header">

                    <p className="eyebrow">
                        Product Management
                    </p>

                    <h1>
                        Product Update
                    </h1>

                    <p className="subtitle">
                        View and update products
                    </p>

                </header>


                {/* SUCCESS */}

                {successMessage && (

                    <div className="message success-message">

                        {successMessage}

                    </div>

                )}


                {/* UPDATE ERROR */}

                {isUpdateError && (

                    <div className="message error-message">

                        {updateError.message}

                    </div>

                )}


                {/* =========================
                    PRODUCT LIST
                ========================= */}

                <section className="product-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Product List
                            </h2>

                            <p>
                                All available products
                            </p>

                        </div>

                        <span className="product-count">
                            {products?.length ?? 0}
                        </span>

                    </div>


                    <div className="product-list">

                        {products?.map((product) => (

                            <article
                                className="product-card"
                                key={product.id}
                            >

                                <div className="product-info">

                                    <h3>
                                        {product.title}
                                    </h3>

                                    <div className="product-details">

                                        <span>
                                            Price: $
                                            {product.price}
                                        </span>

                                        <span>
                                            Category:{" "}
                                            {product.category}
                                        </span>

                                        <span>
                                            Stock:{" "}
                                            {product.stock}
                                        </span>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    className="edit-button"
                                    onClick={() =>
                                        handleEdit(product)
                                    }
                                >
                                    Edit
                                </button>

                            </article>

                        ))}

                    </div>

                </section>


                {/* =========================
                    EDIT FORM
                ========================= */}

                {selectedProductId !== null && (

                    <section className="edit-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Edit Product
                                </h2>

                                <p>
                                    Update product information
                                </p>

                            </div>

                        </div>


                        <form
                            className="edit-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Product Name */}

                            <div className="form-group">

                                <label htmlFor="productName">
                                    Product Name
                                </label>

                                <input
                                    id="productName"
                                    type="text"
                                    value={productName}
                                    onChange={(event) =>
                                        setProductName(
                                            event.target.value
                                        )
                                    }
                                    disabled={isUpdating}
                                />

                            </div>


                            {/* Price */}

                            <div className="form-group">

                                <label htmlFor="price">
                                    Price
                                </label>

                                <input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(event) =>
                                        setPrice(
                                            event.target.value
                                        )
                                    }
                                    disabled={isUpdating}
                                />

                            </div>


                            {/* Stock */}

                            <div className="form-group">

                                <label htmlFor="stock">
                                    Stock
                                </label>

                                <input
                                    id="stock"
                                    type="number"
                                    value={stock}
                                    onChange={(event) =>
                                        setStock(
                                            event.target.value
                                        )
                                    }
                                    disabled={isUpdating}
                                />

                            </div>


                            <button
                                type="submit"
                                className="update-button"
                                disabled={
                                    isUpdating ||
                                    !productName.trim() ||
                                    price === "" ||
                                    stock === ""
                                }
                            >

                                {isUpdating
                                    ? "Updating..."
                                    : "Update Product"
                                }

                            </button>

                        </form>

                    </section>

                )}

            </div>

        </main>
    );
}

export default App;