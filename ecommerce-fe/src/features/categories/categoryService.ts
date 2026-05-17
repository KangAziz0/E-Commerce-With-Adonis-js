import httpClient from "@/lib/httpClient";
import type { SaveCategoryPayload } from "./category.types";

const categoriesService = {
  getAll: () => httpClient.get("/admin/categories"),
  show: (id: number) => httpClient.get(`/admin/categories/${id}`),
  create: (data: Omit<SaveCategoryPayload, "id">) =>
    httpClient.post("/admin/categories", data),
  update: (id: number, data: Omit<SaveCategoryPayload, "id">) =>
    httpClient.put(`/admin/categories/${id}`, data),
  delete: (id: number) => httpClient.delete(`/admin/categories/${id}`),
};

export default categoriesService;
