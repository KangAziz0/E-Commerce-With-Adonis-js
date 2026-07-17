import User from '#models/user'
import UserRepository from '#repositories/user_repository'
import OtpService from './OtpService.js'
import MailService from './MailService.js'
import { DateTime } from 'luxon'
import bcrypt from 'bcryptjs'
import env from '#start/env'

export default class AuthService {
  static readonly #userRepo = new UserRepository()

  static async register(request: any) {
    const { email, password, name } = request.only(['email', 'password', 'name'])

    let user = await this.#userRepo.findByEmail(email)

    if (user && user.email_verified_at) {
      throw new Error('Email already registered')
    }

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10)
      user = await this.#userRepo.create({
        email,
        password: hashedPassword,
        name,
      } as any)
    }

    const shouldSendOtp = env.get('OTP_SENT')
    if (shouldSendOtp === 'true') {
      const otp = await OtpService.generate(email, 'register')
      await MailService.sendVerifyEmail(user, otp)
    }

    return user
  }

  static async verifyEmail(email: string, otp: string) {
    const isValid = await OtpService.verify(email, otp, 'register')
    if (!isValid) {
      throw new Error('Invalid or expired OTP')
    }

    const user = await this.#userRepo.findByEmailOrFail(email)
    user.email_verified_at = new Date()
    await user.save()
    return user
  }

  static async login(email: string, password: string) {
    const user = await this.#userRepo.findByEmail(email)
    let token = null

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    const shouldSendOtp = env.get('OTP_SENT')

    if (shouldSendOtp === 'true') {
      const otp = await OtpService.generate(email, 'login')
      await MailService.sendVerifyEmail(user, otp)
    } else {
      token = await User.accessTokens.create(user)
    }

    return { requireOtp: shouldSendOtp, token: token?.value!.release() }
  }

  static async verifyLoginOtp(email: string, otp: string) {
    const isValid = await OtpService.verify(email, otp, 'login')
    if (!isValid) throw new Error('OTP tidak valid atau expired')

    const user = await this.#userRepo.findByEmailOrFail(email)

    if (!user.email_verified_at) {
      user.email_verified_at = DateTime.now()
      await user.save()
    }

    const token = await User.accessTokens.create(user)

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token: token.value!.release(),
    }
  }

  static async resendOtp(email: string, purpose: 'register' | 'login') {
    const user = await this.#userRepo.findByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    const otp = await OtpService.resend(email, purpose)
    await MailService.sendVerifyEmail(user, otp)
  }

  static async handleGoogleLogin(userGoogle: any) {
    const email = userGoogle.email
    const name = userGoogle.name

    let user = await this.#userRepo.findByEmail(email)

    if (!user) {
      user = await this.#userRepo.create({
        email,
        name,
        isSso: true,
      } as any)
    }

    const token = await User.accessTokens.create(user)

    return { user, token: token.value!.release() }
  }
}
