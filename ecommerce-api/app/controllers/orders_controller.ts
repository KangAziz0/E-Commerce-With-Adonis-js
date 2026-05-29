import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Product from '#models/product'
import { createOrderValidator } from '#validators/OrderValidator'

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

    // Look up actual product prices from the database
    const productIds = payload.items.map((item) => item.id)
    const products = await Product.query().whereIn('id', productIds)

    const productPriceMap = new Map<number, number>()
    for (const product of products) {
      productPriceMap.set(product.id, product.price)
    }

    // Validate all products exist and prices match
    for (const item of payload.items) {
      const actualPrice = productPriceMap.get(item.id)
      if (actualPrice === undefined) {
        return response.notFound({
          message: `Product with id ${item.id} not found`,
        })
      }
      if (Number(actualPrice) !== Number(item.price)) {
        return response.badRequest({
          message: `Price mismatch for product "${item.name}": submitted ${item.price}, actual ${actualPrice}`,
        })
      }
    }

    // Compute total from verified server-side prices
    const subtotal = payload.items.reduce(
      (sum, item) => sum + Number(productPriceMap.get(item.id)!) * item.quantity,
      0
    )

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

      const itemsData = payload.items.map((item) => ({
        orderId: newOrder.id,
        productId: item.id,
        name: item.name,
        price: Number(productPriceMap.get(item.id)!),
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
