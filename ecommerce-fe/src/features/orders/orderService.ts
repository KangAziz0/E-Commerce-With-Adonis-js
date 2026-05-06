import api from "@/api";

const orderService = {
  getOrderByExternalId: async (externalId: string) => {
    const res = await api.get(`/orders/${externalId}`);
    return res.data.data;
  },
};
export default orderService;
