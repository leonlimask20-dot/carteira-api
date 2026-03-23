import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ativo } from './ativo.entity';
import { AtivosService } from './ativos.service';
import { AtivosController } from './ativos.controller';
import { CarteiraModule } from '../carteira/carteira.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ativo]), CarteiraModule],
  providers: [AtivosService],
  controllers: [AtivosController],
})
export class AtivosModule {}
