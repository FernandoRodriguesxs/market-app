# Exemplo: API REST com SDD

API RESTful usando SDD para gerenciamento de tarefas (Todo List).

## Estrutura

```
api-rest/
├── specs/
│   ├── arc42/
│   ├── c4/
│   ├── bdd/
│   └── adr/
│
├── changes/
│   ├── 001-task-crud/
│   ├── 002-user-management/
│   └── 003-task-sharing/
│
└── src/
    ├── task/
    │   ├── create/
    │   ├── update/
    │   ├── delete/
    │   └── list/
    └── user/
        ├── authentication/
        └── authorization/
```

## Endpoints

### Tasks
```
POST   /api/tasks           # Criar tarefa
GET    /api/tasks           # Listar tarefas
GET    /api/tasks/:id       # Detalhes da tarefa
PUT    /api/tasks/:id       # Atualizar tarefa
DELETE /api/tasks/:id       # Deletar tarefa
PATCH  /api/tasks/:id/done  # Marcar como concluída
```

### Users
```
POST   /api/auth/register   # Registrar usuário
POST   /api/auth/login      # Login
POST   /api/auth/logout     # Logout
GET    /api/users/me        # Perfil do usuário
```

## Features

### 001. Task CRUD
- Criar tarefas com título, descrição, prioridade
- Listar tarefas com filtros (status, prioridade)
- Atualizar tarefas
- Deletar tarefas
- Marcar como concluída

### 002. User Management
- Registro de usuários
- Login com JWT
- Autorização por roles (user, admin)
- Perfil do usuário

### 003. Task Sharing
- Compartilhar tarefas entre usuários
- Permissões (view, edit)
- Notificações de compartilhamento

## Stack Técnica

- **Runtime**: Bun
- **Framework**: Elysia (ou Express)
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Validation**: Zod
- **Auth**: JWT + bcrypt
- **Tests**: Vitest + Supertest

## Conformidade SDD

- ✅ Context/Container/Component structure
- ✅ 51 regras + 18 skills
- ✅ Specs completa (arc42, C4, BDD)
- ✅ Changes numeradas com 4 docs
- ✅ CC ≤ 5, cobertura ≥ 85%
