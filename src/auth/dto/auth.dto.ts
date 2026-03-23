import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'leon@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  senha: string;
}

export class RespostaLoginDto {
  @ApiProperty({ description: 'Token JWT para autenticação' })
  token: string;

  @ApiProperty()
  usuario: {
    id: number;
    email: string;
    nome: string;
  };
}
