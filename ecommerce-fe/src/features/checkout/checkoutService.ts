import api from "@/api";
import { GetRatesParams } from "./checkout.type";

const checkoutService = {
  getRates: async (params: GetRatesParams) => {
    const response = await api.post(`/shipping/rates`, params);
    return response.data;
  },
};

export default checkoutService;
