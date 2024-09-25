/* eslint-disable camelcase */
import { Public } from '@/auth/public'
import { AuthenticateWithPasswordUseCase } from '@/domain/forum/use-cases/authenticate-with-password-use-case'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/auth')
@Public()
export class AuthenticateWithPasswordController {
  constructor(
    @Inject(AuthenticateWithPasswordUseCase)
    private authenticateWithPasswordUseCase: AuthenticateWithPasswordUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateWithPasswordUseCase.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
    }

    const { access_token } = result.value

    return { access_token }
  }
}
