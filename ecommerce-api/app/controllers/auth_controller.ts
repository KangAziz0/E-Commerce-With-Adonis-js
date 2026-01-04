import User from '#models/user'
import AuthAccessToken from '#models/auth_access_token'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import AuthService from '#services/AuthService'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const result = await AuthService.login(email, password)

      return response.status(200).json({
        message: 'OTP sent to your email',
        data: result,
      })
    } catch (error) {
      return response.status(401).json({
        message: error.message,
      })
    }
  }

  public async verifyLoginOtp({ request, response }: HttpContext) {
    const { email, otp } = request.only(['email', 'otp'])

    const result = await AuthService.verifyLoginOtp(email, otp)

    response.cookie('access_token', result.token, {
      httpOnly: true,
      secure: true, // true kalau HTTPS
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 hari
    })

    return response.status(200).json({
      message: 'Login success',
      data: {
        user: result.user, // token JANGAN dikirim ke FE
      },
    })
  }

  async register({ request }: HttpContext) {
    await AuthService.register(request)
    return {
      message: 'Register success, please verify your email',
    }
  }

  async verifyEmail({ request }: HttpContext) {
    await AuthService.verifyEmail(request.input('email'), request.input('otp'))
    return {
      message: 'Email verified, please login',
    }
  }

  public async logout({ response, request }: HttpContext) {
    try {
      const tokenId = request['currentAccessTokenId']

      if (tokenId) {
        await AuthAccessToken.query().where('id', tokenId).delete()
      }

      // clear cookie
      response.clearCookie('access_token')

      return response.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
      })
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
          is_admin: user.is_admin,
        })
      )
    } catch (err) {
      console.error('Me error:', err)
      return response.status(401).json(errorResponse('Unauthorized', 401))
    }
  }
}
