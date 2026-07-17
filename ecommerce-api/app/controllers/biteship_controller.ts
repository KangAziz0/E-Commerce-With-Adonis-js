import type { HttpContext } from '@adonisjs/core/http'

import BiteshipService from '#services/BiteshipService'
import { IDR } from '../helpers/currency.js'
import { successResponse } from '../helpers/response.js'
import { getAreasValidator, orderSchema, ratesValidator } from '#validators/biteship_validator'

export default class BiteshipController {
  readonly #biteshipService: BiteshipService
  constructor() {
    this.#biteshipService = new BiteshipService()
  }

  // ─── GET /api/shipping/rates ─────────────────────────────

  async getRates({ request, response }: HttpContext) {
    const payload = await request.validateUsing(ratesValidator)

    const result = await this.#biteshipService.getRates({
      origin_area_id: payload.origin_area_id,
      destination_area_id: payload.destination_area_id,
      couriers: payload.couriers ?? 'jne,jnt,sicepat,anteraja,grab,gojek,lion,tiki',
      items: payload.items.map((item: any) => ({
        name: item.name,
        description: item.description,
        value: item.value,
        length: item.length,
        width: item.width,
        height: item.height,
        weight: item.weight,
        quantity: item.quantity,
      })),
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
        origin_area_id: payload.origin_area_id,
        destination_area_id: payload.destination_area_id,
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

  /**
   * Search Area.
   */

  async getAreas({ request, response }: HttpContext) {
    const payload = await request.validateUsing(getAreasValidator)

    const areas = await this.#biteshipService.getAreas({
      countries: payload.countries,
      input: payload.input,
      type: payload.type,
    })

    return response.ok(successResponse('Berhasil ambil data area', areas))
  }
}
