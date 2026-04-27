import router from '@adonisjs/core/services/router'

// ──────────────────────────────────────────────────────────────────────────────
// Biteship / Shipping Routes
// Semua route diprefix /api dan dibungkus middleware auth jika perlu.
// ──────────────────────────────────────────────────────────────────────────────
const BiteshipController = () => import('#controllers/biteship_controller')

router
  .group(() => {
    // ── Cek Ongkir ──────────────────────────────────────────
    // GET /api/shipping/rates?origin_postal_code=10110&destination_postal_code=40174&weight=1000
    router.get('/rates', [BiteshipController, 'getRates'])

    // ── Order Pengiriman ─────────────────────────────────────
    // POST /api/shipping/orders
    router.post('/orders', [BiteshipController, 'createOrder'])

    // ── Tracking ─────────────────────────────────────────────
    // GET /api/shipping/track/:id   (id = Biteship order ID)
    router.get('/track/:id', [BiteshipController, 'trackOrder'])

    // ── Batalkan Order ────────────────────────────────────────
    // DELETE /api/shipping/orders/:id
    router.delete('/orders/:id', [BiteshipController, 'cancelOrder'])
  })

  .prefix('/api/shipping')
