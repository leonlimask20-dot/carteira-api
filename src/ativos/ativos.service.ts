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

  async adicionar(carteiraId: number, dto: CriarAtivoDto, usuarioId: number): Promise<any> {
    // buscarPorId já verifica autorização e carrega o usuario
    const carteira = await this.carteiraService.buscarPorId(carteiraId, usuarioId);

    const ativo = this.ativoRepo.create({
      ...dto,
      carteira: { id: carteira.id },
    });
    const salvo = await this.ativoRepo.save(ativo);

    // Remove a referência da carteira da resposta
    const { carteira: _, ...resultado } = salvo as any;
    return resultado;
  }

  async listarPorCarteira(carteiraId: number, usuarioId: number): Promise<Ativo[]> {
    await this.carteiraService.buscarPorId(carteiraId, usuarioId);
    return this.ativoRepo.find({ where: { carteira: { id: carteiraId } } });
  }

  async atualizarPreco(id: number, dto: AtualizarPrecoDto, usuarioId: number): Promise<any> {
    const ativo = await this.ativoRepo.findOne({
      where: { id },
      relations: ['carteira', 'carteira.usuario'],
    });

    if (!ativo) throw new NotFoundException('Ativo não encontrado');

    // CRÍTICO: verifica usuario antes de permitir atualização
    if (!ativo.carteira.usuario || ativo.carteira.usuario.id !== usuarioId) {
      throw new ForbiddenException('Você não tem acesso a este ativo');
    }

    ativo.precoAtual = dto.precoAtual;
    const atualizado = await this.ativoRepo.save(ativo);
    const { carteira: _, ...resultado } = atualizado as any;
    return resultado;
  }

  async remover(id: number, usuarioId: number): Promise<void> {
    const ativo = await this.ativoRepo.findOne({
      where: { id },
      relations: ['carteira', 'carteira.usuario'],
    });

    if (!ativo) throw new NotFoundException('Ativo não encontrado');

    // CRÍTICO: verifica usuario antes de permitir remoção
    if (!ativo.carteira.usuario || ativo.carteira.usuario.id !== usuarioId) {
      throw new ForbiddenException('Você não tem acesso a este ativo');
    }

    await this.ativoRepo.remove(ativo);
  }
}
