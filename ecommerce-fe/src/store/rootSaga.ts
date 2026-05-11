import { all } from "redux-saga/effects";
import watchProducts from "@/features/products/productSaga";
import watchAuth from "@/features/auth/authSaga";
import watchCategories from "@/features/categories/categorySaga";
import watchCart from "@/features/cart/cartSaga";
import watchOrder from "@/features/orders/orderSaga";
import watchCheckout from "@/features/checkout/checkoutSaga";
import watchAreaSelector from "@/features/selectors/areas/areaSaga";
import watchWishlist from '@/features/wishlist/wishlistSaga';

export default function* rootSaga() {
  yield all([
    watchProducts(),
    watchAuth(),
    watchCategories(),
    watchCart(),
    watchOrder(),
    watchCheckout(),
    watchAreaSelector(),
    watchWishlist(),
  ]);
}
