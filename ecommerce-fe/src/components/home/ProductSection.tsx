import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "react-bootstrap";
import { FaArrowRight, FaEye } from "react-icons/fa";
import { ProductCard } from "../common/CardProduct";
import { Link } from "react-router-dom";
import { Product } from "@/types/ui/product";

const categories = ["Best Sellers", "New Arrivals", "Hot Sales"] as const;
type Category = (typeof categories)[number];

type ProductSectionProps = {
  data: Product[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, ease: "easeOut" as const },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const ProductSection: React.FC<ProductSectionProps> = ({ data }) => {
  const [activeCategory, setActiveCategory] =
    useState<Category>("Best Sellers");

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
  };

  const products = data
    .filter((p) => {
      if (activeCategory === "Best Sellers") {
        return p.rating >= 4;
      }
      if (activeCategory === "New Arrivals") {
        return p.badge === "NEW";
      }
      if (activeCategory === "Hot Sales") {
        return p.badge === "SALE";
      }
      return true;
    })
    .slice(0, 8);

  return (
    <section className="py-5" style={{ backgroundColor: "#fff" }}>
      <Container className="px-4 px-lg-5">
        {/* Category Tabs */}
        <div className="d-flex justify-content-center align-items-center gap-4 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="border-0 bg-transparent fw-bold pb-1 position-relative"
              style={{
                fontSize: "clamp(16px, 2vw, 22px)",
                color: activeCategory === cat ? "#111" : "#bbb",
                cursor: "pointer",
                transition: "color 0.25s ease",
                letterSpacing: "-0.3px",
              }}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div
                  layoutId="category-underline"
                  className="position-absolute bottom-0 start-0 w-100"
                  style={{ height: "2px", backgroundColor: "#e53935" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {products.map((product) => (
              <div className="col" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* See All Button */}
        <div className="d-flex justify-content-center mt-5">
          <Link to="/shop" style={{ textDecoration: "none" }}>
            <motion.div
              className="d-inline-flex align-items-center gap-2 fw-semibold"
              style={{
                border: "1.5px solid #111",
                padding: "13px 40px",
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#111",
                cursor: "pointer",
              }}
              whileHover={{ backgroundColor: "#111", color: "#fff" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              See All Products
              <FaArrowRight />
            </motion.div>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default ProductSection;
