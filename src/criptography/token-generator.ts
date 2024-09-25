import type { TokenGenerator } from '@/domain/forum/cryptography/token-generator'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtGenerator implements TokenGenerator {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  generate(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload)
  }
}
