import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import StorageService from '#services/StorageService'

export default class UploadsController {
  /**
   * Upload a file to Cloudflare R2.
   * Expects multipart/form-data with a `file` field.
   */
  public async store({ request, response }: HttpContext) {
    try {
      const file = request.file('file', {
        size: '10mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
      })

      if (!file) {
        return response.status(400).json(errorResponse('File tidak ditemukan', 400))
      }

      if (!file.isValid) {
        return response
          .status(422)
          .json(errorResponse(file.errors.map((e) => e.message).join(', '), 422))
      }

      // Read file into buffer
      const { createReadStream } = await import('node:fs')
      const { Readable } = await import('node:stream')

      let buffer: Buffer

      if (file.tmpPath) {
        // File was stored in temp path
        const stream = createReadStream(file.tmpPath)
        const chunks: Buffer[] = []
        for await (const chunk of stream) {
          chunks.push(Buffer.from(chunk))
        }
        buffer = Buffer.concat(chunks)
      } else {
        // Fallback: read from the request
        return response.status(400).json(errorResponse('File processing failed', 400))
      }

      const storage = new StorageService()
      const url = await storage.upload(
        buffer,
        file.clientName,
        file.headers['content-type'] || 'application/octet-stream'
      )

      return response.ok(
        successResponse('File uploaded successfully', { url, filename: file.clientName })
      )
    } catch (error) {
      console.error('Upload error:', error)
      return response.status(500).json(errorResponse('Failed to upload file'))
    }
  }
}
