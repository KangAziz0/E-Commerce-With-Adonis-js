import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import axios, { AxiosInstance } from 'axios'

// ============================================================
// Exception
// ============================================================

export class BiteshipException extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message)
    this.name = 'BiteshipException'
  }
}

// ============================================================
// Client — hanya urusan HTTP, tidak tau soal bisnis
// ============================================================

export default class BiteshipClient {
  readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: env.get('BITESHIP_BASE_URL'),
      headers: {
        'Authorization': `Bearer ${env.get('BITESHIP_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      timeout: 15_000,
    })

    this.axios.interceptors.request.use((config) => {
      logger.info({ method: config.method?.toUpperCase(), url: config.url }, '[Biteship] Request')
      return config
    })

    this.axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const status: number = err.response?.status ?? 500
        const message: string =
          err.response?.data?.error ?? err.response?.data?.message ?? err.message
        logger.error({ status, url: err.config?.url, message }, '[Biteship] Error')
        throw new BiteshipException(message, status)
      }
    )
  }
}
