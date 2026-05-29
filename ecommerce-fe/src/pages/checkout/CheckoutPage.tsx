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
import { useNavigate } from "react-router-dom";

import CourierCard from "@/components/common/CourierCard";
import { env } from "@/config/env";
import { CHECKOUT_STORAGE_KEYS, SUPPORTED_COURIERS } from "@/constants/checkout";
import type {
  CourierRate,
  PaymentChannel,
  PaymentMethod,
} from "@/features/checkout/checkout.types";
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
import PaymentMethodSelector from "./components/PaymentMethodSelector";
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
      // Set step to awaiting_payment so the UI shows the payment instructions
      // instead of the shipping form while polling runs
      dispatch(setStep("awaiting_payment"));
      dispatch(startPaymentPolling(Number(pendingPaymentId)));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-redirect on PAID
  useEffect(() => {
    if (payment.data?.status === "PAID") {
      const timer = setTimeout(() => {
        navigate("/payment/success");
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

  const handleSelectPaymentMethod = (
    method: PaymentMethod,
    channel?: PaymentChannel
  ) => {
    dispatch(selectPaymentMethod({ method, channel }));
    if (order.data) {
      dispatch(
        createPaymentRequest({
          orderId: order.data.id,
          paymentMethod: method,
          paymentChannel: channel,
        })
      );
    }
  };

  const handleReset = () => {
    dispatch(stopPaymentPolling());
    dispatch(resetCheckout());
    localStorage.removeItem(CHECKOUT_STORAGE_KEYS.pendingExternalId);
    localStorage.removeItem(CHECKOUT_STORAGE_KEYS.pendingPaymentId);
  };

  return (
    <div className="shipping-page py-4 py-lg-5">
      <Container className="shipping-wrapper">
        <h1 className="shipping-title mb-4">Checkout</h1>

        <Row className="g-4">
          <Col lg={8}>
            {/* Step 1: Shipping */}
            {step === "shipping" && (
              <>
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
                                selectedRate?.courier_code ===
                                  rate.courier_code &&
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
                        Pilih alamat terlebih dahulu untuk melihat opsi
                        pengiriman.
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </>
            )}

            {/* Step 2: Payment Method Selection */}
            {step === "payment_method" && (
              <Card className="shipping-card">
                <Card.Body className="p-4">
                  <PaymentMethodSelector
                    onSelect={handleSelectPaymentMethod}
                    selectedMethod={payment.selectedMethod}
                    selectedChannel={payment.selectedChannel}
                    loading={payment.loading}
                  />
                  {payment.error && (
                    <div className="text-danger mt-2">{payment.error}</div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Step 3: Awaiting Payment */}
            {(step === "awaiting_payment" || step === "completed") &&
              payment.data && (
                <Card className="shipping-card">
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
              <Card className="shipping-card">
                <Card.Body className="p-4 text-center">
                  <Spinner animation="border" className="me-2" />
                  <span>Memuat status pembayaran...</span>
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col lg={4}>
            <Card className="shipping-card sticky-top" style={{ top: 20 }}>
              <div className="total-box p-4">
                <h5 className="mb-3">Ringkasan Transaksi</h5>
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

                {step === "shipping" && (
                  <Button
                    className="pay-button w-100 py-3"
                    onClick={handleCreateOrder}
                    disabled={!selectedRate || order.loading}
                  >
                    {order.loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Membuat Pesanan...
                      </>
                    ) : (
                      "Lanjut ke Pembayaran"
                    )}
                  </Button>
                )}

                {order.error && (
                  <div className="text-danger mt-2 text-center">
                    {order.error}
                  </div>
                )}

                {(step === "payment_method" ||
                  step === "awaiting_payment" ||
                  step === "completed") &&
                  order.data && (
                    <div className="text-center mt-2">
                      <small className="text-muted">
                        Order ID: {order.data.externalId}
                      </small>
                    </div>
                  )}

                {(step === "awaiting_payment" || step === "completed") && (
                  <Button
                    variant="outline-secondary"
                    className="w-100 mt-2"
                    onClick={handleReset}
                  >
                    Kembali
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
