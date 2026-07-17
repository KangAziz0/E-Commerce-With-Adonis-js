import AuthAccessToken from '#models/auth_access_token'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import AuthService from '#services/AuthService'
import env from '#start/env'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    try {
      const shouldSendOtp = env.get('OTP_SENT') === 'true'
      const { email, password } = request.only(['email', 'password'])

      const result = await AuthService.login(email, password)

      if (!shouldSendOtp && result.token) {
        response.cookie('access_token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
        })
      }

      return response.status(200).json({
        message: 'OTP sent to your email',
        data: result,
      })
    } catch (error: any) {
      return response.status(401).json({ message: error.message })
    }
  }

  public async verifyLoginOtp({ request, response }: HttpContext) {
    const { email, otp } = request.only(['email', 'otp'])

    const result = await AuthService.verifyLoginOtp(email, otp)

    response.cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    })

    return response.status(200).json({
      message: 'Login success',
      data: { user: result.user },
    })
  }

  async register({ request }: HttpContext) {
    await AuthService.register(request)
    return { message: 'Register success, please verify your email' }
  }

  async verifyEmail({ request }: HttpContext) {
    await AuthService.verifyEmail(request.input('email'), request.input('otp'))
    return { message: 'Email verified, please login' }
  }

  public async resendOtp({ request, response }: HttpContext) {
    const { email, purpose } = request.only(['email', 'purpose'])
    await AuthService.resendOtp(email, purpose)
    return response.status(200).json({ message: 'OTP resent successfully' })
  }

  public async logout({ response, request }: HttpContext) {
    try {
      const tokenId = request['currentAccessTokenId']
      if (tokenId) {
        await AuthAccessToken.query().where('id', tokenId).delete()
      }
      response.clearCookie('access_token')
      return response.status(200).json({ status: 'success', message: 'Logged out successfully' })
    } catch (err) {
      return response.status(500).json(errorResponse('Logout Failed', 500))
    }
  }

  public async me({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']
      if (!user) {
        return response.status(401).json(errorResponse('Unauthorized', 401))
      }

      return response.status(200).json(
        successResponse('User retrieved', {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          is_admin: user.is_admin,
          is_active: user.isActive,
          created_at: user.createdAt,
        })
      )
    } catch (err) {
      console.error('Me error:', err)
      return response.status(401).json(errorResponse('Unauthorized', 401))
    }
  }

  async handleGoogleCallback({ ally, response }: any) {
    const google = ally.use('google')

    if (google.accessDenied()) return 'Access denied'
    if (google.stateMisMatch()) return 'Invalid state'
    if (google.hasError()) return google.getError()

    const userGoogle = await google.user()
    const { token } = await AuthService.handleGoogleLogin(userGoogle)

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    })
    return response.redirect('http://localhost:5173/')
  }

  async redirectToGoogle({ ally }: any) {
    console.log('ally', ally)
    return ally.use('google').redirect()
  }
}
