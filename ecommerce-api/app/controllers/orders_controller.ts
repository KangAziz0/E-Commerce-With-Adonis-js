import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Product from '#models/product'
import Variant from '#models/variant'
import { createOrderValidator } from '#validators/OrderValidator'

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

export default class OrdersController {
  async index({ request, response }: HttpContext) {
    const user = (request as any).authenticatedUser
    if (!user) {
      return response.unauthorized({ message: 'Not authenticated' })
    }
    const orders = await Order.query()
      .where('email', user.email)
      .preload('items')
      .orderBy('created_at', 'desc')
    return response.ok({ message: 'Orders retrieved successfully', data: orders })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createOrderValidator)

    // Co-dependency validation: if courierCompany is provided, shipping address fields are required
    if (payload.courierCompany) {
      const missingFields: string[] = []
      if (!payload.destinationAddress) missingFields.push('destinationAddress')
      if (!payload.destinationContactPhone) missingFields.push('destinationContactPhone')
      if (!payload.destinationContactName) missingFields.push('destinationContactName')
      if (!payload.destinationPostalCode) missingFields.push('destinationPostalCode')

      if (missingFields.length > 0) {
        return response.badRequest({
          message: `When courierCompany is provided, the following fields are required: ${missingFields.join(', ')}`,
        })
      }
    }

    const items = payload.items as CheckoutItemPayload[]
    const productIds = items.map((item) => item.id)
    const products = await Product.query().whereIn('id', productIds)
    const variants = await Variant.query()
      .whereIn('product_id', productIds)
      .where('is_active', true)
      .orderBy('id', 'asc')

    const productPriceMap = new Map<number, number>()
    for (const product of products) {
      productPriceMap.set(product.id, product.price)
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
        return response.notFound({
          message: `Product with id ${item.id} not found`,
        })
      }

      const productVariants = variantsByProduct.get(item.id) ?? []
      const selectedVariant = item.variantId
        ? productVariants.find((variant) => variant.id === item.variantId)
        : productVariants.length === 1
          ? productVariants[0]
          : null

      if (item.variantId && !selectedVariant) {
        return response.badRequest({
          message: `Variant with id ${item.variantId} is not available for product "${item.name}"`,
        })
      }

      if (!item.variantId && productVariants.length > 1 && !selectedVariant) {
        return response.badRequest({
          message: `Variant is required for product "${item.name}"`,
        })
      }

      const unitPrice = Number(selectedVariant?.price ?? productPrice)

      if (unitPrice !== Number(item.price)) {
        return response.badRequest({
          message: `Price mismatch for product "${item.name}": submitted ${item.price}, actual ${unitPrice}`,
        })
      }

      verifiedItems.push({
        ...item,
        productId: item.id,
        variantId: selectedVariant?.id ?? null,
        unitPrice,
      })
    }

    // Compute total from verified server-side prices
    const subtotal = verifiedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    const shippingAmount = payload.shippingAmount ?? 0
    const amount = subtotal + shippingAmount

    const externalId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    const order = await db.transaction(async (trx) => {
      const newOrder = await Order.create(
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

      const itemsData = verifiedItems.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
      }))

      await OrderItem.createMany(itemsData, { client: trx })

      return newOrder
    })

    return response.created({
      message: 'Order created successfully',
      data: {
        id: order.id,
        externalId: order.externalId,
        amount: order.amount,
        shippingAmount: order.shippingAmount,
        status: order.status,
      },
    })
  }

  async show({ params, response }: HttpContext) {
    const order = await Order.query()
      .where('external_id', params.externalId)
      .preload('items')
      .preload('payments')
      .preload('shipment')
      .firstOrFail()

    return response.ok({
      message: 'Order retrieved successfully',
      data: order,
    })
  }

  async paymentStatus({ params, request, response }: HttpContext) {
    const { orderId } = params

    // Try to find by numeric id first, then by external_id
    const order = await Order.query()
      .where((query) => {
        const numericId = Number(orderId)
        if (!Number.isNaN(numericId) && Number.isInteger(numericId)) {
          query.where('id', numericId)
        }
        query.orWhere('external_id', orderId)
      })
      .preload('payments')
      .first()

    if (!order) {
      return response.notFound({ message: 'Order not found' })
    }

    // Ownership check: ensure the authenticated user's email matches the order email
    const user = (request as any).authenticatedUser
    if (user && order.email !== user.email) {
      return response.forbidden({ message: 'You are not authorized to view this order' })
    }

    // Get the latest payment
    const latestPayment = order.payments.length > 0
      ? order.payments[order.payments.length - 1]
      : null

    return response.ok({
      message: 'Payment status retrieved successfully',
      data: {
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
      },
    })
  }
}
