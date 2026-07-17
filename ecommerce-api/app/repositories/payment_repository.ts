import BaseRepository from './base_repository.js'
import Payment from '#models/payment'

export default class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super(Payment)
  }

  async findByIdWithOrder(id: number): Promise<Payment | null> {
    return Payment.query().where('id', id).preload('order').first()
  }

  async findByIdOrFailWithOrder(id: number): Promise<Payment> {
    return Payment.query().where('id', id).preload('order').firstOrFail()
  }

  async findByExternalPaymentId(externalPaymentId: string): Promise<Payment | null> {
    return Payment.query().where('external_payment_id', externalPaymentId).first()
  }

  async findByExternalReferenceId(referenceId: string): Promise<Payment | null> {
    return Payment.query().where('external_reference_id', referenceId).first()
  }

  async findPendingByOrderId(orderId: number): Promise<Payment | null> {
    return Payment.query()
      .where('order_id', orderId)
      .where('status', 'PENDING')
      .orderBy('id', 'desc')
      .first()
  }
}
