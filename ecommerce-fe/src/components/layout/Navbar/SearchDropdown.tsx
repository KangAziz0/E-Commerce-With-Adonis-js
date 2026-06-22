import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import httpClient from "@/lib/httpClient";
import type { Product } from "@/types/ui/product";
import { formatRupiah } from "@/utils/currency";

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult extends Pick<Product, "id" | "name" | "price" | "images" | "category"> {}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(query.trim(), 300);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Fetch suggestions
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    httpClient
      .get<{ data: SearchResult[] }>("/products", {
        params: { page: 1, limit: 6, search: debouncedQuery },
      })
      .then((res) => {
        if (!cancelled) {
          setResults(res.data?.data ?? []);
          setActiveIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const goToProduct = useCallback(
    (id: number) => {
      navigate(`/products/${id}`);
      onClose();
    },
    [navigate, onClose],
  );

  const goToShopSearch = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      navigate(`/shop?search=${encodeURIComponent(q.trim())}`);
      onClose();
    },
    [navigate, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        goToProduct(results[activeIndex].id);
      } else {
        goToShopSearch(query);
      }
    }
  };

  const showDropdown = isOpen && (loading || results.length > 0 || (debouncedQuery.length > 0 && !loading));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.25)",
              backdropFilter: "blur(2px)",
              zIndex: 1040,
            }}
            onClick={onClose}
          />

          {/* Search panel */}
          <motion.div
            key="search-panel"
            ref={containerRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1050,
              backgroundColor: "#fff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            {/* Input row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "18px 24px",
                borderBottom: showDropdown ? "1px solid #f0f0f0" : "none",
              }}
            >
              {/* Search icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="#888"
                strokeWidth="2"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cari produk..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  color: "#111",
                  background: "transparent",
                  letterSpacing: "0.2px",
                }}
              />

              {loading && (
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid #e5e5e5",
                    borderTopColor: "#111",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    flexShrink: 0,
                  }}
                />
              )}

              {query && !loading && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    border: "none",
                    background: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "#999",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label="Clear search"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}

              <button
                onClick={onClose}
                style={{
                  border: "1px solid #e0e0e0",
                  background: "#f8f8f8",
                  padding: "4px 10px",
                  cursor: "pointer",
                  color: "#555",
                  fontSize: "12px",
                  borderRadius: "4px",
                  letterSpacing: "0.5px",
                  flexShrink: 0,
                }}
              >
                ESC
              </button>
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  style={{ maxHeight: "420px", overflowY: "auto" }}
                >
                  {/* No results */}
                  {!loading && results.length === 0 && debouncedQuery.length > 0 && (
                    <div style={{ padding: "20px 24px", color: "#888", fontSize: "14px" }}>
                      Tidak ada produk ditemukan untuk &ldquo;<strong style={{ color: "#111" }}>{debouncedQuery}</strong>&rdquo;
                    </div>
                  )}

                  {/* Result items */}
                  {results.map((product, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => goToProduct(product.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "12px 24px",
                          cursor: "pointer",
                          backgroundColor: isActive ? "#f5f5f5" : "#fff",
                          borderBottom: "1px solid #f8f8f8",
                          transition: "background-color 0.12s",
                        }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseLeave={() => setActiveIndex(-1)}
                      >
                        {/* Thumbnail */}
                        <div
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "6px",
                            overflow: "hidden",
                            flexShrink: 0,
                            backgroundColor: "#f0eff4",
                          }}
                        >
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="20" height="20" fill="none" stroke="#ccc" strokeWidth="1.5" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#111",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {product.name}
                          </div>
                          {product.category && (
                            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                              {product.category}
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#111", flexShrink: 0 }}>
                          Rp {formatRupiah(product.price)}
                        </div>

                        {/* Arrow indicator */}
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke={isActive ? "#111" : "#ccc"}
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          style={{ flexShrink: 0, transition: "stroke 0.12s" }}
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </motion.div>
                    );
                  })}

                  {/* View all results footer */}
                  {results.length > 0 && (
                    <div
                      onClick={() => goToShopSearch(query)}
                      style={{
                        padding: "14px 24px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#fafafa",
                        borderTop: "1px solid #f0f0f0",
                        color: "#111",
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                      }}
                    >
                      <span>
                        Lihat semua hasil untuk &ldquo;<span style={{ color: "#e53935" }}>{query}</span>&rdquo;
                      </span>
                      <svg width="16" height="16" fill="none" stroke="#111" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CSS spin animation */}
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchDropdown;
