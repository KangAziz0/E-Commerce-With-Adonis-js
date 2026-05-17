import httpClient from "@/lib/httpClient";

const wishlistService = {
  getAll: async () => {
    const response = await httpClient.get("/wishlist");
    return response.data?.data ?? [];
  },
  add: async (productId: number) => {
    const response = await httpClient.post("/wishlist", { productId });
    return response.data?.data;
  },
  remove: async (productId: number) => {
    const response = await httpClient.delete(`/wishlist/${productId}`);
    return response.data;
  },
};

export default wishlistService;
