import { Product } from "@/data/products";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { StarRating } from "./StarRating";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cardSlice";
export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const currentColor = product.colors[selectedColor];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        ...product,
        quantity: 1,
        image: currentColor?.image,
      }),
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <motion.div
      className="position-relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
      style={{ cursor: "pointer" }}
    >
      {/* Image Container */}
      <div
        className="position-relative overflow-hidden mb-3"
        style={{
          backgroundColor: "#f0eff4",
          aspectRatio: "3/4",
          borderRadius: "4px",
        }}
      >
        {/* Badge */}
        {product.badge && (
          <div
            className="position-absolute top-0 start-0 px-2 py-1 text-white fw-bold"
            style={{
              backgroundColor: product.badge === "SALE" ? "#111" : "#555",
              fontSize: "11px",
              letterSpacing: "1px",
              zIndex: 3,
            }}
          >
            {product.badge}
          </div>
        )}

        {/* Product image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedColor}
            src={currentColor.image}
            alt={product.name}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" as const }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </AnimatePresence>

        {/* Hover overlay */}
        <motion.div
          className="position-absolute top-0 start-0 w-100 h-100"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ backgroundColor: "rgba(0,0,0,0.08)", zIndex: 1 }}
        />

        {/* Action buttons (right side) */}
        <motion.div
          className="position-absolute d-flex flex-column gap-2"
          style={{ top: "12px", right: "12px", zIndex: 4 }}
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 12 }}
          transition={{ duration: 0.22, ease: "easeOut" as const }}
        >
          {/* Wishlist */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setWishlisted(!wishlisted);
            }}
            className="d-flex align-items-center justify-content-center border-0 bg-white rounded-circle shadow-sm"
            style={{ width: "38px", height: "38px", cursor: "pointer" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
          >
            <svg
              width="16"
              height="16"
              fill={wishlisted ? "#e53935" : "none"}
              stroke={wishlisted ? "#e53935" : "#555"}
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.button>

          {/* Quick view */}
          <motion.button
            onClick={(e) => navigate(`/product/${product.id}`)}
            className="d-flex align-items-center justify-content-center border-0 bg-white rounded-circle shadow-sm"
            style={{ width: "38px", height: "38px", cursor: "pointer" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
          >
            <FaEye />
          </motion.button>
        </motion.div>

        {/* Color selector (bottom right on hover) */}
        <motion.div
          className="position-absolute d-flex gap-2 align-items-center"
          style={{ bottom: "12px", right: "12px", zIndex: 4 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.22, ease: "easeOut" as const }}
        >
          {product.colors.map((color, idx) => (
            <motion.button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(idx);
              }}
              className="border-0 p-0 position-relative"
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: color.hex,
                cursor: "pointer",
                outline: selectedColor === idx ? "2px solid #fff" : "none",
                boxShadow:
                  selectedColor === idx
                    ? "0 0 0 3px rgba(0,0,0,0.35)"
                    : "0 0 0 1px rgba(0,0,0,0.18)",
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              title={color.name}
            />
          ))}
        </motion.div>
      </div>

      {/* Card info */}
      <div>
        <div className="d-flex justify-content-between">
          <p
            className="mb-1 text-truncate"
            style={{ color: "#111", fontSize: "17px", fontWeight: 500 }}
          >
            {product.name}
          </p>

          <StarRating rating={product.rating} />
        </div>
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontWeight: 700, fontSize: "20px", color: "#111" }}>
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span
              style={{
                fontSize: "13px",
                color: "#aaa",
                textDecoration: "line-through",
              }}
            >
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart button (appears on hover) */}
        <AnimatePresence>
          {hovered && (
            <motion.button
              onClick={handleAddToCart}
              className="w-100 border-0 fw-semibold mt-2 d-flex align-items-center justify-content-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: "easeOut" as const }}
              style={{
                backgroundColor: addedToCart ? "#2e7d32" : "#111",
                color: "#fff",
                padding: "10px 0",
                fontSize: "12px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "2px",
                transition: "background-color 0.3s",
              }}
            >
              {addedToCart ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Add to Cart
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
