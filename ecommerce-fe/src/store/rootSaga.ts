import { all } from "redux-saga/effects";

import watchAuth from "@/features/auth/authSaga";
import watchCart from "@/features/cart/cartSaga";
import watchCategories from "@/features/categories/categorySaga";
import watchCheckout from "@/features/checkout/checkoutSaga";
import watchOrders from "@/features/orders/orderSaga";
import watchProducts from "@/features/products/productSaga";
import watchAreas from "@/features/selectors/areas/areaSaga";
import watchWishlist from "@/features/wishlist/wishlistSaga";

export default function* rootSaga() {
  yield all([
    watchAuth(),
    watchProducts(),
    watchCategories(),
    watchCart(),
    watchOrders(),
    watchCheckout(),
    watchAreas(),
    watchWishlist(),
  ]);
}
