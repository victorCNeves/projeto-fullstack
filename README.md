# Projeto 2 — Programação Web Fullstack

Aplicação fullstack distribuída com SPA React e arquitetura de microsserviços. O sistema gerencia um catálogo de filmes com autenticação JWT, comunicação assíncrona via Redis Pub/Sub e notificações em tempo real via WebSocket.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Instalação](#instalação)
- [Populando o Banco de Dados](#populando-o-banco-de-dados)
- [Executando o Projeto](#executando-o-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura de Pastas](#estrutura-de-pastas)

---

## Visão Geral

O projeto é composto por quatro componentes executáveis independentes:

| Componente             | Tecnologia             | Porta | Responsabilidade                                                              |
| ---------------------- | ---------------------- | ----- | ----------------------------------------------------------------------------- |
| `frontend`             | React + Vite           | 5173  | SPA — interface do usuário, CRUD de filmes e conexão WebSocket                |
| `auth-service`         | Express.js + MongoDB   | 3001  | Autenticação, emissão e invalidação de tokens JWT                             |
| `resource-service`     | Express.js + MongoDB   | 3002  | CRUD de filmes, validação de JWT, cache Redis e publicação de eventos na fila |
| `notification-service` | Express.js + WebSocket | 3003  | Servidor WebSocket; consome eventos do Redis e os retransmite aos clientes    |

**Dependências externas:** MongoDB e Redis (ambos devem estar em execução antes de subir os serviços).

---

## Arquitetura

```
React (SPA)
  │
  ├─── HTTP (JWT) ──────► auth-service       ──► MongoDB (auth_db)
  │
  ├─── HTTP (JWT) ──────► resource-service   ──► MongoDB (movie_db)
  │                              │                └── Redis (cache)
  │                              └── Redis Pub/Sub ──► notification-service
  │
  └─── WebSocket ───────► notification-service
```

**Fluxo de dados:**

1. O usuário faz login → `auth-service` retorna um JWT.
2. Operações de CRUD → `resource-service` valida o JWT e persiste os dados.
3. A cada escrita (Create/Update/Delete), o `resource-service` publica um evento no Redis.
4. O `notification-service` consome o evento e envia uma mensagem WebSocket a todos os clientes conectados.
5. O frontend atualiza a listagem automaticamente, sem recarregar a página.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [MongoDB](https://www.mongodb.com/) rodando em `localhost:27017`
- [Redis](https://redis.io/) rodando em `localhost:6379`

---

## Variáveis de Ambiente

Cada serviço possui seu próprio arquivo `.env` na raiz da sua pasta. Abaixo estão os valores esperados:

### `auth-service/.env`

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=sua_chave_secreta_jwt
```

### `resource-service/.env`

```env
PORT=3002
MONGO_URI=mongodb://localhost:27017/movie_db
AUTH_SERVICE_URL=http://localhost:3001
REDIS_HOST=localhost
REDIS_PORT=6379
```

### `notification-service/.env`

```env
PORT=3003
AUTH_SERVICE_URL=http://localhost:3001
REDIS_HOST=localhost
REDIS_PORT=6379
```

### `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3002/
VITE_AUTH_SERVICE_URL=http://localhost:3001
VITE_NOTIFICATION_SERVICE=ws://localhost:3003
```

---

## Instalação

Na raiz do projeto, instale as dependências de todos os serviços de uma só vez:

```bash
npm run install-all
```

Esse comando equivale a rodar `npm install` individualmente em `frontend`, `auth-service`, `resource-service` e `notification-service`.

---

## Populando o Banco de Dados

Antes de usar a aplicação, popule os bancos com usuários e filmes iniciais:

```bash
npm run seed
```

Isso executa o seed do `auth-service` (usuários) e do `resource-service` (filmes) em sequência.

**Usuários disponíveis após o seed:**

| Usuário | Senha      |
| ------- | ---------- |
| `admin` | `admin123` |
| `user1` | `user123`  |

> Verifique o arquivo `auth-service/scripts/seedUsers.js` para conferir os dados exatos inseridos.

---

## Executando o Projeto

### Todos os serviços juntos (recomendado)

Na raiz do projeto:

```bash
npm run dev
```

Esse comando sobe o frontend e os três microsserviços em paralelo usando `concurrently`.

### Serviços individualmente

Se preferir subir cada serviço separadamente, abra um terminal para cada um:

```bash
# auth-service
cd auth-service
npm run dev

# resource-service
cd resource-service
npm run dev

# notification-service
cd notification-service
npm run dev

# frontend
cd frontend
npm run dev
```

Após subir tudo, acesse o frontend em: **http://localhost:5173**

---

## Endpoints da API

### auth-service (porta 3001)

| Método | Rota           | Descrição                       | Autenticação |
| ------ | -------------- | ------------------------------- | ------------ |
| POST   | `/auth/login`  | Autenticar usuário, retorna JWT | Não          |
| POST   | `/auth/logout` | Invalidar token (revogação)     | Sim          |

### resource-service (porta 3002)

| Método | Rota          | Descrição                                | Autenticação |
| ------ | ------------- | ---------------------------------------- | ------------ |
| GET    | `/movies`     | Listar filmes (com suporte a busca)      | Sim          |
| GET    | `/movies/:id` | Buscar filme por ID                      | Sim          |
| POST   | `/movies`     | Criar novo filme (vinculado ao usuário)  | Sim          |
| PUT    | `/movies/:id` | Atualizar filme (somente o proprietário) | Sim          |
| DELETE | `/movies/:id` | Excluir filme (somente o proprietário)   | Sim          |
| GET    | `/genres`     | Listar gêneros disponíveis               | Sim          |

> Todas as rotas autenticadas exigem o header: `Authorization: Bearer <token>`

### notification-service (porta 3003)

| Protocolo | Rota      | Descrição                                         |
| --------- | --------- | ------------------------------------------------- |
| WebSocket | `/`       | Conexão em tempo real para recebimento de eventos |
| HTTP GET  | `/health` | Health check do serviço                           |

---

## Estrutura de Pastas

```
projeto/
├── auth-service/
│   ├── app.js
│   ├── package.json
│   ├── scripts/
│   │   └── seedUsers.js
│   └── src/
│       ├── config/       # Configuração do banco e JWT
│       ├── models/       # User, RevokedToken
│       └── routes/       # Rotas e controladores de autenticação
│
├── resource-service/
│   ├── app.js
│   ├── package.json
│   ├── scripts/
│   │   └── seedMovies.js
│   └── src/
│       ├── config/       # Banco, Redis, JWT e cache
│       ├── models/       # Movie, Genre
│       └── routes/       # Rotas e controladores de filmes e gêneros
│
├── notification-service/
│   ├── app.js
│   ├── package.json
│   └── src/
│       ├── config/       # Redis e WebSocket
│       ├── models/       # Consumidor da fila Redis
│       └── routes/       # Health check
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── components/   # Header, CardFilme, Carrossel, ContainerBusca
│       ├── contexts/     # BuscaContext, WebSocketContext
│       ├── pages/        # Home, Catalogo, DetalhesFilme, FormularioFilme, Login
│       ├── routes/       # Definição de rotas React Router
│       └── utils/        # authUtils, tmdbUtils
│
├── package.json          # Scripts raiz (dev, install-all, seed)
└── README.md
```
