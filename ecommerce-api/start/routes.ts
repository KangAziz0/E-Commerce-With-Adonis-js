/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')
const CartController = () => import('#controllers/carts_controller')
const OrdersController = () => import('#controllers/orders_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

/*
|--------------------------------------------------------------------------
| Product
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('', [ProductsController, 'index'])
    router.get('/:id', [ProductsController, 'show'])
    router.post('/', [ProductsController, 'store'])
    router.put('/:id', [ProductsController, 'update'])
    router.delete('/:id', [ProductsController, 'destroy'])
  })
  .prefix('api/products')
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/
// Public routes - tanpa auth
router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
    router.post('/register', [AuthController, 'register'])
  })
  .prefix('api')

// Protected routes - dengan auth
router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/me', [AuthController, 'me'])
  })
  .prefix('api')
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Cart
|--------------------------------------------------------------------------
*/ router
  .group(() => {
    router.get('', [CartController, 'index'])
    router.post('', [CartController, 'add'])
    router.put('/:id', [CartController, 'update'])
    router.delete('/:id', [CartController, 'remove'])
  })
  .prefix('api/cart')
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/ router
  .group(() => {
    router.get('', [OrdersController, 'index'])
    router.post('', [OrdersController, 'create'])
    router.get('/:id', [OrdersController, 'show'])
  })
  .prefix('api/orders')
  .use(middleware.auth())
