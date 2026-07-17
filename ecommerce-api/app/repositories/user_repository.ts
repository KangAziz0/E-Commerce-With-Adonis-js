import BaseRepository from './base_repository.js'
import User from '#models/user'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findBy('email', email)
  }

  async findByEmailOrFail(email: string): Promise<User> {
    return this.findByOrFail('email', email)
  }

  async findNonAdmin(): Promise<ModelQueryBuilderContract<typeof User, User>> {
    return User.query().where('is_admin', false)
  }

  async searchUsers(search: string): Promise<ModelQueryBuilderContract<typeof User, User>> {
    const query = User.query().where('is_admin', false)
    query.where((builder) => {
      builder.where('name', 'like', `%${search}%`).orWhere('email', 'like', `%${search}%`)
    })
    return query
  }
}
