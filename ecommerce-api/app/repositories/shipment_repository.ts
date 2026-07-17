import BaseRepository from './base_repository.js'
import Shipment from '#models/shipment'

export default class ShipmentRepository extends BaseRepository<Shipment> {
  constructor() {
    super(Shipment)
  }

  async findByOrderId(orderId: number, trx?: any): Promise<Shipment | null> {
    return Shipment.query({ client: trx })
      .where('order_id', orderId)
      .first() as Promise<Shipment | null>
  }

  async findByIdWithOrder(id: number): Promise<Shipment | null> {
    return Shipment.query().where('id', id).preload('order').first() as Promise<Shipment | null>
  }

  async findByIdOrFailWithOrder(id: number): Promise<Shipment> {
    return Shipment.query().where('id', id).preload('order').firstOrFail() as Promise<Shipment>
  }

  async upsertByOrderId(orderId: number, data: Partial<Shipment>, trx?: any): Promise<Shipment> {
    let shipment = await this.findByOrderId(orderId, trx)
    if (shipment) {
      shipment.useTransaction(trx)
      shipment.merge(data)
      await shipment.save()
    } else {
      shipment = await Shipment.create(data as any, { client: trx })
    }
    return shipment
  }
}
