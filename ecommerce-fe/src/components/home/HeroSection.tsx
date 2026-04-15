import React, { useState } from "react";
import { motion } from "framer-motion";

const IconArrowRight: React.FC = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ─── Hero Main ────────────────────────────────────────────────────────────────

const HeroMain: React.FC = () => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.04, x: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "520px",
      }}
      className="hero-wrap"
    >
      {/* RIGHT dahulu di mobile (order: -1 via CSS) */}
      <div
        className="hero-right"
        style={{
          position: "relative",
          background: "linear-gradient(135deg, #f0ede8 0%, #e8e4de 100%)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.img
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
          alt="Hero model"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
        />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="deal-card"
          style={{
            position: "absolute",
            bottom: 32,
            left: 10,
            background: "#fff",
            borderRadius: 12,
            padding: "14px 18px",
            border: "0.5px solid #e5e5e5",
            minWidth: 180,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#999",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            FLASH DEAL TODAY
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>
            30% OFF
          </div>
          <div style={{ fontSize: 11, color: "#3b6d11", marginTop: 2 }}>
            ✓ Selected items — ends midnight
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          style={{
            position: "absolute",
            top: 28,
            right: 24,
            background: "#fff",
            borderRadius: 20,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 600,
            border: "0.5px solid #e5e5e5",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#111",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#e24b4a",
            }}
          />
          New arrivals added
        </motion.div>
      </div>

      {/* LEFT — Text */}
      <div
        className="hero-left"
        style={{
          padding: "60px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div
          aria-hidden="true"
          className="watermark"
          style={{
            position: "absolute",
            fontSize: 140,
            fontWeight: 700,
            color: "#f0f0f0",
            top: 40,
            left: -10,
            letterSpacing: -6,
            userSelect: "none",
            zIndex: 0,
            lineHeight: 1,
          }}
        >
          NEW
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ position: "relative", zIndex: 1 }}
        >
          <motion.div variants={itemVariants}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#faeeda",
                color: "#854f0b",
                fontSize: 11,
                fontWeight: 600,
                padding: "5px 12px",
                borderRadius: 20,
                marginBottom: 18,
                letterSpacing: 0.5,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: "#ef9f27",
                  borderRadius: "50%",
                }}
              />
              SEASON 2025 — NOW LIVE
            </span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              lineHeight: 1.08,
              fontWeight: 700,
              color: "#111",
              marginBottom: 16,
              letterSpacing: -1.5,
            }}
          >
            Style that
            <br />
            speaks{" "}
            <em style={{ fontStyle: "italic", color: "#e24b4a" }}>louder</em>
            <br />
            than words.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            style={{
              color: "#777",
              fontSize: 14,
              lineHeight: 1.8,
              maxWidth: 360,
              marginBottom: 32,
            }}
          >
            Discover our curated collection of premium fashion — ethically
            crafted, timeless in design, and made to move with you.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="cta-row"
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginBottom: 40,
              flexWrap: "wrap",
            }}
          >
            <motion.button
              whileHover={{ backgroundColor: "#333" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "#111",
                color: "#fff",
                border: "none",
                padding: "13px 28px",
                fontSize: 13,
                letterSpacing: 1,
                cursor: "pointer",
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Shop Collection
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "#f7f7f7" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "none",
                color: "#111",
                border: "0.5px solid #ccc",
                padding: "12px 24px",
                fontSize: 13,
                cursor: "pointer",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              View Lookbook <IconArrowRight />
            </motion.button>
          </motion.div>
          <motion.div
            variants={itemVariants}
            style={{ display: "flex", gap: 32, flexWrap: "wrap" }}
          >
            {[
              { num: "12K+", label: "HAPPY CUSTOMERS" },
              { num: "400+", label: "STYLES AVAILABLE" },
              { num: "4.9★", label: "AVERAGE RATING" },
            ].map((s) => (
              <div
                key={s.label}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#111",
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: "#999",
                    letterSpacing: 0.5,
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Root Component ───────────────────────────────────────────────────────────

const Hero: React.FC = () => {
  return (
    <section
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <HeroMain />
    </section>
  );
};

export default Hero;
