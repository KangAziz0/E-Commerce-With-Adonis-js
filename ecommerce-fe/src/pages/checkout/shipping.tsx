// pages/CheckOngkirPage.tsx

import CourierCard, { CourierRate } from "@/components/common/CourierCard";
import { getRatesRequest } from "@/features/checkout/checkoutSlice";
import { RootState } from "@/store/store";
import { useState, useCallback, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

// ─── Types ─────────────────────────────────────────────────

interface FormState {
  origin_postal_code: string;
  courier_service_code: string;
  destination_postal_code: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  value: string;
}

interface Props {
  onCourierSelected?: (data: {
    selected: CourierRate;
    form: FormState;
  }) => void;
}

// ─── Constants ──────────────────────────────────────────────

const COURIER_GROUPS = [
  { label: "Semua", value: "jne,jnt,sicepat,anteraja,grab,gojek,lion,tiki" },
  { label: "Reguler", value: "jne,jnt,sicepat,tiki,lion" },
  { label: "Instan", value: "grab,gojek" },
  { label: "Ekonomis", value: "anteraja,tiki" },
];

const INITIAL_FORM: FormState = {
  origin_postal_code: "",
  destination_postal_code: "",
  courier_service_code: "",
  weight: "",
  length: "",
  width: "",
  height: "",
  value: "",
};

// ─── Component ─────────────────────────────────────────────

export default function ShippingPage({ onCourierSelected }: Props) {
  const dispatch = useDispatch();
  const { data: dataRates } = useSelector(
    (state: RootState) => state.checkout.rates,
  );

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [courierGroup, setCourierGroup] = useState<string>(
    COURIER_GROUPS[0].value,
  );
  const [rates, setRates] = useState<CourierRate[]>([]);
  const [selected, setSelected] = useState<CourierRate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDimension, setShowDimension] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  // ─── Handlers ────────────────────────────────────────────

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSelected(null);

    // Validasi
    if (
      !form.origin_postal_code ||
      !form.destination_postal_code ||
      !form.weight
    ) {
      setError("Kode pos asal, tujuan, dan berat wajib diisi.");
      return;
    }

    if (
      !/^\d{5}$/.test(form.origin_postal_code) ||
      !/^\d{5}$/.test(form.destination_postal_code)
    ) {
      setError("Kode pos harus 5 digit angka.");
      return;
    }

    try {
      setLoading(true);
      dispatch(
        getRatesRequest({
          origin_postal_code: form.origin_postal_code,
          destination_postal_code: form.destination_postal_code,
          weight: Number(form.weight),
          length: form.length ? Number(form.length) : undefined,
          width: form.width ? Number(form.width) : undefined,
          height: form.height ? Number(form.height) : undefined,
          value: form.value ? Number(form.value) : undefined,
          quantity: 1,
          couriers: courierGroup,
        }),
      );
      setSearched(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Gagal mengambil tarif.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setRates([]);
    setSelected(null);
    setSearched(false);
    setError(null);
  };

  useEffect(() => {
    if (dataRates) {
      setRates(dataRates);
      setLoading(false);
    }
  }, [dataRates]);

  const handleLanjut = () => {
    if (!selected) return;
    onCourierSelected?.({ selected, form });
  };

  // ─── Derived ─────────────────────────────────────────────

  const sortedRates = [...rates].sort((a, b) => a.price - b.price);

  // ─── UI ──────────────────────────────────────────────────

  return (
    <Container className="py-4" style={{ maxWidth: 820 }}>
      {/* ── Header ── */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#212529" }}>
          Cek Ongkir
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: 14 }}>
          Bandingkan harga pengiriman dari berbagai kurir sebelum checkout.
        </p>
      </div>

      {/* ── Form ── */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            {/* Kode Pos */}
            <Row className="g-3 mb-3">
              <Col xs={12} md={6}>
                <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>
                  Kode Pos Asal
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text
                    style={{
                      background: "#f8f9fa",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="#6c757d"
                    >
                      <path d="M8 0C5.24 0 3 2.24 3 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 7.5C6.62 7.5 5.5 6.38 5.5 5S6.62 2.5 8 2.5 10.5 3.62 10.5 5 9.38 7.5 8 7.5z" />
                    </svg>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="origin_postal_code"
                    placeholder="Contoh: 10110"
                    value={form.origin_postal_code}
                    onChange={handleChange}
                    maxLength={5}
                    pattern="\d{5}"
                    inputMode="numeric"
                    required
                    style={{ fontSize: 14 }}
                  />
                </InputGroup>
                <Form.Text className="text-muted" style={{ fontSize: 11 }}>
                  Kode pos gudang / toko kamu
                </Form.Text>
              </Col>
              <Col xs={12} md={6}>
                <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>
                  Kode Pos Tujuan
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text
                    style={{
                      background: "#f8f9fa",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="#6c757d"
                    >
                      <path d="M8 0C5.24 0 3 2.24 3 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 7.5C6.62 7.5 5.5 6.38 5.5 5S6.62 2.5 8 2.5 10.5 3.62 10.5 5 9.38 7.5 8 7.5z" />
                    </svg>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="destination_postal_code"
                    placeholder="Contoh: 40174"
                    value={form.destination_postal_code}
                    onChange={handleChange}
                    maxLength={5}
                    pattern="\d{5}"
                    inputMode="numeric"
                    required
                    style={{ fontSize: 14 }}
                  />
                </InputGroup>
                <Form.Text className="text-muted" style={{ fontSize: 11 }}>
                  Kode pos pembeli
                </Form.Text>
              </Col>
            </Row>

            {/* Berat */}
            <Row className="g-3 mb-3">
              <Col xs={12} md={6}>
                <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>
                  Berat Paket <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="weight"
                    placeholder="Contoh: 1000"
                    value={form.weight}
                    onChange={handleChange}
                    min={1}
                    required
                    style={{ fontSize: 14 }}
                  />
                  <InputGroup.Text
                    style={{ fontSize: 13, background: "#f8f9fa" }}
                  >
                    gram
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col xs={12} md={6}>
                <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>
                  Nilai Barang
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text
                    style={{ fontSize: 13, background: "#f8f9fa" }}
                  >
                    Rp
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="value"
                    placeholder="Untuk kalkulasi asuransi"
                    value={form.value}
                    onChange={handleChange}
                    min={0}
                    style={{ fontSize: 14 }}
                  />
                </InputGroup>
              </Col>
            </Row>

            {/* Dimensi (opsional, collapse) */}
            <div className="mb-3">
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                style={{ fontSize: 13, color: "#0d6efd" }}
                onClick={() => setShowDimension((v) => !v)}
                type="button"
              >
                {showDimension ? "▲" : "▼"} Tambah dimensi paket (opsional)
              </Button>
            </div>
            {showDimension && (
              <Row className="g-3 mb-3">
                {[
                  { name: "length", label: "Panjang" },
                  { name: "width", label: "Lebar" },
                  { name: "height", label: "Tinggi" },
                ].map(({ name, label }) => (
                  <Col xs={4} key={name}>
                    <Form.Label
                      className="fw-semibold"
                      style={{ fontSize: 13 }}
                    >
                      {label}
                    </Form.Label>
                    <InputGroup size="sm">
                      <Form.Control
                        type="number"
                        name={name}
                        placeholder="0"
                        value={form[name]}
                        onChange={handleChange}
                        min={1}
                        style={{ fontSize: 13 }}
                      />
                      <InputGroup.Text
                        style={{ fontSize: 12, background: "#f8f9fa" }}
                      >
                        cm
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                ))}
              </Row>
            )}

            {/* Filter kurir */}
            <div className="mb-4">
              <Form.Label
                className="fw-semibold d-block"
                style={{ fontSize: 13 }}
              >
                Jenis Kurir
              </Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {COURIER_GROUPS.map((g) => (
                  <Button
                    key={g.value}
                    type="button"
                    size="sm"
                    variant={
                      courierGroup === g.value ? "primary" : "outline-secondary"
                    }
                    style={{
                      borderRadius: 20,
                      fontSize: 12,
                      padding: "3px 14px",
                    }}
                    onClick={() => setCourierGroup(g.value)}
                  >
                    {g.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <Alert variant="danger" className="py-2" style={{ fontSize: 13 }}>
                {error}
              </Alert>
            )}

            {/* Tombol */}
            <div className="d-flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                style={{
                  background: "#0d6efd",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  padding: "10px 28px",
                  fontSize: 14,
                }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Mencari...
                  </>
                ) : (
                  "Cek Ongkir"
                )}
              </Button>
              {searched && (
                <Button
                  type="button"
                  variant="outline-secondary"
                  style={{
                    borderRadius: 10,
                    fontSize: 14,
                    padding: "10px 20px",
                  }}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* ── Hasil ── */}
      {searched && !loading && (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <span className="fw-semibold" style={{ fontSize: 14 }}>
                {sortedRates.length} opsi pengiriman
              </span>
              {sortedRates.length > 0 && (
                <span className="text-muted ms-2" style={{ fontSize: 13 }}>
                  · Termurah{" "}
                  <strong className="text-success">
                    {sortedRates[0].price_formatted}
                  </strong>
                </span>
              )}
            </div>
            {selected && (
              <Badge
                bg="success"
                style={{ fontSize: 12, padding: "5px 10px", borderRadius: 8 }}
              >
                {selected.courier_name} {selected.courier_service_name} dipilih
              </Badge>
            )}
          </div>

          {sortedRates.length === 0 ? (
            <Alert variant="warning" style={{ fontSize: 13, borderRadius: 12 }}>
              Tidak ada kurir tersedia untuk rute ini. Coba ubah jenis kurir
              atau kode pos.
            </Alert>
          ) : (
            <Row className="g-3 mb-4">
              {sortedRates.map((rate) => (
                <Col
                  xs={12}
                  sm={6}
                  md={4}
                  key={`${rate.courier_code}-${rate.courier_service_code}`}
                >
                  <CourierCard
                    rate={rate}
                    selected={
                      selected?.courier_code === rate.courier_code &&
                      selected?.courier_service_code ===
                        rate.courier_service_code
                    }
                    onSelect={setSelected}
                  />
                </Col>
              ))}
            </Row>
          )}

          {/* Tombol lanjut */}
          {selected && selected.courier_code && (
            <div
              className="p-3"
              style={{
                background: "#f8f9fa",
                borderRadius: 14,
                border: "1px solid #dee2e6",
              }}
            >
              {/* Header: logo + nama + badges + tombol */}
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div className="d-flex gap-3 align-items-center">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: "#e9ecef",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#6c757d",
                    }}
                  >
                    {selected.courier_code.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      {selected.courier_name} — {selected.courier_service_name}
                    </div>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {selected.shipping_type && (
                        <Badge bg="secondary" style={{ fontSize: 11 }}>
                          {selected.shipping_type}
                        </Badge>
                      )}
                      {selected.service_type && (
                        <Badge bg="info" text="dark" style={{ fontSize: 11 }}>
                          {selected.service_type}
                        </Badge>
                      )}
                      {selected.available_for_cash_on_delivery && (
                        <Badge bg="success" style={{ fontSize: 11 }}>
                          COD tersedia
                        </Badge>
                      )}
                      {selected.available_for_insurance && (
                        <Badge
                          bg="light"
                          text="dark"
                          style={{ fontSize: 11, border: "1px solid #dee2e6" }}
                        >
                          Asuransi tersedia
                        </Badge>
                      )}
                      {(selected.available_collection_method ?? []).map((m) => (
                        <Badge
                          key={m}
                          bg="light"
                          text="dark"
                          style={{ fontSize: 11, border: "1px solid #dee2e6" }}
                        >
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleLanjut}
                  variant="success"
                  style={{
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  Pakai Kurir Ini →
                </Button>
              </div>

              {/* Estimasi & tipe */}
              <div className="d-flex gap-4 mb-3">
                <div>
                  <div style={{ fontSize: 12, color: "#6c757d" }}>
                    Estimasi tiba
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {selected.shipment_duration_range &&
                    selected.shipment_duration_unit
                      ? `${selected.shipment_duration_range} ${selected.shipment_duration_unit}`
                      : (selected.duration ?? "-")}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#6c757d" }}>
                    Tipe layanan
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {selected.service_type ?? "-"}
                  </div>
                </div>
              </div>

              <hr className="my-2" />

              {/* Rincian biaya */}
              <div
                style={{
                  fontSize: 12,
                  color: "#6c757d",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 6,
                }}
              >
                Rincian biaya
              </div>
              {[
                {
                  label: "Ongkos kirim",
                  value: selected.shipping_fee ?? selected.price,
                },
                {
                  label: "Diskon ongkir",
                  value: -(selected.shipping_fee_discount ?? 0),
                },
                { label: "Biaya asuransi", value: selected.insurance_fee ?? 0 },
                {
                  label: "Biaya COD",
                  value: selected.cash_on_delivery_fee ?? 0,
                },
              ]
                .filter(
                  ({ label, value }) => label === "Ongkos kirim" || value !== 0,
                )
                .map(({ label, value }) => (
                  <div
                    key={label}
                    className="d-flex justify-content-between"
                    style={{ fontSize: 13, padding: "2px 0" }}
                  >
                    <span className="text-muted">{label}</span>
                    <span style={{ color: value < 0 ? "#198754" : "inherit" }}>
                      {value < 0
                        ? `-Rp ${Math.abs(value).toLocaleString("id-ID")}`
                        : `Rp ${value.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                ))}

              <hr className="my-2" />
              <div className="d-flex justify-content-between">
                <span style={{ fontWeight: 700 }}>Total</span>
                <span
                  style={{ fontWeight: 700, color: "#198754", fontSize: 16 }}
                >
                  {selected.price_formatted ??
                    `Rp ${selected.price.toLocaleString("id-ID")}`}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
