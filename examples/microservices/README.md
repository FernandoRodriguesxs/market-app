# Exemplo: Microservices com SDD

Arquitetura de microservices usando SDD para sistema de delivery.

## Arquitetura

```
microservices/
├── services/
│   ├── user-service/
│   │   ├── specs/
│   │   ├── changes/
│   │   └── src/
│   │
│   ├── restaurant-service/
│   │   ├── specs/
│   │   ├── changes/
│   │   └── src/
│   │
│   ├── order-service/
│   │   ├── specs/
│   │   ├── changes/
│   │   └── src/
│   │
│   ├── delivery-service/
│   │   ├── specs/
│   │   ├── changes/
│   │   └── src/
│   │
│   └── notification-service/
│       ├── specs/
│       ├── changes/
│       └── src/
│
├── shared/
│   ├── events/        # Event schemas
│   ├── types/         # Shared types
│   └── utils/         # Common utilities
│
└── infrastructure/
    ├── api-gateway/
    ├── service-mesh/
    └── monitoring/
```

## Serviços

### 1. User Service
- Registro e autenticação
- Perfil de usuário
- Endereços de entrega
- Histórico de pedidos

**Database**: PostgreSQL
**Port**: 3001

### 2. Restaurant Service
- Catálogo de restaurantes
- Menu e preços
- Horário de funcionamento
- Reviews e ratings

**Database**: PostgreSQL
**Port**: 3002

### 3. Order Service
- Criar pedido
- Calcular preço
- Gerenciar status
- Cancelamento

**Database**: PostgreSQL
**Port**: 3003

### 4. Delivery Service
- Atribuir entregador
- Rastreamento em tempo real
- Cálculo de rota
- Status de entrega

**Database**: MongoDB
**Port**: 3004

### 5. Notification Service
- Email notifications
- Push notifications
- SMS notifications
- Event-driven

**Database**: Redis (queue)
**Port**: 3005

## Comunicação

### Síncrona (REST)
- API Gateway → Services
- Service-to-Service (quando necessário)

### Assíncrona (Events)
```
OrderCreated → DeliveryService, NotificationService
OrderCanceled → All Services
DeliveryCompleted → OrderService, NotificationService
```

**Message Broker**: RabbitMQ

## SDD por Serviço

Cada serviço segue estrutura SDD completa:

```
service/
├── specs/           # Docs específicas do serviço
│   ├── arc42/      # Arquitetura do serviço
│   ├── c4/         # Diagramas do serviço
│   ├── bdd/        # Features do serviço
│   └── adr/        # Decisões do serviço
│
├── changes/        # Features numeradas
│   └── NNN-feature/
│       ├── PRD.md
│       ├── design.md
│       ├── specs.md
│       └── tasks.md
│
└── src/            # Código do serviço
    └── {context}/{container}/{component}/
```

## Stack Técnica

- **Runtime**: Bun (ou Node.js)
- **Framework**: Elysia (ou Fastify)
- **API Gateway**: Kong (ou NGINX)
- **Service Mesh**: Istio (opcional)
- **Message Broker**: RabbitMQ
- **Databases**: PostgreSQL, MongoDB, Redis
- **Monitoring**: Prometheus + Grafana
- **Tracing**: Jaeger
- **Logging**: ELK Stack

## 12-Factor App Compliance

Cada serviço segue 12-Factor App (regras 040-051):

- ✅ Codebase única por serviço
- ✅ Dependências explícitas
- ✅ Config via environment
- ✅ Backing services como recursos
- ✅ Build, Release, Run separados
- ✅ Processos stateless
- ✅ Port binding
- ✅ Concorrência via processos
- ✅ Descartabilidade
- ✅ Dev/Prod parity
- ✅ Logs como stream
- ✅ Admin processes

## Deployment

```bash
# Docker Compose (dev)
docker-compose up

# Kubernetes (prod)
kubectl apply -f k8s/
```

## Conformidade SDD

- ✅ Cada serviço com specs/ completa
- ✅ Changes/ documentadas
- ✅ 51 regras + 18 skills por serviço
- ✅ Event-driven architecture documentada
- ✅ CC ≤ 5, cobertura ≥ 85%
