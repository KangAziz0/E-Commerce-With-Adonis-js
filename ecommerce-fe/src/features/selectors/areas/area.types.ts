export interface Area {
  id: string;
  name: string;
  country_name: string;
  country_code: string;
  administrative_division_level_1_name: string; // provinsi
  administrative_division_level_1_type: string;
  administrative_division_level_2_name: string; // kota
  administrative_division_level_2_type: string;
  administrative_division_level_3_name: string | null; // kecamatan
  administrative_division_level_3_type: string | null;
  postal_code: number | null;
}

export interface GetAreasParams {
  countries: string;
  input: string;
  type?: "single" | "multiple";
}

export interface AreaOption {
  value: string; // area.id
  label: string; // area.name
  area: Area; // raw data untuk extract provinsi/kota/kecamatan/kode pos
}

export interface SelectedAddress {
  area_id: string;
  province?: string;
  city?: string;
  district?: string | null;
  postal_code?: number | null;
  recipient_name?: string;
  recipient_phone?: string;
  address_label?: string;
  full_address?: string;
  courier_note?: string;
}
