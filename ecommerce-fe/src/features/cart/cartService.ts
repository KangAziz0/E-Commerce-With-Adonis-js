import httpClient from "@/lib/httpClient";
import type { CartItem } from "./cart.types";

export interface AddToCartPayload {
  productId: number;
  qty: number;
  price: number;
  size?: string;
  color?: string;
}

export interface UpdateCartItemPayload {
  id: number;
  qty: number;
}

interface CartItemAPI {
  id: number;
  cartId: number;
  productId: number;
  qty: number;
  price: number;
  size: string | null;
  color: string | null;
  product: {
    id: number;
    name: string;
    price: number;
    images?: { url: string }[];
  };
}

interface CartAPI {
  id: number;
  userId: number;
  items: CartItemAPI[];
}

function mapCartItemFromAPI(item: CartItemAPI): CartItem {
  const image = item.product?.images?.[0]?.url ?? "";
  return {
    id: item.id,
    productId: item.productId,
    name: item.product?.name ?? "",
    price: item.price,
    quantity: item.qty,
    weight: 0,
    size: item.size ?? undefined,
    color: item.color ?? undefined,
    image,
  };
}

const cartService = {
  getAll: async (): Promise<CartItem[]> => {
    const response = await httpClient.get("/cart");
    const cart: CartAPI | null = response.data?.data ?? null;
    if (!cart || !cart.items) return [];
    return cart.items.map(mapCartItemFromAPI);
  },

  add: async (payload: AddToCartPayload): Promise<CartItem[]> => {
    await httpClient.post("/cart", payload);
    // Re-fetch the full cart so we have fresh data with product info
    return cartService.getAll();
  },

  update: async (payload: UpdateCartItemPayload): Promise<CartItem[]> => {
    await httpClient.put(`/cart/${payload.id}`, { qty: payload.qty });
    return cartService.getAll();
  },

  remove: async (id: number): Promise<CartItem[]> => {
    await httpClient.delete(`/cart/${id}`);
    return cartService.getAll();
  },

  clear: async (): Promise<void> => {
    await httpClient.delete("/cart-clear");
  },
};

export default cartService;
