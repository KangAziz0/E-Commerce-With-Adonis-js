export type CourierCode =
  | "jne"
  | "jnt"
  | "sicepat"
  | "anteraja"
  | "tiki"
  | "grab"
  | "gojek"
  | "lion";

export interface CourierRate {
  courier_code: CourierCode;
  courier_name: string;
  courier_service_code: string;
  courier_service_name: string;
  type?: string;
  company?: string;

  currency?: string;
  price: number;
  price_formatted?: string;
  shipping_fee?: number;
  shipping_fee_discount?: number;
  shipping_fee_surcharge?: number;
  insurance_fee?: number;
  cash_on_delivery_fee?: number;

  tax_lines?: unknown[];

  duration?: string;
  shipment_duration_range?: string;
  shipment_duration_unit?: string;
  description?: string;

  service_type?: string;
  shipping_type?: string;

  available_collection_method: string[];
  available_for_cash_on_delivery?: boolean;
  available_for_proof_of_delivery?: boolean;
  available_for_instant_waybill_id?: boolean;
  available_for_insurance?: boolean;
}

export interface RateItem {
  name: string;
  description?: string;
  value: number;
  length?: number;
  width?: number;
  height?: number;
  weight: number;
  quantity: number;
}

export interface GetRatesParams {
  origin_area_id: string;
  destination_area_id: string;
  couriers?: string;
  items: RateItem[];
}

export interface CheckoutItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateInvoicePayload {
  items: CheckoutItem[];
  email: string;
  courier: string;
  service: string;
  destinationId: string;
}

export interface InvoiceResponse {
  invoiceId: string;
  externalId: string;
  invoiceUrl: string;
  amount: number;
  status: string;
  expiryDate: string;
}
