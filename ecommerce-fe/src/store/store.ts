import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import productReducer from "@/features/products/productSlice";
import categoryReducer from "@/features/categories/categorySlice";
import cartReducer from "@/features/cart/cartSlice";
import orderReducer from "@/features/orders/orderSlice";
import checkoutReducer from "@/features/checkout/checkoutSlice";
import areaSelectorReducer from "@/features/selectors/areas/areaSlice";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    order: orderReducer,
    checkout: checkoutReducer,
    areas: areaSelectorReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});


sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
