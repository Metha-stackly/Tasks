import { Link } from "react-router-dom";
import type { Product } from "../types/Product";
import "../styles/ProductCard.css";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (

    <div className="product-card">

      <img
        src={product.image}
        alt={product.name}
      />

      <h2>{product.name}</h2>

      <p>
        <strong>Category:</strong> {product.category}
      </p>

      <p>
        <strong>Price:</strong> ₹{product.price}
      </p>

      <p
        className={
          product.inStock
            ? "stock"
            : "out-stock"
        }
      >
        {product.inStock ? "In Stock" : "Out of Stock"}
      </p>

      <Link to={`/product/${product.id}`}>
        View Details
      </Link>

    </div>

  );
}

export default ProductCard;