import User from '#models/user'
import OtpService from './OtpService.js'
import MailService from './MailService.js'
import { DateTime } from 'luxon'
import bcrypt from 'bcryptjs'

export default class AuthService {
  static async register(request: any) {
    const { email, password, name } = request.only(['email', 'password', 'name'])

    let user = await User.query().where('email', email).first()

    if (user && user.email_verified_at) {
      throw new Error('Email already registered')
    }

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10)

      user = await User.create({
        email,
        password: hashedPassword,
        name,
      })
    }
    const otp = await OtpService.generate(email)

    await MailService.sendVerifyEmail(user, otp)

    return user
  }

  static async verifyEmail(email: string, otp: string) {
    const isValid = await OtpService.verify(email, otp)

    if (!isValid) {
      throw new Error('Invalid or expired OTP')
    }

    const user = await User.findByOrFail('email', email)

    user.email_verified_at = new Date()
    await user.save()

    return user
  }

  /**
   * LOGIN OTP
   */
  static async login(email: string, password: string) {
    const user = await User.query().where('email', email).first()

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    const otp = await OtpService.generate(email)
    await MailService.sendVerifyEmail(user, otp)

    return { requireOtp: true }
  }

  /**
   * LOGIN STEP 2 - VERIFY OTP & TOKEN
   */
  static async verifyLoginOtp(email: string, otp: string) {
    const isValid = await OtpService.verify(email, otp)
    if (!isValid) throw new Error('OTP tidak valid atau expired')

    const user = await User.query().where('email', email).firstOrFail()

    if (!user.email_verified_at) {
      user.email_verified_at = DateTime.now()
      await user.save()
    }

    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: token.value!.release(),
    }
  }
}
