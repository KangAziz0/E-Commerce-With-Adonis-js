// config/xendit.ts
import env from '#start/env'

const xenditConfig = {
  secretKey: env.get('XENDIT_SECRET_KEY'),
  webhookToken: env.get('XENDIT_WEBHOOK_TOKEN'),
  successRedirectUrl: env.get('XENDIT_SUCCESS_REDIRECT_URL'),
  failureRedirectUrl: env.get('XENDIT_FAILURE_REDIRECT_URL'),
}

export default xenditConfig
