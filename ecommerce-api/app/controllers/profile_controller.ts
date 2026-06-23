import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import StorageService from '#services/StorageService'
import User from '#models/user'

export default class ProfileController {
  /**
   * Update authenticated user's profile (name).
   * PUT /api/profile
   */
  public async update({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser'] as User | undefined

      if (!user) {
        return response.status(401).json(errorResponse('Unauthorized', 401))
      }

      const { name } = request.only(['name'])

      if (!name || name.trim().length < 2) {
        return response.status(422).json(errorResponse('Nama minimal 2 karakter', 422))
      }

      user.name = name.trim()
      await user.save()

      return response.ok(
        successResponse('Profile updated', {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          is_admin: user.is_admin,
          is_active: user.isActive,
          created_at: user.createdAt,
        })
      )
    } catch (error) {
      console.error('Profile update error:', error)
      return response.status(500).json(errorResponse('Gagal memperbarui profil'))
    }
  }

  /**
   * Upload avatar to Cloudflare R2 and update user record.
   * POST /api/profile/avatar
   */
  public async uploadAvatar({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser'] as User | undefined

      if (!user) {
        return response.status(401).json(errorResponse('Unauthorized', 401))
      }

      const file = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (!file) {
        return response.status(400).json(errorResponse('File avatar tidak ditemukan', 400))
      }

      if (!file.isValid) {
        return response
          .status(422)
          .json(
            errorResponse(
              file.errors.map((e: { message: string }) => e.message).join(', '),
              422
            )
          )
      }

      // Read file into buffer
      const { createReadStream } = await import('node:fs')

      let buffer: Buffer

      if (file.tmpPath) {
        const stream = createReadStream(file.tmpPath)
        const chunks: Buffer[] = []
        for await (const chunk of stream) {
          chunks.push(Buffer.from(chunk))
        }
        buffer = Buffer.concat(chunks)
      } else {
        return response.status(400).json(errorResponse('File processing failed', 400))
      }

      const storage = new StorageService()

      // Delete old avatar from R2 if exists
      if (user.avatar) {
        try {
          await storage.delete(user.avatar)
        } catch {
          // Ignore deletion errors for old avatar
        }
      }

      // Upload new avatar with 'avatars/' prefix
      const url = await storage.uploadAvatar(
        buffer,
        file.clientName,
        file.headers['content-type'] || 'image/jpeg'
      )

      // Update user record
      user.avatar = url
      await user.save()

      return response.ok(
        successResponse('Avatar berhasil diupload', {
          avatar: url,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            is_admin: user.is_admin,
            is_active: user.isActive,
            created_at: user.createdAt,
          },
        })
      )
    } catch (error) {
      console.error('Avatar upload error:', error)
      return response.status(500).json(errorResponse('Gagal mengupload avatar'))
    }
  }
}
