import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge, Card, Container, Form, Placeholder, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";

import { ProductCard } from "@/components/common/CardProduct";
import { fetchProductsRequest, resetProductListing } from "@/features/products/productSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const SORT_OPTIONS = ["latest", "price_asc", "price_desc", "rating_desc"] as const;
const PAGE_LIMIT = 9;

const ProductSkeleton: React.FC = () => (
  <Card className="border-0 shadow-sm h-100">
    <Placeholder as={Card.Img} animation="glow" style={{ height: 220 }} />
    <Card.Body>
      <Placeholder as={Card.Title} animation="glow"><Placeholder xs={8} /></Placeholder>
      <Placeholder as="p" animation="glow"><Placeholder xs={6} /></Placeholder>
      <Placeholder.Button variant="secondary" xs={12} />
    </Card.Body>
  </Card>
);

const ShopPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, meta } = useAppSelector((state) => state.products);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]>("latest");
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const hasMore = meta?.hasMorePages ?? false;

  const loadProducts = useCallback(
    (targetPage: number, append: boolean) => {
      dispatch(
        fetchProductsRequest({
          page: targetPage,
          limit: PAGE_LIMIT,
          append,
          search: search.trim(),
          sortBy,
        }),
      );
    },
    [dispatch, search, sortBy],
  );

  useEffect(() => {
    dispatch(resetProductListing());
    setPage(1);
    loadProducts(1, false);
  }, [dispatch, loadProducts]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first.isIntersecting || loading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        loadProducts(nextPage, true);
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadProducts, loading, page]);

  const resultLabel = useMemo(() => {
    if (!meta) return "0 hasil";
    return `${data.length} dari ${meta.total} produk`;
  }, [data.length, meta]);

  return (
    <div className="bg-light min-vh-100 py-4">
      <Container>
        <div className="mb-4">
          <h1 className="fw-bold mb-1">Shop</h1>
          <p className="text-muted mb-0">Temukan produk terbaik dengan pengalaman belanja yang lebih cepat.</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 fw-semibold">Filter</h6>
                  <Badge bg="dark" pill>{meta?.total ?? 0}</Badge>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted">Cari Produk</Form.Label>
                  <Form.Control
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ketik nama produk..."
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="small text-muted">Urutkan</Form.Label>
                  <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value as (typeof SORT_OPTIONS)[number])}>
                    <option value="latest">Terbaru</option>
                    <option value="price_asc">Harga Terendah</option>
                    <option value="price_desc">Harga Tertinggi</option>
                    <option value="rating_desc">Rating Tertinggi</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </div>

          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="text-muted mb-0">Menampilkan {resultLabel}</p>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              {data.map((product, idx) => (
                <motion.div key={product.id} className="col" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}

              {loading &&
                Array.from({ length: PAGE_LIMIT }).map((_, index) => (
                  <div className="col" key={`skeleton-${index}`}>
                    <ProductSkeleton />
                  </div>
                ))}
            </div>

            {!loading && data.length === 0 && (
              <Card className="border-0 shadow-sm rounded-4 mt-3">
                <Card.Body className="text-center py-5 text-muted">Produk tidak ditemukan.</Card.Body>
              </Card>
            )}

            <div ref={observerTarget} className="d-flex justify-content-center py-4">
              {loading && data.length > 0 && <Spinner animation="border" variant="secondary" />}
              {!hasMore && data.length > 0 && <small className="text-muted">Semua produk sudah ditampilkan.</small>}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ShopPage;
