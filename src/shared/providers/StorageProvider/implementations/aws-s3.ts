import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

import { env } from '@/env'

import { StorageProvider } from '../storage-provider'

export class AwsS3 implements StorageProvider {
  private s3: S3Client

  constructor() {
    this.s3 = new S3Client({
      region: env.S3_REGION,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      },
    })
  }

  async uploadImage(
    file: Buffer,
    fileName: string,
    mimetype: string,
  ): Promise<string> {
    const s3FileName = `users/${fileName}`

    const params = {
      Bucket: env.S3_NAME,
      Key: s3FileName,
      Body: file,
      ContentType: mimetype,
    }

    const command = new PutObjectCommand(params)
    await this.s3.send(command)

    return s3FileName
  }

  async deleteImage(filename: string): Promise<void> {
    const params = {
      Bucket: env.S3_NAME,
      Key: `${filename}`,
    }

    const command = new DeleteObjectCommand(params)
    await this.s3.send(command)
  }
}
