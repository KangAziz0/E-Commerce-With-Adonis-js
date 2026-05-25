import httpClient from "@/lib/httpClient";
import type {
  CreateInvoicePayload,
  GetRatesParams,
  PaymentStatusResponse,
} from "./checkout.types";

const checkoutService = {
  getRates: async (params: GetRatesParams) => {
    const response = await httpClient.post("/shipping/rates", params);
    return response.data;
  },
  createInvoice: async (data: CreateInvoicePayload) => {
    const response = await httpClient.post("/invoices", data);
    return response.data?.data;
  },
  getPaymentStatus: async (orderId: string): Promise<PaymentStatusResponse> => {
    const response = await httpClient.get(
      `/orders/${orderId}/payment-status`,
    );
    return response.data?.data ?? response.data;
  },
};

export default checkoutService;
