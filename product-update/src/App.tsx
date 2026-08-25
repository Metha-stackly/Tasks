import { useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    fetchProduct,
    updateProduct,
} from "./api";

function App() {
    const queryClient = useQueryClient();

    const productId = 1;

    const [isEditing, setIsEditing] = useState(false);

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    /* =========================
       GET PRODUCT
    ========================= */

    const {
        data: product,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => fetchProduct(productId),
    });

    /* =========================
       UPDATE PRODUCT
    ========================= */

    const {
        mutate: updateProductMutation,
        isPending: isUpdating,
        isError: isUpdateError,
        error: updateError,
    } = useMutation({

        mutationFn: () =>
            updateProduct(productId, {
                title: productName.trim(),
                price: Number(price),
                stock: Number(stock),
            }),

        onSuccess: async (updatedProduct) => {

            setSuccessMessage(
                "Product updated successfully!"
            );

            setIsEditing(false);

            /*
             * Refresh the product query.
             * This is required by the task.
             */
            await queryClient.invalidateQueries({
                queryKey: ["product", productId],
            });

            /*
             * DummyJSON is a mock API and does not
             * permanently save the PUT request.
             *
             * Therefore, put the returned updated
             * product back into the cache so the
             * updated values remain visible.
             */
            queryClient.setQueryData(
                ["product", productId],
                updatedProduct
            );
        },
    });

    /* =========================
       LOADING
    ========================= */

    if (isLoading) {
        return (
            <div className="message">
                Loading product...
            </div>
        );
    }

    /* =========================
       ERROR
    ========================= */

    if (isError) {
        return (
            <div className="message error">
                {error instanceof Error
                    ? error.message
                    : "Failed to load product"}
            </div>
        );
    }

    if (!product) {
        return (
            <div className="message error">
                Product not found
            </div>
        );
    }

    /* =========================
       EDIT BUTTON
    ========================= */

    const handleEdit = () => {
        setProductName(product.title);
        setPrice(String(product.price));
        setStock(String(product.stock));

        setSuccessMessage("");

        setIsEditing(true);
    };

    /* =========================
       FORM SUBMIT
    ========================= */

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !productName.trim() ||
            price === "" ||
            stock === ""
        ) {
            return;
        }

        updateProductMutation();
    };

    return (
        <main className="page">

            <div className="product-container">

                <h1>
                    Product Update
                </h1>

                <p className="description">
                    Update product information
                </p>

                {/* SUCCESS */}

                {successMessage && (
                    <div className="message success">
                        {successMessage}
                    </div>
                )}

                {/* UPDATE ERROR */}

                {isUpdateError && (
                    <div className="message error">
                        {updateError instanceof Error
                            ? updateError.message
                            : "Failed to update product"}
                    </div>
                )}

                {/* PRODUCT LIST */}

                <section className="product-list">

                    <div className="product-card">

                        <div className="product-info">

                            <h2>
                                {product.title}
                            </h2>

                            <div className="product-details">

                                <span>
                                    Price: ${product.price}
                                </span>

                                <span>
                                    Category: {product.category}
                                </span>

                                <span>
                                    Stock: {product.stock}
                                </span>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="edit-button"
                            onClick={handleEdit}
                        >
                            Edit
                        </button>

                    </div>

                </section>

                {/* EDIT FORM */}

                {isEditing && (
                    <section className="edit-section">

                        <h2>
                            Edit Product
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="edit-form"
                        >

                            {/* PRODUCT NAME */}

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

                            {/* PRICE */}

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

                            {/* STOCK */}

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

                            {/* UPDATE */}

                            <button
                                type="submit"
                                className="update-button"
                                disabled={isUpdating}
                            >
                                {isUpdating
                                    ? "Updating..."
                                    : "Update Product"}
                            </button>

                        </form>

                    </section>
                )}

            </div>

        </main>
    );
}

export default App;