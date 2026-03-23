import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Carteira } from '../carteira/carteira.entity';

/**
 * Entidade Usuario — representa a tabela 'usuarios' no banco.
 *
 * No NestJS com TypeORM, as entidades são decoradas com @Entity().
 * É o equivalente ao @Entity do Spring Boot com JPA/Hibernate.
 *
 * @Exclude(): impede que o campo senha apareça nas respostas JSON.
 * Funciona junto com o ClassSerializerInterceptor no módulo.
 */
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  nome: string;

  // @Exclude garante que a senha nunca seja serializada na resposta
  @Exclude()
  @Column()
  senha: string;

  // Um usuário tem uma carteira (OneToOne seria mais semântico,
  // mas OneToMany permite múltiplas carteiras no futuro)
  @OneToMany(() => Carteira, (carteira) => carteira.usuario)
  carteiras: Carteira[];

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
