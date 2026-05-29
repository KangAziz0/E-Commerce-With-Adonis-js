import { useEffect, useState } from "react";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { addToCartRequest } from "@/features/cart/cartSlice";
import { openModalLogin } from "@/features/auth/authSlice";
import { fetchDetailProductRequest } from "@/features/products/productSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import type { Product, ProductColor } from "@/types/ui/product";
import { formatRupiah } from "@/utils/currency";

// ─── Star Rating ──────────────────────────────────────────────────────────────

const StarRating: React.FC<{
  rating: number;
  max?: number;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  onRate?: (r: number) => void;
}> = ({ rating, max = 5, interactive = false, size = "md", onRate }) => {
  const [hovered, setHovered] = useState(0);
  const fontSize = size === "sm" ? "13px" : size === "lg" ? "24px" : "16px";

  return (
    <span style={{ display: "inline-flex", gap: 2, fontSize }}>
      {Array.from({ length: max }, (_, i) => {
        const val = i + 1;
        const filled = interactive
          ? val <= (hovered || rating)
          : val <= Math.floor(rating) ||
            (val === Math.ceil(rating) && rating % 1 >= 0.5);
        return (
          <span
            key={i}
            style={{
              color: filled ? "#111" : "#ccc",
              cursor: interactive ? "pointer" : "default",
              transition: "color 0.15s",
            }}
            onMouseEnter={() => interactive && setHovered(val)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRate?.(val)}
          >
            ★
          </span>
        );
      })}
    </span>
  );
};

// ─── Tab: Description ─────────────────────────────────────────────────────────

const TabDescription: React.FC<{ product: Product }> = ({ product }) => (
  <div style={{ padding: "40px 0" }}>
    <div style={{ maxWidth: 720 }}>
      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#999",
          marginBottom: 12,
        }}
      >
        About this product
      </p>
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#0a0a0a",
          marginBottom: 20,
          letterSpacing: "-0.5px",
          lineHeight: 1.3,
        }}
      >
        Product Description
      </h3>
      <div
        style={{
          width: 40,
          height: 3,
          background: "#0a0a0a",
          marginBottom: 28,
          borderRadius: 2,
        }}
      />
      <p
        style={{
          fontSize: "0.95rem",
          color: "#555",
          lineHeight: 1.85,
          marginBottom: 16,
        }}
      >
        {product.description}
      </p>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#555",
          lineHeight: 1.85,
          marginBottom: 0,
        }}
      >
        Designed for both urban commutes and weekend adventures, the jacket
        features zippered pockets, a stand-up collar, and adjustable cuffs. A
        timeless wardrobe staple reimagined with modern fabric technology.
      </p>
    </div>
  </div>
);

// ─── Tab: Information ─────────────────────────────────────────────────────────

const TabInformation: React.FC<{ product: Product }> = ({ product }) => {
  const rows = [
    { label: "Brand", value: product.brand, icon: "◈" },
    { label: "Category", value: product.category, icon: "◉" },
    { label: "SKU", value: product.sku, icon: "◎" },
    { label: "Available Stock", value: "99 units", icon: "◇" },
    { label: "Available Sizes", value: product.sizes?.join(", "), icon: "◻" },
    {
      label: "Available Colors",
      value: product.colors.map((c) => c.name).join(", "),
      icon: "◼",
    },
  ];

  return (
    <div style={{ padding: "40px 0" }}>
      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#999",
          marginBottom: 12,
        }}
      >
        Specs & Details
      </p>
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#0a0a0a",
          marginBottom: 20,
          letterSpacing: "-0.5px",
        }}
      >
        Product Information
      </h3>
      <div
        style={{
          width: 40,
          height: 3,
          background: "#0a0a0a",
          marginBottom: 32,
          borderRadius: 2,
        }}
      />

      <div style={{ maxWidth: 680 }}>
        {rows.map(({ label, value, icon }, idx) => (
          <div
            key={label}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
              padding: "16px 20px",
              background: idx % 2 === 0 ? "#fafafa" : "#fff",
              borderRadius: 10,
              marginBottom: 6,
              border: "1px solid #f0f0f0",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  background: "#0a0a0a",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {icon}
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#444",
                  letterSpacing: "0.2px",
                }}
              >
                {label}
              </span>
            </div>
            <span
              style={{
                fontSize: "0.9rem",
                color: "#1a1a1a",
                fontWeight: 500,
              }}
            >
              {value ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Tab: Reviews ─────────────────────────────────────────────────────────────

const TabReviews: React.FC<{ product: Product }> = ({ product }) => {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const inputBase: React.CSSProperties = {
    border: "1px solid #e8e8e8",
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
    background: "#fafafa",
    color: "#1a1a1a",
    transition: "all 0.2s",
    boxSizing: "border-box",
  };

  const inputFocused: React.CSSProperties = {
    ...inputBase,
    background: "#fff",
    borderColor: "#0a0a0a",
    boxShadow: "0 0 0 3px rgba(10,10,10,0.06)",
  };

  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) /
        product.reviews.length
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews?.filter((r) => r.rating === star).length ?? 0,
  }));

  return (
    <div style={{ padding: "40px 0" }}>
      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#999",
          marginBottom: 12,
        }}
      >
        Customer Feedback
      </p>
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#0a0a0a",
          marginBottom: 20,
          letterSpacing: "-0.5px",
        }}
      >
        Reviews
      </h3>
      <div
        style={{
          width: 40,
          height: 3,
          background: "#0a0a0a",
          marginBottom: 36,
          borderRadius: 2,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
        }}
        className="review-grid"
      >
        {/* ── Left: Reviews List ── */}
        <div>
          {/* Rating Summary Card */}
          {(product.reviews?.length ?? 0) > 0 && (
            <div
              style={{
                background: "#0a0a0a",
                borderRadius: 14,
                padding: "24px 28px",
                marginBottom: 32,
                display: "flex",
                alignItems: "center",
                gap: 32,
              }}
            >
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1,
                    letterSpacing: "-2px",
                  }}
                >
                  {avgRating.toFixed(1)}
                </div>
                <StarRating rating={avgRating} size="sm" />
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#888",
                    marginTop: 4,
                  }}
                >
                  {product.reviews?.length ?? 0} reviews
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {ratingCounts.map(({ star, count }) => {
                  const total = product.reviews?.length ?? 0;
                  const pct = total ? (count / total) * 100 : 0;
                  return (
                    <div
                      key={star}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 5,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#aaa",
                          width: 10,
                          textAlign: "right",
                        }}
                      >
                        {star}
                      </span>
                      <span style={{ color: "#555", fontSize: "0.75rem" }}>
                        ★
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 4,
                          background: "#2a2a2a",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: "#fff",
                            borderRadius: 4,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#666",
                          width: 16,
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Individual Reviews */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {product.reviews?.map((rev, idx) => (
              <div
                key={rev.id}
                style={{
                  padding: "20px 0",
                  borderBottom:
                    idx < (product.reviews?.length ?? 0) - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#0a0a0a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {rev.author.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: "#0a0a0a",
                        }}
                      >
                        {rev.author}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#aaa",
                          fontWeight: 400,
                        }}
                      >
                        {rev.date}
                      </span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#555",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {rev.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {(product.reviews?.length ?? 0) === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#bbb",
                  fontSize: "0.9rem",
                }}
              >
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Write a Review ── */}
        <div>
          <div
            style={{
              background: "#fafafa",
              border: "1px solid #f0f0f0",
              borderRadius: 14,
              padding: "32px",
            }}
          >
            <h5
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#0a0a0a",
                marginBottom: 6,
                letterSpacing: "-0.3px",
              }}
            >
              Write a Review
            </h5>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#aaa",
                marginBottom: 28,
              }}
            >
              Your email address will not be published. Required fields are
              marked *
            </p>

            {/* Rating Selector */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#444",
                  marginBottom: 8,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Your Rating *
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 16px",
                  background: "#fff",
                  border: "1px solid #e8e8e8",
                  borderRadius: 8,
                }}
              >
                <StarRating
                  rating={reviewRating}
                  interactive
                  size="lg"
                  onRate={setReviewRating}
                />
                {reviewRating > 0 && (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#999",
                      marginLeft: 8,
                    }}
                  >
                    {
                      ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                        reviewRating
                      ]
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Review Textarea */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#444",
                  marginBottom: 8,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Your Review *
              </label>
              <textarea
                rows={5}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                onFocus={() => setFocusedField("text")}
                onBlur={() => setFocusedField(null)}
                placeholder="Share your experience with this product..."
                style={
                  focusedField === "text"
                    ? { ...inputFocused, resize: "vertical" }
                    : { ...inputBase, resize: "vertical" }
                }
              />
            </div>

            {/* Name & Email Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#444",
                    marginBottom: 8,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Full name"
                  style={focusedField === "name" ? inputFocused : inputBase}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#444",
                    marginBottom: 8,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  value={reviewEmail}
                  onChange={(e) => setReviewEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="email@example.com"
                  style={focusedField === "email" ? inputFocused : inputBase}
                />
              </div>
            </div>

            <button
              style={{
                width: "100%",
                padding: "13px 24px",
                background: "#0a0a0a",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#333";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#0a0a0a";
              }}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main ProductDetail Component ─────────────────────────────────────────────

const ProductDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const product = useAppSelector((state) => state.products.detail);
  const user = useAppSelector((state) => state.auth.user);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    dispatch(fetchDetailProductRequest(Number(id)));
  }, [id, dispatch]);

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "information" | "reviews"
  >("description");
  const [mainImgHover, setMainImgHover] = useState(false);

  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  console.log(product);

  const handleQty = (delta: number) => {
    setQuantity((q) => Math.max(1, Math.min(q + delta, 99)));
  };

  if (!product) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #f0f0f0",
              borderTopColor: "#0a0a0a",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "#999", fontSize: "0.9rem" }}>
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      dispatch(openModalLogin());
      return;
    }
    dispatch(
      addToCartRequest({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        size: selectedSize,
        weight: selectedWeight,
        image: selectedColor?.image,
      }),
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* ── Product Hero ── */}
      <div className="container" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "start",
          }}
          className="product-detail-grid"
        >
          {/* ──── LEFT: Image Gallery ──── */}
          <div>
            {/* Main Image */}
            <div
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                background: "#f5f5f5",
                aspectRatio: "4/5",
                cursor: "zoom-in",
              }}
              onMouseEnter={() => setMainImgHover(true)}
              onMouseLeave={() => setMainImgHover(false)}
            >
              {product?.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    background: "#0a0a0a",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    padding: "5px 10px",
                    borderRadius: 4,
                    zIndex: 2,
                  }}
                >
                  {product.badge}
                </span>
              )}
              <img
                src={selectedColor?.image ?? ""}
                alt={`${product.name} in ${selectedColor?.name}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s ease",
                  transform: mainImgHover ? "scale(1.04)" : "scale(1)",
                }}
              />

              {/* Color Indicator Badge */}
              {selectedColor?.name && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#0a0a0a",
                    letterSpacing: "0.3px",
                    border: "1px solid rgba(255,255,255,0.6)",
                  }}
                >
                  {selectedColor.name}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product?.colors?.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                {product.colors.map((c) => (
                  <div
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 10,
                      overflow: "hidden",
                      cursor: "pointer",
                      border:
                        selectedColor?.name === c.name
                          ? "2.5px solid #0a0a0a"
                          : "2.5px solid transparent",
                      outline:
                        selectedColor?.name === c.name
                          ? "none"
                          : "1px solid #e8e8e8",
                      transition: "all 0.2s",
                      flexShrink: 0,
                      opacity: selectedColor?.name === c.name ? 1 : 0.7,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedColor?.name !== c.name) {
                        (e.currentTarget as HTMLDivElement).style.opacity = "1";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedColor?.name !== c.name) {
                        (e.currentTarget as HTMLDivElement).style.opacity =
                          "0.7";
                      }
                    }}
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ──── RIGHT: Product Info ──── */}
          <div style={{ paddingTop: 8 }}>
            {/* Category / Brand Breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: "#999",
                }}
              >
                {product?.category}
              </span>
              <span style={{ color: "#ddd", fontSize: "0.7rem" }}>—</span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: "#999",
                }}
              >
                {product?.brand}
              </span>
            </div>

            {/* Product Name */}
            <h1
              style={{
                fontSize: "clamp(1.7rem, 3vw, 2.3rem)",
                fontWeight: 800,
                color: "#0a0a0a",
                letterSpacing: "-1px",
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              {product?.name}
            </h1>

            {/* Rating Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
                paddingBottom: 20,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <StarRating rating={product?.rating} />
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                {product?.reviews?.length ?? 0} Reviews
              </span>
              <span
                style={{
                  width: 1,
                  height: 14,
                  background: "#e0e0e0",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#22c55e",
                  fontWeight: 600,
                }}
              >
                ● In Stock
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 20 }}>
              <span
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  color: "#0a0a0a",
                  letterSpacing: "-1.5px",
                }}
              >
                Rp {formatRupiah(product.price)}
              </span>
            </div>

            {/* Description snippet */}
            <p
              style={{
                fontSize: "0.9rem",
                color: "#666",
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <p
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "#888",
                    marginBottom: 10,
                  }}
                >
                  Color:{" "}
                  <span style={{ color: "#0a0a0a" }}>
                    {selectedColor?.name}
                  </span>
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border:
                          selectedColor?.name === c.name
                            ? "2.5px solid #0a0a0a"
                            : "2.5px solid transparent",
                        outline: "2px solid #e0e0e0",
                        outlineOffset: 2,
                        background: c.hex ?? "#ccc",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && (
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: "#888",
                      margin: 0,
                    }}
                  >
                    Size:{" "}
                    <span style={{ color: "#0a0a0a" }}>{selectedSize}</span>
                  </p>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "0.75rem",
                      color: "#999",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    Size Guide
                  </button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSize(s.size);
                        setSelectedWeight(s.weight);
                      }}
                      style={{
                        minWidth: 48,
                        height: 48,
                        padding: "0 16px",
                        border:
                          selectedSize === s.size
                            ? "2px solid #0a0a0a"
                            : "1.5px solid #e8e8e8",
                        borderRadius: 8,
                        background:
                          selectedSize === s.size ? "#0a0a0a" : "#fff",
                        color: selectedSize === s.size ? "#fff" : "#555",
                        fontWeight: selectedSize === s.size ? 700 : 500,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.18s",
                        letterSpacing: "0.3px",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSize !== s.size) {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = "#0a0a0a";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#0a0a0a";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSize !== s.size) {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = "#e8e8e8";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#555";
                        }
                      }}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart + Wishlist */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 24,
              }}
            >
              {/* Quantity */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1.5px solid #e8e8e8",
                  borderRadius: 10,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => handleQty(-1)}
                  style={{
                    width: 44,
                    height: 50,
                    border: "none",
                    background: "transparent",
                    fontSize: "1.2rem",
                    color: "#0a0a0a",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    width: 44,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#0a0a0a",
                    borderLeft: "1px solid #f0f0f0",
                    borderRight: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => handleQty(1)}
                  style={{
                    width: 44,
                    height: 50,
                    border: "none",
                    background: "transparent",
                    fontSize: "1.2rem",
                    color: "#0a0a0a",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  height: 50,
                  background: addedToCart ? "#16a34a" : "#0a0a0a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  if (!addedToCart) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#222";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!addedToCart) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#0a0a0a";
                  }
                }}
              >
                {addedToCart ? (
                  <>
                    <svg
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <FaShoppingCart size={14} />
                    Add to Cart
                  </>
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                title="Add to wishlist"
                style={{
                  width: 50,
                  height: 50,
                  border: "1.5px solid #e8e8e8",
                  borderRadius: 10,
                  background: wishlisted ? "#0a0a0a" : "#fff",
                  color: wishlisted ? "#fff" : "#888",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (!wishlisted) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#0a0a0a";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#0a0a0a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!wishlisted) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#e8e8e8";
                    (e.currentTarget as HTMLButtonElement).style.color = "#888";
                  }
                }}
              >
                {wishlisted ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              </button>
            </div>

            {/* Meta Info Strip */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 1,
                background: "#f0f0f0",
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 28,
              }}
            >
              {[
                { icon: "📦", label: "Stock", value: "99 left" },
                { icon: "🏷️", label: "SKU", value: product.sku },
                { icon: "✦", label: "Brand", value: product.brand },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "#fff",
                    padding: "14px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>
                    {icon}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "#aaa",
                      fontWeight: 600,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: 2,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#0a0a0a",
                      fontWeight: 700,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Share Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#aaa",
                }}
              >
                Share
              </span>
              {[
                { label: "f", title: "Facebook" },
                { label: "𝕏", title: "Twitter/X" },
                { label: "in", title: "LinkedIn" },
                { label: "𝐏", title: "Pinterest" },
              ].map(({ label, title }) => (
                <button
                  key={title}
                  title={title}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "1.5px solid #e8e8e8",
                    background: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "#666",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "#0a0a0a";
                    el.style.color = "#fff";
                    el.style.borderColor = "#0a0a0a";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "#fff";
                    el.style.color = "#666";
                    el.style.borderColor = "#e8e8e8";
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          background: "#fff",
        }}
      >
        <div className="container">
          {/* Tab Nav */}
          <div
            style={{
              display: "flex",
              gap: 0,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            {(
              [
                { key: "description", label: "Description" },
                { key: "information", label: "Information" },
                {
                  key: "reviews",
                  label: `Reviews (${product.reviews?.length ?? 0})`,
                },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom:
                    activeTab === key
                      ? "2.5px solid #0a0a0a"
                      : "2.5px solid transparent",
                  padding: "18px 28px",
                  fontSize: "0.82rem",
                  fontWeight: activeTab === key ? 700 : 500,
                  color: activeTab === key ? "#0a0a0a" : "#aaa",
                  letterSpacing: activeTab === key ? "0.5px" : "0",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: "-1px",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== key) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#555";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== key) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ paddingBottom: 64 }}>
            {activeTab === "description" && (
              <TabDescription product={product} />
            )}
            {activeTab === "information" && (
              <TabInformation product={product} />
            )}
            {activeTab === "reviews" && <TabReviews product={product} />}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .review-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
