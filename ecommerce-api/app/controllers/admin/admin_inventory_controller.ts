import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import Variant from '#models/variant'
import Product from '#models/product'

export default class AdminInventoryController {
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const lowStock = request.input('low_stock')
      const search = request.input('search')

      const query = Variant.query()

      if (lowStock === 'true' || lowStock === '1') {
        query.where('stock', '<', 10)
      }

      if (search) {
        const productIds = await Product.query()
          .where('name', 'like', `%${search}%`)
          .select('id')

        query.whereIn(
          'productId',
          productIds.map((p) => p.id)
        )
      }

      query.orderBy('created_at', 'desc')

      const variants = await query.paginate(page, limit)

      // Batch-load products instead of N+1 queries
      const variantsData = variants.all()
      const productIds = [...new Set(variantsData.map((v) => v.productId))]
      const products = await Product.query().whereIn('id', productIds)
      const productMap = new Map(products.map((p) => [p.id, p]))

      return response.ok(
        successResponse('Inventory fetched successfully', {
          data: variantsData.map((v) => ({
            ...v.toJSON(),
            product: productMap.get(v.productId) || null,
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
      const variant = await Variant.findOrFail(params.variantId)

      variant.stock = stock
      await variant.save()

      return response.ok(successResponse('Stock updated successfully', variant))
    } catch (error) {
      return response.status(404).json(errorResponse('Variant not found', 404))
    }
  }
}
