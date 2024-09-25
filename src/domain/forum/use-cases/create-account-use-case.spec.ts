import { InMemoryAccountsRepository } from 'test/repositories/in-memory-account-repository'
import { CreateAccountUseCase } from './create-account-use-case'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let sut: CreateAccountUseCase

describe('Create an Account', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    sut = new CreateAccountUseCase(inMemoryAccountsRepository)
  })

  it('It should be able to create an account', async () => {
    const result = await sut.execute({
      name: 'Bruno Ramos Lemos',
      email: 'bruno.lemos@live.com',
      password: '123456',
    })

    expect(result.value).toEqual({
      account: inMemoryAccountsRepository.items[0],
    })
  })
})
