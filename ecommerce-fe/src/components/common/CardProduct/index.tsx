// components/ProductCard.tsx
import React from "react";

type Product = {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
};

type Props = {
  product: Product;
};

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <img
        src={product.image}
        className="card-img-top"
        alt={product.title}
        style={{ height: "160px", objectFit: "cover" }}
      />

      <div className="card-body p-2">
        <h6 className="fw-bold mb-1">{product.title}</h6>
        <small className="text-muted d-block mb-2">{product.category}</small>

        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold">${product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
