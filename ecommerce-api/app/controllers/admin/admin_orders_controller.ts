import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import Order from '#models/order'
import Variant from '#models/variant'
import db from '@adonisjs/lucid/services/db'
import { createBiteshipShipmentForOrder } from '../../helpers/shipment.js'

const VALID_ORDER_STATUSES = ['PENDING', 'PROCESSING', 'PAID', 'EXPIRED', 'FAILED', 'CANCELLED'] as const
type OrderStatus = (typeof VALID_ORDER_STATUSES)[number]

const VALID_SORT_COLUMNS = ['created_at', 'amount', 'status', 'email', 'updated_at'] as const

export default class AdminOrdersController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')
      const search = request.input('search')
      const sortBy = request.input('sort_by', 'created_at')
      const sortOrder = request.input('sort_order', 'desc')

      // Allowlist sortBy to prevent SQL injection via column identifier
      const safeSortBy = (VALID_SORT_COLUMNS as readonly string[]).includes(sortBy)
        ? sortBy
        : 'created_at'

      const query = Order.query().preload('items').preload('payments').preload('shipment')

      if (status) {
        query.where('status', status)
      }

      if (search) {
        query.where((builder) => {
          builder.where('email', 'like', `%${search}%`).orWhere('externalId', 'like', `%${search}%`)
        })
      }

      query.orderBy(safeSortBy, sortOrder)

      const orders = await query.paginate(page, limit)

      return response.ok(
        successResponse('Orders fetched successfully', {
          data: orders.all(),
          meta: orders.getMeta(),
        })
      )
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch orders'))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const order = await Order.query()
        .where('id', params.id)
        .preload('items')
        .preload('payments')
        .preload('shipment')
        .firstOrFail()

      return response.ok(successResponse('Order fetched successfully', order))
    } catch (error) {
      return response.status(404).json(errorResponse('Order not found', 404))
    }
  }

  public async updateStatus({ params, request, response }: HttpContext) {
    try {
      const { status } = request.only(['status'])

      // Validate status against known values
      if (!VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
        return response.status(400).json(
          errorResponse(
            `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}`,
            400
          )
        )
      }

      const order = await Order.findOrFail(params.id)

      if (status === 'CANCELLED') {
        // Wrap stock restoration in a transaction for atomicity
        const trx = await db.transaction()
        try {
          const items = await order.related('items').query()
          for (const item of items) {
            const variantQuery = Variant.query({ client: trx }).forUpdate()

            if (item.variantId) {
              variantQuery.where('id', item.variantId)
            } else {
              variantQuery.where('product_id', item.productId)
            }

            const variant = await variantQuery.first()
            if (variant) {
              variant.stock += item.quantity
              await variant.save()
            }
          }

          order.useTransaction(trx)
          order.status = status
          await order.save()

          await trx.commit()
        } catch (error) {
          await trx.rollback()
          throw error
        }
      } else {
        order.status = status
        await order.save()
      }

      return response.ok(successResponse('Order status updated successfully', order))
    } catch (error) {
      return response.status(404).json(errorResponse('Order not found', 404))
    }
  }

  public async refreshPaymentStatus({ params, response }: HttpContext) {
    try {
      const order = await Order.query()
        .where('id', params.id)
        .preload('payments')
        .firstOrFail()

      const latestPayment = order.payments?.[order.payments.length - 1] || null

      return response.ok(
        successResponse('Payment status fetched', {
          orderId: order.id,
          orderStatus: order.status,
          payment: latestPayment,
        })
      )
    } catch (error) {
      return response.status(404).json(errorResponse('Order not found', 404))
    }
  }

  public async retryShipment({ params, response }: HttpContext) {
    try {
      const order = await Order.findOrFail(params.id)

      if (order.status !== 'PROCESSING') {
        return response.status(400).json(errorResponse('Order must be in PROCESSING status', 400))
      }

      if (order.biteshipOrderId) {
        return response
          .status(400)
          .json(errorResponse('Order already has a Biteship shipment', 400))
      }

      if (!order.courierCompany || !order.destinationAddress) {
        return response
          .status(400)
          .json(errorResponse('Order missing shipping information', 400))
      }

      const items = await order.related('items').query()
      const biteshipOrder = await createBiteshipShipmentForOrder(order, items)

      order.biteshipOrderId = biteshipOrder.id
      await order.save()

      return response.ok(successResponse('Shipment created successfully', { biteshipOrder }))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to retry shipment'))
    }
  }

  public async updateTracking({ params, request, response }: HttpContext) {
    try {
      const { trackingId } = request.only(['trackingId'])
      const order = await Order.query().where('id', params.id).preload('shipment').firstOrFail()

      order.trackingId = trackingId
      await order.save()

      if (order.shipment) {
        order.shipment.trackingId = trackingId
        await order.shipment.save()
      }

      return response.ok(successResponse('Tracking updated successfully', order))
    } catch (error) {
      return response.status(404).json(errorResponse('Order not found', 404))
    }
  }
}
