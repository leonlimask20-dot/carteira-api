import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JwtStrategy — valida o token JWT em cada requisição protegida.
 *
 * Quando uma rota usa @UseGuards(JwtAuthGuard), o Passport extrai
 * o token do header Authorization, valida a assinatura com o secret
 * e chama o método validate() com o payload decodificado.
 *
 * O retorno do validate() é injetado em req.user no controller.
 *
 * É o equivalente ao JwtAuthFilter do Spring Security.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrai o token do header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'segredo-desenvolvimento',
    });
  }

  async validate(payload: any) {
    // O que retornar aqui fica disponível em req.user no controller
    return { id: payload.sub, email: payload.email };
  }
}
