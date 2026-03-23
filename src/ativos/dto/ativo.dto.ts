import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { TipoAtivo } from '../ativo.entity';

export class CriarAtivoDto {
  @ApiProperty({ example: 'PETR4' })
  @IsString()
  ticker: string;

  @ApiProperty({ example: 'Petrobras PN' })
  @IsString()
  nome: string;

  @ApiProperty({ enum: TipoAtivo, example: TipoAtivo.ACAO })
  @IsEnum(TipoAtivo)
  tipo: TipoAtivo;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0.01)
  quantidade: number;

  @ApiProperty({ example: 38.50, description: 'Preço médio de compra' })
  @IsNumber()
  @Min(0.01)
  precoMedio: number;

  @ApiProperty({ example: 42.30, description: 'Preço atual de mercado' })
  @IsNumber()
  @Min(0.01)
  precoAtual: number;
}

export class AtualizarPrecoDto {
  @ApiProperty({ example: 45.00, description: 'Novo preço atual de mercado' })
  @IsNumber()
  @Min(0.01)
  precoAtual: number;
}
