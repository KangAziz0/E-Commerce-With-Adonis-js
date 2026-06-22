import { all } from "redux-saga/effects";

import watchAdmin from "@/features/admin/adminSaga";
import watchAuth from "@/features/auth/authSaga";
import watchBrands from "@/features/brands/brandSaga";
import watchCart from "@/features/cart/cartSaga";
import watchCategories from "@/features/categories/categorySaga";
import watchCheckout from "@/features/checkout/checkoutSaga";
import watchOrders from "@/features/orders/orderSaga";
import watchProducts from "@/features/products/productSaga";
import watchSearch from "@/features/search/searchSaga";
import watchAreas from "@/features/selectors/areas/areaSaga";
import watchWishlist from "@/features/wishlist/wishlistSaga";

export default function* rootSaga() {
  yield all([
    watchAdmin(),
    watchAuth(),
    watchBrands(),
    watchProducts(),
    watchSearch(),
    watchCategories(),
    watchCart(),
    watchOrders(),
    watchCheckout(),
    watchAreas(),
    watchWishlist(),
  ]);
}
