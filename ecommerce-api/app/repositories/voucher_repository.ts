import BaseRepository from './base_repository.js'
import Voucher from '#models/voucher'

export default class VoucherRepository extends BaseRepository<Voucher> {
  constructor() {
    super(Voucher)
  }

  async findByCode(code: string): Promise<Voucher | null> {
    return this.findBy('code', code)
  }
}
