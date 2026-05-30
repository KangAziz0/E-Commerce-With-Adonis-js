import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import Product from '#models/product'
import Category from '#models/category'
import Brand from '#models/brand'
import Order from '#models/order'
import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  public async stats({ response }: HttpContext) {
    try {
      const productsCount = await Product.query().count('* as total')
      const categoriesCount = await Category.query().count('* as total')
      const brandsCount = await Brand.query().count('* as total')

      const ordersByStatus = await db
        .from('orders')
        .select('status')
        .count('* as count')
        .groupBy('status')

      const revenueResult = await db
        .from('orders')
        .whereIn('status', ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'])
        .sum('amount as total')

      const recentOrders = await Order.query().orderBy('created_at', 'desc').limit(10)

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
        recentOrders,
      }

      return response.ok(successResponse('Dashboard stats fetched successfully', data))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch dashboard stats'))
    }
  }
}
