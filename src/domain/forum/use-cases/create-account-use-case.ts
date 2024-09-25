import { Inject, Injectable } from '@nestjs/common'
import { Account } from '../entities/account'
import { left, right, Either } from '../../../errors/either'
import { AccountRepository } from '../repositories/account-respository'

interface CreateAcountUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterAccountCaseResponse = Either<Error, { account: Account }>

@Injectable()
export class CreateAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({
    email,
    name,
    password,
  }: CreateAcountUseCaseRequest): Promise<RegisterAccountCaseResponse> {
    const accountWithSameEmail = await this.accountRepository.findByEmail(email)
    if (accountWithSameEmail) {
      return left(new Error(`Student ${name} already exists`))
    }

    const account = new Account({
      name,
      email,
      password,
    })

    await this.accountRepository.create(account)

    return right({
      account,
    })
  }
}