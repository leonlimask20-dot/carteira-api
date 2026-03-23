import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

/**
 * UsuariosModule — encapsula tudo relacionado a usuários.
 *
 * exports: torna o UsuariosService disponível para outros módulos.
 * O AuthModule precisa do UsuariosService para validar credenciais.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService],
})
export class UsuariosModule {}
