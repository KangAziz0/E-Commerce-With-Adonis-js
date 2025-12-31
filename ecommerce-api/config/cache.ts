import { defineConfig, store, drivers } from '@adonisjs/cache'

const cacheConfig = defineConfig({
  default: 'memory',

  stores: {
    memory: store().useL1Layer(drivers.memory()),
  },
})

export default cacheConfig
