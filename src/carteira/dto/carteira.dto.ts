import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CriarCarteiraDto {
  @ApiProperty({ example: 'Carteira de Longo Prazo' })
  @IsString()
  @IsOptional()
  nome?: string;
}

export class ResumoCarteiraDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty({ description: 'Valor total investido em R$' })
  totalInvestido: number;

  @ApiProperty({ description: 'Valor atual da carteira em R$' })
  valorAtual: number;

  @ApiProperty({ description: 'Rentabilidade em %' })
  rentabilidade: number;

  @ApiProperty({ description: 'Número de ativos na carteira' })
  quantidadeAtivos: number;
}
