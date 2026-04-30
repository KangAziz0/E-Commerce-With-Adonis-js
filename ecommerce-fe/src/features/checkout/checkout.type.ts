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
