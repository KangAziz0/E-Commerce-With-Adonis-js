import BiteshipService from '#services/BiteshipService'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import env from '#start/env'
import type { BiteshipOrder } from '../types/biteship.js'

/**
 * Creates a Biteship shipment order for a given order and its items.
 * Shared between admin order retry and admin shipments retry controllers.
 */
export async function createBiteshipShipmentForOrder(
  order: Order,
  items: OrderItem[]
): Promise<BiteshipOrder> {
  const biteshipService = new BiteshipService()

  const storeName = env.get('STORE_NAME') || 'Toko Online'
  const storePhone = env.get('STORE_PHONE') || '08123456789'
  const storeAddress = env.get('STORE_ADDRESS') || 'Jl. Toko Online No. 1'
  const storePostalCode = env.get('STORE_POSTAL_CODE') || '10110'

  const biteshipOrder = await biteshipService.createOrder({
    shipper_contact_name: storeName,
    shipper_contact_phone: storePhone,
    origin_contact_name: storeName,
    origin_contact_phone: storePhone,
    origin_address: storeAddress,
    origin_postal_code: storePostalCode,
    origin_area_id: order.originAreaId || '',
    destination_area_id: order.destinationAreaId || '',
    courier_company: order.courierCompany!,
    courier_type: order.courierType || 'REG',
    delivery_type: 'now',
    destination_contact_name: order.destinationContactName || '',
    destination_contact_phone: order.destinationContactPhone || '',
    destination_address: order.destinationAddress || '',
    destination_postal_code: order.destinationPostalCode || '0',
    destination_note: order.destinationNote || '',
    items: items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      value: item.price,
      weight: 500,
      length: 10,
      width: 10,
      height: 10,
    })),
  })

  return biteshipOrder
}
