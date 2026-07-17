import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import User from '#models/user'
import OrderRepository from '#repositories/order_repository'

export default class AdminCustomersController {
  readonly #orderRepo = new OrderRepository()

  private serializeCustomer(user: User, orders: any[] = []) {
    return {
      id: user.id,
      fullName: user.name,
      email: user.email,
      isActive: Boolean(user.isActive),
      isAdmin: Boolean(user.is_admin),
      emailVerifiedAt: user.email_verified_at,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      orderCount: orders.length,
      orders,
    }
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const search = request.input('search')

      const query = User.query().where('is_admin', false)

      if (search) {
        query.where((builder) => {
          builder.where('name', 'like', `%${search}%`).orWhere('email', 'like', `%${search}%`)
        })
      }

      query.orderBy('created_at', 'desc')

      const users = await query.paginate(page, limit)

      return response.ok(
        successResponse('Customers fetched successfully', {
          data: users.all().map((user) => this.serializeCustomer(user)),
          meta: users.getMeta(),
        })
      )
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch customers'))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const orders = await this.#orderRepo.findByEmail(user.email)

      return response.ok(
        successResponse('Customer fetched successfully', this.serializeCustomer(user, orders))
      )
    } catch (error) {
      return response.status(404).json(errorResponse('Customer not found', 404))
    }
  }

  public async toggleActive({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      user.isActive = !user.isActive
      await user.save()

      return response.ok(
        successResponse('Customer status toggled successfully', {
          user: this.serializeCustomer(user),
          active: user.isActive,
        })
      )
    } catch (error) {
      return response.status(404).json(errorResponse('Customer not found', 404))
    }
  }
}
