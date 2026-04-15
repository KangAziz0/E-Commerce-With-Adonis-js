import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
};

const initialState: CartState = {
  items: [],
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const product = action.payload;

      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += product.quantity;
      } else {
        state.items.push({
          ...product,
          quantity: product.quantity,
        });
      }
    },

    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },

    decreaseQty(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },

    openCart(state) {
      state.isCartOpen = true;
    },

    closeCart(state) {
      state.isCartOpen = false;
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  setCart,
  decreaseQty,
  removeFromCart,
  openCart,
  closeCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
