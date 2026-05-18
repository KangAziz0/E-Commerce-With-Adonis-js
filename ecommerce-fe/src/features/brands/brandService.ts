import httpClient from "@/lib/httpClient";
import type { SaveBrandPayload } from "./brand.types";

const brandService = {
  getAll: () => httpClient.get("/admin/brands"),
  show: (id: number) => httpClient.get(`/admin/brands/${id}`),
  create: (data: Omit<SaveBrandPayload, "id">) =>
    httpClient.post("/admin/brands", data),
  update: (id: number, data: Omit<SaveBrandPayload, "id">) =>
    httpClient.put(`/admin/brands/${id}`, data),
  delete: (id: number) => httpClient.delete(`/admin/brands/${id}`),
};

export default brandService;
