import api from "@/api";

export const fetchWishlistApi = async () => {
  const response = await api.get("/wishlist");
  return response.data.data;
};

export const addWishlistApi = async (productId: number) => {
  const response = await api.post("/wishlist", { productId });
  return response.data.data;
};

export const removeWishlistApi = async (productId: number) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};
