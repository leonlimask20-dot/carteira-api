import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { CarteiraModule } from './carteira/carteira.module';
import { AtivosModule } from './ativos/ativos.module';

/**
 * AppModule — módulo raiz da aplicação.
 *
 * No NestJS, a aplicação é organizada em módulos.
 * Cada módulo encapsula um domínio: usuários, autenticação, carteira, ativos.
 * Isso é a mesma ideia do Spring Boot com @Service, @Repository e @Controller
 * mas usando decorators TypeScript.
 *
 * @Module: decorator que define um módulo NestJS
 * imports: outros módulos que este módulo precisa
 */
@Module({
  imports: [
    // Carrega variáveis de ambiente do .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Configuração do TypeORM com PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'carteiradb',
      // autoLoadEntities: carrega automaticamente as entidades registradas nos módulos
      autoLoadEntities: true,
      // synchronize: cria/atualiza as tabelas automaticamente (só em desenvolvimento)
      synchronize: true,
    }),

    UsuariosModule,
    AuthModule,
    CarteiraModule,
    AtivosModule,
  ],
})
export class AppModule {}
