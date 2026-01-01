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
const ProductImagesController = () => import('#controllers/product_images_controller')
const VariantsController = () => import('#controllers/variants_controller')
const CategoriesController = () => import('#controllers/categories_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router
  .group(() => {
    /*
  |--------------------------------------------------------------------------
  | Public
  |--------------------------------------------------------------------------
  */
    router.get('products', [ProductsController, 'index'])
    router.get('products/:id', [ProductsController, 'show'])
    router.get('categories', [CategoriesController, 'index'])
    router.get('categories/:id', [CategoriesController, 'show'])

    router.post('login', [AuthController, 'login'])
    router.post('register', [AuthController, 'register'])
    router.post('verify-email', [AuthController, 'verifyEmail'])
    router.post('verify-login', [AuthController, 'verifyLoginOtp'])

    /*
  |--------------------------------------------------------------------------
  | Authenticated User
  |--------------------------------------------------------------------------
  */
    router
      .group(() => {
        router.post('logout', [AuthController, 'logout'])
        router.get('me', [AuthController, 'me'])

        router.resource('cart', CartController).apiOnly()
        router.resource('orders', OrdersController).apiOnly()
      })
      .use(middleware.auth())

    /*
  |--------------------------------------------------------------------------
  | Admin / CMS
  |--------------------------------------------------------------------------
  */
    router
      .group(() => {
        router.resource('products', ProductsController).apiOnly()
        router.resource('categories', CategoriesController).apiOnly()

        router.post('products/:productId/images', [ProductImagesController, 'store'])
        router.delete('products/:productId/images/:id', [ProductImagesController, 'destroy'])

        router.resource('products.variants', VariantsController).apiOnly()
      })
      .use(middleware.auth())
  })
  .prefix('api')
