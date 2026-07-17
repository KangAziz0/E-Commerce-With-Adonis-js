import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import db from '@adonisjs/lucid/services/db'
import ProductRepository from '#repositories/product_repository'
import CategoryRepository from '#repositories/category_repository'
import BrandRepository from '#repositories/brand_repository'

export default class DashboardController {
  readonly #productRepo = new ProductRepository()
  readonly #categoryRepo = new CategoryRepository()
  readonly #brandRepo = new BrandRepository()

  public async stats({ request, response }: HttpContext) {
    try {
      const year = request.input('year')
      const month = request.input('month')

      const [productsCount, categoriesCount, brandsCount] = await Promise.all([
        this.#productRepo.count(),
        this.#categoryRepo.count(),
        this.#brandRepo.count(),
      ])

      const ordersByStatusQuery = db
        .from('orders')
        .select('status')
        .count('* as count')
        .groupBy('status')
      if (year) ordersByStatusQuery.whereRaw('EXTRACT(YEAR FROM created_at) = ?', [Number(year)])
      if (month) ordersByStatusQuery.whereRaw('EXTRACT(MONTH FROM created_at) = ?', [Number(month)])
      const ordersByStatus = await ordersByStatusQuery

      const revenueQuery = db
        .from('orders')
        .whereIn('status', ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'])
        .sum('amount as total')
      if (year) revenueQuery.whereRaw('EXTRACT(YEAR FROM created_at) = ?', [Number(year)])
      if (month) revenueQuery.whereRaw('EXTRACT(MONTH FROM created_at) = ?', [Number(month)])
      const revenueResult = await revenueQuery

      const data = {
        totalProducts: Number(productsCount),
        totalCategories: Number(categoriesCount),
        totalBrands: Number(brandsCount),
        ordersByStatus: ordersByStatus.reduce(
          (acc, row) => {
            acc[row.status] = Number(row.count)
            return acc
          },
          {} as Record<string, number>
        ),
        totalRevenue: Number(revenueResult[0]?.total || 0),
      }

      return response.ok(successResponse('Dashboard stats fetched successfully', data))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch dashboard stats'))
    }
  }
}
