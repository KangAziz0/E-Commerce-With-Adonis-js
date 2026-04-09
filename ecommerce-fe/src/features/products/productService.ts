import api from "@/api";
import { Product } from "@/types/ui/product";

const productService = {
  getAll: () => api.get("/products"),
  getDetail: (id: number) => api.get(`/products/${id}`),
  create: (data: Product) => api.post("/admin/products", data),
  update: (data: Product) => api.put(`/admin/products/${data.id}`, data),
  delete: (id: number) => api.delete(`/admin/products/${id}`),
};

export default productService;
