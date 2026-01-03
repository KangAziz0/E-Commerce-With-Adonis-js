import api from "../../api";
import { Product } from "../../types/Product";

const productService = {
  getAll: () => api.get("/products"),
  create: (data: Product) => api.post("/admin/products", data),
  update: (data: Product) => api.put(`/admin/products/${data.id}`, data),
  delete: (id: number) => api.delete(`/admin/products/${id}`),
};

export default productService;
