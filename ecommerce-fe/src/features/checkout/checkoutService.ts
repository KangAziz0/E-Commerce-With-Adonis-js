import httpClient from "@/lib/httpClient";
import type { CreateInvoicePayload, GetRatesParams } from "./checkout.types";

const checkoutService = {
  getRates: async (params: GetRatesParams) => {
    const response = await httpClient.post("/shipping/rates", params);
    return response.data;
  },
  createInvoice: async (data: CreateInvoicePayload) => {
    const response = await httpClient.post("/invoices", data);
    return response.data?.data;
  },
};

export default checkoutService;
