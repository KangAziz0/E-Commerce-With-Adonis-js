import { DateTime } from 'luxon'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { errorResponse } from '../helpers/response.js'
import { NextFn } from '@adonisjs/core/types/http'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthMiddleware {
  public async handle(ctx: HttpContext, next: NextFn) {
    // 1. Cek token dari Authorization header
    let token = ctx.request.header('Authorization')?.replace('Bearer ', '').trim()

    // 2. Kalau ga ada di header, coba dari cookie
    if (!token) {
      token = ctx.request.cookie('access_token')
    }

    if (!token) {
      return ctx.response.status(401).json(errorResponse('Unauthorized - Missing token', 401))
    }

    try {
      // token format oat_ID.PAYLOAD
      const [prefix] = token.split('.')
      if (!prefix.startsWith('oat_')) throw new Error('Invalid token prefix')

      const encodedId = prefix.replace('oat_', '')
      const tokenId = parseInt(Buffer.from(encodedId, 'base64').toString('utf-8'))
      if (isNaN(tokenId)) throw new Error('Invalid token ID')

      const accessToken = await db.from('auth_access_tokens').where('id', tokenId).first()
      if (!accessToken) throw new Error('Token not found')

      if (accessToken.expires_at && DateTime.fromSQL(accessToken.expires_at) < DateTime.now()) {
        throw new Error('Token expired')
      }

      const user = await User.find(accessToken.tokenable_id)
      if (!user) throw new Error('User not found')

      // Update last_used_at
      await db.from('auth_access_tokens').where('id', tokenId).update({
        last_used_at: DateTime.now().toSQL(),
      })

      ctx.request.authenticatedUser = user
      ctx.request.currentAccessTokenId = tokenId

      await next()
    } catch (err: any) {
      return ctx.response.status(401).json(errorResponse(`Unauthorized - ${err.message}`, 401))
    }
  }
}
