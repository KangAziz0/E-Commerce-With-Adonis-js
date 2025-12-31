import cache from '@adonisjs/cache/services/main'
import { randomInt } from 'node:crypto'

export default class OtpService {
  static async generate(email: string) {
    const otp = randomInt(100000, 999999).toString()

    await cache.set({
      key: `otp:${email}`,
      value: otp,
      ttl: '5m',
    })

    return otp
  }

  static async verify(email: string, otp: string) {
    const savedOtp = await cache.get({ key: `otp:${email}` })

    if (!savedOtp || savedOtp !== otp) {
      return false
    }

    await cache.delete({ key: `otp:${email}` })
    return true
  }
}
