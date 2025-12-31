import User from '#models/user'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'

export default class VerifyEmailMailer {
  static async send(user: User, otp: string) {
    await mail.send((message) => {
      message
        .to(user.email)
        .subject('Verify your email')
        .htmlView('emails/verify_otp', {
          user,
          otp,
          appUrl: env.get('APP_URL'),
        })
    })
  }
}
