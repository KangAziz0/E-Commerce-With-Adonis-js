/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
  FRONTEND_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.string(),
  OTP_SENT: Env.schema.string(),

  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the google OAuth
  |----------------------------------------------------------
  */
  GOOGLE_CLIENT_ID: Env.schema.string(),
  GOOGLE_CLIENT_SECRET: Env.schema.string(),
  /*
  |----------------------------------------------------------
  | Variables for configuring the Xendit package
  |----------------------------------------------------------
  */
  XENDIT_SECRET_KEY: Env.schema.string(),
  XENDIT_WEBHOOK_TOKEN: Env.schema.string(),
  XENDIT_SUCCESS_REDIRECT_URL: Env.schema.string(),
  XENDIT_FAILURE_REDIRECT_URL: Env.schema.string(),
  /*
  |----------------------------------------------------------
  | Variables for configuring the Biteship
  |----------------------------------------------------------
  */
  BITESHIP_API_KEY: Env.schema.string(),
  BITESHIP_BASE_URL: Env.schema.string(),
  BITESHIP_WEBHOOK_TOKEN: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for store/shipper info (used for Biteship orders)
  |----------------------------------------------------------
  */
  STORE_NAME: Env.schema.string.optional(),
  STORE_PHONE: Env.schema.string.optional(),
  STORE_EMAIL: Env.schema.string.optional(),
  STORE_ADDRESS: Env.schema.string.optional(),
  STORE_POSTAL_CODE: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring Cloudflare R2 (S3-compatible)
  |----------------------------------------------------------
  */
  R2_ACCOUNT_ID: Env.schema.string(),
  R2_ACCESS_KEY_ID: Env.schema.string(),
  R2_SECRET_ACCESS_KEY: Env.schema.string(),
  R2_BUCKET_NAME: Env.schema.string(),
  R2_PUBLIC_URL: Env.schema.string(),
})
