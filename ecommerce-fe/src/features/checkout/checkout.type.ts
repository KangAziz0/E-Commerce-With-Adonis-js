export interface GetRatesParams {
  origin_area_id: string;
  destination_area_id: string;
  couriers?: string;
  items: Array<{
    name: string;
    description?: string;
    value: number;
    length?: number;
    width?: number;
    height?: number;
    weight: number;
    quantity: number;
  }>;
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
