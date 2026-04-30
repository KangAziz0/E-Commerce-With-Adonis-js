export interface BiteshipArea {
  id: string
  name: string
  country_name: string
  country_code: string
  administrative_division_level_1_name: string
  administrative_division_level_1_type: string
  administrative_division_level_2_name: string
  administrative_division_level_2_type: string
  administrative_division_level_3_name: string | null
  administrative_division_level_3_type: string | null
  postal_code: number | null
}

export interface BiteshipAreasResponse {
  success: boolean
  areas: BiteshipArea[]
}

export interface GetAreasQuery {
  countries: string
  input: string
  type?: 'single' | 'multiple'
}

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
