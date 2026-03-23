import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CarteiraService } from './carteira.service';
import { Carteira } from './carteira.entity';

/**
 * Testes unitários do CarteiraService.
 *
 * No NestJS, usamos o TestingModule para criar um contexto de teste
 * com as dependências mockadas — igual ao @MockBean do Spring Boot.
 *
 * getRepositoryToken(Carteira): obtém o token de injeção do repositório
 * para que possamos substituí-lo por um mock.
 */
describe('CarteiraService', () => {
  let service: CarteiraService;
  let repoMock: any;

  const carteirasMock: Carteira[] = [
    {
      id: 1,
      nome: 'Carteira Principal',
      usuario: { id: 1 } as any,
      ativos: [
        { id: 1, ticker: 'PETR4', quantidade: 100, precoMedio: 30, precoAtual: 35 } as any,
        { id: 2, ticker: 'VALE3', quantidade: 50, precoMedio: 60, precoAtual: 55 } as any,
      ],
      criadoEm: new Date(),
    },
  ];

  beforeEach(async () => {
    repoMock = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarteiraService,
        { provide: getRepositoryToken(Carteira), useValue: repoMock },
      ],
    }).compile();

    service = module.get<CarteiraService>(CarteiraService);
  });

  describe('criar', () => {
    it('deve criar uma carteira com o nome padrão quando nome não é informado', async () => {
      const carteiraCriada = { id: 1, nome: 'Minha Carteira', usuario: { id: 1 } };
      repoMock.create.mockReturnValue(carteiraCriada);
      repoMock.save.mockResolvedValue(carteiraCriada);

      const resultado = await service.criar({}, 1);

      expect(repoMock.create).toHaveBeenCalledWith({
        nome: 'Minha Carteira',
        usuario: { id: 1 },
      });
      expect(resultado.nome).toBe('Minha Carteira');
    });

    it('deve criar uma carteira com o nome informado', async () => {
      const carteiraCriada = { id: 1, nome: 'Carteira de Longo Prazo', usuario: { id: 1 } };
      repoMock.create.mockReturnValue(carteiraCriada);
      repoMock.save.mockResolvedValue(carteiraCriada);

      const resultado = await service.criar({ nome: 'Carteira de Longo Prazo' }, 1);

      expect(resultado.nome).toBe('Carteira de Longo Prazo');
    });
  });

  describe('buscarPorId', () => {
    it('deve lançar NotFoundException quando carteira não existe', async () => {
      repoMock.findOne.mockResolvedValue(null);

      await expect(service.buscarPorId(999, 1))
        .rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException quando carteira pertence a outro usuário', async () => {
      repoMock.findOne.mockResolvedValue({
        id: 1,
        usuario: { id: 99 }, // outro usuário
      });

      await expect(service.buscarPorId(1, 1))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('calcularResumo', () => {
    it('deve calcular corretamente o total investido', () => {
      // PETR4: 100 * 30 = 3000 + VALE3: 50 * 60 = 3000 → total = 6000
      const resumo = service.calcularResumo(carteirasMock[0]);
      expect(resumo.totalInvestido).toBe(6000);
    });

    it('deve calcular corretamente o valor atual', () => {
      // PETR4: 100 * 35 = 3500 + VALE3: 50 * 55 = 2750 → total = 6250
      const resumo = service.calcularResumo(carteirasMock[0]);
      expect(resumo.valorAtual).toBe(6250);
    });

    it('deve calcular corretamente a rentabilidade', () => {
      // (6250 - 6000) / 6000 * 100 = 4.17%
      const resumo = service.calcularResumo(carteirasMock[0]);
      expect(resumo.rentabilidade).toBe(4.17);
    });

    it('deve retornar rentabilidade zero quando não há ativos', () => {
      const carteiraVazia = { ...carteirasMock[0], ativos: [] };
      const resumo = service.calcularResumo(carteiraVazia);
      expect(resumo.rentabilidade).toBe(0);
      expect(resumo.totalInvestido).toBe(0);
    });

    it('deve retornar a quantidade correta de ativos', () => {
      const resumo = service.calcularResumo(carteirasMock[0]);
      expect(resumo.quantidadeAtivos).toBe(2);
    });
  });
});
