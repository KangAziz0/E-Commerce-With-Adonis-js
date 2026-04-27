import env from '#start/env'
import Logger from '@adonisjs/core/services/logger'
import axios, { AxiosInstance } from 'axios'

// ============================================================
// Types
// ============================================================

export interface CourierRate {
  courier_code: string
  courier_name: string
  courier_service_code: string
  courier_service_name: string
  description: string
  duration: string
  shipment_duration_range: string
  shipment_duration_unit: string
  price: number
  type: string
}

export interface RatesResponse {
  success: boolean
  object: string
  message: string
  code: number
  pricing: CourierRate[]
}

export interface CheckRatesPayload {
  origin_postal_code: string
  destination_postal_code: string
  couriers: string // 'jne,jnt,sicepat,anteraja,grab,gojek' dsb
  items: Array<{
    name: string
    description?: string
    value: number
    length: number // cm
    width: number // cm
    height: number // cm
    weight: number // gram
    quantity: number
  }>
}

export interface CreateOrderPayload {
  shipper_contact_name: string
  shipper_contact_phone: string
  shipper_contact_email?: string
  shipper_organization?: string
  origin_contact_name: string
  origin_contact_phone: string
  origin_address: string
  origin_note?: string
  origin_postal_code: string
  destination_contact_name: string
  destination_contact_phone: string
  destination_address: string
  destination_postal_code: string
  destination_note?: string
  courier_company: string // contoh: 'jne'
  courier_type: string // contoh: 'REG'
  delivery_type: string // 'now' | 'later'
  order_note?: string
  metadata?: Record<string, unknown>
  items: Array<{
    name: string
    description?: string
    value: number
    length: number
    width: number
    height: number
    weight: number
    quantity: number
  }>
}

export interface BiteshipOrder {
  id: string
  status: string
  tracking_id: string
  waybill_id: string
  courier: {
    company: string
    name: string
    phone: string
    driver_name?: string
    driver_phone?: string
  }
  price: number
  origin_contact_name: string
  origin_address: string
  destination_contact_name: string
  destination_address: string
  metadata?: Record<string, unknown>
}

export interface TrackingHistory {
  note: string
  status: string
  updated_at: string
}

export interface TrackingResponse {
  success: boolean
  object: string
  id: string
  waybill_id: string
  courier: {
    company: string
    name: string
    phone: string
  }
  origin: {
    contact_name: string
    address: string
  }
  destination: {
    contact_name: string
    address: string
  }
  history: TrackingHistory[]
  status: string
  updated_at: string
}

// ============================================================
// Service
// ============================================================

export default class BiteshipService {
  private readonly client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: env.get('BITESHIP_API_KEY'),
      headers: {
        'Authorization': `Bearer ${env.get('BITESHIP_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      timeout: 15_000,
    })

    // Request log
    this.client.interceptors.request.use((config) => {
      Logger.info({ method: config.method?.toUpperCase(), url: config.url }, '[Biteship] Request')
      return config
    })

    // Response / error log
    this.client.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err.response?.status
        const data = err.response?.data
        Logger.error({ status, data, url: err.config?.url }, '[Biteship] Error')
        throw err
      }
    )
  }

  // ─── Cek Ongkir ───────────────────────────────────────────

  /**
   * Ambil daftar tarif pengiriman dari berbagai kurir.
   * Biteship endpoint: GET /v1/rates/couriers
   */
  async getRates(payload: CheckRatesPayload): Promise<RatesResponse> {
    const params = new URLSearchParams({
      origin_postal_code: payload.origin_postal_code,
      destination_postal_code: payload.destination_postal_code,
      couriers: payload.couriers,
      items: JSON.stringify(payload.items),
    })

    const { data } = await this.client.get<RatesResponse>(`/v1/rates/couriers?${params.toString()}`)
    return data
  }

  // ─── Buat Order ───────────────────────────────────────────

  /**
   * Buat order pengiriman baru.
   * Biteship endpoint: POST /v1/orders
   */
  async createOrder(payload: CreateOrderPayload): Promise<BiteshipOrder> {
    const { data } = await this.client.post<BiteshipOrder>('/v1/orders', payload)
    return data
  }

  // ─── Tracking ─────────────────────────────────────────────

  /**
   * Ambil status tracking berdasarkan ID order Biteship.
   * Biteship endpoint: GET /v1/trackings/:id
   */
  async trackOrder(biteshipOrderId: string): Promise<TrackingResponse> {
    const { data } = await this.client.get<TrackingResponse>(`/v1/trackings/${biteshipOrderId}`)
    return data
  }

  // ─── Batalkan Order ───────────────────────────────────────

  /**
   * Batalkan order yang sudah dibuat.
   * Hanya bisa dibatalkan sebelum kurir pickup.
   */
  async cancelOrder(biteshipOrderId: string): Promise<{ success: boolean; message: string }> {
    const { data } = await this.client.delete(`/v1/orders/${biteshipOrderId}`)
    return data
  }
}
