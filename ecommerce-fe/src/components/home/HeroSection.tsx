import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

const HeroMain: React.FC = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.6]);

  return (
    <section
      ref={heroRef}
      style={{
        position: "relative",
        minHeight: "88vh",
        overflow: "hidden",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: -80,
          y: bgY,
          backgroundImage:
            "linear-gradient(130deg, rgba(12,12,16,0.35), rgba(12,12,16,0.75)), url('https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(1.05)",
        }}
      />

      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(226,75,74,0.35), transparent 40%)",
          opacity: overlayOpacity,
        }}
      />

      <motion.div
        animate={{ backgroundPositionX: ["0%", "100%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.14,
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
          backgroundSize: "220% 100%",
          mixBlendMode: "screen",
        }}
      />

      <motion.div
        style={{
          position: "relative",
          y: textY,
          zIndex: 2,
          maxWidth: 760,
          padding: "clamp(72px, 10vh, 110px) 24px",
          margin: "0 auto",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 16,
            color: "#ffd8c8",
            fontWeight: 600,
          }}
        >
          Everyday Fashion Essentials
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontSize: "clamp(34px, 5.4vw, 68px)",
            lineHeight: 1.05,
            letterSpacing: -1.8,
            marginBottom: 20,
            fontWeight: 700,
          }}
        >
          Upgrade Gaya Harianmu,
          <br />
          dari Basic jadi <span style={{ color: "#ff8f8e" }}>Statement</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2 }}
          style={{
            maxWidth: 620,
            margin: "0 auto 32px",
            fontSize: "clamp(14px, 2vw, 18px)",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Koleksi fashion pria & wanita dengan desain modern, material nyaman,
          dan kualitas premium untuk aktivitas kerja, hangout, sampai weekend
          style.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#fff",
              color: "#111",
              border: "none",
              padding: "13px 26px",
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Belanja Sekarang
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.16)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              padding: "12px 22px",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Lihat Koleksi Baru <IconArrowRight />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroMain;
