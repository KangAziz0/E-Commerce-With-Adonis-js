import Order from '#models/order'
import Shipment from '#models/shipment'
import type { BiteshipWebhookPayload } from '../types/biteship.js'

export default class ShipmentService {
  async handleWebhook(payload: BiteshipWebhookPayload) {
    const biteshipOrderId = payload.order_id

    // Find order by biteship_order_id
    const order = await Order.query().where('biteship_order_id', biteshipOrderId).first()

    if (!order) {
      console.warn(`[ShipmentService] No order found for biteship_order_id: ${biteshipOrderId}`)
      return
    }

    // Upsert shipment record (create or update based on order_id)
    let shipment = await Shipment.query().where('order_id', order.id).first()

    const trackingEntry = {
      status: payload.status,
      updated_at: new Date().toISOString(),
      courier_waybill_id: payload.courier_waybill_id,
      courier_driver_name: payload.courier_driver_name,
    }

    if (shipment) {
      // Update existing shipment
      shipment.status = payload.status
      shipment.courierCompany = payload.courier_company
      shipment.courierType = payload.courier_type
      shipment.waybillId = payload.courier_waybill_id || shipment.waybillId
      shipment.trackingId = payload.tracking_id || shipment.trackingId
      shipment.rawWebhookPayload = payload as unknown as Record<string, any>

      // Append new tracking entry to history
      const history = Array.isArray(shipment.trackingHistory) ? [...shipment.trackingHistory] : []
      history.push(trackingEntry)
      shipment.trackingHistory = history

      await shipment.save()
    } else {
      // Create new shipment
      shipment = await Shipment.create({
        orderId: order.id,
        biteshipOrderId,
        courierCompany: payload.courier_company,
        courierType: payload.courier_type,
        waybillId: payload.courier_waybill_id || null,
        trackingId: payload.tracking_id || null,
        status: payload.status,
        trackingHistory: [trackingEntry],
        rawWebhookPayload: payload as unknown as Record<string, any>,
      })
    }

    // Update order shipping status
    order.shippingStatus = payload.status
    await order.save()

    return shipment
  }
}
