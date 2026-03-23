import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Carteira } from '../carteira/carteira.entity';

export enum TipoAtivo {
  ACAO = 'ACAO',
  FII = 'FII',
  RENDA_FIXA = 'RENDA_FIXA',
  CRIPTOMOEDA = 'CRIPTOMOEDA',
  ETF = 'ETF',
}

@Entity('ativos')
export class Ativo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticker: string;

  @Column()
  nome: string;

  @Column({ type: 'enum', enum: TipoAtivo })
  tipo: TipoAtivo;

  @Column('decimal', { precision: 10, scale: 2 })
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'preco_medio' })
  precoMedio: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'preco_atual' })
  precoAtual: number;

  @ManyToOne(() => Carteira, (carteira) => carteira.ativos, { onDelete: 'CASCADE' })
  carteira: Carteira;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
