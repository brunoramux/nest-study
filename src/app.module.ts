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

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    EnvModule,
  ],
  controllers: [CreateAccountController],
  providers: [
    CreateAccountUseCase,
    PrismaService,
    {
      provide: AccountRepository,
      useClass: PrismaAccountRepository,
    },
  ],
  exports: [PrismaService, AccountRepository],
})
export class AppModule {}
