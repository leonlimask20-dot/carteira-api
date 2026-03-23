import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carteira } from './carteira.entity';
import { CarteiraService } from './carteira.service';
import { CarteiraController } from './carteira.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Carteira])],
  providers: [CarteiraService],
  controllers: [CarteiraController],
  exports: [CarteiraService],
})
export class CarteiraModule {}
