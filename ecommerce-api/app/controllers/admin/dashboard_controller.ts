import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import Product from '#models/product'
import Category from '#models/category'
import Brand from '#models/brand'
import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  public async stats({ request, response }: HttpContext) {
    try {
      const year = request.input('year')
      const month = request.input('month')

      const productsCount = await Product.query().count('* as total')
      const categoriesCount = await Category.query().count('* as total')
      const brandsCount = await Brand.query().count('* as total')

      // Orders by status - filtered by year/month if provided
      const ordersByStatusQuery = db.from('orders').select('status').count('* as count').groupBy('status')
      if (year) {
        ordersByStatusQuery.whereRaw('EXTRACT(YEAR FROM created_at) = ?', [Number(year)])
      }
      if (month) {
        ordersByStatusQuery.whereRaw('EXTRACT(MONTH FROM created_at) = ?', [Number(month)])
      }
      const ordersByStatus = await ordersByStatusQuery

      // Revenue - filtered by year/month if provided
      const revenueQuery = db
        .from('orders')
        .whereIn('status', ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'])
        .sum('amount as total')
      if (year) {
        revenueQuery.whereRaw('EXTRACT(YEAR FROM created_at) = ?', [Number(year)])
      }
      if (month) {
        revenueQuery.whereRaw('EXTRACT(MONTH FROM created_at) = ?', [Number(month)])
      }
      const revenueResult = await revenueQuery

      const data = {
        totalProducts: Number(productsCount[0].$extras.total),
        totalCategories: Number(categoriesCount[0].$extras.total),
        totalBrands: Number(brandsCount[0].$extras.total),
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
