import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTOs — Data Transfer Objects.
 *
 * No NestJS, os DTOs definem o formato dos dados de entrada.
 * O ValidationPipe valida automaticamente cada campo usando os decorators
 * do class-validator: @IsEmail, @IsString, @MinLength, etc.
 *
 * @ApiProperty: documenta o campo no Swagger UI.
 */
export class CriarUsuarioDto {
  @ApiProperty({ example: 'leon@email.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Leon' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha: string;
}

export class RespostaUsuarioDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  criadoEm: Date;
}
