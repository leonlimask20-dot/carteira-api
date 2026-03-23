import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Ativo } from '../ativos/ativo.entity';

@Entity('carteiras')
export class Carteira {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Minha Carteira' })
  nome: string;

  // ManyToOne: muitas carteiras para um usuário
  @ManyToOne(() => Usuario, (usuario) => usuario.carteiras, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @OneToMany(() => Ativo, (ativo) => ativo.carteira, { cascade: true })
  ativos: Ativo[];

  @CreateDateColumn()
  criadoEm: Date;
}
