import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchProductsRequest } from "@/features/products/productSlice";
import Hero from "@/components/home/HeroSection";
import ProductSection from "@/components/home/ProductSection";
import WhyChooseUs from "@/components/home/WhyChooseUsSection";
import { RootState } from "@/store/store";

export default function Home() {
  const dispatch = useDispatch();

  const products = useSelector((state: RootState) => state.products.data);

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  return (
    <div style={{ backgroundColor: "#f0fdf4" }}>
      <Hero />
      <ProductSection data={products} />
      <WhyChooseUs />
    </div>
  );
}
