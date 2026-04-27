import api from "@/api";
import { GetRatesParams } from "./checkout.type";

const checkoutService = {
  getRates: async (params: GetRatesParams) => {
    const response = await api.get(`/shipping/rates`, {
      params,
    });

    return response.data.data;
  },
};

export default checkoutService;
