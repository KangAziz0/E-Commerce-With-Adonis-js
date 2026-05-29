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
    shippingAmount: vine.number().positive().optional(),
    courierCompany: vine.string().optional(),
    courierType: vine.string().optional(),
    courierServiceName: vine.string().optional(),
    destinationContactName: vine.string().optional(),
    destinationContactPhone: vine.string().optional(),
    destinationAddress: vine.string().optional(),
    destinationNote: vine.string().optional(),
    destinationPostalCode: vine.string().optional(),
    destinationAreaId: vine.string().optional(),
    originAreaId: vine.string().optional(),
  })
)
