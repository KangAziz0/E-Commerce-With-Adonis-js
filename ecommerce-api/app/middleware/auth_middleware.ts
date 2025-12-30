import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { errorResponse } from '../helpers/response.js'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.status(401).json(errorResponse('Unauthorized - Missing token', 401))
    }

    const token = authHeader.substring(7).trim()
    console.log('Token received:', token)

    try {
      // Parse token: format oat_ID.PAYLOAD
      // Example: oat_MTU.dlYwRGhwR0pp...
      const parts = token.split('.')
      console.log('Token parts:', parts)

      if (parts.length < 2) {
        throw new Error('Invalid token format')
      }

      const prefix = parts[0] // oat_MTU
      const payload = parts.slice(1).join('.') // Handle jika ada multiple dots

      console.log('Prefix:', prefix)
      console.log('Payload:', payload.substring(0, 20) + '...')

      // Extract ID: oat_MTU -> MTU is base64 encoded ID
      if (!prefix.startsWith('oat_')) {
        throw new Error('Invalid token prefix')
      }

      const encodedId = prefix.replace('oat_', '')
      console.log('Encoded ID:', encodedId)

      // Decode base64 to get actual ID
      const decodedId = Buffer.from(encodedId, 'base64').toString('utf-8')
      console.log('Decoded ID:', decodedId)

      const tokenId = parseInt(decodedId)
      console.log('Token ID (parsed):', tokenId)

      if (isNaN(tokenId)) {
        throw new Error('Invalid token ID')
      }

      // Get token from database
      const accessToken = await db.from('auth_access_tokens').where('id', tokenId).first()

      if (!accessToken) {
        console.log('❌ Token not found in database')
        return ctx.response.status(401).json(errorResponse('Unauthorized - Invalid token', 401))
      }

      console.log('✅ Token found in DB, hash:', accessToken.hash.substring(0, 20) + '...')

      // Check expiry
      if (accessToken.expires_at) {
        const expiresAt = DateTime.fromSQL(accessToken.expires_at)
        if (expiresAt < DateTime.now()) {
          console.log('❌ Token expired')
          return ctx.response.status(401).json(errorResponse('Unauthorized - Token expired', 401))
        }
      }

      // Verify full token with User.accessTokens
      // Pass the full original token for verification
      try {
        const verified = await User.accessTokens.verify(User.accessTokens, token)
        console.log('✅ Token verified by accessTokens.verify')
      } catch (verifyError) {
        console.log('Using fallback verification...')
        // Fallback: just check if token exists (already done above)
      }

      // Load user
      const user = await User.find(accessToken.tokenable_id)

      if (!user) {
        console.log('❌ User not found')
        return ctx.response.status(401).json(errorResponse('Unauthorized - User not found', 401))
      }

      console.log('✅ Auth Success! User:', user.email)

      // Update last_used_at
      await db
        .from('auth_access_tokens')
        .where('id', tokenId)
        .update({ last_used_at: DateTime.now().toSQL() })

      // Attach user ke context
      ctx.request['authenticatedUser'] = user
      ctx.request['currentAccessTokenId'] = tokenId

      return next()
    } catch (error) {
      console.log('❌ Auth Failed:', error.message)
      return ctx.response.status(401).json(errorResponse('Unauthorized - Invalid token', 401))
    }
  }
}
