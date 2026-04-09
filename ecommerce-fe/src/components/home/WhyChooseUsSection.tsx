import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "react-bootstrap";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}

const features: Feature[] = [
  {
    icon: (
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Fast & Free Shipping",
    description:
      "Every order ships free, no minimums. Your items arrive carefully packaged and on time — guaranteed.",
    accent: "#e8f4e8",
  },
  {
    icon: (
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    title: "Easy to Shop",
    description:
      "A streamlined experience from browse to checkout. Discover curated collections tailored to your taste.",
    accent: "#e8eef8",
  },
  {
    icon: (
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "24/7 Support",
    description:
      "Our team is always here for you. Real humans, real answers — whenever you need us, around the clock.",
    accent: "#fdf3e8",
  },
  {
    icon: (
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    title: "Hassle Free Returns",
    description:
      "Changed your mind? No problem. Return anything within 30 days — no questions, no complications.",
    accent: "#f3e8f8",
  },
];

const DotGrid: React.FC<{ color?: string; rows?: number; cols?: number }> = ({
  color = "#f5a623",
  rows = 5,
  cols = 8,
}) => (
  <svg
    width={cols * 20}
    height={rows * 20}
    viewBox={`0 0 ${cols * 20} ${rows * 20}`}
  >
    {Array.from({ length: rows }).map((_, r) =>
      Array.from({ length: cols }).map((_, c) => (
        <circle
          key={`${r}-${c}`}
          cx={c * 20 + 10}
          cy={r * 20 + 10}
          r="2.5"
          fill={color}
          opacity={0.7 - r * 0.1}
        />
      )),
    )}
  </svg>
);

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({
  feature,
  index,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: "easeOut" as const,
      }}
      className="d-flex flex-column gap-3 p-4 position-relative"
      style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: "1px solid #f0f0f0",
        overflow: "hidden",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
      }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
    >
      {/* Accent blob */}
      <div
        className="position-absolute"
        style={{
          top: "-20px",
          right: "-20px",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          backgroundColor: feature.accent,
          zIndex: 0,
        }}
      />

      {/* Icon */}
      <div
        className="d-flex align-items-center justify-content-center position-relative"
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          backgroundColor: feature.accent,
          color: "#333",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {feature.icon}
      </div>

      <div style={{ zIndex: 1 }}>
        <h6
          className="mb-2 fw-bold"
          style={{ fontSize: "15px", color: "#111", letterSpacing: "-0.2px" }}
        >
          {feature.title}
        </h6>
        <p
          className="mb-0"
          style={{ fontSize: "13.5px", color: "#888", lineHeight: "1.7" }}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const WhyChooseUs: React.FC = () => {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });
  const imageRef = useRef(null);
  const imageInView = useInView(imageRef, { once: true, margin: "-80px" });

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "#f5f4f0", overflow: "hidden" }}
    >
      <Container>
        <div className="row align-items-center g-5">
          {/* LEFT COLUMN */}
          <div className="col-lg-6">
            {/* Heading block */}
            <motion.div
              ref={headingRef}
              initial={{ opacity: 0, y: 28 }}
              animate={headingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: "easeOut" as const }}
              className="mb-5"
            >
              <p
                className="fw-semibold text-uppercase mb-2"
                style={{
                  color: "#e53935",
                  fontSize: "11px",
                  letterSpacing: "3px",
                }}
              >
                Our Promise
              </p>
              <h2
                className="fw-bold mb-3"
                style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  color: "#111",
                  letterSpacing: "-1px",
                  lineHeight: 1.15,
                }}
              >
                Why Choose{" "}
                <span style={{ position: "relative", display: "inline-block" }}>
                  Us
                  <motion.svg
                    viewBox="0 0 60 12"
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      left: 0,
                      width: "100%",
                      overflow: "visible",
                    }}
                    initial={{ pathLength: 0 }}
                    animate={headingInView ? { pathLength: 1 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: 0.4,
                      ease: "easeOut" as const,
                    }}
                  >
                    <motion.path
                      d="M2 8 Q30 2 58 8"
                      stroke="#e53935"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={headingInView ? { pathLength: 1 } : {}}
                      transition={{
                        duration: 0.55,
                        delay: 0.45,
                        ease: "easeOut" as const,
                      }}
                    />
                  </motion.svg>
                </span>
              </h2>
              <p
                style={{
                  color: "#888",
                  fontSize: "15px",
                  lineHeight: 1.75,
                  maxWidth: "420px",
                }}
              >
                We built Male Fashion around one idea: you deserve quality
                without compromise. Every piece, every policy, and every
                interaction is designed with you in mind.
              </p>
            </motion.div>

            {/* Feature cards grid */}
            <div className="row g-3">
              {features.map((feature, i) => (
                <div key={i} className="col-6">
                  <FeatureCard feature={feature} index={i} />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — Image + decorations */}
          <div
            ref={imageRef}
            className="col-lg-6 position-relative d-flex justify-content-center"
            style={{ minHeight: "520px" }}
          >
            {/* Dot grid top-left */}
            <motion.div
              className="position-absolute"
              style={{ top: "-10px", left: "0px", zIndex: 1 }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={imageInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: "easeOut" as const,
              }}
            >
              <DotGrid color="#f5a623" rows={5} cols={8} />
            </motion.div>

            {/* Dot grid bottom-right */}
            <motion.div
              className="position-absolute"
              style={{ bottom: "20px", right: "10px", zIndex: 1 }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={imageInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.25,
                ease: "easeOut" as const,
              }}
            >
              <DotGrid color="#ddd" rows={4} cols={6} />
            </motion.div>

            {/* Floating stat card */}
            <motion.div
              className="position-absolute d-flex align-items-center gap-3 bg-white px-4 py-3"
              style={{
                bottom: "60px",
                left: "20px",
                borderRadius: "14px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                zIndex: 4,
                minWidth: "180px",
              }}
              initial={{ opacity: 0, x: -30 }}
              animate={imageInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: 0.5,
                ease: "easeOut" as const,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "#fdf3e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#f5a623"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <p
                  className="mb-0 fw-bold"
                  style={{ fontSize: "18px", color: "#111" }}
                >
                  50K+
                </p>
                <p className="mb-0" style={{ fontSize: "11px", color: "#aaa" }}>
                  Happy Customers
                </p>
              </div>
            </motion.div>

            {/* Rating badge */}
            <motion.div
              className="position-absolute d-flex align-items-center gap-2 bg-white px-3 py-2"
              style={{
                top: "40px",
                right: "30px",
                borderRadius: "50px",
                boxShadow: "0 6px 24px rgba(0,0,0,0.09)",
                zIndex: 4,
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={imageInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.55,
                ease: "easeOut" as const,
              }}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="#f5a623"
                  stroke="#f5a623"
                  strokeWidth="1"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              <span
                style={{ fontSize: "12px", fontWeight: 600, color: "#111" }}
              >
                4.9
              </span>
            </motion.div>

            {/* Main image */}
            <motion.div
              className="position-relative"
              style={{
                width: "82%",
                height: "100%",
                minHeight: "480px",
                borderRadius: "20px",
                overflow: "hidden",
                zIndex: 2,
                alignSelf: "stretch",
              }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={imageInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.65,
                delay: 0.1,
                ease: "easeOut" as const,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80"
                alt="Why Choose Us"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {/* Subtle overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.18) 100%)",
                }}
              />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUs;
