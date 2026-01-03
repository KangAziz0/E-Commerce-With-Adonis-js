import api from "../../api";
import { Category } from "../../types/Category";

const categoriesService = {
  getAll: () => api.get("/admin/categories"),
  create: (data: Category) => api.post("/admin/categories", data),
  update: (data: Category) => api.put(`/admin/categories/${data.id}`, data),
  show: (id: number) => api.get(`/admin/categories/${id}`),
  delete: (id: number) => api.delete(`/admin/categories/${id}`),
};

export default categoriesService;
