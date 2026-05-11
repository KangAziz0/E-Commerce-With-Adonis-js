import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { faqData } from "@/data/faq";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Semua",
  "Pemesanan",
  "Pembayaran",
  "Pengiriman",
  "Pengembalian",
];

const CATEGORY_META: Record<
  string,
  { color: string; bg: string; icon: string }
> = {
  Pemesanan: { color: "#2563eb", bg: "#eff6ff", icon: "🛍️" },
  Pembayaran: { color: "#16a34a", bg: "#f0fdf4", icon: "💳" },
  Pengiriman: { color: "#d97706", bg: "#fffbeb", icon: "🚚" },
  Pengembalian: { color: "#dc2626", bg: "#fef2f2", icon: "↩️" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const CategoryPill: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}> = ({ label, active, onClick, count }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.96 }}
    style={{
      border: active ? "2px solid #111" : "2px solid #e5e5e5",
      background: active ? "#111" : "#fff",
      color: active ? "#fff" : "#666",
      fontWeight: active ? 700 : 500,
      fontSize: "0.8rem",
      padding: "8px 18px",
      borderRadius: 100,
      cursor: "pointer",
      letterSpacing: "0.3px",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
      fontFamily: "inherit",
    }}
  >
    {label}
    {count !== undefined && (
      <span
        style={{
          background: active ? "rgba(255,255,255,0.2)" : "#f0f0f0",
          color: active ? "#fff" : "#999",
          fontSize: "0.72rem",
          fontWeight: 700,
          padding: "1px 7px",
          borderRadius: 100,
        }}
      >
        {count}
      </span>
    )}
  </motion.button>
);

const FAQCard: React.FC<{
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, index, isOpen, onToggle }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const meta = CATEGORY_META[item.category] ?? {
    color: "#111",
    bg: "#f5f5f5",
    icon: "❓",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      style={{
        background: "#fff",
        border: isOpen ? "2px solid #111" : "2px solid #f0f0f0",
        borderRadius: 16,
        marginBottom: 10,
        overflow: "hidden",
        boxShadow: isOpen ? "0 8px 32px rgba(0,0,0,0.07)" : "none",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* Question Row */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        {/* Category Tag */}
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            color: meta.color,
            background: meta.bg,
            padding: "4px 10px",
            borderRadius: 100,
            flexShrink: 0,
          }}
        >
          {meta.icon} {item.category}
        </span>

        {/* Question */}
        <span
          style={{
            flex: 1,
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#111",
            lineHeight: 1.45,
          }}
        >
          {item.question}
        </span>

        {/* Toggle Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: isOpen ? "#111" : "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "1.1rem",
            color: isOpen ? "#fff" : "#666",
            lineHeight: 1,
          }}
        >
          +
        </motion.div>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "0 24px 22px 24px",
                fontSize: "0.9rem",
                color: "#555",
                lineHeight: 1.8,
                borderTop: "1px solid #f5f5f5",
                paddingTop: 16,
              }}
            >
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Floating decorative blob ─────────────────────────────────────────────────

const FloatingBlob: React.FC<{
  x: string;
  y: string;
  size: number;
  color: string;
  delay?: number;
}> = ({ x, y, size, color, delay = 0 }) => (
  <motion.div
    aria-hidden
    animate={{ y: [0, -16, 0], scale: [1, 1.04, 1] }}
    transition={{
      duration: 6 + delay,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      filter: "blur(40px)",
      zIndex: 0,
      pointerEvents: "none",
    }}
  />
);

// ─── Contact Card ─────────────────────────────────────────────────────────────

const ContactCard: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
      style={{ position: "sticky", top: 24 }}
    >
      {/* Main contact block */}
      <div
        style={{
          background: "#0a0a0a",
          borderRadius: 20,
          padding: "32px 28px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          marginBottom: 14,
        }}
      >
        {/* Subtle bg glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -60,
            left: -20,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              marginBottom: 18,
            }}
          >
            💬
          </div>

          <h4
            style={{
              fontSize: "1.15rem",
              fontWeight: 800,
              marginBottom: 8,
              letterSpacing: "-0.4px",
              color: "#fff",
            }}
          >
            Masih butuh bantuan?
          </h4>
          <p
            style={{
              fontSize: "0.83rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            Tim kami siap membantu 7 hari seminggu, pukul 08.00–21.00 WIB.
          </p>

          <motion.button
            whileHover={{ scale: 1.02, background: "#fff" }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "#f0f0f0",
              color: "#111",
              border: "none",
              borderRadius: 12,
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.3px",
              cursor: "pointer",
              marginBottom: 8,
              fontFamily: "inherit",
              transition: "background 0.2s",
            }}
          >
            💬 Live Chat
          </motion.button>

          <motion.button
            whileHover={{ background: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "transparent",
              color: "rgba(255,255,255,0.65)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.2s",
            }}
          >
            📧 Kirim Email
          </motion.button>

          <p
            style={{
              fontSize: "0.74rem",
              color: "rgba(255,255,255,0.3)",
              marginTop: 16,
              marginBottom: 0,
              textAlign: "center",
            }}
          >
            ⚡ Respons rata-rata &lt; 5 menit
          </p>
        </div>
      </div>

      {/* Quick stats row */}
      {[
        { icon: "🛡️", label: "Transaksi aman & terenkripsi" },
        { icon: "🔄", label: "Return 7 hari tanpa ribet" },
        { icon: "🚀", label: "Pengiriman same-day tersedia" },
      ].map(({ icon, label }) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: "#fafafa",
            border: "1.5px solid #f0f0f0",
            borderRadius: 12,
            marginBottom: 8,
            fontSize: "0.82rem",
            color: "#444",
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: "1rem" }}>{icon}</span>
          {label}
        </div>
      ))}
    </motion.div>
  );
};

// ─── Search Bar ───────────────────────────────────────────────────────────────

const SearchBar: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#fff",
        border: focused ? "2px solid #111" : "2px solid #e5e5e5",
        borderRadius: 14,
        padding: "10px 18px",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: focused ? "0 0 0 4px rgba(0,0,0,0.06)" : "none",
        maxWidth: 520,
      }}
    >
      <svg
        width="16"
        height="16"
        fill="none"
        stroke={focused ? "#111" : "#bbb"}
        strokeWidth="2"
        viewBox="0 0 24 24"
        style={{ flexShrink: 0, transition: "stroke 0.2s" }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Cari pertanyaan..."
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "0.9rem",
          color: "#111",
          flex: 1,
          fontFamily: "inherit",
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#bbb",
            padding: 0,
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// ─── Main FAQ Component ───────────────────────────────────────────────────────

const FaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  // Parallax on section scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const blobY1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const headingY = useTransform(scrollYProgress, [0, 0.5], [30, 0]);

  const filtered = faqData.filter((item) => {
    const matchCat =
      activeCategory === "Semua" || item.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const countFor = (cat: string) =>
    cat === "Semua"
      ? faqData.length
      : faqData.filter((f) => f.category === cat).length;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#fafafa",
        padding: "96px 0 112px",
        overflow: "hidden",
        fontFamily:
          "'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── Parallax background blobs ── */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "5%",
          left: "-8%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(239,246,255,0.9) 0%, transparent 70%)",
          y: blobY1,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "5%",
          right: "-6%",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,251,235,0.9) 0%, transparent 70%)",
          y: blobY2,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Subtle grid pattern */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, #e5e5e5 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.4,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <motion.div
          ref={headingRef}
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 40 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="text-center"
          /* max-width centred */
        >
          {/* Overline badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={headingInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#111",
              color: "#fff",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              padding: "6px 16px",
              borderRadius: 100,
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: "0.75rem" }}>❓</span>
            Pusat Bantuan
          </motion.div>

          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              color: "#0a0a0a",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Pertanyaan yang
            <br />
            <span
              style={{
                position: "relative",
                display: "inline-block",
                color: "#0a0a0a",
              }}
            >
              Sering Ditanyakan
              {/* Animated underline */}
              <motion.svg
                viewBox="0 0 300 10"
                style={{
                  position: "absolute",
                  bottom: -6,
                  left: 0,
                  width: "100%",
                  overflow: "visible",
                }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={headingInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.path
                  d="M4 6 Q75 2 150 6 Q225 10 296 6"
                  stroke="#d97706"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={headingInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.75, delay: 0.55, ease: "easeOut" }}
                />
              </motion.svg>
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              fontSize: "1rem",
              color: "#777",
              lineHeight: 1.75,
              maxWidth: 520,
              margin: "0 auto 40px",
            }}
          >
            Temukan jawaban cepat seputar pemesanan, pembayaran, pengiriman, dan
            pengembalian barang.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <SearchBar
              value={searchQuery}
              onChange={(v) => {
                setSearchQuery(v);
                setOpenId(null);
              }}
            />
          </motion.div>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.42 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                count={countFor(cat)}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenId(null);
                }}
              />
            ))}
          </motion.div>

          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={headingInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.55 }}
            style={{
              fontSize: "0.78rem",
              color: "#bbb",
              marginTop: 10,
              marginBottom: 0,
              fontWeight: 500,
            }}
          >
            Menampilkan {filtered.length} pertanyaan
          </motion.p>
        </motion.div>

        {/* ── Divider ── */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(to right, transparent, #e5e5e5, transparent)",
            margin: "40px 0 48px",
          }}
        />

        {/* ── Main content grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 40,
            alignItems: "start",
          }}
          className="faq-main-grid"
        >
          {/* FAQ list */}
          <div>
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    textAlign: "center",
                    padding: "64px 24px",
                    background: "#fff",
                    borderRadius: 20,
                    border: "2px dashed #e5e5e5",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#111",
                      fontSize: "1rem",
                      marginBottom: 8,
                    }}
                  >
                    Tidak ada hasil
                  </p>
                  <p style={{ color: "#999", fontSize: "0.88rem" }}>
                    Coba kata kunci lain atau pilih kategori berbeda.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {filtered.map((item, i) => (
                    <FAQCard
                      key={item.id}
                      item={item}
                      index={i}
                      isOpen={openId === item.id}
                      onToggle={() =>
                        setOpenId(openId === item.id ? null : item.id)
                      }
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact sidebar */}
          <ContactCard />
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .faq-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          section[data-faq] { padding: 60px 0 80px !important; }
        }
      `}</style>
    </section>
  );
};

export default FaqSection;
