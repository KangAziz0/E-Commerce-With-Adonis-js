import type { Product } from "@/types/ui/product";

/**
 * Wishlist row as stored on the server (id is the wishlist row id, not the
 * product id). The product itself is mapped through the standard product
 * mapper so the UI can render it like any other product card.
 */
export interface WishlistItem extends Product {
  wishlistId: number;
}
