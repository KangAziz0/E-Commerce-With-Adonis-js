import api from '@/api'

export const fetchWishlistApi = async () => {
  const response = await api.get('/api/wishlist')
  return response.data.data
}

export const addWishlistApi = async (productId: number) => {
  const response = await api.post('/api/wishlist', { productId })
  return response.data.data
}

export const removeWishlistApi = async (productId: number) => {
  const response = await api.delete(`/api/wishlist/${productId}`)
  return response.data
}
