import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "react-bootstrap";
import { ProductCard } from "@/components/common/CardProduct";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsRequest } from "@/features/products/productSlice";
import { RootState } from "@/store/store";

const CATEGORIES = ["Bags", "Clothing", "Shoes", "Accessories", "Kids"];
const BRANDS = [
  "Louis Vuitton",
  "Zara",
  "H&M",
  "Nike",
  "Gucci",
  "Ralph Lauren",
];
const PRICE_RANGES = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $150", min: 100, max: 150 },
  { label: "Over $150", min: 150, max: Infinity },
];
const SORT_OPTIONS = ["Low To High", "High To Low", "Newest", "Best Rated"];
const PER_PAGE = 12;

// ─── Sidebar filter block ──────────────────────────────────────────────────────
const FilterBlock: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4 pb-4" style={{ borderBottom: "1px solid #eee" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-100 border-0 bg-transparent d-flex justify-content-between align-items-center p-0 mb-3"
        style={{ cursor: "pointer" }}
      >
        <span
          className="fw-bold text-uppercase"
          style={{ fontSize: "12px", letterSpacing: "1.5px", color: "#111" }}
        >
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          style={{ color: "#888", fontSize: "14px" }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" as const }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main ShopPage ─────────────────────────────────────────────────────────────
const ShopPage: React.FC = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.products);
  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(
    null,
  );
  const [sortBy, setSortBy] = useState("Low To High");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [page, setPage] = useState(1);

  const toggleFilter = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...data];
    if (search)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    if (selectedCategories.length)
      result = result.filter((p) => selectedCategories.includes(p.category));
    if (selectedBrands.length)
      result = result.filter((p) => selectedBrands.includes(p.brand));
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter(
        (p) => p.price >= range.min && p.price < range.max,
      );
    }
    if (sortBy === "Low To High") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "High To Low") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "Best Rated")
      result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, selectedCategories, selectedBrands, selectedPriceRange, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const startItem = (page - 1) * PER_PAGE + 1;
  const endItem = Math.min(page * PER_PAGE, filtered.length);

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (selectedPriceRange !== null ? 1 : 0);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setSearch("");
    setPage(1);
  };

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Page Header / Breadcrumb */}
      <div className="py-4 px-4 px-lg-5" style={{ backgroundColor: "#f5f4f0" }}>
        <Container>
          <h1
            className="fw-bold mb-1"
            style={{ fontSize: "28px", color: "#111", letterSpacing: "-0.5px" }}
          >
            Shop
          </h1>
          <nav style={{ fontSize: "13px", color: "#888" }}>
            <span style={{ color: "#555", cursor: "pointer" }}>Home</span>
            <span className="mx-2">›</span>
            <span style={{ color: "#aaa" }}>Shop</span>
          </nav>
        </Container>
      </div>

      <Container className="py-5">
        <div className="row g-5">
          {/* ── SIDEBAR ────────────────────────────────────────── */}
          <div className="col-lg-3 col-md-4">
            {/* Search */}
            <div
              className="position-relative mb-4 pb-4"
              style={{ borderBottom: "1px solid #eee" }}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                className="w-100 ps-3 pe-5 py-2"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#555",
                  outline: "none",
                  backgroundColor: "#fafafa",
                }}
              />
            </div>

            {/* Active filters */}
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 d-flex align-items-center justify-content-between"
                style={{
                  backgroundColor: "#fff8f8",
                  border: "1px solid #fdd",
                  borderRadius: "8px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#e53935" }}>
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
                  active
                </span>
                <button
                  onClick={clearAll}
                  className="border-0 bg-transparent fw-semibold"
                  style={{
                    fontSize: "11px",
                    color: "#e53935",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Clear all
                </button>
              </motion.div>
            )}

            {/* Categories */}
            <FilterBlock title="Categories">
              <ul className="list-unstyled mb-0">
                {CATEGORIES.map((cat) => {
                  const count = data?.filter((p) => p.category === cat).length;
                  const active = selectedCategories.includes(cat);
                  return (
                    <li
                      key={cat}
                      onClick={() =>
                        toggleFilter(
                          cat,
                          selectedCategories,
                          setSelectedCategories,
                        )
                      }
                      className="d-flex justify-content-between align-items-center py-1"
                      style={{
                        cursor: "pointer",
                        fontSize: "14px",
                        color: active ? "#e53935" : "#555",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      <span>{cat}</span>
                      <span style={{ color: "#bbb", fontSize: "12px" }}>
                        ({count})
                      </span>
                    </li>
                  );
                })}
              </ul>
            </FilterBlock>

            {/* Branding */}
            <FilterBlock title="Branding">
              <ul className="list-unstyled mb-0">
                {BRANDS.map((brand) => {
                  const active = selectedBrands.includes(brand);
                  return (
                    <li
                      key={brand}
                      onClick={() =>
                        toggleFilter(brand, selectedBrands, setSelectedBrands)
                      }
                      className="d-flex align-items-center gap-2 py-1"
                      style={{
                        cursor: "pointer",
                        fontSize: "14px",
                        color: active ? "#e53935" : "#555",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "3px",
                          flexShrink: 0,
                          border: `1.5px solid ${active ? "#e53935" : "#ccc"}`,
                          backgroundColor: active ? "#e53935" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {active && (
                          <svg
                            width="8"
                            height="8"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {brand}
                    </li>
                  );
                })}
              </ul>
            </FilterBlock>

            {/* Price */}
            <FilterBlock title="Price Range">
              <ul className="list-unstyled mb-0">
                {PRICE_RANGES.map((range, i) => {
                  const active = selectedPriceRange === i;
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        setSelectedPriceRange(active ? null : i);
                        setPage(1);
                      }}
                      className="d-flex align-items-center gap-2 py-1"
                      style={{
                        cursor: "pointer",
                        fontSize: "14px",
                        color: active ? "#e53935" : "#555",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          border: `1.5px solid ${active ? "#e53935" : "#ccc"}`,
                          backgroundColor: active ? "#e53935" : "transparent",
                        }}
                      />
                      {range.label}
                    </li>
                  );
                })}
              </ul>
            </FilterBlock>
          </div>

          {/* ── MAIN CONTENT ───────────────────────────────────── */}
          <div className="col-lg-9 col-md-8">
            {/* Toolbar */}
            <div
              className="d-flex justify-content-between align-items-center mb-4 pb-3"
              style={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <p className="mb-0" style={{ fontSize: "14px", color: "#888" }}>
                Showing{" "}
                <strong style={{ color: "#111" }}>
                  {filtered.length > 0 ? `${startItem}–${endItem}` : "0"}
                </strong>{" "}
                of <strong style={{ color: "#111" }}>{filtered.length}</strong>{" "}
                results
              </p>

              {/* Sort dropdown */}
              <div className="position-relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="border-0 bg-transparent d-flex align-items-center gap-2"
                  style={{ fontSize: "14px", color: "#555", cursor: "pointer" }}
                >
                  Sort by Price:
                  <strong style={{ color: "#111" }}>{sortBy}</strong>
                  <motion.span
                    animate={{ rotate: showSortDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="position-absolute end-0 bg-white"
                      style={{
                        top: "calc(100% + 8px)",
                        minWidth: "180px",
                        zIndex: 99,
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                      }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSortBy(opt);
                            setShowSortDropdown(false);
                            setPage(1);
                          }}
                          className="w-100 border-0 bg-transparent text-start px-4 py-2"
                          style={{
                            fontSize: "14px",
                            cursor: "pointer",
                            color: sortBy === opt ? "#e53935" : "#555",
                            fontWeight: sortBy === opt ? 600 : 400,
                            backgroundColor:
                              sortBy === opt ? "#fff8f8" : "transparent",
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Products grid */}
            {paginated.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="d-flex flex-column align-items-center justify-content-center py-5 text-center"
                style={{ minHeight: "320px" }}
              >
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  stroke="#ddd"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="mb-3"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p
                  className="fw-semibold mb-1"
                  style={{ color: "#aaa", fontSize: "16px" }}
                >
                  No products found
                </p>
                <p style={{ color: "#ccc", fontSize: "13px" }}>
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearAll}
                  className="border-0 mt-2 px-4 py-2 fw-semibold"
                  style={{
                    backgroundColor: "#111",
                    color: "#fff",
                    fontSize: "12px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${page}-${sortBy}-${selectedCategories.join()}-${selectedBrands.join()}-${selectedPriceRange}-${search}`}
                  className="row row-cols-2 row-cols-md-3 g-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {paginated.map((product, i) => (
                    <motion.div
                      className="col"
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: i * 0.04,
                        duration: 0.3,
                        ease: "easeOut" as const,
                      }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-5 pt-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-0 bg-transparent d-flex align-items-center justify-content-center"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    cursor: page === 1 ? "default" : "pointer",
                    color: page === 1 ? "#ddd" : "#555",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const isActive = page === p;
                  return (
                    <motion.button
                      key={p}
                      onClick={() => setPage(p)}
                      className="border-0 d-flex align-items-center justify-content-center fw-semibold"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        fontSize: "14px",
                        backgroundColor: isActive ? "#111" : "transparent",
                        color: isActive ? "#fff" : "#555",
                      }}
                      whileHover={
                        !isActive ? { backgroundColor: "#f5f5f5" } : {}
                      }
                    >
                      {p}
                    </motion.button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-0 bg-transparent d-flex align-items-center justify-content-center"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    cursor: page === totalPages ? "default" : "pointer",
                    color: page === totalPages ? "#ddd" : "#555",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ShopPage;
