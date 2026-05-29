import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AddToCartPayload, CartItem } from "./cart.types";

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ===== Fetch cart from API =====
    fetchCartRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess(state, action: PayloadAction<CartItem[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== Add to cart =====
    addToCartRequest(state, _action: PayloadAction<AddToCartPayload>) {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess(state, action: PayloadAction<CartItem[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    addToCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== Decrease quantity =====
    decreaseQtyRequest(state, _action: PayloadAction<{ id: number }>) {
      state.loading = true;
      state.error = null;
    },

    // ===== Remove item from cart =====
    removeFromCartRequest(state, _action: PayloadAction<{ id: number }>) {
      state.loading = true;
      state.error = null;
    },

    // ===== Clear cart =====
    clearCartRequest(state) {
      state.loading = true;
      state.error = null;
    },
    clearCartSuccess(state) {
      state.loading = false;
      state.items = [];
    },

    // ===== Cart UI state =====
    openCart(state) {
      state.isCartOpen = true;
    },
    closeCart(state) {
      state.isCartOpen = false;
    },
  },
});

export const {
  fetchCartRequest,
  fetchCartSuccess,
  fetchCartFailure,
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  decreaseQtyRequest,
  removeFromCartRequest,
  clearCartRequest,
  clearCartSuccess,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
