import httpClient from "@/lib/httpClient";
import type { CartItem } from "./cart.types";

export interface AddToCartPayload {
  productId: number;
  variantId?: number | null;
  qty: number;
  price: number;
  size?: string;
  color?: string;
}

export interface UpdateCartItemPayload {
  id: number;
  qty: number;
}

interface ProductColorAPI {
  id: number;
  name: string;
  hex: string;
}

interface ProductImageAPI {
  id: number;
  productId: number;
  colorId: number;
  imageUrl: string;
}

interface CartItemAPI {
  id: number;
  cartId: number;
  productId: number;
  variantId: number | null;
  qty: number;
  price: number;
  size: string | null;
  color: string | null;
  product: {
    id: number;
    name: string;
    price: number;
    images?: ProductImageAPI[];
    colors?: ProductColorAPI[];
  };
}

interface CartAPI {
  id: number;
  userId: number;
  items: CartItemAPI[];
}

function getImageForCartItem(item: CartItemAPI): string {
  const images = item.product?.images ?? [];
  const colors = item.product?.colors ?? [];

  // If cart item has a color, find image by color index (same logic as productMapper)
  if (item.color && colors.length > 0) {
    const colorIndex = colors.findIndex(
      (c) => c.name.toLowerCase() === item.color!.toLowerCase(),
    );
    if (colorIndex >= 0 && images[colorIndex]) {
      return images[colorIndex].imageUrl;
    }
  }

  // Try matching by colorId
  if (item.color && colors.length > 0) {
    const matchedColor = colors.find(
      (c) => c.name.toLowerCase() === item.color!.toLowerCase(),
    );
    if (matchedColor) {
      const matchedImage = images.find(
        (img) => img.colorId === matchedColor.id,
      );
      if (matchedImage) return matchedImage.imageUrl;
    }
  }

  // Fallback: first image available
  return images[0]?.imageUrl ?? "";
}

function mapCartItemFromAPI(item: CartItemAPI): CartItem {
  // Use product price as source of truth, fallback to stored cart item price
  const price = item.product?.price ? Number(item.product.price) : item.price;

  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    name: item.product?.name ?? "",
    price,
    quantity: item.qty,
    weight: 0,
    size: item.size ?? undefined,
    color: item.color ?? undefined,
    image: getImageForCartItem(item),
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
