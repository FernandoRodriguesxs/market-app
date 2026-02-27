# Exemplo: E-commerce com SDD

Este é um exemplo de estrutura de projeto e-commerce usando SDD (Spec-Driven Development).

## Estrutura

```
e-commerce/
├── specs/              # Documentação
│   ├── arc42/         # 12 capítulos de arquitetura
│   ├── c4/            # Diagramas C4 (context, container, component, code)
│   ├── bdd/           # Features BDD executáveis
│   └── adr/           # Architecture Decision Records
│
├── changes/           # Features numeradas
│   ├── 001-user-authentication/
│   │   ├── PRD.md     # Product Requirements
│   │   ├── design.md  # Arquitetura
│   │   ├── specs.md   # Especificação técnica
│   │   └── tasks.md   # Decomposição atômica
│   ├── 002-product-catalog/
│   ├── 003-shopping-cart/
│   └── 004-checkout/
│
└── src/               # Código
    ├── user/          # Context: Usuários
    │   └── authentication/
    │       ├── login/
    │       ├── register/
    │       └── password-reset/
    ├── product/       # Context: Produtos
    │   └── catalog/
    │       ├── search/
    │       ├── filter/
    │       └── detail/
    ├── order/         # Context: Pedidos
    │   ├── cart/
    │   └── checkout/
    └── payment/       # Context: Pagamentos
        └── gateway/
```

## Features Implementadas

### 001. User Authentication
- Login com email/senha
- Registro de novos usuários
- Reset de senha via email
- JWT tokens

### 002. Product Catalog
- Busca de produtos
- Filtros (categoria, preço, marca)
- Detalhes do produto
- Imagens e reviews

### 003. Shopping Cart
- Adicionar/remover itens
- Atualizar quantidades
- Cálculo de subtotal
- Persistência

### 004. Checkout
- Endereço de entrega
- Opções de frete
- Integração com pagamento
- Confirmação do pedido

## Workflow SDD

1. **research** → Consultar specs/ antes de implementar
2. **change** → Criar changes/NNN-feature/ com 4 docs
3. **code** → Implementar em src/ seguindo 51 regras + 18 skills
4. **docs** → Atualizar arc42, C4, BDD, ADRs

## Tecnologias

- **Backend**: Node.js + TypeScript
- **Frontend**: React + TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Queue**: RabbitMQ
- **Tests**: Vitest + Cucumber

## Comandos

```bash
# Implementar
bun run dev

# Testes
bun test
bun test:bdd

# Validar código
/reviewer

# Commit e push
/ship

# Sincronizar branch
/sync
```

## Conformidade

- ✅ 51 regras arquiteturais
- ✅ 18 skills de código
- ✅ CC ≤ 5 por método
- ✅ Cobertura ≥ 85%
- ✅ Path aliases (sem ../)
