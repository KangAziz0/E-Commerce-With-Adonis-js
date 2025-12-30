import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/**
 * Global middleware
 */
server.use([() => import('@adonisjs/cors/cors_middleware')])

/**
 * Router middleware - BODYPARSER BUILT-IN
 */
router.use([() => import('@adonisjs/core/bodyparser_middleware')])

/**
 * Named middleware
 */
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
})
