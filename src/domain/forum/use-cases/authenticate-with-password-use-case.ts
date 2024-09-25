/* eslint-disable camelcase */
import { Inject, Injectable } from '@nestjs/common'
import { AccountRepository } from '../repositories/account-respository'
import { TokenGenerator } from '../cryptography/token-generator'
import { left, right, type Either } from '@/errors/either'
import { compare } from 'bcryptjs'

interface AuthenticateWithPasswordRequest {
  email: string
  password: string
}
type AuthenticateWithPasswordResponse = Either<Error, { access_token: string }>

@Injectable()
export class AuthenticateWithPasswordUseCase {
  constructor(
    @Inject(AccountRepository) private accountRepository: AccountRepository,
    @Inject(TokenGenerator) private tokenGenerator: TokenGenerator,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateWithPasswordRequest): Promise<AuthenticateWithPasswordResponse> {
    const account = await this.accountRepository.findByEmail(email)

    if (!account) {
      return left(new Error('Wrong credentials'))
    }

    const isPasswordValid = await compare(password, account.getPassword)

    if (!isPasswordValid) {
      return left(new Error('Wrong credentials'))
    }

    const access_token = await this.tokenGenerator.generate({
      sub: account.getId,
    })

    return right({
      access_token,
    })
  }
}
