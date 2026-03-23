import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // ValidationPipe — valida DTOs automaticamente
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ClassSerializerInterceptor — ativa @Exclude() nas entidades
  // Isso garante que campos marcados com @Exclude() (como senha)
  // nunca apareçam nas respostas, independente de qual endpoint chamou
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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
