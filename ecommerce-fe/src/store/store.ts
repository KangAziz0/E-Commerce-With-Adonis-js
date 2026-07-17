import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import adminReducer from "@/features/admin/adminSlice";
import authReducer from "@/features/auth/authSlice";
import brandReducer from "@/features/brands/brandSlice";
import cartReducer from "@/features/cart/cartSlice";
import categoryReducer from "@/features/categories/categorySlice";
import checkoutReducer from "@/features/checkout/checkoutSlice";
import orderReducer from "@/features/orders/orderSlice";
import productReducer from "@/features/products/productSlice";
import areaSelectorReducer from "@/features/selectors/areas/areaSlice";
import voucherReducer from "@/features/vouchers/voucherSlice";
import wishlistReducer from "@/features/wishlist/wishlistSlice";
import rootSaga from "@/store/rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    brands: brandReducer,
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    order: orderReducer,
    checkout: checkoutReducer,
    areas: areaSelectorReducer,
    vouchers: voucherReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
