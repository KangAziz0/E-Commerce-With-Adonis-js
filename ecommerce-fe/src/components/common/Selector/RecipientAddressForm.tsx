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

  // ─── Search ───────────────────────────────────────────────

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

  console.log("options", options);

  // ─── Select ───────────────────────────────────────────────

  const handleSelect = useCallback(
    (option: AreaOption) => {
      const { area } = option;

      setSelected(option);
      setInputValue(option.label);
      setShowDropdown(false);
      dispatch(clearAreas());

      onChange?.({
        area_id: area.id,
        province: area.administrative_division_level_1_name,
        city: area.administrative_division_level_2_name,
        district: area.administrative_division_level_3_name,
        postal_code: area.postal_code,
      });
    },
    [dispatch, onChange],
  );

  const handleBlur = useCallback(() => {
    // delay supaya klik dropdown sempat terpanggil dulu
    setTimeout(() => setShowDropdown(false), 200);
  }, []);

  // ─── Derived values dari selected area ───────────────────

  const province = selected?.area.administrative_division_level_1_name ?? "";
  const city = selected?.area.administrative_division_level_2_name ?? "";
  const district = selected?.area.administrative_division_level_3_name ?? "";
  const postalCode = selected?.area.postal_code?.toString() ?? "";

  // ─── Render ───────────────────────────────────────────────

  return (
    <Row className="g-3">
      {/* Search Area */}
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

            {/* Loading spinner */}
            {loading && (
              <div
                className="position-absolute top-50 end-0 translate-middle-y pe-3"
                style={{ pointerEvents: "none" }}
              >
                <Spinner animation="border" size="sm" variant="secondary" />
              </div>
            )}

            {/* Dropdown hasil pencarian */}
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

            {/* Empty state */}
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

      {/* Provinsi */}
      <Col xs={12} md={6}>
        <Form.Group>
          <Form.Label>Provinsi</Form.Label>
          <Form.Control
            type="text"
            value={province}
            readOnly
            placeholder="Terisi otomatis"
            className="bg-light"
          />
        </Form.Group>
      </Col>

      {/* Kota / Kabupaten */}
      <Col xs={12} md={6}>
        <Form.Group>
          <Form.Label>Kota / Kabupaten</Form.Label>
          <Form.Control
            type="text"
            value={city}
            readOnly
            placeholder="Terisi otomatis"
            className="bg-light"
          />
        </Form.Group>
      </Col>

      {/* Kecamatan */}
      <Col xs={12} md={6}>
        <Form.Group>
          <Form.Label>Kecamatan</Form.Label>
          <Form.Control
            type="text"
            value={district}
            readOnly
            placeholder="Terisi otomatis"
            className="bg-light"
          />
        </Form.Group>
      </Col>

      {/* Kode Pos */}
      <Col xs={12} md={6}>
        <Form.Group>
          <Form.Label>Kode Pos</Form.Label>
          <Form.Control
            type="text"
            value={postalCode}
            readOnly
            placeholder="Terisi otomatis"
            className="bg-light"
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default RecipientAddressForm;
