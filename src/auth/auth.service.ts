import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto, RespostaLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<RespostaLoginDto> {
    const usuario = await this.usuariosService.buscarPorEmail(dto.email);

    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Payload do JWT — sub é o ID do usuário (convenção RFC 7519)
    const payload = { sub: usuario.id, email: usuario.email };

    return {
      token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
      },
    };
  }
}
