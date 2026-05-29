import vine from '@vinejs/vine'

const VALID_VA_CHANNELS = [
  'BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA', 'BSI', 'CIMB', 'BJB',
  'SAHABAT_SAMPOERNA', 'BNC', 'HANA', 'MUAMALAT',
] as const

const VALID_EWALLET_CHANNELS = [
  'OVO', 'DANA', 'SHOPEEPAY', 'LINKAJA', 'ASTRAPAY', 'JENIUSPAY', 'GRABPAY',
] as const

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
      reference_id: vine.string().optional(),
      payment_request_id: vine.string().optional(),
      status: vine.string(),
      amount: vine.number(),
      payment_method: vine.any().optional(),
      metadata: vine.any().optional(),
    }),
  })
)

// Export channel lists for use in service validation
export { VALID_VA_CHANNELS, VALID_EWALLET_CHANNELS }
