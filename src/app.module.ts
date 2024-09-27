import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { CreateAccountController } from './http/controllers/account/create-account.controller'
import { CreateAccountUseCase } from './domain/forum/use-cases/create-account-use-case'
import { PrismaService } from './database/prisma/prisma.service'
import { AccountRepository } from './domain/forum/repositories/account-respository'
import { PrismaAccountRepository } from './database/repositories/prisma-account-repository'
import { EnvModule } from './env/env.module'
import { TokenGenerator } from './domain/forum/cryptography/token-generator'
import { JwtGenerator } from './criptography/token-generator'
import { AuthenticateWithPasswordController } from './http/controllers/auth/authenticate-with-password.controller'
import { AuthenticateWithPasswordUseCase } from './domain/forum/use-cases/authenticate-with-password-use-case'
import { Uploader } from './domain/forum/storage/uploader'
import { R2Storage } from './storage/r2-storage'
import { UploadAttachmentController } from './http/controllers/attachment/upload-attachment.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    EnvModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateWithPasswordController,
    UploadAttachmentController,
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateWithPasswordUseCase,
    PrismaService,
    {
      provide: AccountRepository,
      useClass: PrismaAccountRepository,
    },
    { provide: TokenGenerator, useClass: JwtGenerator },
    { provide: Uploader, useClass: R2Storage },
  ],
  exports: [PrismaService, AccountRepository, TokenGenerator, Uploader],
})
export class AppModule {}
