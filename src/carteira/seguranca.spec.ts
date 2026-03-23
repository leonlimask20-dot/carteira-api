import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CarteiraService } from '../carteira/carteira.service';
import { AtivosService } from '../ativos/ativos.service';
import { Carteira } from '../carteira/carteira.entity';
import { Ativo } from '../ativos/ativo.entity';

/**
 * Testes de segurança — verificam que as proteções de autorização
 * funcionam corretamente e que dados sensíveis não vazam.
 *
 * Esses testes são tão importantes quanto os funcionais:
 * garantem que um usuário nunca acessa dados de outro.
 */
describe('Segurança — CarteiraService', () => {
  let carteiraService: CarteiraService;
  let carteiraRepoMock: any;

  beforeEach(async () => {
    carteiraRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarteiraService,
        { provide: getRepositoryToken(Carteira), useValue: carteiraRepoMock },
      ],
    }).compile();

    carteiraService = module.get<CarteiraService>(CarteiraService);
  });

  describe('Autorização — acesso entre usuários', () => {
    it('deve lançar ForbiddenException quando usuario é null na entidade', async () => {
      // Simula carteira sem usuario carregado — não deve passar na verificação
      carteiraRepoMock.findOne.mockResolvedValue({
        id: 1,
        usuario: null,
        ativos: [],
      });

      await expect(carteiraService.buscarPorId(1, 1))
        .rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ForbiddenException quando usuario pertence a outro (id diferente)', async () => {
      carteiraRepoMock.findOne.mockResolvedValue({
        id: 1,
        usuario: { id: 99 }, // usuário 99 é dono, não o usuário 1
        ativos: [],
      });

      await expect(carteiraService.buscarPorId(1, 1))
        .rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ForbiddenException quando usuario é undefined', async () => {
      carteiraRepoMock.findOne.mockResolvedValue({
        id: 1,
        usuario: undefined,
        ativos: [],
      });

      await expect(carteiraService.buscarPorId(1, 1))
        .rejects.toThrow(ForbiddenException);
    });

    it('deve permitir acesso quando usuario é o dono correto', async () => {
      carteiraRepoMock.findOne.mockResolvedValue({
        id: 1,
        usuario: { id: 1 }, // mesmo usuário
        ativos: [],
      });

      const resultado = await carteiraService.buscarPorId(1, 1);
      expect(resultado.id).toBe(1);
    });

    it('deve lançar NotFoundException quando carteira não existe', async () => {
      carteiraRepoMock.findOne.mockResolvedValue(null);

      await expect(carteiraService.buscarPorId(999, 1))
        .rejects.toThrow(NotFoundException);
    });
  });
});

describe('Segurança — AtivosService', () => {
  let ativosService: AtivosService;
  let ativoRepoMock: any;
  let carteiraServiceMock: any;

  beforeEach(async () => {
    ativoRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    carteiraServiceMock = {
      buscarPorId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtivosService,
        { provide: getRepositoryToken(Ativo), useValue: ativoRepoMock },
        { provide: CarteiraService, useValue: carteiraServiceMock },
      ],
    }).compile();

    ativosService = module.get<AtivosService>(AtivosService);
  });

  describe('Autorização — acesso a ativos de outros usuários', () => {
    it('deve lançar ForbiddenException ao atualizar preco de ativo de outro usuario', async () => {
      ativoRepoMock.findOne.mockResolvedValue({
        id: 1,
        precoAtual: 40,
        carteira: {
          usuario: { id: 99 }, // dono é o usuário 99
        },
      });

      await expect(ativosService.atualizarPreco(1, { precoAtual: 50 }, 1))
        .rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ForbiddenException ao remover ativo de outro usuario', async () => {
      ativoRepoMock.findOne.mockResolvedValue({
        id: 1,
        carteira: {
          usuario: { id: 99 },
        },
      });

      await expect(ativosService.remover(1, 1))
        .rejects.toThrow(ForbiddenException);
    });

    it('deve lançar NotFoundException ao atualizar ativo inexistente', async () => {
      ativoRepoMock.findOne.mockResolvedValue(null);

      await expect(ativosService.atualizarPreco(999, { precoAtual: 50 }, 1))
        .rejects.toThrow(NotFoundException);
    });

    it('deve lançar NotFoundException ao remover ativo inexistente', async () => {
      ativoRepoMock.findOne.mockResolvedValue(null);

      await expect(ativosService.remover(999, 1))
        .rejects.toThrow(NotFoundException);
    });

    it('deve delegar verificação de autorização ao CarteiraService ao adicionar ativo', async () => {
      // CarteiraService.buscarPorId já verifica autorização
      // Se lançar ForbiddenException, AtivosService deve propagar
      carteiraServiceMock.buscarPorId.mockRejectedValue(
        new ForbiddenException('Você não tem acesso a esta carteira'),
      );

      await expect(
        ativosService.adicionar(1, {
          ticker: 'PETR4',
          nome: 'Petrobras',
          tipo: 'ACAO' as any,
          quantidade: 100,
          precoMedio: 38,
          precoAtual: 42,
        }, 1)
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
