import router from '@adonisjs/core/services/router'

const BiteshipController = () => import('#controllers/biteship_controller')

router
  .group(() => {
    // =========================
    // SHIPPING
    // =========================
    router
      .group(() => {
        router.post('/rates', [BiteshipController, 'getRates'])
        router.post('/orders', [BiteshipController, 'createOrder'])
        router.get('/track/:id', [BiteshipController, 'trackOrder'])
        router.delete('/orders/:id', [BiteshipController, 'cancelOrder'])
      })
      .prefix('/shipping')

    // =========================
    // MAPS / AREAS
    // =========================
    router
      .group(() => {
        router.get('/areas', [BiteshipController, 'getAreas'])
      })
      .prefix('/maps')
  })
  .prefix('/api')
