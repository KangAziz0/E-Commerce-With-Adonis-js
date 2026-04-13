import api from "@/api";
import { CreateInvoicePayload } from "./order.type";

const orderService = {
  createInvoice: async (data: CreateInvoicePayload) => {
    const res = await api.post("/invoices", data);
    return res.data.data;
  },

  getOrderByExternalId: async (externalId: string) => {
    const res = await api.get(`/orders/${externalId}`);
    return res.data.data;
  },
};
export default orderService;
