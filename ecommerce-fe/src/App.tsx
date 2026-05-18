import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ScrollToTop from "@/components/common/ScrollToTop";
import { fetchMeRequest } from "@/features/auth/authSlice";
import { fetchWishlistRequest } from "@/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import AppRoutes from "@/routes/routes";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loginOtpSent = useAppSelector((state) => state.auth.login.otpSent);
  const registerOtpSent = useAppSelector((state) => state.auth.register.otpSent);
  const otpSent = loginOtpSent || registerOtpSent;

  useEffect(() => {
    dispatch(fetchMeRequest());
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(fetchWishlistRequest());
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <ScrollToTop />
      <AppRoutes otpSent={otpSent} />
    </BrowserRouter>
  );
}

export default App;
