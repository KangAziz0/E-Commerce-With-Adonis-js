import vine from '@vinejs/vine'

const orderItemSchema = vine.object({
  id: vine.number().positive(),
  name: vine.string().minLength(1).maxLength(255),
  price: vine.number().positive(),
  quantity: vine.number().positive().withoutDecimals(),
})

export const createInvoiceValidator = vine.compile(
  vine.object({
    items: vine.array(orderItemSchema).minLength(1),
    email: vine.string().email(),
  })
)

export const webhookValidator = vine.compile(
  vine.object({
    id: vine.string(),
    external_id: vine.string(),
    status: vine.string(),
    amount: vine.number(),
    payer_email: vine.string().optional(),
    payment_method: vine.string().optional(),
    payment_channel: vine.string().optional(),
    paid_at: vine.string().optional(),
    paid_amount: vine.number().optional(),
  })
)
