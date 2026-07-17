import type { LucidModel, LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class BaseRepository<T extends LucidRow> {
  constructor(protected model: LucidModel) {}

  async all(): Promise<T[]> {
    return (await this.model.query().orderBy('created_at', 'desc')) as T[]
  }

  async find(id: number): Promise<T | null> {
    return this.model.find(id) as Promise<T | null>
  }

  async findOrFail(id: number): Promise<T> {
    return this.model.findOrFail(id) as Promise<T>
  }

  async findBy(key: string, value: any): Promise<T | null> {
    return this.model.findBy(key, value) as Promise<T | null>
  }

  async findByOrFail(key: string, value: any): Promise<T> {
    return this.model.findByOrFail(key, value) as Promise<T>
  }

  async create(data: Record<string, any>, options?: { client?: any }): Promise<T> {
    return this.model.create(data, options) as Promise<T>
  }

  async update(entity: T, data: Record<string, any>): Promise<T> {
    entity.merge(data as any)
    await entity.save()
    return entity
  }

  async delete(entity: T): Promise<void> {
    await entity.delete()
  }

  async deleteBy(key: string, value: any): Promise<void> {
    await this.model.query().where(key, value).delete()
  }

  async count(): Promise<number> {
    const result = await this.model.query().count('* as total')
    return Number(result[0].$extras.total)
  }

  query(): ModelQueryBuilderContract<LucidModel, LucidRow> {
    return this.model.query()
  }
}
