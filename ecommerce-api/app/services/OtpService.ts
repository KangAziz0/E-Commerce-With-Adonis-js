import cache from '@adonisjs/cache/services/main'
import { randomInt } from 'node:crypto'

export type OtpPurpose = 'register' | 'login' | 'verify_email'

export default class OtpService {
  static OTP_TTL = '5m'
  static RESEND_TTL = '60s'

  static getKey(email: string, purpose: OtpPurpose) {
    return `otp:${purpose}:${email}`
  }

  static getCooldownKey(email: string, purpose: OtpPurpose) {
    return `otp:cooldown:${purpose}:${email}`
  }

  static async generate(email: string, purpose: OtpPurpose) {
    const otpKey = this.getKey(email, purpose)
    const cooldownKey = this.getCooldownKey(email, purpose)

    // cek cooldown resend (60 detik)
    const cooldown = await cache.get({ key: cooldownKey })
    if (cooldown) {
      throw new Error('Please wait before requesting new OTP')
    }

    const otp = randomInt(100000, 999999).toString()

    // simpan OTP (5 menit)
    await cache.set({
      key: otpKey,
      value: otp,
      ttl: this.OTP_TTL,
    })

    // set cooldown resend (60 detik)
    await cache.set({
      key: cooldownKey,
      value: true,
      ttl: this.RESEND_TTL,
    })

    return otp
  }

  static async verify(email: string, otp: string, purpose: OtpPurpose) {
    const otpKey = this.getKey(email, purpose)

    const savedOtp = await cache.get({ key: otpKey })

    if (!savedOtp || savedOtp !== otp) {
      return false
    }

    await cache.delete({ key: otpKey })
    return true
  }

  static async resend(email: string, purpose: OtpPurpose) {
    // ❌ jangan hapus cooldown
    await cache.delete({ key: this.getKey(email, purpose) })
    return this.generate(email, purpose)
  }
}
