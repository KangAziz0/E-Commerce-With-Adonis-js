import './routes_biteship.js'

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
const BrandsController = () => import('#controllers/brands_controller')
const InvoicesController = () => import('#controllers/invoices_controller')
const WishlistsController = () => import('#controllers/wishlists_controller')
const UploadsController = () => import('#controllers/uploads_controller')

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
    router.post('resendOtp', [AuthController, 'resendOtp'])
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
        /*
        |--------------------------------------------------------------------------
        | Cart & Invoices
        |--------------------------------------------------------------------------
        */
        router.resource('cart', CartController).apiOnly()
        router.get('wishlist', [WishlistsController, 'index'])
        router.post('wishlist', [WishlistsController, 'store'])
        router.delete('wishlist/:productId', [WishlistsController, 'destroy'])
        router.get('/orders/:externalId', [OrdersController, 'show'])
        router.post('/invoices', [InvoicesController, 'store'])
        router.get('/invoices/:id', [InvoicesController, 'show'])
        router.post('/invoices/:id/expire', [InvoicesController, 'expire'])
        router.post('/webhooks/xendit', [InvoicesController, 'webhook'])
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
        router.resource('brands', BrandsController).apiOnly()

        router.post('products/:productId/images', [ProductImagesController, 'store'])
        router.delete('products/:productId/images/:id', [ProductImagesController, 'destroy'])

        router.post('upload', [UploadsController, 'store'])

        router.resource('products.variants', VariantsController).apiOnly()
      })
      .use(middleware.auth())
      .prefix('admin')
  })
  .prefix('api')

router.get('/auth/google', [AuthController, 'redirectToGoogle'])
router.get('/auth/google/callback', [AuthController, 'handleGoogleCallback'])
