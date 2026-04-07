import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchProductsRequest } from "@/features/products/productSlice";
import HeroSection from "@/components/home/HeroSection";
import FeatureBanner from "@/components/home/FeatureBanner";
import { products } from "@/data/products";

export default function Home() {
  const dispatch = useDispatch();
  // const { products } = useSelector((state: RootState) => state.products);
  // const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div style={{ backgroundColor: "#f0fdf4" }}>
      <HeroSection />
      <FeatureBanner />
    </div>
  );
}
