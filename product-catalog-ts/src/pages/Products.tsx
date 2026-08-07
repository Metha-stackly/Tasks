import { useState } from "react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/Product";
import { productData } from "../services/productData";

import "../styles/Products.css";

function Products() {

  const [products] = useState<Product[]>(productData);

  const [searchText, setSearchText] =
    useState<string>("");

  const [category, setCategory] =
    useState<string>("All");

  const [sortOrder, setSortOrder] =
    useState<string>("");

  let filteredProducts = products.filter((product) => {

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;

  });

  if (sortOrder === "LowToHigh") {

    filteredProducts.sort(
      (a, b) => a.price - b.price
    );

  }

  if (sortOrder === "HighToLow") {

    filteredProducts.sort(
      (a, b) => b.price - a.price
    );

  }

  return (

    <div className="products">

      <h1>Product Catalog</h1>

      <input
        type="text"
        placeholder="Search Product"
        value={searchText}
        onChange={(e) =>
          setSearchText(e.target.value)
        }
      />

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >

        <option value="All">
          All Categories
        </option>

        <option value="Electronics">
          Electronics
        </option>

        <option value="Accessories">
          Accessories
        </option>

        <option value="Furniture">
          Furniture
        </option>

      </select>

      <select
        value={sortOrder}
        onChange={(e) =>
          setSortOrder(e.target.value)
        }
      >

        <option value="">
          Sort By Price
        </option>

        <option value="LowToHigh">
          Low → High
        </option>

        <option value="HighToLow">
          High → Low
        </option>

      </select>

      <div className="product-grid">

        {filteredProducts.map((product) => (

          <ProductCard

            key={product.id}

            product={product}

          />

        ))}

      </div>

    </div>

  );

}

export default Products;