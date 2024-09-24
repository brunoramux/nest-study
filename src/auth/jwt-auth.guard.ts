import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from './public'

// AuthGuard customizado com verificação de contexto isPublic() para rotas que não necessitem de autenticação
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // Apenas retorna true caso isPublic esteja no contexto (informado no controller)
    if (isPublic) {
      return true
    }

    // Caso não encontre o isPublic, segue para validação de Token
    return super.canActivate(context)
  }
}
