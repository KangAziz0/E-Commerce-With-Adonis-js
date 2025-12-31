import User from '#models/user'
import mail from '@adonisjs/mail/services/main'

export default class SendVerifyEmailJob {
  static async handle(user: User, token: string) {
    await mail.sendLater((message) => {
      message.to(user.email).subject('Verify your email').htmlView('emails/verify_email', {
        user,
        token,
      })
    })
  }
}
