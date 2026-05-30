import { errorResponse } from '../helpers/response.js'
import { NextFn } from '@adonisjs/core/types/http'
import { HttpContext } from '@adonisjs/core/http'

export default class AdminMiddleware {
  public async handle(ctx: HttpContext, next: NextFn) {
    const user = (ctx.request as any).authenticatedUser

    if (!user) {
      return ctx.response.status(401).json(errorResponse('Unauthorized - Authentication required', 401))
    }

    if (!user.is_admin) {
      return ctx.response.status(403).json(errorResponse('Forbidden - Admin access required', 403))
    }

    await next()
  }
}
