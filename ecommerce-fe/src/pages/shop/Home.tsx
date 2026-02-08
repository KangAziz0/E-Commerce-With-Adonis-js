import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsRequest } from "../../features/products/productSlice";
import { RootState } from "../../store/store";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import "bootstrap/dist/css/bootstrap.min.css";
import CardProduct from "../../components/CardProduct";

export default function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.products);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const productList = products || [];

  const testimonials = [
    {
      id: 1,
      name: "Andi Wijaya",
      avatar:
        "https://ui-avatars.com/api/?name=Andi+Wijaya&background=10b981&color=fff",
      rating: 5,
      comment:
        "Kualitas produk sangat bagus! Pengiriman cepat dan pelayanan ramah. Highly recommended!",
      date: "2 hari yang lalu",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      avatar:
        "https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=10b981&color=fff",
      rating: 5,
      comment: "Barang sesuai deskripsi, packaging rapi. Pasti order lagi!",
      date: "5 hari yang lalu",
    },
    {
      id: 3,
      name: "Budi Santoso",
      avatar:
        "https://ui-avatars.com/api/?name=Budi+Santoso&background=10b981&color=fff",
      rating: 4,
      comment:
        "Produk bagus, harga terjangkau. Pengiriman agak lama tapi worth it!",
      date: "1 minggu yang lalu",
    },
  ];

  const categories = [
    { id: "all", name: "Semua Produk", icon: "🏪" },
    { id: "fashion", name: "Fashion", icon: "👔" },
    { id: "electronics", name: "Elektronik", icon: "📱" },
    { id: "accessories", name: "Aksesoris", icon: "⌚" },
  ];

  const features = [
    {
      icon: "🚚",
      title: "Gratis Ongkir",
      desc: "Untuk pembelian minimal Rp 200.000",
    },
    {
      icon: "🔒",
      title: "Pembayaran Aman",
      desc: "Transaksi dijamin aman 100%",
    },
    {
      icon: "💯",
      title: "Kualitas Terjamin",
      desc: "Produk original dan berkualitas",
    },
    {
      icon: "🎁",
      title: "Banyak Promo",
      desc: "Diskon dan cashback menarik",
    },
  ];

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div style={{ backgroundColor: "#f0fdf4" }}>
      {/* Hero Section - Redesigned */}
      <section
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          minHeight: "600px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container>
          <Row className="align-items-center" style={{ minHeight: "600px" }}>
            <Col lg={6} className="text-white py-5">
              <Badge bg="light" text="success" className="mb-3 px-3 py-2 fs-6">
                🎉 Grand Opening Sale
              </Badge>
              <h1
                className="display-3 fw-bold mb-4"
                style={{ lineHeight: "1.2" }}
              >
                Belanja Fashion
                <br />
                Jadi Lebih Mudah
              </h1>
              <p className="lead mb-4 fs-4" style={{ opacity: 0.95 }}>
                Temukan koleksi fashion terbaru dengan harga terbaik. Kualitas
                premium, harga bersahabat!
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button
                  size="lg"
                  style={{
                    backgroundColor: "white",
                    color: "#10b981",
                    border: "none",
                    padding: "15px 40px",
                    fontWeight: "bold",
                    borderRadius: "50px",
                  }}
                >
                  Mulai Belanja
                </Button>
                <Button
                  size="lg"
                  variant="outline-light"
                  style={{
                    padding: "15px 40px",
                    fontWeight: "bold",
                    borderRadius: "50px",
                    borderWidth: "2px",
                  }}
                >
                  Lihat Promo
                </Button>
              </div>

              {/* Stats */}
              <Row className="mt-5 pt-4">
                <Col xs={4}>
                  <h3 className="fw-bold mb-0">10K+</h3>
                  <small style={{ opacity: 0.9 }}>Pelanggan</small>
                </Col>
                <Col xs={4}>
                  <h3 className="fw-bold mb-0">500+</h3>
                  <small style={{ opacity: 0.9 }}>Produk</small>
                </Col>
                <Col xs={4}>
                  <h3 className="fw-bold mb-0">4.9</h3>
                  <small style={{ opacity: 0.9 }}>Rating</small>
                </Col>
              </Row>
            </Col>

            <Col lg={6} className="d-none d-lg-block">
              <div
                style={{
                  position: "relative",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                <img
                  src="/images/baju2.jpg"
                  alt="Hero"
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.2))",
                    borderRadius: "20px",
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>

        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.1)",
            top: "-100px",
            right: "-100px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.1)",
            bottom: "50px",
            left: "-50px",
          }}
        />
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ backgroundColor: "white" }}>
        <Container>
          <Row className="g-4">
            {features.map((feature, idx) => (
              <Col key={idx} md={6} lg={3}>
                <div
                  className="text-center p-4 h-100"
                  style={{
                    backgroundColor: "#f0fdf4",
                    borderRadius: "20px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(16, 185, 129, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="fs-1 mb-3">{feature.icon}</div>
                  <h5 className="fw-bold mb-2" style={{ color: "#059669" }}>
                    {feature.title}
                  </h5>
                  <p className="text-muted mb-0 small">{feature.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Category Filter */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold mb-3" style={{ color: "#059669" }}>
            Kategori Produk
          </h2>
          <p className="text-muted fs-5">Pilih kategori favorit Anda</p>
        </div>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                backgroundColor:
                  activeCategory === cat.id ? "#10b981" : "white",
                color: activeCategory === cat.id ? "white" : "#059669",
                border: `2px solid ${activeCategory === cat.id ? "#10b981" : "#10b981"}`,
                padding: "12px 30px",
                fontWeight: "600",
                borderRadius: "50px",
                transition: "all 0.3s ease",
              }}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>
      </Container>

      {/* Products Section - Update */}
      <section style={{ backgroundColor: "white", padding: "60px 0" }}>
        <Container>
          <div className="mb-4">
            <h3 className="fw-bold" style={{ color: "#059669" }}>
              Produk Terlaris
            </h3>
            <p className="text-muted mb-0">Pilihan terbaik minggu ini</p>
          </div>

          <Row className="g-3">
            {productList.map((p: any) => (
              <Col key={p.id} xs={6} md={4} lg={3}>
                <CardProduct
                  id={p.id}
                  name={p.name}
                  price={Number(p.price)}
                  image={p.image || "/images/baju2.jpg"}
                  description={p.description}
                  discount={30}
                  rating={4}
                  reviewCount={128}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5" style={{ backgroundColor: "#f0fdf4" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ color: "#059669" }}>
              Apa Kata Mereka?
            </h2>
            <p className="text-muted fs-5">
              Testimoni dari pelanggan setia kami
            </p>
          </div>

          <Row className="g-4">
            {testimonials.map((testimonial) => (
              <Col key={testimonial.id} md={4}>
                <Card
                  className="h-100 border-0"
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          marginRight: "15px",
                        }}
                      />
                      <div>
                        <h6 className="mb-1 fw-bold">{testimonial.name}</h6>
                        <small className="text-muted">{testimonial.date}</small>
                      </div>
                    </div>
                    <div
                      className="mb-3"
                      style={{ color: "#fbbf24", fontSize: "1rem" }}
                    >
                      {renderStars(testimonial.rating)}
                    </div>
                    <p
                      className="text-muted mb-0"
                      style={{ lineHeight: "1.6" }}
                    >
                      "{testimonial.comment}"
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className="py-5" style={{ backgroundColor: "white" }}>
        <Container>
          <Card
            className="border-0"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "30px",
              overflow: "hidden",
            }}
          >
            <Card.Body className="p-5 text-white text-center">
              <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <h2 className="display-6 fw-bold mb-3">
                  Dapatkan Penawaran Eksklusif!
                </h2>
                <p className="lead mb-4 fs-5">
                  Subscribe newsletter kami dan dapatkan diskon 10% untuk
                  pembelian pertama
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Masukkan email Anda"
                    style={{
                      maxWidth: "400px",
                      padding: "15px 25px",
                      borderRadius: "50px",
                      border: "none",
                    }}
                  />
                  <Button
                    style={{
                      backgroundColor: "white",
                      color: "#10b981",
                      border: "none",
                      padding: "15px 40px",
                      fontWeight: "bold",
                      borderRadius: "50px",
                    }}
                  >
                    Subscribe Sekarang
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
