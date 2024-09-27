import { Public } from '@/auth/public'
import { Uploader } from '@/domain/forum/storage/uploader'
import {
  Controller,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachments')
@Public()
export class UploadAttachmentController {
  constructor(private uploader: Uploader) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(file.mimetype)) {
      return new HttpException('Invalid file type.', HttpStatus.BAD_REQUEST)
    }

    if (file.size > 2097152) {
      return new HttpException('Invalid file size.', HttpStatus.BAD_REQUEST)
    }
    const result = await this.uploader.upload({
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
    })

    return {
      link: result.link,
    }
  }
}
