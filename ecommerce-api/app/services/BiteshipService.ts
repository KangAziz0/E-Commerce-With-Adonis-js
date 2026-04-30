import BiteshipClient from '../clients/biteship_client.js'
import {
  BiteshipArea,
  BiteshipAreasResponse,
  BiteshipOrder,
  CheckRatesPayload,
  CreateOrderPayload,
  RatesResponse,
  TrackingResponse,
} from '../types/biteship.js'

// ============================================================
// Service
// ============================================================

export default class BiteshipService {
  private readonly client: BiteshipClient

  constructor(client: BiteshipClient = new BiteshipClient()) {
    this.client = client
  }

  // ─── Areas ────────────────────────────────────────────────
  async getAreas(params: {
    countries: string
    input: string
    type?: 'single' | 'multiple'
  }): Promise<BiteshipArea[]> {
    const { data } = await this.client.axios.get<BiteshipAreasResponse>('/v1/maps/areas', {
      params,
    })
    return data.areas
  }

  // ─── Cek Ongkir ───────────────────────────────────────────

  async getRates(payload: CheckRatesPayload): Promise<RatesResponse> {
    const body = {
      origin_area_id: payload.origin_area_id,
      destination_area_id: payload.destination_area_id,
      couriers: payload.couriers?.replace(/\s/g, ''),
      items: payload.items.map((item) => ({
        ...item,
        weight: Number(item.weight),
        length: Number(item.length),
        width: Number(item.width),
        height: Number(item.height),
      })),
    }
    const { data } = await this.client.axios.post<RatesResponse>('/v1/rates/couriers', body)
    return data
  }

  // ─── Buat Order ───────────────────────────────────────────

  async createOrder(payload: CreateOrderPayload): Promise<BiteshipOrder> {
    const { data } = await this.client.axios.post<BiteshipOrder>('/v1/orders', payload)
    return data
  }

  // ─── Tracking ─────────────────────────────────────────────

  async trackOrder(biteshipOrderId: string): Promise<TrackingResponse> {
    const { data } = await this.client.axios.get<TrackingResponse>(
      `/v1/trackings/${biteshipOrderId}`
    )
    return data
  }

  // ─── Batalkan Order ───────────────────────────────────────

  async cancelOrder(biteshipOrderId: string): Promise<{ success: boolean; message: string }> {
    const { data } = await this.client.axios.delete(`/v1/orders/${biteshipOrderId}`)
    return data
  }
}
