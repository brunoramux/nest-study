import type { Uploader, UploadParams } from '@/domain/forum/storage/uploader'
import { EnvService } from '@/env/env.service'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { flatten, Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client
  constructor(@Inject(EnvService) private envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')
    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({
    body,
    fileName,
    fileType,
  }: UploadParams): Promise<{ link: string }> {
    const uploadId = randomUUID()

    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: 'nest-study',
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      link: uniqueFileName,
    }
  }
}
