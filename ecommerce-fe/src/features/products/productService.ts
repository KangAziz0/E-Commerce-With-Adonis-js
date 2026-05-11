import api from "@/api";
import { Product } from "@/types/ui/product";
import { FetchProductsParams } from "@/types/api/product";

const mapSortQuery = (sortBy: FetchProductsParams["sortBy"]) => {
  if (sortBy === "price_asc") return { sort_by: "price", sort_order: "asc" };
  if (sortBy === "price_desc") return { sort_by: "price", sort_order: "desc" };
  if (sortBy === "rating_desc") return { sort_by: "created_at", sort_order: "desc" };
  return { sort_by: "created_at", sort_order: "desc" };
};

const productService = {
  getAll: (params: FetchProductsParams = {}) => {
    const sortQuery = mapSortQuery(params.sortBy);
    return api.get("/products", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 9,
        search: params.search || undefined,
        ...sortQuery,
      },
    });
  },
  getDetail: (id: number) => api.get(`/products/${id}`),
  create: (data: Product) => api.post("/admin/products", data),
  update: (data: Product) => api.put(`/admin/products/${data.id}`, data),
  delete: (id: number) => api.delete(`/admin/products/${id}`),
};

export default productService;
