import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import {
  AreaOption,
  SelectedAddress,
} from "@/features/selectors/areas/area.type";
import {
  selectAreaOptions,
  selectAreasError,
  selectAreasLoading,
} from "@/features/selectors/areas/area.selectors";
import {
  clearAreas,
  fetchAreasRequest,
} from "@/features/selectors/areas/areaSlice";

interface RecipientAddressFormProps {
  onChange?: (address: SelectedAddress | null) => void;
}

const RecipientAddressForm: React.FC<RecipientAddressFormProps> = ({
  onChange,
}) => {
  const dispatch = useDispatch();
  const options = useSelector(selectAreaOptions) ?? [];
  const loading = useSelector(selectAreasLoading);
  const error = useSelector(selectAreasError);

  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<AreaOption | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [addressLabel, setAddressLabel] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [courierNote, setCourierNote] = useState("");

  const emitChange = useCallback(
    (areaOption: AreaOption | null) => {
      if (!areaOption) {
        onChange?.(null);
        return;
      }

      const { area } = areaOption;
      onChange?.({
        area_id: area.id,
        postal_code: area.postal_code,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        address_label: addressLabel,
        full_address: fullAddress,
        courier_note: courierNote,
      });
    },
    [
      addressLabel,
      courierNote,
      fullAddress,
      onChange,
      recipientName,
      recipientPhone,
    ],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setSelected(null);
      onChange?.(null);

      if (value.length >= 3) {
        dispatch(
          fetchAreasRequest({ countries: "ID", input: value, type: "single" }),
        );
        setShowDropdown(true);
      } else {
        dispatch(clearAreas());
        setShowDropdown(false);
      }
    },
    [dispatch, onChange],
  );

  // ─── Select ───────────────────────────────────────────────

  const handleSelect = useCallback(
    (option: AreaOption) => {
      setSelected(option);
      setInputValue(option.label);
      setShowDropdown(false);
      dispatch(clearAreas());
      emitChange(option);
    },
    [dispatch, emitChange],
  );

  const handleBlur = useCallback(() => {
    // delay supaya klik dropdown sempat terpanggil dulu
    setTimeout(() => setShowDropdown(false), 200);
  }, []);

  // ─── Render ───────────────────────────────────────────────

  return (
    <Row className="g-3">
      <Col xs={12} md={6}>
        <Form.Group>
          <Form.Label>
            Nama Penerima <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Masukkan nama penerima"
            value={recipientName}
            onChange={(e) => {
              const value = e.target.value;
              setRecipientName(value);
              if (selected) emitChange(selected);
            }}
          />
        </Form.Group>
      </Col>

      <Col xs={12} md={6}>
        <Form.Group>
          <Form.Label>
            Nomor Penerima <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="tel"
            placeholder="Contoh: 081234567890"
            value={recipientPhone}
            onChange={(e) => {
              const value = e.target.value;
              setRecipientPhone(value);
              if (selected) emitChange(selected);
            }}
          />
        </Form.Group>
      </Col>

      <Col xs={12}>
        <Form.Group>
          <Form.Label>
            Label Alamat <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Contoh: Rumah, Kantor"
            value={addressLabel}
            onChange={(e) => {
              const value = e.target.value;
              setAddressLabel(value);
              if (selected) emitChange(selected);
            }}
          />
        </Form.Group>
      </Col>

      <Col xs={12}>
        <Form.Group>
          <Form.Label>
            Cari Kecamatan / Kota / Provinsi / Kode Pos{" "}
            <span className="text-danger">*</span>
          </Form.Label>
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Contoh: Margaasih, Bandung..."
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => options.length > 0 && setShowDropdown(true)}
              onBlur={handleBlur}
              isInvalid={!!error}
            />

            {loading && (
              <div
                className="position-absolute top-50 end-0 translate-middle-y pe-3"
                style={{ pointerEvents: "none" }}
              >
                <Spinner animation="border" size="sm" variant="secondary" />
              </div>
            )}

            {showDropdown && options.length > 0 && (
              <div
                className="position-absolute w-100 bg-white border rounded shadow-sm"
                style={{
                  zIndex: 1050,
                  maxHeight: 240,
                  overflowY: "auto",
                  top: "100%",
                }}
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    className="px-3 py-2 cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onMouseDown={() => handleSelect(option)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <small>{option.label}</small>
                  </div>
                ))}
              </div>
            )}

            {showDropdown &&
              !loading &&
              inputValue.length >= 3 &&
              options.length === 0 && (
                <div
                  className="position-absolute w-100 bg-white border rounded shadow-sm px-3 py-2"
                  style={{ zIndex: 1050, top: "100%" }}
                >
                  <small className="text-muted">Area tidak ditemukan</small>
                </div>
              )}
          </div>

          {error && (
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          )}
          <Form.Text className="text-muted">
            Ketik minimal 3 huruf untuk mencari
          </Form.Text>
        </Form.Group>
      </Col>

      <Col xs={12}>
        <Form.Group>
          <Form.Label>
            Alamat Lengkap <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Nama jalan, nomor rumah, RT/RW, patokan, dll"
            value={fullAddress}
            onChange={(e) => {
              const value = e.target.value;
              setFullAddress(value);
              if (selected) emitChange(selected);
            }}
          />
        </Form.Group>
      </Col>

      <Col xs={12}>
        <Form.Group>
          <Form.Label>Catatan Untuk Kurir</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Contoh: pagar warna hitam, titip ke satpam"
            value={courierNote}
            onChange={(e) => {
              const value = e.target.value;
              setCourierNote(value);
              if (selected) emitChange(selected);
            }}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default RecipientAddressForm;
