import { ProductCard } from '@/components/common/CardProduct'
import { fetchWishlistRequest } from '@/features/wishlist/wishlistSlice'
import { RootState } from '@/store/store'
import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const WishlistPage = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.wishlist)

  useEffect(() => { dispatch(fetchWishlistRequest()) }, [dispatch])

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <div className='py-4 px-4 px-lg-5' style={{ backgroundColor: '#f5f4f0' }}>
        <Container>
          <h1 className='fw-bold mb-1' style={{ fontSize: '28px', color: '#111' }}>Wishlist</h1>
        </Container>
      </div>
      <Container className='py-5'>
        <div className='row g-5'>
          <div className='col-lg-3 col-md-4'>
            <div className='p-3 rounded border'>
              <h6 className='mb-2'>Filter</h6>
              <small className='text-muted'>Saved items ({items.length})</small>
            </div>
          </div>
          <div className='col-lg-9 col-md-8'>
            <div className='row g-4'>
              {items.length === 0 ? <p className='text-muted'>Wishlist kamu masih kosong.</p> : items.map((item) => (
                <div className='col-xl-4 col-lg-6 col-md-6' key={item.id}>
                  <ProductCard product={item.product as any} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default WishlistPage
