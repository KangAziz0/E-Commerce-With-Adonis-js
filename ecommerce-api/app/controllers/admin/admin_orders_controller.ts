import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import Order from '#models/order'
import Variant from '#models/variant'
import BiteshipService from '#services/BiteshipService'

export default class AdminOrdersController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')
      const search = request.input('search')
      const sortBy = request.input('sort_by', 'created_at')
      const sortOrder = request.input('sort_order', 'desc')

      const query = Order.query().preload('items').preload('payments').preload('shipment')

      if (status) {
        query.where('status', status)
      }

      if (search) {
        query.where((builder) => {
          builder.where('email', 'like', `%${search}%`).orWhere('externalId', 'like', `%${search}%`)
        })
      }

      query.orderBy(sortBy, sortOrder)

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
      const order = await Order.findOrFail(params.id)

      if (status === 'CANCELLED') {
        const items = await order.related('items').query()
        for (const item of items) {
          const variant = await Variant.query().where('productId', item.productId).first()
          if (variant) {
            variant.stock += item.quantity
            await variant.save()
          }
        }
      }

      order.status = status
      await order.save()

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

      const biteshipService = new BiteshipService()
      const items = await order.related('items').query()

      const biteshipOrder = await biteshipService.createOrder({
        shipper_contact_name: 'Admin',
        shipper_contact_phone: '08000000000',
        origin_contact_name: 'Admin',
        origin_contact_phone: '08000000000',
        origin_address: 'Store Address',
        origin_postal_code: '10000',
        origin_area_id: order.originAreaId || '',
        destination_area_id: order.destinationAreaId || '',
        courier_company: order.courierCompany,
        courier_type: order.courierType || 'reg',
        delivery_type: 'now',
        destination_contact_name: order.destinationContactName || '',
        destination_contact_phone: order.destinationContactPhone || '',
        destination_address: order.destinationAddress || '',
        destination_postal_code: order.destinationPostalCode || '0',
        destination_note: order.destinationNote || '',
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          value: item.price,
          weight: 500,
          length: 10,
          width: 10,
          height: 10,
        })),
      })

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
