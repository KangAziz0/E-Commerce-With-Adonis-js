import httpClient from "@/lib/httpClient";
import type { FetchProductsParams, ProductSortBy } from "@/types/api/product";
import type { Product } from "@/types/ui/product";

interface SortQuery {
  sort_by: string;
  sort_order: "asc" | "desc";
}

const SORT_QUERY_MAP: Record<ProductSortBy, SortQuery> = {
  latest: { sort_by: "created_at", sort_order: "desc" },
  price_asc: { sort_by: "price", sort_order: "asc" },
  price_desc: { sort_by: "price", sort_order: "desc" },
  // Backend doesn't yet support a real rating sort — fall back to latest.
  rating_desc: { sort_by: "created_at", sort_order: "desc" },
};

const mapSortQuery = (sortBy: ProductSortBy = "latest"): SortQuery =>
  SORT_QUERY_MAP[sortBy];

const productService = {
  getAll: (params: FetchProductsParams = {}) =>
    httpClient.get("/products", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        ...mapSortQuery(params.sortBy),
      },
    }),
  getDetail: (id: number) => httpClient.get(`/products/${id}`),
  create: (data: Product) => httpClient.post("/admin/products", data),
  update: (data: Product) => httpClient.put(`/admin/products/${data.id}`, data),
  delete: (id: number) => httpClient.delete(`/admin/products/${id}`),
};

export default productService;
