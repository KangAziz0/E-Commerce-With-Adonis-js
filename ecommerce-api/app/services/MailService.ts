import User from '#models/user'
import VerifyEmailMailer from './EmailVerificationService.js'

export default class MailService {
  static async sendVerifyEmail(user: User, otp: string) {
    await VerifyEmailMailer.send(user, otp)
  }
}
