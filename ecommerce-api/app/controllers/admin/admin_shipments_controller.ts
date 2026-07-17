import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import Shipment from '#models/shipment'
import ShipmentRepository from '#repositories/shipment_repository'
import OrderRepository from '#repositories/order_repository'
import BiteshipService from '#services/BiteshipService'
import { createBiteshipShipmentForOrder } from '../../helpers/shipment.js'

export default class AdminShipmentsController {
  readonly #shipmentRepo = new ShipmentRepository()
  readonly #orderRepo = new OrderRepository()

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const courierCompany = request.input('courierCompany')
      const status = request.input('status')

      const query = Shipment.query().preload('order')

      if (courierCompany) query.where('courierCompany', courierCompany)
      if (status) query.where('status', status)
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
      const shipment = await this.#shipmentRepo.findByIdOrFailWithOrder(params.id)
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
      const shipment = await this.#shipmentRepo.findOrFail(params.id)

      if (!shipment.biteshipOrderId) {
        return response.status(400).json(errorResponse('Shipment has no Biteship order ID', 400))
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
      const order = await this.#orderRepo.findOrFail(params.orderId)

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

      const items = await order.related('items').query()
      const biteshipOrder = await createBiteshipShipmentForOrder(order, items)

      order.biteshipOrderId = biteshipOrder.id
      await order.save()

      return response.ok(successResponse('Shipment created successfully', { biteshipOrder }))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to create shipment'))
    }
  }
}
