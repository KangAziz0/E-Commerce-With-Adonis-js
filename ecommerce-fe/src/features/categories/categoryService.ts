import api from "../../api";
import { SaveCategoryPayload } from "./category.types";

const categoriesService = {
  getAll: () => api.get("/admin/categories"),

  create: (data: Omit<SaveCategoryPayload, "id">) =>
    api.post("/admin/categories", data),

  update: (id: number, data: Omit<SaveCategoryPayload, "id">) =>
    api.put(`/admin/categories/${id}`, data),

  show: (id: number) => api.get(`/admin/categories/${id}`),

  delete: (id: number) => api.delete(`/admin/categories/${id}`),
};

export default categoriesService;
