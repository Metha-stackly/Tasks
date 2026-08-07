import { useParams } from "react-router-dom";
import { productData } from "../services/productData";

import "../styles/ProductDetails.css";

function ProductDetails() {

  const { id } = useParams();

  const product = productData.find(
    (item) => item.id === Number(id)
  );

  if (!product) {

    return <h2>Product Not Found</h2>;

  }

  return (

    <div className="product-details">

      <img
        src={product.image}
        alt={product.name}
      />

      <h1>{product.name}</h1>

      <h3>₹{product.price}</h3>

      <p>

        <strong>Category:</strong>

        {product.category}

      </p>

      <p>

        <strong>Description:</strong>

        {product.description}

      </p>

      <p>

        <strong>Status:</strong>

        {product.inStock
          ? "In Stock"
          : "Out of Stock"}

      </p>

    </div>

  );

}

export default ProductDetails;