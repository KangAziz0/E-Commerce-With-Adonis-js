import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";

import CourierCard from "@/components/common/CourierCard";
import { env } from "@/config/env";
import { SUPPORTED_COURIERS } from "@/constants/checkout";
import type { CourierRate } from "@/features/checkout/checkout.types";
import {
  createInvoiceRequest,
  getRatesRequest,
} from "@/features/checkout/checkoutSlice";
import type { SelectedAddress } from "@/features/selectors/areas/area.types";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import RecipientAddressForm from "./components/AddressForm";
import ListProduct from "./components/ListProduct";
import "./CheckoutPage.css";

interface CheckoutPageProps {
  onCourierSelected?: (data: { selected: CourierRate }) => void;
}

export default function CheckoutPage({ onCourierSelected }: CheckoutPageProps) {
  const dispatch = useAppDispatch();
  const invoice = useAppSelector((state) => state.checkout.invoice);
  const user = useAppSelector((state) => state.auth.user);
  const cart = useAppSelector((state) => state.cart.items);
  const { data: dataRates, loading: ratesLoading } = useAppSelector(
    (state) => state.checkout.rates,
  );

  const [rates, setRates] = useState<CourierRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<CourierRate | null>(null);
  const [destinationAreaId, setDestinationAreaId] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setRates(dataRates ?? []);
  }, [dataRates]);

  const sortedRates = useMemo(
    () => [...rates].sort((a, b) => a.price - b.price),
    [rates],
  );

  const totalProductPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const shippingTotal = selectedRate?.price ?? 0;
  const totalBilling = totalProductPrice + shippingTotal;

  const handleGetRates = () => {
    if (!destinationAreaId) return;
    setSearched(true);

    dispatch(
      getRatesRequest({
        origin_area_id: env.originAreaId,
        destination_area_id: destinationAreaId,
        couriers: SUPPORTED_COURIERS,
        items: cart.map((item) => ({
          name: item.name,
          value: item.price,
          weight: item.weight * item.quantity,
          quantity: item.quantity,
        })),
      }),
    );
  };

  const handleCheckout = () => {
    dispatch(
      createInvoiceRequest({
        items: cart,
        email: user?.email ?? "",
        courier: selectedRate?.courier_code ?? "",
        service: selectedRate?.courier_service_code ?? "",
        destinationId: destinationAreaId,
      }),
    );
  };

  return (
    <div className="shipping-page py-4 py-lg-5">
      <Container className="shipping-wrapper">
        <h1 className="shipping-title mb-4">Checkout</h1>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="shipping-card mb-4">
              <Card.Body className="p-4">
                <p className="address-label mb-3">ALAMAT PENGIRIMAN</p>
                <RecipientAddressForm
                  onChange={(address: SelectedAddress | null) =>
                    setDestinationAreaId(address?.area_id ?? "")
                  }
                />
                <div className="mt-3">
                  <Button
                    onClick={handleGetRates}
                    disabled={ratesLoading || !destinationAreaId}
                  >
                    {ratesLoading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Mencari...
                      </>
                    ) : (
                      "Cek Pengiriman"
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="shipping-card">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Pilih Kurir</h5>
                  {selectedRate && (
                    <Badge bg="success">
                      {selectedRate.courier_name} dipilih
                    </Badge>
                  )}
                </div>

                {searched && sortedRates.length > 0 ? (
                  <Row className="g-3">
                    {sortedRates.map((rate) => (
                      <Col
                        md={6}
                        key={`${rate.courier_code}-${rate.courier_service_code}`}
                      >
                        <CourierCard
                          rate={rate}
                          selected={
                            selectedRate?.courier_code === rate.courier_code &&
                            selectedRate?.courier_service_code ===
                              rate.courier_service_code
                          }
                          onSelect={(item) => {
                            setSelectedRate(item);
                            onCourierSelected?.({ selected: item });
                          }}
                        />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-muted mb-0">
                    Pilih alamat terlebih dahulu untuk melihat opsi pengiriman.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shipping-card sticky-top" style={{ top: 20 }}>
              <div className="total-box p-4">
                <h5 className="mb-3">Cek ringkasan transaksimu, yuk</h5>
                <ListProduct />
                <div className="d-flex justify-content-between mb-2 mt-2">
                  <span className="text-muted">{`Total Harga (${cart.length} Barang)`}</span>
                  <span>Rp {totalProductPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Ongkir</span>
                  <span>Rp {shippingTotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                  <span>Total Tagihan</span>
                  <span>Rp {totalBilling.toLocaleString("id-ID")}</span>
                </div>
                <Button
                  className="pay-button w-100 py-3"
                  onClick={handleCheckout}
                  disabled={invoice.loading}
                >
                  {invoice.loading ? "Loading..." : "Bayar Sekarang"}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
