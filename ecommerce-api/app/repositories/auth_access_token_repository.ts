import BaseRepository from './base_repository.js'
import AuthAccessToken from '#models/auth_access_token'
import { DateTime } from 'luxon'

export default class AuthAccessTokenRepository extends BaseRepository<AuthAccessToken> {
  constructor() {
    super(AuthAccessToken)
  }

  async findById(tokenId: number): Promise<AuthAccessToken | null> {
    return AuthAccessToken.query().where('id', tokenId).first() as Promise<AuthAccessToken | null>
  }

  async isExpired(token: AuthAccessToken): Promise<boolean> {
    if (!token.expiresAt) return false
    return token.expiresAt < DateTime.now()
  }

  async updateLastUsed(tokenId: number): Promise<void> {
    await AuthAccessToken.query().where('id', tokenId).update({
      lastUsedAt: DateTime.now().toSQL(),
    })
  }

  async deleteById(tokenId: number): Promise<void> {
    await AuthAccessToken.query().where('id', tokenId).delete()
  }
}
