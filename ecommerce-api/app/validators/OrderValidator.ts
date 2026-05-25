import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
  vine.object({
    items: vine
      .array(
        vine.object({
          id: vine.number().positive(),
          name: vine.string().minLength(1),
          price: vine.number().positive(),
          quantity: vine.number().positive().withoutDecimals(),
        })
      )
      .minLength(1),
    email: vine.string().email(),
  })
)
