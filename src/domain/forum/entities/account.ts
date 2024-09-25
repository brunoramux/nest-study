import { randomUUID } from 'crypto'

interface AccountProps {
  name: string
  email: string
  password: string
}

export class Account {
  private id: string
  private name: string
  private email: string
  private password: string

  constructor({ email, name, password }: AccountProps) {
    this.id = randomUUID()
    this.name = name
    this.email = email
    this.password = password
  }

  get getName() {
    return this.name
  }

  get getEmail() {
    return this.email
  }

  get getPassword() {
    return this.password
  }
}
