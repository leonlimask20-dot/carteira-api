# Investment Portfolio API

![CI](https://github.com/leonlimask20-dot/carteira-api/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)
![Tests](https://img.shields.io/badge/tests-Jest-C21325?logo=jest&logoColor=white)

REST API for managing a personal investment portfolio with JWT authentication,
TypeORM and Swagger documentation.

---

## Quick links

| | |
|---|---|
| Swagger UI | `http://localhost:3000/docs` |
| Run with Docker | `docker-compose up --build` |
| Run tests | `npm test` |

---

## Key skills demonstrated

- NestJS with a modular architecture — modules per domain (auth, users, portfolio, assets)
- TypeScript with strict typing in DTOs, entities and services
- Stateless JWT authentication with Passport and guards
- TypeORM with PostgreSQL — entities, relationships and repositories
- Automatic DTO validation with class-validator
- Interactive documentation with Swagger UI
- Unit tests with Jest and NestJS's TestingModule
- Docker and Docker Compose
- CI pipeline with GitHub Actions

---

## Tech stack

| Technology | Version |
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

## Modular architecture

```
src/
├── auth/                    ← JWT authentication
│   ├── strategies/
│   │   └── jwt.strategy.ts  ← validates the token on each request
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── auth.service.ts
│   ├── auth.service.spec.ts ← 4 tests
│   └── auth.module.ts
├── usuarios/
│   ├── usuario.entity.ts
│   ├── usuarios.service.ts
│   └── usuarios.module.ts
├── carteira/
│   ├── carteira.entity.ts
│   ├── carteira.service.ts
│   ├── carteira.service.spec.ts ← 7 tests
│   └── carteira.module.ts
└── ativos/
    ├── ativo.entity.ts
    ├── ativos.service.ts
    └── ativos.module.ts
```

---

## Endpoints

### Authentication
| Method | Route | Description |
|--------|------|-------------|
| POST | `/api/usuarios/registro` | Create account |
| POST | `/api/auth/login` | Login — returns a JWT |

### Portfolio
| Method | Route | Description |
|--------|------|-------------|
| POST | `/api/carteiras` | Create portfolio |
| GET | `/api/carteiras` | List portfolios |
| GET | `/api/carteiras/:id` | Get portfolio |
| GET | `/api/carteiras/:id/resumo` | Financial summary |

### Assets
| Method | Route | Description |
|--------|------|-------------|
| POST | `/api/carteiras/:id/ativos` | Add asset |
| GET | `/api/carteiras/:id/ativos` | List assets |
| PATCH | `/api/carteiras/:id/ativos/:id/preco` | Update price |
| DELETE | `/api/carteiras/:id/ativos/:id` | Remove asset |

---

## How to run

```bash
# Copy the .env
cp .env.example .env

# Bring up the database and the API
docker-compose up --build
```

Open the Swagger UI at `http://localhost:3000/docs`

---

## Tests

```bash
npm test
```

---

## 🤖 Agent Architecture

This project was built and code-reviewed using a **multi-agent
context-optimization workflow**: specialized AI agents each audit a single
slice of the codebase — auth, domain modules, persistence, tests — within a
strict context budget. The approach cuts review time and token cost while
keeping full traceability of every finding.

Methodology, agent templates and the full playbook: **[leonlim3.gumroad.com](https://leonlim3.gumroad.com)**

---

## Author

**LNL**
GitHub: [@leonlimask20-dot](https://github.com/leonlimask20-dot)
Email: leonlimask@gmail.com
