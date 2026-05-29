// config/biteship.ts
import env from '#start/env'

const biteshipConfig = {
  apiKey: env.get('BITESHIP_API_KEY'),
  baseUrl: env.get('BITESHIP_BASE_URL'),
  webhookToken: env.get('BITESHIP_WEBHOOK_TOKEN'),
}

export default biteshipConfig
