import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ativo } from './ativo.entity';
import { CarteiraService } from '../carteira/carteira.service';
import { CriarAtivoDto, AtualizarPrecoDto } from './dto/ativo.dto';

@Injectable()
export class AtivosService {
  constructor(
    @InjectRepository(Ativo)
    private readonly ativoRepo: Repository<Ativo>,
    private readonly carteiraService: CarteiraService,
  ) {}

  async adicionar(carteiraId: number, dto: CriarAtivoDto, usuarioId: number): Promise<Ativo> {
    // Verifica se a carteira existe e pertence ao usuário
    const carteira = await this.carteiraService.buscarPorId(carteiraId, usuarioId);

    const ativo = this.ativoRepo.create({ ...dto, carteira });
    return this.ativoRepo.save(ativo);
  }

  async listarPorCarteira(carteiraId: number, usuarioId: number): Promise<Ativo[]> {
    await this.carteiraService.buscarPorId(carteiraId, usuarioId);
    return this.ativoRepo.find({ where: { carteira: { id: carteiraId } } });
  }

  async atualizarPreco(id: number, dto: AtualizarPrecoDto, usuarioId: number): Promise<Ativo> {
    const ativo = await this.ativoRepo.findOne({
      where: { id },
      relations: ['carteira', 'carteira.usuario'],
    });

    if (!ativo) throw new NotFoundException('Ativo não encontrado');
    if (ativo.carteira.usuario?.id !== usuarioId) {
      throw new ForbiddenException('Você não tem acesso a este ativo');
    }

    ativo.precoAtual = dto.precoAtual;
    return this.ativoRepo.save(ativo);
  }

  async remover(id: number, usuarioId: number): Promise<void> {
    const ativo = await this.ativoRepo.findOne({
      where: { id },
      relations: ['carteira', 'carteira.usuario'],
    });

    if (!ativo) throw new NotFoundException('Ativo não encontrado');
    if (ativo.carteira.usuario?.id !== usuarioId) {
      throw new ForbiddenException('Você não tem acesso a este ativo');
    }

    await this.ativoRepo.remove(ativo);
  }
}
