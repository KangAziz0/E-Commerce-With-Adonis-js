import db from '@adonisjs/lucid/services/db'

const REVENUE_ORDER_STATUSES = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']

interface AnalyticsFilters {
  year?: number
  month?: number
}

export default class AdminAnalyticsService {
  async getDashboardAnalytics(filters: AnalyticsFilters = {}) {
    const currentYear = filters.year || new Date().getFullYear()
    const previousYear = currentYear - 1
    const month = filters.month

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
      this.getMonthlyRevenue(currentYear, previousYear, month),
      this.getOrdersByStatusMonthly(currentYear, month),
      this.getTopSellingProducts(currentYear, month),
      this.getPaymentStatusDistribution(currentYear, month),
      this.getShipmentStatusDistribution(currentYear, month),
      this.getLowStockProducts(),
      this.getRecentFailedShipments(),
      this.getRecentPendingPayments(),
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

  private async getMonthlyRevenue(currentYear: number, previousYear: number, month?: number) {
    const query = db
      .from('orders')
      .whereIn('status', REVENUE_ORDER_STATUSES)
      .select(
        db.raw('EXTRACT(MONTH FROM created_at)::int as month'),
        db.raw('EXTRACT(YEAR FROM created_at)::int as year'),
        db.raw('SUM(amount) as revenue')
      )

    if (month) {
      query
        .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [currentYear])
        .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [month])
    } else {
      query.whereRaw('EXTRACT(YEAR FROM created_at) IN (?, ?)', [currentYear, previousYear])
    }

    return query
      .groupByRaw('EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)')
      .orderByRaw('year, month')
  }

  private async getOrdersByStatusMonthly(year: number, month?: number) {
    const query = db
      .from('orders')
      .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year])
      .select(
        db.raw('EXTRACT(MONTH FROM created_at)::int as month'),
        'status',
        db.raw('COUNT(*)::int as count')
      )

    if (month) {
      query.whereRaw('EXTRACT(MONTH FROM created_at) = ?', [month])
    }

    return query.groupByRaw('EXTRACT(MONTH FROM created_at), status').orderByRaw('month')
  }

  private async getTopSellingProducts(year: number, month?: number) {
    const query = db
      .from('order_items')
      .join('orders', 'orders.id', 'order_items.order_id')
      .whereIn('orders.status', REVENUE_ORDER_STATUSES)
      .whereRaw('EXTRACT(YEAR FROM orders.created_at) = ?', [year])
      .select('order_items.name as name')
      .sum('order_items.quantity as totalQuantity')
      .groupBy('order_items.name')
      .orderBy('totalQuantity', 'desc')
      .limit(10)

    if (month) {
      query.whereRaw('EXTRACT(MONTH FROM orders.created_at) = ?', [month])
    }

    return query
  }

  private async getPaymentStatusDistribution(year: number, month?: number) {
    const query = db.from('payments').select('status').count('* as count')

    if (year) {
      query.whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year])
    }
    if (month) {
      query.whereRaw('EXTRACT(MONTH FROM created_at) = ?', [month])
    }

    return query.groupBy('status')
  }

  private async getShipmentStatusDistribution(year: number, month?: number) {
    const query = db.from('shipments').select('status').count('* as count')

    if (year) {
      query.whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year])
    }
    if (month) {
      query.whereRaw('EXTRACT(MONTH FROM created_at) = ?', [month])
    }

    return query.groupBy('status')
  }

  private async getLowStockProducts() {
    return db
      .from('variants')
      .where('stock', '<', 10)
      .select('id', 'product_id as productId', 'name', 'stock', 'price')
      .orderBy('stock', 'asc')
      .limit(20)
  }

  private async getRecentFailedShipments() {
    return db
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
  }

  private async getRecentPendingPayments() {
    return db
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
  }
}
