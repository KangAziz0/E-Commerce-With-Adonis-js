import ShipmentRepository from '#repositories/shipment_repository'
import Shipment from '#models/shipment'
import Order from '#models/order'
import db from '@adonisjs/lucid/services/db'
import type { BiteshipWebhookPayload } from '../types/biteship.js'

export default class ShipmentService {
  readonly #shipmentRepo = new ShipmentRepository()

  async handleWebhook(payload: BiteshipWebhookPayload) {
    const biteshipOrderId = payload.order_id

    const trackingEntry = {
      status: payload.status,
      timestamp: new Date().toISOString(),
      note: payload.courier_driver_name
        ? `Driver: ${payload.courier_driver_name}`
        : `Status updated to ${payload.status}`,
    }

    const trx = await db.transaction()

    try {
      const order = await Order.query({ client: trx })
        .where('biteship_order_id', biteshipOrderId)
        .first()

      if (!order) {
        await trx.rollback()
        console.warn(`[ShipmentService] No order found for biteship_order_id: ${biteshipOrderId}`)
        return
      }

      let shipment = await this.#shipmentRepo.findByOrderId(order.id)

      if (shipment) {
        shipment.useTransaction(trx)
        shipment.status = payload.status
        shipment.courierCompany = payload.courier_company
        shipment.courierType = payload.courier_type
        shipment.waybillId = payload.courier_waybill_id || shipment.waybillId
        shipment.trackingId = payload.tracking_id || shipment.trackingId
        shipment.rawWebhookPayload = payload as unknown as Record<string, any>

        const history = Array.isArray(shipment.trackingHistory) ? [...shipment.trackingHistory] : []
        const alreadyExists = history.some((e: any) => e.status === payload.status)
        if (!alreadyExists) {
          history.push(trackingEntry)
          shipment.trackingHistory = history
        }

        await shipment.save()
      } else {
        shipment = await Shipment.create(
          {
            orderId: order.id,
            biteshipOrderId,
            courierCompany: payload.courier_company,
            courierType: payload.courier_type,
            waybillId: payload.courier_waybill_id || null,
            trackingId: payload.tracking_id || null,
            status: payload.status,
            trackingHistory: [trackingEntry],
            rawWebhookPayload: payload as unknown as Record<string, any>,
          },
          { client: trx }
        )
      }

      order.useTransaction(trx)
      order.shippingStatus = payload.status
      await order.save()

      await trx.commit()
      return shipment
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
