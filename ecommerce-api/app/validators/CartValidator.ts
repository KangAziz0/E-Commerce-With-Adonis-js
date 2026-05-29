import vine from '@vinejs/vine'

export const storeCartValidator = vine.compile(
  vine.object({
    productId: vine.number().positive(),
    qty: vine.number().positive().withoutDecimals().optional(),
    price: vine.number().positive(),
    size: vine.string().trim().optional(),
    color: vine.string().trim().optional(),
  })
)

export const updateCartValidator = vine.compile(
  vine.object({
    qty: vine.number().withoutDecimals().min(0),
  })
)
