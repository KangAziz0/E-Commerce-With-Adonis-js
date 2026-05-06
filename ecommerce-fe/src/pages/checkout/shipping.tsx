import CourierCard, { CourierRate } from "@/components/common/CourierCard";
import { CartItem } from "@/features/cart/cartSlice";
import {
  createInvoiceRequest,
  getRatesRequest,
} from "@/features/checkout/checkoutSlice";
import { SelectedAddress } from "@/features/selectors/areas/area.type";
import { RootState } from "@/store/store";
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
import { useDispatch, useSelector } from "react-redux";
import "./shipping.css";
import RecipientAddressForm from "./components/AddressForm";
import ListProduct from "./components/ListProduct";

interface Props {
  onCourierSelected?: (data: { selected: CourierRate }) => void;
}

const COURIER_GROUP = "jne,jnt,sicepat,anteraja,grab,gojek,lion,tiki";

export default function ShippingPage({ onCourierSelected }: Props) {
  const dispatch = useDispatch();
  const invoice = useSelector((state: RootState) => state.checkout.invoice);
  const user = useSelector((state: RootState) => state.auth.user);
  const cart = useSelector((state: RootState) => state.cart.items);
  const { data: dataRates } = useSelector(
    (state: RootState) => state.checkout.rates,
  );

  const [rates, setRates] = useState<CourierRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<CourierRate | null>(null);
  const [destinationAreaId, setDestinationAreaId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (dataRates) {
      setRates(dataRates);
      setLoading(false);
    }
  }, [dataRates]);

  const sortedRates = useMemo(
    () => [...rates].sort((a, b) => a.price - b.price),
    [rates],
  );

  const totalProductPrice = useMemo(
    () =>
      cart.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0,
      ),
    [cart],
  );

  const shippingTotal = selectedRate?.price ?? 0;
  const totalBilling = totalProductPrice + shippingTotal;

  const handleGetRates = () => {
    if (!destinationAreaId) return;

    setLoading(true);
    setSearched(true);

    dispatch(
      getRatesRequest({
        origin_area_id: "IDNP6IDNC148IDND836IDZ12410",
        destination_area_id: destinationAreaId,
        couriers: COURIER_GROUP,
        items: cart.map((item: CartItem) => ({
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
                    disabled={loading || !destinationAreaId}
                  >
                    {loading ? (
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
                  className="pay-button w-100 py-3 "
                  onClick={handleCheckout}
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
