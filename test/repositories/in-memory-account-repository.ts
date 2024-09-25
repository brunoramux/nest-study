import type { Account } from '@/domain/forum/entities/account'
import type { AccountRepository } from '@/domain/forum/repositories/account-respository'

export class InMemoryAccountsRepository implements AccountRepository {
  public items: Account[] = []
  async create(account: Account): Promise<void> {
    this.items.push(account)
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = this.items.find((account) => account.getEmail === email)

    if (!account) {
      return null
    }

    return account
  }
}
