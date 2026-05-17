import { useCallback, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";

import {
  selectAreaOptions,
  selectAreasError,
  selectAreasLoading,
} from "@/features/selectors/areas/area.selectors";
import type {
  AreaOption,
  SelectedAddress,
} from "@/features/selectors/areas/area.types";
import {
  clearAreas,
  fetchAreasRequest,
} from "@/features/selectors/areas/areaSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

interface RecipientAddressFormProps {
  onChange?: (address: SelectedAddress | null) => void;
}

const MIN_SEARCH_LENGTH = 3;

const RecipientAddressForm: React.FC<RecipientAddressFormProps> = ({
  onChange,
}) => {
  const dispatch = useAppDispatch();
  const options = useAppSelector(selectAreaOptions);
  const loading = useAppSelector(selectAreasLoading);
  const error = useAppSelector(selectAreasError);

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

      if (value.length >= MIN_SEARCH_LENGTH) {
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

  // Delay closing so a click on a dropdown item registers before blur.
  const handleBlur = useCallback(() => {
    setTimeout(() => setShowDropdown(false), 200);
  }, []);

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
              setRecipientName(e.target.value);
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
              setRecipientPhone(e.target.value);
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
              setAddressLabel(e.target.value);
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
                    className="px-3 py-2"
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
              inputValue.length >= MIN_SEARCH_LENGTH &&
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
            Ketik minimal {MIN_SEARCH_LENGTH} huruf untuk mencari
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
              setFullAddress(e.target.value);
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
              setCourierNote(e.target.value);
              if (selected) emitChange(selected);
            }}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default RecipientAddressForm;
