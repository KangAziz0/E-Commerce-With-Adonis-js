import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import AdminAnalyticsService from '#services/AdminAnalyticsService'

export default class AdminAnalyticsController {
  readonly #analyticsService = new AdminAnalyticsService()

  public async index({ response }: HttpContext) {
    try {
      const data = await this.#analyticsService.getDashboardAnalytics()
      return response.ok(successResponse('Analytics data fetched successfully', data))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch analytics data'))
    }
  }
}
