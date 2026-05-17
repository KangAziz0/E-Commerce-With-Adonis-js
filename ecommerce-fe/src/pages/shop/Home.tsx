import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";

import Hero from "@/components/home/HeroSection";
import ProductSection from "@/components/home/ProductSection";
import WhyChooseUs from "@/components/home/WhyChooseUsSection";
import FAQ from "@/components/home/FaqSection";
import { fetchProductsRequest } from "@/features/products/productSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

// ─── Parallax Section Wrapper ────────────────────────────────────────────────
// Each section gets a subtle parallax offset as it enters the viewport.

interface ParallaxSectionProps {
  children: React.ReactNode;
  /** How many px the section slides up from its initial off-screen position */
  yOffset?: number;
  /** Parallax depth for the background (0 = none) */
  bgDepth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  yOffset = 48,
  bgDepth = 0,
  className,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Entrance: fades + slides up once when section enters viewport
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Continuous parallax: inner content moves slightly while section is visible
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${bgDepth}px`, `${-bgDepth}px`]
  );
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
      initial={{ opacity: 0, y: yOffset }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Inner wrapper that carries the continuous parallax drift */}
      <motion.div style={{ y: bgDepth > 0 ? springY : undefined }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

// ─── Divider with parallax line reveal ───────────────────────────────────────

const ParallaxDivider: React.FC<{ flip?: boolean }> = ({ flip = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      style={{
        overflow: "hidden",
        height: 2,
        background: "transparent",
        margin: 0,
        position: "relative",
        zIndex: 2,
      }}
    >
      <motion.div
        initial={{ scaleX: 0, originX: flip ? 1 : 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: "100%",
          background:
            "linear-gradient(to right, transparent, #e5e5e5 20%, #e5e5e5 80%, transparent)",
          transformOrigin: flip ? "right" : "left",
        }}
      />
    </div>
  );
};

// ─── Floating scroll-progress indicator ──────────────────────────────────────

const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "#111",
        scaleX,
        transformOrigin: "left",
        zIndex: 9999,
      }}
    />
  );
};

// ─── Section label badge ──────────────────────────────────────────────────────

const SectionBadge: React.FC<{ label: string; index: number }> = ({
  label,
  index,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      style={{
        position: "absolute",
        top: 32,
        left: 24,
        display: "flex",
        alignItems: "center",
        gap: 8,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#bbb",
        }}
      >
        {String(index).padStart(2, "0")} — {label}
      </span>
    </motion.div>
  );
};

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.data);

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  return (
    <>
      {/* Scroll progress bar at very top */}
      <ScrollProgress />

      <div style={{ backgroundColor: "#ffffff", overflowX: "hidden" }}>

        {/* ── 01  Hero ─────────────────────────────────────────────────────── */}
        {/*
          Hero already has its own internal parallax (useScroll bgY / textY).
          We just mount it directly — no extra wrapper needed, or scroll
          progress would fight the inner transforms.
        */}
        <Hero />

        <ParallaxDivider />

        {/* ── 02  Products ─────────────────────────────────────────────────── */}
        <ParallaxSection
          yOffset={60}
          bgDepth={24}
          style={{ position: "relative", background: "#fff" }}
        >
          <SectionBadge label="Products" index={2} />
          <ProductSection data={products} />
        </ParallaxSection>

        <ParallaxDivider flip />

        {/* ── 03  Why Choose Us ────────────────────────────────────────────── */}
        <ParallaxSection
          yOffset={60}
          bgDepth={32}
          style={{ position: "relative", background: "#f5f4f0" }}
        >
          <SectionBadge label="Why Us" index={3} />
          <WhyChooseUs />
        </ParallaxSection>

        <ParallaxDivider />

        {/* ── 04  FAQ ──────────────────────────────────────────────────────── */}
        <ParallaxSection
          yOffset={60}
          bgDepth={28}
          style={{ position: "relative", background: "#fafafa" }}
        >
          <SectionBadge label="FAQ" index={4} />
          <FAQ />
        </ParallaxSection>

        {/* ── Footer spacer ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center",
            padding: "32px 24px",
            background: "#0a0a0a",
            color: "rgba(255,255,255,0.25)",
            fontSize: "0.75rem",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          © {new Date().getFullYear()} Male Fashion — Crafted with care
        </motion.div>
      </div>
    </>
  );
}
