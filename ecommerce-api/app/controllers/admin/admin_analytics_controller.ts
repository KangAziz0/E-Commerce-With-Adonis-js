import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import AdminAnalyticsService from '#services/AdminAnalyticsService'

export default class AdminAnalyticsController {
  readonly #analyticsService = new AdminAnalyticsService()

  public async index({ request, response }: HttpContext) {
    try {
      const year = request.input('year')
      const month = request.input('month')

      const filters: { year?: number; month?: number } = {}
      if (year) filters.year = Number(year)
      if (month) filters.month = Number(month)

      const data = await this.#analyticsService.getDashboardAnalytics(filters)
      return response.ok(successResponse('Analytics data fetched successfully', data))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch analytics data'))
    }
  }
}
