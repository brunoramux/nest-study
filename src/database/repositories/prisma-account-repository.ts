import type { AccountRepository } from '../../domain/forum/repositories/account-respository'
import { PrismaService } from '../prisma/prisma.service'
import { Account } from '../../domain/forum/entities/account'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private prisma: PrismaService) {}
  async create(account: Account): Promise<void> {
    await this.prisma.user.create({
      data: {
        email: account.getEmail,
        name: account.getName,
        password: account.getPassword,
      },
    })
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!account) {
      return null
    }

    const domainAccount = new Account({
      email: account.email,
      password: account.password,
      name: account.name,
    })

    return domainAccount
  }
}
