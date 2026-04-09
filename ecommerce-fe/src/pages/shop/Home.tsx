import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchProductsRequest } from "@/features/products/productSlice";
import Hero from "@/components/home/HeroSection";
import ProductSection from "@/components/home/ProductSection";
import WhyChooseUs from "@/components/home/WhyChooseUsSection";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  return (
    <div style={{ backgroundColor: "#f0fdf4" }}>
      <Hero />
      <ProductSection />
      <WhyChooseUs />
    </div>
  );
}
