import BaseRepository from './base_repository.js'
import Order from '#models/order'
import OrderItem from '#models/order_item'

export default class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(Order)
  }

  async findByEmail(email: string): Promise<Order[]> {
    return Order.query().where('email', email).preload('items').orderBy('created_at', 'desc')
  }

  async findByExternalId(externalId: string): Promise<Order | null> {
    return Order.query()
      .where('external_id', externalId)
      .preload('items')
      .preload('payments')
      .preload('shipment')
      .first()
  }

  async findByExternalIdOrFail(externalId: string): Promise<Order> {
    return Order.query()
      .where('external_id', externalId)
      .preload('items')
      .preload('payments')
      .preload('shipment')
      .firstOrFail()
  }

  async findByIdWithRelations(id: number): Promise<Order | null> {
    return Order.query()
      .where('id', id)
      .preload('items')
      .preload('payments')
      .preload('shipment')
      .first()
  }

  async findByIdOrFailWithRelations(id: number): Promise<Order> {
    return Order.query()
      .where('id', id)
      .preload('items')
      .preload('payments')
      .preload('shipment')
      .firstOrFail()
  }

  async findByOrderIdOrExternalId(identifier: string | number): Promise<Order | null> {
    const query = Order.query().preload('payments')
    const numericId = Number(identifier)
    if (!Number.isNaN(numericId) && Number.isInteger(numericId)) {
      query.where('id', numericId)
    }
    query.orWhere('external_id', String(identifier))
    return query.first()
  }

  async findByIdWithItems(id: number, trx?: any): Promise<Order | null> {
    return Order.query({ client: trx }).where('id', id).preload('items').first()
  }

  async findByIdOrFailWithItems(id: number, trx?: any): Promise<Order> {
    return Order.query({ client: trx }).where('id', id).preload('items').firstOrFail()
  }

  async updateBiteshipFields(
    orderId: number,
    data: {
      biteshipOrderId: string
      waybillId: string
      trackingId: string
      shippingStatus: string
      biteshipRawResponse: string
    }
  ): Promise<void> {
    await Order.query().where('id', orderId).whereNull('biteship_order_id').update(data)
  }

  async createOrderItems(
    orderId: number,
    items: Array<{
      productId: number
      variantId: number | null
      name: string
      price: number
      quantity: number
    }>,
    options?: { client?: any }
  ): Promise<void> {
    const itemsData = items.map((item) => ({ ...item, orderId }))
    await OrderItem.createMany(itemsData, options)
  }
}
