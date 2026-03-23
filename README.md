# Carteira de Investimentos API

![CI](https://github.com/leonlimask20-dot/carteira-api/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)
![Testes](https://img.shields.io/badge/testes-Jest-C21325?logo=jest&logoColor=white)

API REST para gerenciamento de carteira de investimentos pessoal com autenticação JWT, TypeORM e documentação Swagger.

---

## Links rápidos

| | |
|---|---|
| Swagger UI | `http://localhost:3000/docs` |
| Rodar com Docker | `docker-compose up --build` |
| Rodar testes | `npm test` |

---

## Principais competências demonstradas

- NestJS com arquitetura modular — módulos por domínio (auth, usuários, carteira, ativos)
- TypeScript com tipagem estrita em DTOs, entidades e serviços
- Autenticação JWT stateless com Passport e guards
- TypeORM com PostgreSQL — entidades, relacionamentos e repositórios
- Validação automática de DTOs com class-validator
- Documentação interativa com Swagger UI
- Testes unitários com Jest e TestingModule do NestJS
- Docker e Docker Compose
- Pipeline CI com GitHub Actions

---

## Tecnologias

| Tecnologia | Versão |
|---|---|
| Node.js | 20+ |
| NestJS | 10 |
| TypeScript | 5 |
| TypeORM | 0.3 |
| PostgreSQL | 15 |
| Passport JWT | 4 |
| Jest | 29 |
| Swagger (OpenAPI 3) | 7 |

---

## Arquitetura modular

```
src/
├── auth/                    ← autenticação JWT
│   ├── strategies/
│   │   └── jwt.strategy.ts  ← valida token em cada requisição
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── auth.service.ts
│   ├── auth.service.spec.ts ← 4 testes
│   └── auth.module.ts
├── usuarios/
│   ├── usuario.entity.ts
│   ├── usuarios.service.ts
│   └── usuarios.module.ts
├── carteira/
│   ├── carteira.entity.ts
│   ├── carteira.service.ts
│   ├── carteira.service.spec.ts ← 7 testes
│   └── carteira.module.ts
└── ativos/
    ├── ativo.entity.ts
    ├── ativos.service.ts
    └── ativos.module.ts
```

---

## Endpoints

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/usuarios/registro` | Criar conta |
| POST | `/api/auth/login` | Login — retorna JWT |

### Carteira
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/carteiras` | Criar carteira |
| GET | `/api/carteiras` | Listar carteiras |
| GET | `/api/carteiras/:id` | Buscar carteira |
| GET | `/api/carteiras/:id/resumo` | Resumo financeiro |

### Ativos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/carteiras/:id/ativos` | Adicionar ativo |
| GET | `/api/carteiras/:id/ativos` | Listar ativos |
| PATCH | `/api/carteiras/:id/ativos/:id/preco` | Atualizar preço |
| DELETE | `/api/carteiras/:id/ativos/:id` | Remover ativo |

---

## Como executar

```bash
# Copie o .env
cp .env.example .env

# Suba o banco e a API
docker-compose up --build
```

Acesse o Swagger em `http://localhost:3000/docs`

---

## Testes

```bash
npm test
```

---

## Autor

**LNL**
GitHub: [@leonlimask20-dot](https://github.com/leonlimask20-dot)
Email: leonlimask@gmail.com
