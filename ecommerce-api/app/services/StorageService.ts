import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import env from '#start/env'

/**
 * StorageService
 *
 * Handles file uploads to Cloudflare R2 (S3-compatible).
 * Configure via environment variables:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *   R2_BUCKET_NAME, R2_PUBLIC_URL
 */
export default class StorageService {
  private client: S3Client
  private bucket: string
  private publicUrl: string

  constructor() {
    const accountId = env.get('R2_ACCOUNT_ID')

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.get('R2_ACCESS_KEY_ID'),
        secretAccessKey: env.get('R2_SECRET_ACCESS_KEY'),
      },
    })

    this.bucket = env.get('R2_BUCKET_NAME')
    this.publicUrl = env.get('R2_PUBLIC_URL')
  }

  /**
   * Upload a file buffer to R2.
   * Returns the public URL of the uploaded file.
   */
  async upload(fileBuffer: Buffer, originalName: string, contentType: string): Promise<string> {
    const ext = extname(originalName)
    const key = `products/${Date.now()}-${randomUUID()}${ext}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      })
    )

    return `${this.publicUrl}/${key}`
  }

  /**
   * Upload an avatar image to R2 under the `avatars/` prefix.
   * Returns the public URL of the uploaded file.
   */
  async uploadAvatar(fileBuffer: Buffer, originalName: string, contentType: string): Promise<string> {
    const ext = extname(originalName)
    const key = `avatars/${Date.now()}-${randomUUID()}${ext}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      })
    )

    return `${this.publicUrl}/${key}`
  }

  /**
   * Delete a file from R2 by its key or full URL.
   */
  async delete(fileUrl: string): Promise<void> {
    const key = fileUrl.replace(`${this.publicUrl}/`, '')

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    )
  }
}
