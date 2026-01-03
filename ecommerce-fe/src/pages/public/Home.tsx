import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsRequest } from "../../features/products/productSlice";
import { RootState } from "../../store/store";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const productList = products.data || [];

  return (
    <div className="container mt-4">
      {/* Carousel */}
      <Carousel className="mb-4">
        {[1, 2, 3].map((i) => (
          <Carousel.Item key={i}>
            <img
              className="d-block w-100 rounded"
              src={`/images/banner${i}.jpg`}
              alt={`Promo ${i}`}
              style={{
                maxHeight: "300px", // batas maksimal tinggi
                width: "100%", // lebar penuh
                objectFit: "cover", // menyesuaikan crop agar proporsional
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Horizontal Scroll Products */}
      <h4 className="mb-3">Recommended Products</h4>
      <div className="d-flex overflow-auto pb-3" style={{ gap: "1rem" }}>
        {productList.map((p: any) => (
          <Card
            key={p.id}
            style={{
              minWidth: "180px",
              maxWidth: "180px",
              flex: "0 0 auto",
              borderRadius: "15px",
            }}
            className="shadow-sm"
          >
            <div
              style={{
                height: "150px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
              }}
            >
              <Card.Img
                variant="top"
                src={`/images/baju2.jpg`}
                style={{ objectFit: "contain", height: "100%" }}
              />
            </div>
            <Card.Body className="d-flex flex-column">
              <Card.Title className="fs-6 text-truncate" title={p.name}>
                {p.name}
              </Card.Title>
              {/* Rating dummy */}
              <div
                className="mb-1"
                style={{ fontSize: "0.8rem", color: "#ffc107" }}
              >
                ⭐⭐⭐⭐☆
              </div>
              <Card.Text
                className="text-muted text-truncate mb-1"
                title={p.description}
              >
                {p.description}
              </Card.Text>
              <span className="text-success fw-bold fs-6 mt-auto">
                RP. {Number(p.price).toLocaleString("id-ID")}
              </span>
              <Button variant="success" size="sm" className="mt-2">
                Buy Now
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
