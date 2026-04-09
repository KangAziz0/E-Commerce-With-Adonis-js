import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "react-bootstrap";

interface Slide {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  bgColor: string;
  circleColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    label: "SUMMER COLLECTION",
    title: "Fall – Winter",
    subtitle: "Collections 2030",
    description:
      "A specialist label creating luxury essentials. Ethically crafted with an unwavering commitment to exceptional quality.",
    imageUrl:
      "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=700&q=80",
    accentColor: "#e53935",
    bgColor: "#f0ede8",
    circleColor: "#f5d6d3",
  },
  {
    id: 2,
    label: "NEW ARRIVALS",
    title: "Spring – Summer",
    subtitle: "Lookbook 2031",
    description:
      "Timeless silhouettes reimagined for the modern era. Discover pieces that transcend seasonal trends.",
    imageUrl:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=700&q=80",
    accentColor: "#1565c0",
    bgColor: "#eaf0f7",
    circleColor: "#c5d8f0",
  },
  {
    id: 3,
    label: "EXCLUSIVE EDIT",
    title: "Urban – Luxe",
    subtitle: "Capsule Series",
    description:
      "Limited edition pieces for the discerning few. Crafted from the world's finest materials, designed for the streets.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80",
    accentColor: "#2e7d32",
    bgColor: "#edf5ee",
    circleColor: "#c8e6c9",
  },
];

const DotPattern: React.FC<{ color?: string }> = ({ color = "#ccc" }) => (
  <svg width="160" height="160" viewBox="0 0 160 160">
    {Array.from({ length: 8 }).map((_, row) =>
      Array.from({ length: 10 }).map((_, col) => (
        <circle
          key={`${row}-${col}`}
          cx={col * 18 + 9}
          cy={row * 18 + 9}
          r="2.5"
          fill={color}
        />
      )),
    )}
  </svg>
);

const SocialIcon: React.FC<{ type: string }> = ({ type }) => {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    twitter: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
    pinterest: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
    instagram: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  };
  return <>{icons[type]}</>;
};

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = slides.length;

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setCurrent((index + total) % total);
    },
    [total],
  );

  const prev = () => goTo(current - 1, -1);
  const next = () => goTo(current + 1, 1);

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1, 1), 5500);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];

  const textVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.55, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" as const },
    }),
  };

  const imageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 1.06,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.45, ease: "easeIn" as const },
    }),
  };

  const circleVariants = {
    enter: { scale: 0.7, opacity: 0 },
    center: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.1 },
    },
    exit: { scale: 1.1, opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <section
      className="position-relative overflow-hidden d-flex align-items-center"
      style={{
        backgroundColor: slide.bgColor,
        minHeight: "100vh",
        transition: "background-color 0.6s ease",
      }}
    >
      {/* Left arrow */}
      <button
        onClick={prev}
        className="position-absolute d-flex align-items-center justify-content-center border-0 bg-transparent"
        style={{
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: "44px",
          height: "44px",
          cursor: "pointer",
          color: "#555",
        }}
      >
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        className="position-absolute d-flex align-items-center justify-content-center border-0 bg-transparent"
        style={{
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: "44px",
          height: "44px",
          cursor: "pointer",
          color: "#555",
        }}
      >
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Main content */}
      <Container>
        <div className="row align-items-center" style={{ minHeight: "100vh" }}>
          {/* LEFT: Text content */}
          <div className="col-lg-5 col-md-6 ps-5">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Label */}
                <p
                  className="fw-semibold mb-3 text-uppercase"
                  style={{
                    color: slide.accentColor,
                    fontSize: "12px",
                    letterSpacing: "3px",
                  }}
                >
                  {slide.label}
                </p>

                {/* Heading */}
                <h1
                  className="fw-bold mb-4"
                  style={{
                    fontSize: "clamp(36px, 4.5vw, 58px)",
                    lineHeight: "1.1",
                    color: "#111",
                    letterSpacing: "-1px",
                  }}
                >
                  {slide.title}
                  <br />
                  {slide.subtitle}
                </h1>

                {/* Description */}
                <p
                  style={{
                    color: "#777",
                    fontSize: "15px",
                    lineHeight: "1.75",
                    maxWidth: "380px",
                    marginBottom: "36px",
                  }}
                >
                  {slide.description}
                </p>

                {/* CTA Button */}
                <motion.a
                  href="#"
                  className="d-inline-flex align-items-center gap-3 text-decoration-none text-white fw-semibold"
                  style={{
                    backgroundColor: "#111",
                    padding: "14px 32px",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                  whileHover={{
                    backgroundColor: slide.accentColor,
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  Shop Now
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.a>
              </motion.div>
            </AnimatePresence>

            {/* Social icons */}
            <div className="d-flex gap-4 mt-5 pt-3">
              {["facebook", "twitter", "pinterest", "instagram"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-decoration-none"
                  style={{ color: "#888", transition: "color 0.2s" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = slide.accentColor)
                  }
                  onMouseOut={(e) => (e.currentTarget.style.color = "#888")}
                >
                  <SocialIcon type={s} />
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: Image + decorative elements */}
          <div
            className="col-lg-7 col-md-6 position-relative d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
          >
            {/* Dot pattern top-left */}
            <div
              className="position-absolute"
              style={{ top: "10%", left: "10%", opacity: 0.6, zIndex: 1 }}
            >
              <DotPattern color="#bbb" />
            </div>

            {/* Dot pattern bottom-right */}
            <div
              className="position-absolute"
              style={{ bottom: "8%", right: "5%", opacity: 0.5, zIndex: 1 }}
            >
              <DotPattern color="#ccc" />
            </div>

            {/* Circle background */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`circle-${slide.id}`}
                variants={circleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="position-absolute rounded-circle"
                style={{
                  width: "clamp(320px, 42vw, 580px)",
                  height: "clamp(320px, 42vw, 580px)",
                  backgroundColor: slide.circleColor,
                  zIndex: 2,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </AnimatePresence>

            {/* Person image */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`img-${slide.id}`}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="position-relative"
                style={{ zIndex: 3, maxWidth: "420px", width: "100%" }}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.subtitle}
                  style={{
                    width: "100%",
                    height: "clamp(420px, 55vh, 680px)",
                    objectFit: "cover",
                    objectPosition: "top center",
                    display: "block",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>

      {/* Slide counter */}
      <div
        className="position-absolute d-flex gap-2"
        style={{
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className="border-0 p-0"
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: i === current ? slide.accentColor : "#ccc",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
