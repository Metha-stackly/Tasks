import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "./api";

function Products() {

    // Stores the text entered in the search box
    const [searchTerm, setSearchTerm] = useState("");

    // Stores the selected category
    const [selectedCategory, setSelectedCategory] = useState("all");

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts
    });

    if (isLoading) {
        return (
            <div className="message">
                Loading products...
            </div>
        );
    }
if (isFetching) {
    return (
        
        <div className="message">
            Loading products...
        </div>
    );
}
    if (isError) {
        return (
            <div className="message error">
                Error: {error.message}
            </div>
        );
    }

    // Get unique categories from products
    const categories = [
        ...new Set(data?.map((product) => product.category))
    ];

    // Search and filter products
    const filteredProducts = data?.filter((product) => {

        const matchesSearch = product.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="products-page">

            <h1>Product Explorer</h1>

            {/* Search and Filter */}
            <div className="controls">

                <input
                    type="text"
                    placeholder="Search products by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={selectedCategory}
                    onChange={(e) =>
                        setSelectedCategory(e.target.value)
                    }
                >
                    <option value="all">
                        All Categories
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>
                    ))}
                </select>

    <button
        className="refresh-button"
        onClick={() => refetch()}
    
    >

        Refresh Products
    </button>

            </div>

            {/* Products */}

            {filteredProducts && filteredProducts.length === 0 ? (

                <p className="no-products">
                    No Products Found
                </p>

            ) : (

                <div className="products-grid">

                    {filteredProducts?.map((product) => (

                        <div
                            className="product-card"
                            key={product.id}
                        >

                            <img
                                src={product.thumbnail}
                                alt={product.title}
                            />

                            <h3>{product.title}</h3>

                            <p>
                                Category: {product.category}
                            </p>

                            <p>
                                Price: ${product.price}
                            </p>

                            <p>
                                Rating: {product.rating}
                            </p>

                            <p>
                                Stock: {product.stock}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Products;