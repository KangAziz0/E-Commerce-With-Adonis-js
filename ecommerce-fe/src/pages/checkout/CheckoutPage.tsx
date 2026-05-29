import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import CourierCard from "@/components/common/CourierCard";
import { env } from "@/config/env";
import { CHECKOUT_STORAGE_KEYS, SUPPORTED_COURIERS } from "@/constants/checkout";
import type { CourierRate } from "@/features/checkout/checkout.types";
import {
  createOrderRequest,
  createPaymentRequest,
  getRatesRequest,
  resetCheckout,
  selectPaymentMethod,
  setStep,
  startPaymentPolling,
  stopPaymentPolling,
} from "@/features/checkout/checkoutSlice";
import type { SelectedAddress } from "@/features/selectors/areas/area.types";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import RecipientAddressForm from "./components/AddressForm";
import ListProduct from "./components/ListProduct";
import PaymentInstructions from "./components/PaymentInstructions";
import "./CheckoutPage.css";

interface CheckoutPageProps {
  onCourierSelected?: (data: { selected: CourierRate }) => void;
}

export default function CheckoutPage({ onCourierSelected }: CheckoutPageProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { order, payment, step } = useAppSelector((state) => state.checkout);
  const user = useAppSelector((state) => state.auth.user);
  const cart = useAppSelector((state) => state.cart.items);
  const { data: dataRates, loading: ratesLoading } = useAppSelector(
    (state) => state.checkout.rates
  );

  const [rates, setRates] = useState<CourierRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<CourierRate | null>(null);
  const [destinationAreaId, setDestinationAreaId] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setRates(dataRates ?? []);
  }, [dataRates]);

  // Resume payment polling if a pending payment ID is found in localStorage
  useEffect(() => {
    const pendingPaymentId = localStorage.getItem(
      CHECKOUT_STORAGE_KEYS.pendingPaymentId
    );
    if (pendingPaymentId && step === "shipping") {
      dispatch(setStep("awaiting_payment"));
      dispatch(startPaymentPolling(Number(pendingPaymentId)));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When order is created, automatically create QRIS payment
  useEffect(() => {
    if (step === "payment_method" && order.data) {
      dispatch(selectPaymentMethod({ method: "QRIS" }));
      dispatch(
        createPaymentRequest({
          orderId: order.data.id,
          paymentMethod: "QRIS",
        })
      );
    }
  }, [step, order.data, dispatch]);

  // Auto-redirect when payment reaches a terminal status
  useEffect(() => {
    if (payment.data?.status === "PAID") {
      const timer = setTimeout(() => {
        navigate("/payment/success");
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (
      payment.data?.status === "FAILED" ||
      payment.data?.status === "EXPIRED"
    ) {
      const timer = setTimeout(() => {
        navigate("/payment/failed");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [payment.data?.status, navigate]);

  const sortedRates = useMemo(
    () => [...rates].sort((a, b) => a.price - b.price),
    [rates]
  );

  const totalProductPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
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
      })
    );
  };

  const handleCreateOrder = () => {
    dispatch(
      createOrderRequest({
        items: cart.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        email: user?.email ?? "",
      })
    );
  };

  const handleReset = () => {
    dispatch(stopPaymentPolling());
    dispatch(resetCheckout());
    localStorage.removeItem(CHECKOUT_STORAGE_KEYS.pendingExternalId);
    localStorage.removeItem(CHECKOUT_STORAGE_KEYS.pendingPaymentId);
  };

  // Determine active step index for the indicator
  const stepIndex =
    step === "shipping"
      ? 0
      : step === "payment_method"
        ? 1
        : step === "awaiting_payment"
          ? 1
          : 2;

  const steps = ["Pengiriman", "Pembayaran", "Selesai"];

  return (
    <div className="checkout-page py-4 py-lg-5">
      <Container className="checkout-wrapper">
        <h1 className="checkout-title mb-3">Checkout</h1>

        {/* Step Indicator */}
        <div className="step-indicator" aria-label="Progress checkout">
          {steps.map((label, i) => (
            <div key={label} className="step-indicator__segment">
              <div
                className={`step-indicator__item ${
                  i === stepIndex
                    ? "step-indicator__item--active"
                    : i < stepIndex
                      ? "step-indicator__item--done"
                      : ""
                }`}
                aria-current={i === stepIndex ? "step" : undefined}
              >
                <div className="step-indicator__dot">
                  {i < stepIndex ? "\u2713" : i + 1}
                </div>
                <span className="step-indicator__label">{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`step-indicator__line ${
                    i < stepIndex ? "step-indicator__line--done" : ""
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Row className="g-4">
          <Col lg={8}>
            {/* Step 1: Shipping */}
            {step === "shipping" && (
              <>
                <Card className="checkout-card mb-4">
                  <Card.Body className="p-4">
                    <p className="section-label mb-3">Alamat Pengiriman</p>
                    <RecipientAddressForm
                      onChange={(address: SelectedAddress | null) =>
                        setDestinationAreaId(address?.area_id ?? "")
                      }
                    />
                    <div className="mt-3">
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={handleGetRates}
                        disabled={ratesLoading || !destinationAreaId}
                        className="rounded-3 px-4"
                      >
                        {ratesLoading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Mencari...
                          </>
                        ) : (
                          "Cek Ongkir"
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                {searched && sortedRates.length > 0 && (
                  <Card className="checkout-card">
                    <Card.Body className="p-4">
                      <p className="section-label mb-3">Pilih Kurir</p>
                      {sortedRates.map((rate) => (
                        <CourierCard
                          key={`${rate.courier_code}-${rate.courier_service_code}`}
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
                      ))}
                    </Card.Body>
                  </Card>
                )}

                {!searched && (
                  <Card className="checkout-card">
                    <Card.Body className="p-4 text-center">
                      <p className="text-muted mb-0">
                        Masukkan alamat untuk melihat opsi pengiriman.
                      </p>
                    </Card.Body>
                  </Card>
                )}
              </>
            )}

            {/* Transition: Creating QRIS payment */}
            {step === "payment_method" && (
              <Card className="checkout-card">
                <Card.Body className="p-5 text-center">
                  <Spinner animation="border" variant="success" className="mb-3" />
                  <h5 className="mb-2">Menyiapkan Pembayaran</h5>
                  <p className="text-muted mb-0">
                    Membuat QR Code pembayaran...
                  </p>
                  {payment.error && (
                    <div className="text-danger mt-3">{payment.error}</div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Step 2: Awaiting Payment (QRIS) */}
            {(step === "awaiting_payment" || step === "completed") &&
              payment.data && (
                <Card className="checkout-card">
                  <Card.Body className="p-4">
                    <PaymentInstructions
                      payment={payment.data}
                      polling={payment.polling}
                    />
                  </Card.Body>
                </Card>
              )}

            {/* Loading state while resuming payment from localStorage */}
            {step === "awaiting_payment" && !payment.data && (
              <Card className="checkout-card">
                <Card.Body className="p-5 text-center">
                  <Spinner animation="border" variant="success" className="mb-3" />
                  <p className="text-muted mb-0">Memuat status pembayaran...</p>
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col lg={4}>
            <Card className="summary-card sticky-top" style={{ top: 20 }}>
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">Ringkasan</h6>
                <ListProduct />

                <hr className="summary-divider" />

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">
                    Subtotal ({cart.length} item)
                  </span>
                  <span className="small">
                    Rp {totalProductPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Ongkir</span>
                  <span className="small">
                    {shippingTotal > 0
                      ? `Rp ${shippingTotal.toLocaleString("id-ID")}`
                      : "-"}
                  </span>
                </div>

                <hr className="summary-divider" />

                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total</span>
                  <span>Rp {totalBilling.toLocaleString("id-ID")}</span>
                </div>

                {step === "shipping" && (
                  <Button
                    className="btn-checkout w-100"
                    onClick={handleCreateOrder}
                    disabled={!selectedRate || order.loading}
                  >
                    {order.loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Membuat Pesanan...
                      </>
                    ) : (
                      "Bayar dengan QRIS"
                    )}
                  </Button>
                )}

                {order.error && (
                  <div className="text-danger mt-2 text-center small">
                    {order.error}
                  </div>
                )}

                {(step === "payment_method" ||
                  step === "awaiting_payment" ||
                  step === "completed") &&
                  order.data && (
                    <p className="text-center text-muted small mt-2 mb-0">
                      Order: {order.data.externalId}
                    </p>
                  )}

                {(step === "awaiting_payment" || step === "completed") && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="w-100 mt-2 rounded-3"
                    onClick={handleReset}
                  >
                    Kembali
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
