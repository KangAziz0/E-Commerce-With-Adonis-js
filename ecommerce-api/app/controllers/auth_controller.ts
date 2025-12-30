import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcryptjs'
import { errorResponse, successResponse } from '../helpers/response.js'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.all()

      if (!email || !password) {
        return response.status(400).json(errorResponse('Email and password are required', 400))
      }

      const user = await User.query().where('email', email).first()
      if (!user) {
        return response.status(401).json(errorResponse('Invalid credentials', 401))
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return response.status(401).json(errorResponse('Invalid credentials', 401))
      }

      // Generate token dengan AccessTokensProvider
      const token = await User.accessTokens.create(user)
      const tokenString = token.value!.release()

      console.log('✅ Token generated for user:', user.email)
      console.log('Token hash stored in DB:', token.hash)

      return response.status(200).json(
        successResponse('Login successful', {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          token: tokenString,
        })
      )
    } catch (err) {
      console.error('Login error:', err)
      return response.status(500).json(errorResponse('Internal server error', 500))
    }
  }

  public async register({ request, response }: HttpContext) {
    try {
      const { name, email, password } = request.all()

      if (!name || !email || !password) {
        return response
          .status(400)
          .json(errorResponse('Name, email, and password are required', 400))
      }

      const exists = await User.query().where('email', email).first()
      if (exists) {
        return response.status(400).json(errorResponse('Email already exists', 400))
      }

      const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        is_admin: false,
      })

      const token = await User.accessTokens.create(user)
      const tokenString = token.value!.release()

      return response.status(201).json(
        successResponse(
          'User registered successfully',
          {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            token: tokenString,
          },
          201
        )
      )
    } catch (err) {
      console.error('Register error:', err)
      return response.status(500).json(errorResponse('Internal server error', 500))
    }
  }

  public async logout({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']
      const tokenId = request['currentAccessTokenId']

      if (!user) {
        return response.status(401).json(errorResponse('Unauthorized', 401))
      }

      // Hapus token spesifik atau semua token user
      if (tokenId) {
        await User.accessTokens.delete(user, tokenId)
      }

      return response.status(200).json(successResponse('Logged out successfully', null))
    } catch (err) {
      console.error('Logout error:', err)
      return response.status(500).json(errorResponse('Internal server error', 500))
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
