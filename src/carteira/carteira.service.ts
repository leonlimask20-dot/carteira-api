import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carteira } from './carteira.entity';
import { CriarCarteiraDto, ResumoCarteiraDto } from './dto/carteira.dto';

@Injectable()
export class CarteiraService {
  constructor(
    @InjectRepository(Carteira)
    private readonly carteiraRepo: Repository<Carteira>,
  ) {}

  async criar(dto: CriarCarteiraDto, usuarioId: number): Promise<Carteira> {
    const carteira = this.carteiraRepo.create({
      nome: dto.nome || 'Minha Carteira',
      usuario: { id: usuarioId },
    });
    return this.carteiraRepo.save(carteira);
  }

  async listarPorUsuario(usuarioId: number): Promise<Carteira[]> {
    return this.carteiraRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['ativos'],
    });
  }

  async buscarPorId(id: number, usuarioId: number): Promise<Carteira> {
    const carteira = await this.carteiraRepo.findOne({
      where: { id },
      // CRÍTICO: usuario DEVE ser carregado para o check de autorização funcionar
      relations: ['ativos', 'usuario'],
    });

    if (!carteira) {
      throw new NotFoundException('Carteira não encontrada');
    }

    // CRÍTICO: sem isso qualquer usuário acessa qualquer carteira
    if (!carteira.usuario || carteira.usuario.id !== usuarioId) {
      throw new ForbiddenException('Você não tem acesso a esta carteira');
    }

    return carteira;
  }

  calcularResumo(carteira: Carteira): ResumoCarteiraDto {
    const ativos = carteira.ativos || [];

    const totalInvestido = ativos.reduce(
      (soma, ativo) => soma + Number(ativo.quantidade) * Number(ativo.precoMedio),
      0,
    );

    const valorAtual = ativos.reduce(
      (soma, ativo) => soma + Number(ativo.quantidade) * Number(ativo.precoAtual),
      0,
    );

    const rentabilidade = totalInvestido > 0
      ? ((valorAtual - totalInvestido) / totalInvestido) * 100
      : 0;

    return {
      id: carteira.id,
      nome: carteira.nome,
      totalInvestido: Number(totalInvestido.toFixed(2)),
      valorAtual: Number(valorAtual.toFixed(2)),
      rentabilidade: Number(rentabilidade.toFixed(2)),
      quantidadeAtivos: ativos.length,
    };
  }
}
