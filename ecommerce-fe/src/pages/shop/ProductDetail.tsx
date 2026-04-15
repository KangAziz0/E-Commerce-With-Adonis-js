import { addToCart } from "@/features/cart/cardSlice";
import { fetchDetailProductRequest } from "@/features/products/productSlice";
import { RootState } from "@/store/store";
import { Product, ProductColor } from "@/types/ui/product";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const StarRating: React.FC<{
  rating: number;
  max?: number;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  onRate?: (r: number) => void;
}> = ({ rating, max = 5, interactive = false, size = "md", onRate }) => {
  const [hovered, setHovered] = useState(0);
  const fontSize = size === "sm" ? "14px" : size === "lg" ? "22px" : "17px";

  return (
    <span className="d-inline-flex gap-1" style={{ fontSize }}>
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
              color: filled ? "#c07a6b" : "#d9c5c1",
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
  <div className="py-4">
    <h5
      className="fw-bold mb-3"
      style={{ color: "#1a1a1a", letterSpacing: "-0.3px" }}
    >
      Product Description
    </h5>
    <p className="text-secondary lh-lg" style={{ fontSize: "0.95rem" }}>
      {product.description}
    </p>
    <p className="text-secondary lh-lg" style={{ fontSize: "0.95rem" }}>
      Designed for both urban commutes and weekend adventures, the jacket
      features zippered pockets, a stand-up collar, and adjustable cuffs. A
      timeless wardrobe staple reimagined with modern fabric technology.
    </p>
  </div>
);

// ─── Tab: Information ─────────────────────────────────────────────────────────

const TabInformation: React.FC<{ product: Product }> = ({ product }) => (
  <div className="py-4">
    <h5
      className="fw-bold mb-3"
      style={{ color: "#1a1a1a", letterSpacing: "-0.3px" }}
    >
      Product Information
    </h5>
    <table className="table table-bordered" style={{ fontSize: "0.9rem" }}>
      <tbody>
        {[
          ["Brand", product.brand],
          ["Category", product.category],
          ["SKU", product.sku],
          ["Available Stock", `99 units`],
          ["Available Sizes", product.sizes?.join(", ")],
          ["Available Colors", product.colors.map((c) => c.name).join(", ")],
        ].map(([label, value]) => (
          <tr key={label as string}>
            <td
              className="fw-semibold"
              style={{ width: "35%", color: "#555", background: "#faf9f8" }}
            >
              {label}
            </td>
            <td style={{ color: "#333" }}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Tab: Reviews ─────────────────────────────────────────────────────────────

const TabReviews: React.FC<{ product: Product }> = ({ product }) => {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");

  const inputStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: "0.9rem",
    width: "100%",
    outline: "none",
    background: "#fefefe",
  };

  return (
    <div className="py-4">
      <div className="row g-5">
        {/* Existing Reviews */}
        <div className="col-12 col-lg-6">
          <h5
            className="fw-bold mb-4"
            style={{ color: "#1a1a1a", letterSpacing: "-0.3px" }}
          >
            {product.reviews?.length} review
            {(product.reviews?.length ?? 0) > 1 ? "s" : ""} for &quot;
            {product.name}&quot;
          </h5>
          {product.reviews?.map((rev) => (
            <div key={rev.id} className="d-flex gap-3 mb-4">
              <div
                className="rounded-circle overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center"
                style={{
                  width: 48,
                  height: 48,
                  background: "#e8ddd8",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#c07a6b",
                }}
              >
                {rev.author.charAt(0)}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span
                    className="fw-semibold"
                    style={{ color: "#1a1a1a", fontSize: "0.95rem" }}
                  >
                    {rev.author}
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                    — {rev.date}
                  </span>
                </div>
                <StarRating rating={rev.rating} size="sm" />
                <p
                  className="mt-2 mb-0 text-secondary lh-lg"
                  style={{ fontSize: "0.9rem" }}
                >
                  {rev.comment}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Leave a Review */}
        <div className="col-12 col-lg-6">
          <h5
            className="fw-bold mb-1"
            style={{ color: "#1a1a1a", letterSpacing: "-0.3px" }}
          >
            Leave a review
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.82rem" }}>
            Your email address will not be published. Required fields are marked
            *
          </p>

          <div className="mb-3">
            <label
              className="fw-semibold mb-1"
              style={{ fontSize: "0.88rem", color: "#444" }}
            >
              Your Rating *
            </label>
            <div>
              <StarRating
                rating={reviewRating}
                interactive
                size="lg"
                onRate={setReviewRating}
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              className="fw-semibold mb-1"
              style={{ fontSize: "0.88rem", color: "#444" }}
            >
              Your Review *
            </label>
            <textarea
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div className="mb-3">
            <label
              className="fw-semibold mb-1"
              style={{ fontSize: "0.88rem", color: "#444" }}
            >
              Your Name *
            </label>
            <input
              type="text"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder="Full name"
              style={inputStyle}
            />
          </div>

          <div className="mb-4">
            <label
              className="fw-semibold mb-1"
              style={{ fontSize: "0.88rem", color: "#444" }}
            >
              Your Email *
            </label>
            <input
              type="email"
              value={reviewEmail}
              onChange={(e) => setReviewEmail(e.target.value)}
              placeholder="email@example.com"
              style={inputStyle}
            />
          </div>

          <button
            className="btn px-4 py-2 fw-semibold"
            style={{
              background: "#c07a6b",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              letterSpacing: "0.3px",
              fontSize: "0.9rem",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#a8685a")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#c07a6b")
            }
          >
            Leave Your Review
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main ProductDetail Component ─────────────────────────────────────────────

const ProductDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const product = useSelector((state: RootState) => state.products.detail);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchDetailProductRequest(Number(id)));
  }, [id]);

  const [selectedColor, setSelectedColor] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "information" | "reviews"
  >("description");

  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const handleQty = (delta: number) => {
    setQuantity((q) => Math.max(1, Math.min(q + delta, 99)));
  };

  const accentColor = "#c07a6b";
  const accentLight = "#f5edeb";

  if (!product) return <p>Loading...</p>;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity: quantity,
        image: selectedColor?.image?.imageUrl,
      }),
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1000);
  };

  return (
    <div>
      {/* ── Product Hero ── */}
      <div className="container py-5">
        <div className="row g-5 align-items-start">
          {/* Image */}
          <div className="col-12 col-lg-6">
            <div
              className="position-relative overflow-hidden"
              style={{ borderRadius: 12, background: "#f8f5f3" }}
            >
              {product?.badge && (
                <span
                  className="position-absolute top-0 start-0 m-3 px-2 py-1 fw-bold"
                  style={{
                    background: accentColor,
                    color: "#fff",
                    fontSize: "0.72rem",
                    letterSpacing: "1.5px",
                    borderRadius: 4,
                    zIndex: 2,
                  }}
                >
                  {product.badge}
                </span>
              )}
              <img
                src={selectedColor?.image?.imageUrl ?? ""}
                alt={`${product.name} in ${selectedColor?.name}`}
                style={{
                  width: "100%",
                  height: 480,
                  objectFit: "cover",
                  display: "block",
                  transition: "opacity 0.3s",
                }}
              />

              {/* Thumbnail row */}
              <div
                className="d-flex gap-2 p-3"
                style={{ background: "#f0ebe8" }}
              >
                {product?.colors.map((c: any) => (
                  <div
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className="overflow-hidden"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 8,
                      cursor: "pointer",
                      border:
                        selectedColor?.name === c.name
                          ? `2px solid ${accentColor}`
                          : "2px solid transparent",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <img
                      src={c.image?.imageUrl}
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
            </div>
          </div>

          {/* Details */}
          <div className="col-12 col-lg-6">
            {/* Breadcrumb */}
            <p
              className="text-muted mb-2"
              style={{ fontSize: "0.82rem", letterSpacing: "0.5px" }}
            >
              {product?.category} / {product?.brand}
            </p>

            <h1
              className="fw-bold mb-2"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              {product?.name}
            </h1>

            {/* Rating */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <StarRating rating={product?.rating} />
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                ({product?.reviews?.length ?? 0} Reviews)
              </span>
            </div>

            {/* Price */}
            <p
              className="fw-bold mb-3"
              style={{
                fontSize: "2rem",
                color: accentColor,
                letterSpacing: "-0.5px",
              }}
            >
              ${product.price.toFixed(2)}
            </p>

            {/* Description snippet */}
            <p
              className="text-secondary lh-lg mb-4"
              style={{ fontSize: "0.93rem" }}
            >
              {product.description}
            </p>

            {/* Sizes */}
            {product.sizes && (
              <div className="mb-3">
                <p
                  className="fw-semibold mb-2"
                  style={{ fontSize: "0.9rem", color: "#444" }}
                >
                  Sizes:
                </p>
                <div className="d-flex flex-wrap gap-2">
                  {product.sizes.map((s: any) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.size)}
                      className="px-2 py-1 rounded"
                      style={{
                        border:
                          selectedSize === s.size
                            ? `1.5px solid ${accentColor}`
                            : "1.5px solid #ddd",
                        background:
                          selectedSize === s.size ? accentLight : "#fff",
                        color: selectedSize === s.size ? accentColor : "#555",
                        fontWeight: selectedSize === s.size ? 600 : 400,
                      }}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="d-flex align-items-center gap-3 flex-wrap mb-4">
              <div
                className="d-flex align-items-center"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => handleQty(-1)}
                  className="btn border-0"
                  style={{
                    background: accentColor,
                    color: "#fff",
                    width: 42,
                    height: 42,
                    fontSize: "1.1rem",
                    borderRadius: 0,
                  }}
                >
                  −
                </button>
                <span
                  className="text-center fw-semibold"
                  style={{ width: 48, fontSize: "0.95rem" }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => handleQty(1)}
                  className="btn border-0"
                  style={{
                    background: accentColor,
                    color: "#fff",
                    width: 42,
                    height: 42,
                    fontSize: "1.1rem",
                    borderRadius: 0,
                  }}
                >
                  +
                </button>
              </div>

              <button
                className="btn flex-grow-1 fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{
                  background: addedToCart ? "#2e7d32" : accentColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontSize: "0.95rem",
                  letterSpacing: "0.2px",
                  minHeight: 42,
                  transition: "background 0.2s",
                }}
                onClick={handleAddToCart}
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
                    <FaShoppingCart />
                    Add To Cart
                  </>
                )}
              </button>

              <button
                className="btn border"
                style={{
                  borderColor: "#ddd",
                  borderRadius: 8,
                  width: 42,
                  height: 42,
                  fontSize: "1.1rem",
                  color: "#888",
                  padding: 0,
                }}
                title="Add to wishlist"
              >
                ♡
              </button>
            </div>

            {/* Meta info */}
            <div
              className="py-3 px-3 mb-4 d-flex flex-wrap gap-3"
              style={{
                background: "#faf9f8",
                borderRadius: 8,
                fontSize: "0.83rem",
                color: "#666",
              }}
            >
              <span>✔ In Stock ({99} left)</span>
              <span>• SKU: {product.sku}</span>
              <span>
                • Brand: <strong>{product.brand}</strong>
              </span>
            </div>

            {/* Share */}
            <div className="d-flex align-items-center gap-3">
              <span
                className="fw-semibold"
                style={{ fontSize: "0.9rem", color: "#444" }}
              >
                Share on:
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
                  className="btn p-0 d-flex align-items-center justify-content-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "1px solid #ddd",
                    fontSize: "0.8rem",
                    color: "#555",
                    background: "#fff",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = accentColor;
                    el.style.color = "#fff";
                    el.style.borderColor = accentColor;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "#fff";
                    el.style.color = "#555";
                    el.style.borderColor = "#ddd";
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
      <div className="container pb-5">
        <div
          style={{
            borderTop: "1px solid #eee",
            borderBottom: "1px solid #eee",
            marginBottom: 0,
          }}
        >
          <nav className="d-flex gap-1">
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
                className="btn border-0 px-4 py-3"
                style={{
                  fontFamily: "inherit",
                  fontSize: "0.93rem",
                  fontWeight: activeTab === key ? 600 : 400,
                  color: activeTab === key ? "#1a1a1a" : "#999",
                  borderBottom:
                    activeTab === key
                      ? `2px solid ${accentColor}`
                      : "2px solid transparent",
                  borderRadius: 0,
                  background: "transparent",
                  transition: "all 0.15s",
                  marginBottom: "-1px",
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ borderBottom: "1px solid #eee" }}>
          {activeTab === "description" && <TabDescription product={product} />}
          {activeTab === "information" && <TabInformation product={product} />}
          {activeTab === "reviews" && <TabReviews product={product} />}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
