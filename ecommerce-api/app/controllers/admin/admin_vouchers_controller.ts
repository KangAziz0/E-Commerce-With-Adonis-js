import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../../helpers/response.js'
import VoucherService from '#services/VoucherService'

export default class AdminVouchersController {
  readonly #voucherService = new VoucherService()

  public async index({ response }: HttpContext) {
    try {
      const vouchers = await this.#voucherService.getAll()
      return response.ok(successResponse('Vouchers fetched successfully', vouchers))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch vouchers'))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const voucher = await this.#voucherService.getById(params.id)
      return response.ok(successResponse('Voucher fetched successfully', voucher))
    } catch (error) {
      return response.status(404).json(errorResponse('Voucher not found', 404))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const voucher = await this.#voucherService.create(request.all())
      return response.created(successResponse('Voucher created successfully', voucher, 201))
    } catch (error: any) {
      return response.status(422).json(errorResponse(error.message, 422))
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const voucher = await this.#voucherService.update(params.id, request.all())
      return response.ok(successResponse('Voucher updated successfully', voucher))
    } catch (error: any) {
      return response.status(422).json(errorResponse(error.message, 422))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      await this.#voucherService.delete(params.id)
      return response.ok(successResponse('Voucher deleted successfully', null))
    } catch (error) {
      return response.status(404).json(errorResponse('Voucher not found', 404))
    }
  }
}
