import OrderRepository from '#repositories/order_repository'
import ProductRepository from '#repositories/product_repository'
import Variant from '#models/variant'
import db from '@adonisjs/lucid/services/db'

type CheckoutItemPayload = {
  id: number
  variantId?: number
  name: string
  price: number
  quantity: number
}

type VerifiedOrderItem = Omit<CheckoutItemPayload, 'variantId'> & {
  productId: number
  variantId: number | null
  unitPrice: number
}

export default class OrderService {
  readonly #orderRepo = new OrderRepository()
  readonly #productRepo = new ProductRepository()

  async getUserOrders(email: string) {
    return this.#orderRepo.findByEmail(email)
  }

  async getByExternalId(externalId: string) {
    return this.#orderRepo.findByExternalIdOrFail(externalId)
  }

  async getPaymentStatus(orderId: string, userEmail: string) {
    const order = await this.#orderRepo.findByOrderIdOrExternalId(orderId)
    if (!order) throw new Error('Order not found')
    if (order.email !== userEmail) throw new Error('Unauthorized')

    const latestPayment =
      order.payments.length > 0 ? order.payments[order.payments.length - 1] : null

    return {
      status: order.status,
      paidAt: order.paidAt,
      externalId: order.externalId,
      amount: order.amount,
      payment: latestPayment
        ? {
            id: latestPayment.id,
            paymentMethod: latestPayment.paymentMethod,
            paymentChannel: latestPayment.paymentChannel,
            status: latestPayment.status,
            qrString: latestPayment.qrString,
            qrUrl: latestPayment.qrUrl,
            vaNumber: latestPayment.vaNumber,
            ewalletUrl: latestPayment.ewalletUrl,
            expiryDate: latestPayment.expiryDate,
            paidAt: latestPayment.paidAt,
          }
        : null,
    }
  }

  async create(payload: any) {
    if (payload.courierCompany) {
      const missingFields: string[] = []
      if (!payload.destinationAddress) missingFields.push('destinationAddress')
      if (!payload.destinationContactPhone) missingFields.push('destinationContactPhone')
      if (!payload.destinationContactName) missingFields.push('destinationContactName')
      if (!payload.destinationPostalCode) missingFields.push('destinationPostalCode')
      if (missingFields.length > 0) {
        throw new Error(
          `When courierCompany is provided, the following fields are required: ${missingFields.join(', ')}`
        )
      }
    }

    const items = payload.items as CheckoutItemPayload[]
    const productIds = items.map((item) => item.id)
    const products = await this.#productRepo.query().whereIn('id', productIds)
    const variants = await this.#productRepo.findActiveVariantsByProductIds(productIds)

    const productPriceMap = new Map<number, number>()
    for (const product of products) {
      productPriceMap.set((product as any).id, (product as any).price)
    }

    const variantsByProduct = new Map<number, Variant[]>()
    for (const variant of variants) {
      const productVariants = variantsByProduct.get(variant.productId) ?? []
      productVariants.push(variant)
      variantsByProduct.set(variant.productId, productVariants)
    }

    const verifiedItems: VerifiedOrderItem[] = []

    for (const item of items) {
      const productPrice = productPriceMap.get(item.id)
      if (productPrice === undefined) {
        throw new Error(`Product with id ${item.id} not found`)
      }

      const productVariants = variantsByProduct.get(item.id) ?? []
      const selectedVariant = item.variantId
        ? productVariants.find((variant) => variant.id === item.variantId)
        : productVariants.length === 1
          ? productVariants[0]
          : null

      if (item.variantId && !selectedVariant) {
        throw new Error(
          `Variant with id ${item.variantId} is not available for product "${item.name}"`
        )
      }
      if (!item.variantId && productVariants.length > 1 && !selectedVariant) {
        throw new Error(`Variant is required for product "${item.name}"`)
      }

      const unitPrice = Number(selectedVariant?.price ?? productPrice)
      if (unitPrice !== Number(item.price)) {
        throw new Error(
          `Price mismatch for product "${item.name}": submitted ${item.price}, actual ${unitPrice}`
        )
      }

      verifiedItems.push({
        ...item,
        productId: item.id,
        variantId: selectedVariant?.id ?? null,
        unitPrice,
      })
    }

    const subtotal = verifiedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const shippingAmount = payload.shippingAmount ?? 0
    const amount = subtotal + shippingAmount
    const externalId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    const order = await db.transaction(async (trx) => {
      const newOrder = await this.#orderRepo.create(
        {
          externalId,
          email: payload.email,
          amount,
          status: 'PENDING',
          shippingAmount: payload.shippingAmount ?? null,
          courierCompany: payload.courierCompany ?? null,
          courierType: payload.courierType ?? null,
          courierServiceName: payload.courierServiceName ?? null,
          destinationContactName: payload.destinationContactName ?? null,
          destinationContactPhone: payload.destinationContactPhone ?? null,
          destinationAddress: payload.destinationAddress ?? null,
          destinationNote: payload.destinationNote ?? null,
          destinationPostalCode: payload.destinationPostalCode ?? null,
          destinationAreaId: payload.destinationAreaId ?? null,
          originAreaId: payload.originAreaId ?? null,
        },
        { client: trx }
      )

      await this.#orderRepo.createOrderItems(
        newOrder.id,
        verifiedItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          price: item.unitPrice,
          quantity: item.quantity,
        })),
        { client: trx }
      )

      return newOrder
    })

    return {
      id: order.id,
      externalId: order.externalId,
      amount: order.amount,
      shippingAmount: order.shippingAmount,
      status: order.status,
    }
  }
}
