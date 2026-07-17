import vine from '@vinejs/vine'

export const voucherValidator = vine.withMetaData<{ voucherId?: number }>().compile(
  vine.object({
    code: vine
      .string()
      .trim()
      .unique({
        table: 'vouchers',
        column: 'code',
      })
      .transform((value) => value.toUpperCase()),

    name: vine.string().trim(),

    description: vine.string().trim().nullable().optional(),

    discountType: vine.enum(['percentage', 'fixed'] as const),

    discountValue: vine.number().positive(),

    minimumPurchase: vine.number().min(0),

    maximumDiscount: vine.number().min(0).nullable().optional(),

    usageLimit: vine.number().positive().nullable().optional(),

    startDate: vine.date().optional(),

    endDate: vine.date().optional(),

    isActive: vine.boolean().optional(),
  })
)
