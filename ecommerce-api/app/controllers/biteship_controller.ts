import type { HttpContext } from '@adonisjs/core/http'

import BiteshipService from '#services/BiteshipService'
import { orderSchema, ratesSchema } from '#validators/BiteshipValidator'
import { IDR } from '../helpers/currency.js'
import { successResponse } from '../helpers/response.js'

export default class BiteshipController {
  readonly #biteshipService: BiteshipService
  constructor() {
    this.#biteshipService = new BiteshipService()
  }

  // ─── GET /api/shipping/rates ─────────────────────────────

  /**
   * Cek ongkir berdasarkan kode pos asal, tujuan, dan dimensi barang.
   *
   * Query params:
   *   origin_postal_code      : string (required)
   *   destination_postal_code : string (required)
   *   weight                  : number gram (required)
   *   length                  : number cm
   *   width                   : number cm
   *   height                  : number cm
   *   value                   : number (harga barang untuk asuransi)
   *   couriers                : string csv, default semua utama
   */
  async getRates({ request, response }: HttpContext) {
    const payload = await request.validateUsing(ratesSchema)

    const result = await this.#biteshipService.getRates({
      origin_postal_code: payload.origin_postal_code,
      destination_postal_code: payload.destination_postal_code,
      couriers: payload.couriers ?? 'jne,jnt,sicepat,anteraja,grab,gojek,lion,tiki',
      items: [
        {
          name: 'Paket',
          value: payload.value ?? 0,
          length: payload.length ?? 10,
          width: payload.width ?? 10,
          height: payload.height ?? 10,
          weight: payload.weight,
          quantity: 1,
        },
      ],
    })

    const enriched = result.pricing.map((rate) => ({
      ...rate,
      price_formatted: IDR(rate.price),
    }))

    return response.ok({
      status: 'success',
      message: 'Berhasil ambil data ongkir',
      data: enriched,
      meta: {
        origin: payload.origin_postal_code,
        destination: payload.destination_postal_code,
        weight_gram: payload.weight,
        total_couriers: enriched.length,
      },
    })
  }

  // ─── POST /api/shipping/orders ───────────────────────────

  /**
   * Buat order pengiriman baru ke Biteship.
   * Dipanggil setelah pembayaran dikonfirmasi oleh Xendit webhook.
   */
  async createOrder({ request, response }: HttpContext) {
    const payload = await request.validateUsing(orderSchema)

    const biteshipOrder = await this.#biteshipService.createOrder({
      ...payload,
      delivery_type: 'now',
      metadata: payload.internal_order_id
        ? { internal_order_id: payload.internal_order_id }
        : undefined,
    })

    return response.created(
      successResponse('Order berhasil dibuat', {
        biteship_order_id: biteshipOrder.id,
        waybill_id: biteshipOrder.waybill_id,
        tracking_id: biteshipOrder.tracking_id,
        status: biteshipOrder.status,
        courier: biteshipOrder.courier,
        price: biteshipOrder.price,
        price_formatted: IDR(biteshipOrder.price),
      })
    )
  }

  // ─── GET /api/shipping/track/:id ─────────────────────────

  /**
   * Ambil status tracking berdasarkan Biteship order ID.
   */
  async trackOrder({ params, response }: HttpContext) {
    const tracking = await this.#biteshipService.trackOrder(params.id)

    return response.ok(
      successResponse('Track Order Success', {
        id: tracking.id,
        waybill_id: tracking.waybill_id,
        status: tracking.status,
        courier: tracking.courier,
        origin: tracking.origin,
        destination: tracking.destination,
        history: tracking.history,
        updated_at: tracking.updated_at,
      })
    )
  }

  // ─── DELETE /api/shipping/orders/:id ─────────────────────

  /**
   * Batalkan order pengiriman.
   */
  async cancelOrder({ params, response }: HttpContext) {
    const result = await this.#biteshipService.cancelOrder(params.id)

    return response.ok(successResponse(result.message ?? 'Order berhasil dibatalkan'))
  }
}
