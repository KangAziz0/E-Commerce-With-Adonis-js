import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import VariantRepository from '#repositories/variant_repository'
import ProductRepository from '#repositories/product_repository'

export default class AdminInventoryController {
  readonly #variantRepo = new VariantRepository()
  readonly #productRepo = new ProductRepository()

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const lowStock = request.input('low_stock')
      const search = request.input('search')

      const query = this.#variantRepo.query()

      if (lowStock === 'true' || lowStock === '1') {
        query.where('stock', '<', 10)
      }

      if (search) {
        const productIds = await this.#productRepo
          .query()
          .where('name', 'like', `%${search}%`)
          .select('id')

        query.whereIn(
          'productId',
          productIds.map((p: any) => p.id)
        )
      }

      query.orderBy('created_at', 'desc')

      const variants = await query.paginate(page, limit)
      const variantsData = variants.all()
      const productIds = [...new Set(variantsData.map((v: any) => v.productId))]
      const products = await this.#productRepo.query().whereIn('id', productIds)
      const productMap = new Map(products.map((p: any) => [p.id, p]))

      return response.ok(
        successResponse('Inventory fetched successfully', {
          data: variantsData.map((v: any) => ({
            variantId: v.id,
            productId: v.productId,
            productName: productMap.get(v.productId)?.name || '-',
            variantName: v.name,
            sku: productMap.get(v.productId)?.sku || null,
            stock: Number(v.stock),
            price: Number(v.price),
          })),
          meta: variants.getMeta(),
        })
      )
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch inventory'))
    }
  }

  public async updateStock({ params, request, response }: HttpContext) {
    try {
      const { stock } = request.only(['stock'])
      const variant = await this.#variantRepo.findOrFail(params.variantId)
      variant.stock = stock
      await variant.save()

      return response.ok(successResponse('Stock updated successfully', variant))
    } catch (error) {
      return response.status(404).json(errorResponse('Variant not found', 404))
    }
  }
}
