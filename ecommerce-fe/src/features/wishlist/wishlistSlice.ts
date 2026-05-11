import { Product } from '@/types/ui/product'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type WishlistItem = { id: number; productId: number; product: Product }

type WishlistState = {
  items: WishlistItem[]
  loading: boolean
  error: string | null
}

const initialState: WishlistState = { items: [], loading: false, error: null }

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    fetchWishlistRequest(state) { state.loading = true },
    fetchWishlistSuccess(state, action: PayloadAction<WishlistItem[]>) { state.loading = false; state.items = action.payload },
    toggleWishlistRequest(state, _action: PayloadAction<{ productId: number }>) { state.loading = true },
    wishlistFailure(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload },
  },
})

export const { fetchWishlistRequest, fetchWishlistSuccess, toggleWishlistRequest, wishlistFailure } = wishlistSlice.actions
export default wishlistSlice.reducer
