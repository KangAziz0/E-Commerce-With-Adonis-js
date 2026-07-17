import httpClient from "@/lib/httpClient";
import type { SaveVoucherPayload } from "./voucher.types";

const voucherService = {
  getAll: () => httpClient.get("/admin/vouchers"),
  show: (id: number) => httpClient.get(`/admin/vouchers/${id}`),
  create: (data: Omit<SaveVoucherPayload, "id">) =>
    httpClient.post("/admin/vouchers", data),
  update: (id: number, data: Omit<SaveVoucherPayload, "id">) =>
    httpClient.put(`/admin/vouchers/${id}`, data),
  delete: (id: number) => httpClient.delete(`/admin/vouchers/${id}`),
};

export default voucherService;
