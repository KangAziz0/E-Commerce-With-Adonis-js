import vine from '@vinejs/vine'

export const ratesValidator = vine.compile(
  vine.object({
    origin_postal_code: vine.string().minLength(5).maxLength(5).regex(/^\d+$/),
    destination_postal_code: vine.string().minLength(5).maxLength(5).regex(/^\d+$/),
    weight: vine.number().range([1, 500_000]),
    quantity: vine.number().optional(),
    length: vine.number().optional(),
    width: vine.number().optional(),
    height: vine.number().optional(),
    value: vine.number().optional(),
  })
)

export const orderSchema = vine.object({
  // Informasi pengirim (toko)
  shipper_contact_name: vine.string(),
  shipper_contact_phone: vine.string(),
  shipper_contact_email: vine.string().optional(),

  // Asal pengiriman
  origin_contact_name: vine.string(),
  origin_contact_phone: vine.string(),
  origin_address: vine.string(),
  origin_note: vine.string().optional(),
  origin_postal_code: vine.string(),

  // Tujuan pengiriman
  destination_contact_name: vine.string(),
  destination_contact_phone: vine.string(),
  destination_address: vine.string(),
  destination_note: vine.string().optional(),
  destination_postal_code: vine.string(),

  // Kurir (dari hasil cek ongkir)
  courier_company: vine.string(),
  courier_type: vine.string(),

  // Catatan order
  order_note: vine.string(),

  // Internal reference (order ID dari DB kamu)
  internal_order_id: vine.string().optional(),

  // Barang
  items: vine.array(
    vine.object({
      name: vine.string(),
      description: vine.string().optional(),
      value: vine.number(),
      length: vine.number().range([1, 300]),
      width: vine.number().range([1, 300]),
      height: vine.number().range([1, 300]),
      weight: vine.number().range([1, 500_000]),
      quantity: vine.number().range([1, 999]),
    })
  ),
})

export const getAreasValidator = vine.compile(
  vine.object({
    countries: vine.string().trim().toUpperCase(),
    input: vine.string().trim().minLength(1),
    type: vine.enum(['single', 'multiple']).optional(),
  })
)
