export interface GetRatesParams {
  origin_postal_code: string;
  destination_postal_code: string;
  weight: number;
  length?: number;
  quantity?: number;
  width?: number;
  height?: number;
  value?: number;
  couriers?: string;
}
