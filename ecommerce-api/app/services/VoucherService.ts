import VoucherRepository from '#repositories/voucher_repository'
import { DateTime } from 'luxon'

type VoucherPayload = {
  code?: string
  name?: string
  description?: string | null
  discountType?: 'percentage' | 'fixed'
  discountValue?: number
  minimumPurchase?: number
  maximumDiscount?: number | null
  usageLimit?: number | null
  startDate?: DateTime | null
  endDate?: DateTime | null
  isActive?: boolean
}

export default class VoucherService {
  readonly #voucherRepo = new VoucherRepository()

  async getAll() {
    return this.#voucherRepo.all()
  }

  async getById(id: number) {
    return this.#voucherRepo.findOrFail(id)
  }

  async create(input: Record<string, any>) {
    const payload = this.getPayload(input)
    const validationError = await this.validatePayload(payload)
    if (validationError) throw new Error(validationError)
    return this.#voucherRepo.create(payload)
  }

  async update(id: number, input: Record<string, any>) {
    const voucher = await this.#voucherRepo.findOrFail(id)
    const payload = this.getPayload(input)
    const validationError = await this.validatePayload(payload, voucher.id)
    if (validationError) throw new Error(validationError)
    return this.#voucherRepo.update(voucher, payload)
  }

  async delete(id: number) {
    const voucher = await this.#voucherRepo.findOrFail(id)
    await this.#voucherRepo.delete(voucher)
  }

  private getPayload(input: Record<string, any>): VoucherPayload {
    return {
      code: String(input.code ?? '')
        .trim()
        .toUpperCase(),
      name: String(input.name ?? '').trim(),
      description: input.description ? String(input.description).trim() : null,
      discountType: input.discountType,
      discountValue: Number(input.discountValue ?? 0),
      minimumPurchase: Number(input.minimumPurchase ?? 0),
      maximumDiscount:
        input.maximumDiscount === null ||
        input.maximumDiscount === '' ||
        input.maximumDiscount === undefined
          ? null
          : Number(input.maximumDiscount),
      usageLimit:
        input.usageLimit === null || input.usageLimit === '' || input.usageLimit === undefined
          ? null
          : Number(input.usageLimit),
      startDate: input.startDate ? DateTime.fromISO(String(input.startDate)) : null,
      endDate: input.endDate ? DateTime.fromISO(String(input.endDate)) : null,
      isActive:
        input.isActive === undefined ? true : input.isActive === true || input.isActive === 'true',
    }
  }

  private async validatePayload(payload: VoucherPayload, currentId?: number) {
    if (!payload.code) return 'Kode voucher wajib diisi'
    if (!payload.name) return 'Nama voucher wajib diisi'
    if (!['percentage', 'fixed'].includes(payload.discountType ?? ''))
      return 'Tipe diskon tidak valid'
    if (!payload.discountValue || payload.discountValue <= 0)
      return 'Nilai diskon harus lebih dari 0'
    if (payload.discountType === 'percentage' && payload.discountValue > 100)
      return 'Diskon persentase maksimal 100'
    if ((payload.minimumPurchase ?? 0) < 0) return 'Minimum belanja tidak boleh negatif'
    if (payload.maximumDiscount !== null && (payload.maximumDiscount ?? 0) < 0)
      return 'Maksimum diskon tidak boleh negatif'
    if (payload.usageLimit !== null && (payload.usageLimit ?? 0) <= 0)
      return 'Batas pemakaian harus lebih dari 0'
    if (payload.startDate && !payload.startDate.isValid) return 'Tanggal mulai tidak valid'
    if (payload.endDate && !payload.endDate.isValid) return 'Tanggal berakhir tidak valid'
    if (payload.startDate && payload.endDate && payload.endDate < payload.startDate)
      return 'Tanggal berakhir harus setelah tanggal mulai'

    const existing = await this.#voucherRepo.findByCode(payload.code)
    if (existing && existing.id !== currentId) return 'Kode voucher sudah digunakan'

    return null
  }
}
