import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Ponto de entrada da aplicação NestJS.
 *
 * No NestJS, tudo começa pelo AppModule — o módulo raiz que importa
 * todos os outros módulos da aplicação.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // ValidationPipe: valida automaticamente os DTOs em todas as rotas
  // whitelist: remove campos não declarados no DTO
  // transform: converte tipos automaticamente (ex: string '1' → number 1)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configuração do Swagger UI
  const config = new DocumentBuilder()
    .setTitle('Carteira de Investimentos API')
    .setDescription('API para gerenciamento de carteira de investimentos pessoal')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documento);

  await app.listen(3000);
  console.log('API rodando em http://localhost:3000');
  console.log('Swagger UI em http://localhost:3000/docs');
}

bootstrap();
