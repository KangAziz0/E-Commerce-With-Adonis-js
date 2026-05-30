import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import db from '@adonisjs/lucid/services/db'

export default class AdminAnalyticsController {
  public async index({ response }: HttpContext) {
    try {
      const currentYear = new Date().getFullYear()
      const previousYear = currentYear - 1

      // Monthly revenue for current and previous year
      const monthlyRevenue = await db
        .from('orders')
        .whereIn('status', ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'])
        .whereRaw('EXTRACT(YEAR FROM created_at) IN (?, ?)', [currentYear, previousYear])
        .select(
          db.raw('EXTRACT(MONTH FROM created_at)::int as month'),
          db.raw('EXTRACT(YEAR FROM created_at)::int as year'),
          db.raw('SUM(amount) as revenue')
        )
        .groupByRaw('EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)')
        .orderByRaw('year, month')

      // Orders by status monthly for current year
      const ordersByStatusMonthly = await db
        .from('orders')
        .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [currentYear])
        .select(
          db.raw('EXTRACT(MONTH FROM created_at)::int as month'),
          'status',
          db.raw('COUNT(*)::int as count')
        )
        .groupByRaw('EXTRACT(MONTH FROM created_at), status')
        .orderByRaw('month')

      // Top selling products
      const topSellingProducts = await db
        .from('order_items')
        .join('orders', 'orders.id', 'order_items.order_id')
        .whereIn('orders.status', ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'])
        .select('order_items.product_name as name')
        .sum('order_items.quantity as totalQuantity')
        .groupBy('order_items.product_name')
        .orderBy('totalQuantity', 'desc')
        .limit(10)

      // Payment status distribution
      const paymentStatusDistribution = await db
        .from('payments')
        .select('status')
        .count('* as count')
        .groupBy('status')

      // Shipment status distribution
      const shipmentStatusDistribution = await db
        .from('shipments')
        .select('status')
        .count('* as count')
        .groupBy('status')

      // Low stock products
      const lowStockProducts = await db
        .from('variants')
        .where('stock', '<', 10)
        .select('id', 'product_id as productId', 'name', 'stock', 'price')
        .orderBy('stock', 'asc')
        .limit(20)

      // Recent failed shipments
      const recentFailedShipments = await db
        .from('shipments')
        .whereILike('status', '%fail%')
        .select(
          'id',
          'order_id as orderId',
          'status',
          'courier_company as courierCompany',
          'tracking_id as trackingId',
          'created_at as createdAt'
        )
        .orderBy('created_at', 'desc')
        .limit(10)

      // Recent pending payments
      const recentPendingPayments = await db
        .from('payments')
        .where('status', 'PENDING')
        .select(
          'id',
          'order_id as orderId',
          'amount',
          'status',
          'payment_method as paymentMethod',
          'created_at as createdAt'
        )
        .orderBy('created_at', 'desc')
        .limit(10)

      const data = {
        monthlyRevenue: monthlyRevenue.map((row) => ({
          month: Number(row.month),
          year: Number(row.year),
          revenue: Number(row.revenue),
        })),
        ordersByStatusMonthly: ordersByStatusMonthly.map((row) => ({
          month: Number(row.month),
          status: row.status,
          count: Number(row.count),
        })),
        topSellingProducts: topSellingProducts.map((row) => ({
          name: row.name,
          totalQuantity: Number(row.totalQuantity),
        })),
        paymentStatusDistribution: paymentStatusDistribution.map((row) => ({
          status: row.status,
          count: Number(row.count),
        })),
        shipmentStatusDistribution: shipmentStatusDistribution.map((row) => ({
          status: row.status,
          count: Number(row.count),
        })),
        lowStockProducts,
        recentFailedShipments,
        recentPendingPayments,
      }

      return response.ok(successResponse('Analytics data fetched successfully', data))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch analytics data'))
    }
  }
}
