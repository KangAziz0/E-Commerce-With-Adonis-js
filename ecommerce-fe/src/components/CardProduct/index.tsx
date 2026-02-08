// components/CardProduct/CardProduct.tsx
import { Card, Badge } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CardProduct.css";

interface CardProductProps {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  sold?: number;
  stock?: number;
  location?: string;
  category?: string;
  isNew?: boolean;
  isFreeShipping?: boolean;
}

export default function CardProduct({
  id,
  name,
  price,
  image,
  description,
  discount = 0,
  rating = 4.5,
  reviewCount = 128,
  sold = 250,
  stock = 50,
  location = "Jakarta",
  category = "Fashion",
  isNew = false,
  isFreeShipping = true,
}: CardProductProps) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const originalPrice = discount > 0 ? price / (1 - discount / 100) : price;
  const savings = discount > 0 ? originalPrice - price : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;
      return (
        <span key={i} className="star-wrapper">
          <svg width="14" height="14" viewBox="0 0 24 24" className="star-bg">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="#e5e7eb"
            />
          </svg>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="star-fill"
            style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="#fbbf24"
            />
          </svg>
        </span>
      );
    });
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Added to cart:", id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Card className="ultra-modern-card" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="image-container">
        {/* Badges */}
        <div className="badge-group">
          {isNew && <Badge className="badge-new">Baru</Badge>}
          {discount > 0 && (
            <Badge className="badge-discount">{discount}% OFF</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`wishlist-button ${isWishlisted ? "active" : ""}`}
          onClick={handleWishlistToggle}
          aria-label="Tambah ke wishlist"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Product Image */}
        <div className={`image-wrapper ${imageLoaded ? "loaded" : ""}`}>
          <img
            src={image || "/images/baju2.jpg"}
            alt={name}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>

      {/* Card Body */}
      <Card.Body className="card-body-modern">
        {/* Category */}
        <div className="category-tag">{category}</div>

        {/* Product Name */}
        <h3 className="product-name-modern">{name}</h3>

        {/* Rating & Reviews */}
        <div className="rating-container">
          <div className="stars-row">{renderStars(rating)}</div>
          <span className="rating-number">{rating}</span>
          <span className="divider">•</span>
          <span className="review-text">
            {reviewCount >= 1000
              ? `${(reviewCount / 1000).toFixed(1)}k`
              : reviewCount}{" "}
            ulasan
          </span>
          <span className="divider">•</span>
          <span className="sold-text">
            {sold >= 1000 ? `${(sold / 1000).toFixed(1)}k` : sold} terjual
          </span>
        </div>

        {/* Price Section */}
        <div className="price-container">
          <div className="price-main">
            <span className="currency">Rp</span>
            <span className="price-value">{price.toLocaleString("id-ID")}</span>
          </div>
          {discount > 0 && (
            <div className="price-original-row">
              <span className="original-price-value">
                Rp {originalPrice.toLocaleString("id-ID")}
              </span>
              <span className="savings">
                Hemat Rp {savings.toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="info-row">
          {isFreeShipping && (
            <div className="info-badge shipping">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Gratis Ongkir
            </div>
          )}
          <div className="info-badge location">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </div>
        </div>

        {/* Stock Indicator */}
        {stock > 0 && stock <= 10 && (
          <div className="stock-warning">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Stok tersisa {stock}
          </div>
        )}

        {/* Add to Cart Button */}
        <button className="btn-add-cart" onClick={handleAddToCart}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>Tambah ke Keranjang</span>
        </button>
      </Card.Body>
    </Card>
  );
}
