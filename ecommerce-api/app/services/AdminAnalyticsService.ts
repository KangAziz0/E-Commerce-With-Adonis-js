import db from '@adonisjs/lucid/services/db'

const REVENUE_ORDER_STATUSES = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export default class AdminAnalyticsService {
  async getDashboardAnalytics() {
    const currentYear = new Date().getFullYear()
    const previousYear = currentYear - 1

    const [
      monthlyRevenue,
      ordersByStatusMonthly,
      topSellingProducts,
      paymentStatusDistribution,
      shipmentStatusDistribution,
      lowStockProducts,
      recentFailedShipments,
      recentPendingPayments,
    ] = await Promise.all([
      db
        .from('orders')
        .whereIn('status', REVENUE_ORDER_STATUSES)
        .whereRaw('EXTRACT(YEAR FROM created_at) IN (?, ?)', [currentYear, previousYear])
        .select(
          db.raw('EXTRACT(MONTH FROM created_at)::int as month'),
          db.raw('EXTRACT(YEAR FROM created_at)::int as year'),
          db.raw('SUM(amount) as revenue')
        )
        .groupByRaw('EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)')
        .orderByRaw('year, month'),

      db
        .from('orders')
        .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [currentYear])
        .select(
          db.raw('EXTRACT(MONTH FROM created_at)::int as month'),
          'status',
          db.raw('COUNT(*)::int as count')
        )
        .groupByRaw('EXTRACT(MONTH FROM created_at), status')
        .orderByRaw('month'),

      db
        .from('order_items')
        .join('orders', 'orders.id', 'order_items.order_id')
        .whereIn('orders.status', REVENUE_ORDER_STATUSES)
        .select('order_items.name as name')
        .sum('order_items.quantity as totalQuantity')
        .groupBy('order_items.name')
        .orderBy('totalQuantity', 'desc')
        .limit(10),

      db.from('payments').select('status').count('* as count').groupBy('status'),

      db.from('shipments').select('status').count('* as count').groupBy('status'),

      db
        .from('variants')
        .where('stock', '<', 10)
        .select('id', 'product_id as productId', 'name', 'stock', 'price')
        .orderBy('stock', 'asc')
        .limit(20),

      db
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
        .limit(10),

      db
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
        .limit(10),
    ])

    return {
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
  }
}
