import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Carteira } from '../carteira/carteira.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  nome: string;

  @Exclude()
  @Column()
  senha: string;

  @Exclude()
  @OneToMany(() => Carteira, (carteira) => carteira.usuario)
  carteiras: Carteira[];

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  @Exclude()
  atualizadoEm: Date;
}
