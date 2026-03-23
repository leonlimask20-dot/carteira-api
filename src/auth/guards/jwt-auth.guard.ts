import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard — guard que protege rotas com autenticação JWT.
 *
 * Basta anotar qualquer rota com @UseGuards(JwtAuthGuard) para exigir
 * um token JWT válido. Sem o token, retorna 401 Unauthorized.
 *
 * É o equivalente ao @PreAuthorize ou SecurityFilterChain do Spring Security.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
