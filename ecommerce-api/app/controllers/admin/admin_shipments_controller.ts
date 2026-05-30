import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import Shipment from '#models/shipment'
import Order from '#models/order'
import BiteshipService from '#services/BiteshipService'

export default class AdminShipmentsController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const courierCompany = request.input('courierCompany')
      const status = request.input('status')

      const query = Shipment.query().preload('order')

      if (courierCompany) {
        query.where('courierCompany', courierCompany)
      }

      if (status) {
        query.where('status', status)
      }

      query.orderBy('created_at', 'desc')

      const shipments = await query.paginate(page, limit)

      return response.ok(
        successResponse('Shipments fetched successfully', {
          data: shipments.all(),
          meta: shipments.getMeta(),
        })
      )
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch shipments'))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const shipment = await Shipment.query()
        .where('id', params.id)
        .preload('order')
        .firstOrFail()

      return response.ok(
        successResponse('Shipment fetched successfully', {
          ...shipment.toJSON(),
          trackingHistory: shipment.trackingHistory,
        })
      )
    } catch (error) {
      return response.status(404).json(errorResponse('Shipment not found', 404))
    }
  }

  public async refreshTracking({ params, response }: HttpContext) {
    try {
      const shipment = await Shipment.findOrFail(params.id)

      if (!shipment.biteshipOrderId) {
        return response
          .status(400)
          .json(errorResponse('Shipment has no Biteship order ID', 400))
      }

      const biteshipService = new BiteshipService()
      const tracking = await biteshipService.trackOrder(shipment.biteshipOrderId)

      shipment.status = tracking.status || shipment.status
      await shipment.save()

      return response.ok(successResponse('Tracking refreshed successfully', { shipment, tracking }))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to refresh tracking'))
    }
  }

  public async retryCreation({ params, response }: HttpContext) {
    try {
      const order = await Order.findOrFail(params.orderId)

      if (!order.courierCompany) {
        return response
          .status(400)
          .json(errorResponse('Order has no courier company selected', 400))
      }

      if (order.biteshipOrderId) {
        return response
          .status(400)
          .json(errorResponse('Order already has a Biteship shipment', 400))
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
      return response.status(500).json(errorResponse('Failed to create shipment'))
    }
  }
}
