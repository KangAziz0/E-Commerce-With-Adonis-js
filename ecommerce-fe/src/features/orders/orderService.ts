import httpClient from "@/lib/httpClient";

const orderService = {
  getOrderByExternalId: async (externalId: string) => {
    const response = await httpClient.get(`/orders/${externalId}`);
    return response.data?.data;
  },
};

export default orderService;
