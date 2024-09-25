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
import { Public } from 'src/auth/public'
import { CreateAccountUseCase } from 'src/domain/forum/use-cases/create-account-use-case'
import { ZodValidationPipe } from 'src/http/pipes/zod-validation-pipe'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private createAccount: CreateAccountUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, name, password } = body

    const result = await this.createAccount.execute({
      email,
      name,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new HttpException(error.message, HttpStatus.CONFLICT)
    }
  }
}
