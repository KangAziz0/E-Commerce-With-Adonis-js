import httpClient from "@/lib/httpClient";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  CreatePaymentPayload,
  GetRatesParams,
  PaymentResponse,
} from "./checkout.types";

const checkoutService = {
  getRates: async (params: GetRatesParams) => {
    const response = await httpClient.post("/shipping/rates", params);
    return response.data;
  },
  createOrder: async (data: CreateOrderPayload): Promise<CreateOrderResponse> => {
    const response = await httpClient.post("/orders/create", data);
    return response.data?.data ?? response.data;
  },
  createPayment: async (data: CreatePaymentPayload): Promise<PaymentResponse> => {
    const response = await httpClient.post("/payments/create", data);
    return response.data?.data ?? response.data;
  },
  getPaymentStatus: async (paymentId: number): Promise<PaymentResponse> => {
    const response = await httpClient.get(`/payments/${paymentId}/status`);
    return response.data?.data ?? response.data;
  },
};

export default checkoutService;
