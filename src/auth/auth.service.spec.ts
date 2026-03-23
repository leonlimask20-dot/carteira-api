import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usuariosServiceMock: any;
  let jwtServiceMock: any;

  const usuarioMock = {
    id: 1,
    email: 'leon@email.com',
    nome: 'Leon',
    senha: '$2b$10$hashedpassword',
  };

  beforeEach(async () => {
    usuariosServiceMock = {
      buscarPorEmail: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuariosService, useValue: usuariosServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('deve retornar token quando credenciais são válidas', async () => {
      usuariosServiceMock.buscarPorEmail.mockResolvedValue(usuarioMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const resultado = await service.login({
        email: 'leon@email.com',
        senha: 'senha123',
      });

      expect(resultado.token).toBe('mock-jwt-token');
      expect(resultado.usuario.email).toBe('leon@email.com');
    });

    it('deve lançar UnauthorizedException quando usuário não existe', async () => {
      usuariosServiceMock.buscarPorEmail.mockResolvedValue(null);

      await expect(service.login({ email: 'nao@existe.com', senha: '123' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException quando senha está errada', async () => {
      usuariosServiceMock.buscarPorEmail.mockResolvedValue(usuarioMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login({ email: 'leon@email.com', senha: 'errada' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('não deve expor a senha na resposta', async () => {
      usuariosServiceMock.buscarPorEmail.mockResolvedValue(usuarioMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const resultado = await service.login({ email: 'leon@email.com', senha: 'senha123' });

      expect(resultado.usuario).not.toHaveProperty('senha');
    });
  });
});
