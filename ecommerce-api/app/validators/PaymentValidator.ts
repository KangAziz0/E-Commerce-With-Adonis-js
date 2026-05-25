import vine from '@vinejs/vine'

export const createPaymentValidator = vine.compile(
  vine.object({
    orderId: vine.number().positive(),
    paymentMethod: vine.enum(['QRIS', 'VIRTUAL_ACCOUNT', 'EWALLET']),
    paymentChannel: vine.string().optional(),
  })
)

export const webhookPaymentValidator = vine.compile(
  vine.object({
    event: vine.string(),
    data: vine.object({
      id: vine.string(),
      reference_id: vine.string(),
      status: vine.string(),
      amount: vine.number(),
      payment_method: vine.any().optional(),
      metadata: vine.any().optional(),
    }),
  })
)
