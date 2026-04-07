import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');

  :root {
    --accent: #E8450A;
    --black: #111010;
    --white: #F8F7F4;
    --gray: #6B6B6B;
  }

  .hero-section {
    font-family: 'Barlow', sans-serif;
    background: var(--white);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }

  /* ── ACCENT BAR ── */
  .accent-bar {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 5px;
    background: var(--accent);
    z-index: 30;
  }

  /* ── NAVBAR ── */
  .hero-navbar {
    position: absolute;
    top: 0; left: 0; right: 0;
    z-index: 20;
    padding: 30px 60px;
    display: flex;
    align-items: center;
    gap: 44px;
  }

  .nav-link-item {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--black);
    text-decoration: none;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: color 0.2s;
  }
  .nav-link-item:hover { color: var(--accent); }

  /* ── BACKGROUND PHOTO ── */
  .hero-bg-photo {
    position: absolute;
    right: 0; top: 0;
    width: 64%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }

  .hero-bg-fade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      var(--white) 28%,
      rgba(248,247,244,0.5) 50%,
      transparent 68%
    );
    pointer-events: none;
    z-index: 5;
  }

  /* ── LEFT CONTENT ── */
  .hero-content {
    position: relative;
    z-index: 10;
    padding: 0 60px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 540px;
  }

  .coupon-badge {
    font-size: 0.8rem;
    color: var(--gray);
    letter-spacing: 0.02em;
    margin-bottom: 22px;
  }
  .coupon-badge span {
    font-weight: 700;
    color: var(--accent);
  }

  .hero-heading {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: clamp(3rem, 5.5vw, 5rem);
    line-height: 1.02;
    letter-spacing: -0.01em;
    color: var(--black);
    margin-bottom: 44px;
    text-transform: uppercase;
  }

  .cta-btn {
    display: inline-block;
    background: var(--black);
    color: var(--white);
    font-family: 'Barlow', sans-serif;
    font-weight: 700;
    font-size: 0.92rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 18px 40px;
    border: 2px solid var(--black);
    cursor: pointer;
    text-decoration: none;
    align-self: flex-start;
    transition: background 0.22s, color 0.22s, transform 0.18s, border-color 0.22s;
  }
  .cta-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    transform: translateY(-2px);
  }

  /* ── FLOATING PRODUCT CARDS ── */
  .floating-cards {
    position: absolute;
    right: 0; bottom: 0;
    width: 64%;
    height: 100%;
    pointer-events: none;
    z-index: 15;
  }

  .prod-card {
    position: absolute;
    background: rgba(255,255,255,0.93);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 8px;
    overflow: hidden;
    pointer-events: all;
    cursor: pointer;
    box-shadow: 0 8px 36px rgba(0,0,0,0.14);
    border: 1px solid rgba(255,255,255,0.7);
    transition: transform 0.26s cubic-bezier(.22,.68,0,1.2), box-shadow 0.26s;
  }
  .prod-card:hover {
    transform: translateY(-8px) scale(1.03) !important;
    box-shadow: 0 20px 52px rgba(0,0,0,0.2);
  }

  .prod-card img {
    width: 100%;
    display: block;
    object-fit: cover;
  }

  .prod-card-body {
    padding: 14px 16px 16px;
  }
  .prod-card-name {
    font-weight: 700;
    font-size: 0.88rem;
    color: var(--black);
    margin-bottom: 5px;
  }
  .prod-card-price {
    font-size: 0.82rem;
    color: var(--accent);
    font-weight: 700;
  }

  .card-watch {
    width: 210px;
    bottom: 9%;
    left: 20%;
    animation: floatA 5.5s ease-in-out infinite;
  }

  .card-shoe {
    width: 190px;
    top: 26%;
    right: 4%;
    animation: floatB 6.5s ease-in-out infinite;
  }

  @keyframes floatA {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-16px); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .hero-navbar { padding: 22px 28px; gap: 24px; }
    .hero-bg-photo { width: 100%; opacity: 0.22; }
    .hero-bg-fade { background: linear-gradient(to right, var(--white) 0%, rgba(248,247,244,0.9) 100%); }
    .hero-content { padding: 130px 28px 220px; max-width: 100%; }
    .floating-cards { width: 100%; }
    .card-watch { width: 155px; left: 4%; bottom: 3%; }
    .card-shoe  { width: 145px; right: 3%; bottom: 18%; top: auto; }
  }
`;
const PRODUCTS = [
  {
    id: 1,
    className: "prod-card card-watch",
    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80",
    imgHeight: 145,
    name: "Fitbit Smart Watch",
    price: "$129.00",
  },
  {
    id: 2,
    className: "prod-card card-shoe",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    imgHeight: 125,
    name: "Running Shoe for Fitness",
    price: "$99.00",
  },
];

export default function HeroSection() {
  const [hoveredNav, setHoveredNav] = useState(null);

  return (
    <>
      <style>{css}</style>

      <section className="hero-section">
        <div className="accent-bar" />

        {/* BACKGROUND PHOTO */}
        <img
          className="hero-bg-photo"
          src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=85"
          alt="Fitness model"
        />
        <div className="hero-bg-fade" />

        {/* LEFT CONTENT */}
        <div className="hero-content">
          <p className="coupon-badge">
            Use <span>"FIT40"</span> coupon to get 40% flat discount
          </p>

          <h1 className="hero-heading">
            Fitness kits
            <br />
            that help you
            <br />
            keep fit.
          </h1>

          <a className="cta-btn" href="#">
            Start shopping
          </a>
        </div>

        {/* FLOATING PRODUCT CARDS */}
        <div className="floating-cards">
          {PRODUCTS.map((p) => (
            <div key={p.id} className={p.className}>
              <img src={p.image} alt={p.name} style={{ height: p.imgHeight }} />
              <div className="prod-card-body">
                <div className="prod-card-name">{p.name}</div>
                <div className="prod-card-price">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
