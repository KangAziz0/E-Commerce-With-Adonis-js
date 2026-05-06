import api from "@/api";
import { CreateInvoicePayload, GetRatesParams } from "./checkout.type";

const checkoutService = {
  getRates: async (params: GetRatesParams) => {
    const response = await api.post(`/shipping/rates`, params);
    return response.data;
  },
  createInvoice: async (data: CreateInvoicePayload) => {
    const res = await api.post("/invoices", data);
    return res.data.data;
  },
};

export default checkoutService;
