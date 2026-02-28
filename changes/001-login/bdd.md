# BDD — Autenticação por Login (001-login)

**Versão**: 1.0
**Data**: 2026-02-28
**Linguagem**: Gherkin (pt-BR)

> Cenários cobrem os três casos de uso definidos no PRD:
> - UC-001: Autenticar usuário
> - UC-002: Redirecionar usuário já autenticado
> - UC-003: Proteger rotas privadas

---

## Feature: Autenticação de Usuário (UC-001)

```gherkin
Feature: Autenticação de Usuário
  Como usuário cadastrado no Market App
  Quero me autenticar com email e senha
  Para acessar as funcionalidades protegidas do sistema

  Background:
    Given que existe um usuário cadastrado com email "joao@exemplo.com"
    And a senha desse usuário é "minhasenha123"
    And a senha está armazenada como hash bcrypt no banco de dados

  # ---------------------------------------------------------------------------
  # Cenários de Sucesso
  # ---------------------------------------------------------------------------

  Scenario: Login com credenciais válidas
    When o usuário submete o formulário com email "joao@exemplo.com" e senha "minhasenha123"
    Then a API retorna status 200
    And um cookie HttpOnly com nome "session" é definido na resposta
    And o cookie contém um JWT válido com userId e email do usuário
    And o usuário é redirecionado para a página inicial "/"

  Scenario: Login com email em letras maiúsculas é normalizado
    When o usuário submete o formulário com email "JOAO@EXEMPLO.COM" e senha "minhasenha123"
    Then o email é normalizado para "joao@exemplo.com"
    And a API retorna status 200
    And o usuário é autenticado com sucesso

  Scenario: Login redireciona para URL de origem após sucesso
    Given que o usuário tentou acessar "/dashboard" sem estar autenticado
    And foi redirecionado para "/login?redirect=/dashboard"
    When o usuário submete credenciais válidas no formulário
    Then o usuário é redirecionado para "/dashboard"

  # ---------------------------------------------------------------------------
  # Cenários de Erro — Validação Client-Side
  # ---------------------------------------------------------------------------

  Scenario: Validação de email inválido no formulário
    When o usuário preenche o campo email com "nao-e-um-email"
    And sai do campo (evento blur)
    Then uma mensagem de erro é exibida abaixo do campo email
    And o formulário não é submetido para a API

  Scenario: Validação de senha curta no formulário
    When o usuário preenche o campo senha com "123"
    And sai do campo (evento blur)
    Then uma mensagem de erro é exibida abaixo do campo senha indicando mínimo de 8 caracteres
    And o formulário não é submetido para a API

  Scenario: Campo email obrigatório
    When o usuário tenta submeter o formulário com o campo email vazio
    Then uma mensagem de erro é exibida no campo email
    And o formulário não é submetido para a API

  # ---------------------------------------------------------------------------
  # Cenários de Erro — Credenciais Inválidas
  # ---------------------------------------------------------------------------

  Scenario: Login com senha incorreta
    When o usuário submete o formulário com email "joao@exemplo.com" e senha "senhaerrada"
    Then a API retorna status 401
    And o corpo da resposta contém código "INVALID_CREDENTIALS"
    And uma mensagem de erro geral é exibida no formulário
    And nenhum cookie de sessão é definido

  Scenario: Login com email não cadastrado
    When o usuário submete o formulário com email "naoexiste@exemplo.com" e senha "minhasenha123"
    Then a API retorna status 401
    And o corpo da resposta contém código "INVALID_CREDENTIALS"
    And a mensagem de erro não discrimina se o email ou a senha está errado

  Scenario: Login com payload malformado
    When uma requisição POST é enviada para "/api/auth/login" sem body JSON
    Then a API retorna status 400
    And o corpo da resposta contém código "VALIDATION_ERROR"

  # ---------------------------------------------------------------------------
  # Cenários de Segurança
  # ---------------------------------------------------------------------------

  Scenario: Cookie de sessão tem atributos de segurança corretos
    When o usuário faz login com credenciais válidas em ambiente de produção
    Then o cookie "session" é definido com atributo "HttpOnly"
    And o cookie "session" é definido com atributo "Secure"
    And o cookie "session" é definido com atributo "SameSite=Strict"
    And o cookie "session" expira em 86400 segundos

  Scenario: JWT contém apenas dados não sensíveis
    When o usuário faz login com credenciais válidas
    Then o JWT gerado contém "userId" e "email"
    And o JWT não contém o hash da senha nem dados pessoais adicionais
    And o JWT tem tempo de expiração de 24 horas
```

---

## Feature: Redirecionamento de Usuário Autenticado (UC-002)

```gherkin
Feature: Redirecionamento de Usuário Autenticado
  Como usuário já autenticado no Market App
  Quando tento acessar a página de login novamente
  Quero ser redirecionado para a página inicial
  Para não precisar fazer login duas vezes

  Background:
    Given que o usuário possui um cookie "session" com JWT válido

  Scenario: Usuário autenticado acessa /login e é redirecionado
    When o usuário navega para "/login"
    Then o middleware intercepta a requisição
    And o JWT no cookie é verificado com sucesso
    And o usuário é redirecionado com status 302 para "/"

  Scenario: Usuário com JWT expirado acessa /login não é redirecionado
    Given que o cookie "session" contém um JWT expirado
    When o usuário navega para "/login"
    Then o middleware não redireciona o usuário
    And a página de login é renderizada normalmente

  Scenario: Usuário com JWT inválido acessa /login não é redirecionado
    Given que o cookie "session" contém um JWT com assinatura inválida
    When o usuário navega para "/login"
    Then o middleware não redireciona o usuário
    And a página de login é renderizada normalmente

  Scenario: Usuário sem cookie acessa /login
    Given que o usuário não possui cookie "session"
    When o usuário navega para "/login"
    Then o middleware não tenta verificar nenhum JWT
    And a página de login é renderizada normalmente
```

---

## Feature: Proteção de Rotas Privadas (UC-003)

```gherkin
Feature: Proteção de Rotas Privadas
  Como sistema de segurança do Market App
  Quero garantir que apenas usuários autenticados acessem rotas protegidas
  Para proteger dados e funcionalidades sensíveis

  # Rotas protegidas configuradas: /dashboard, /profile, /orders

  Scenario Outline: Acesso a rota protegida sem autenticação redireciona para login
    Given que o usuário não possui cookie "session"
    When o usuário navega para "<rota>"
    Then o middleware redireciona com status 302 para "/login?redirect=<rota>"

    Examples:
      | rota        |
      | /dashboard  |
      | /profile    |
      | /orders     |

  Scenario Outline: Acesso a rota protegida com JWT válido é permitido
    Given que o usuário possui um cookie "session" com JWT válido
    When o usuário navega para "<rota>"
    Then o middleware permite o acesso
    And a requisição continua para o servidor Next.js

    Examples:
      | rota        |
      | /dashboard  |
      | /profile    |
      | /orders     |

  Scenario: Acesso a rota protegida com JWT expirado redireciona para login
    Given que o cookie "session" contém um JWT expirado
    When o usuário navega para "/dashboard"
    Then o middleware redireciona com status 302 para "/login?redirect=/dashboard"

  Scenario: Acesso a rota não protegida não requer autenticação
    Given que o usuário não possui cookie "session"
    When o usuário navega para "/"
    Then o middleware não verifica nenhum JWT
    And a requisição continua normalmente

  Scenario: Rotas de assets são sempre liberadas pelo middleware
    When o usuário faz requisição para "/_next/static/chunk.js"
    Then o middleware não processa a requisição
    And o arquivo estático é servido diretamente

  Scenario: URL de redirect é preservada com sub-caminho
    Given que o usuário não possui cookie "session"
    When o usuário navega para "/orders/123/details"
    Then o middleware redireciona para "/login?redirect=/orders/123/details"
```

---

## Feature: Value Objects de Domínio

```gherkin
Feature: Value Object Email
  Como módulo de domínio de autenticação
  Quero que o VO Email valide e normalize emails
  Para garantir consistência antes de qualquer operação

  Scenario: Email válido é criado e normalizado
    When Email.create("Usuario@EXEMPLO.com") é chamado
    Then um objeto Email é retornado com valor "usuario@exemplo.com"
    And o objeto é imutável (Object.freeze aplicado)

  Scenario: Email sem @ lança InvalidEmailError
    When Email.create("semaarroba.com") é chamado
    Then InvalidEmailError é lançado

  Scenario: Email sem domínio lança InvalidEmailError
    When Email.create("usuario@") é chamado
    Then InvalidEmailError é lançado

  Scenario: Email com espaços é normalizado
    When Email.create("  usuario@exemplo.com  ") é chamado
    Then um objeto Email é retornado com valor "usuario@exemplo.com"

  Scenario: Dois emails iguais são considerados equivalentes
    Given que emailA = Email.create("usuario@exemplo.com")
    And emailB = Email.create("USUARIO@EXEMPLO.COM")
    Then emailA.equals(emailB) retorna true


Feature: Value Object Password
  Como módulo de domínio de autenticação
  Quero que o VO Password valide comprimento de senhas
  Para garantir segurança antes de qualquer operação de hash

  Scenario: Senha com 8 caracteres (mínimo) é criada com sucesso
    When Password.create("12345678") é chamado
    Then um objeto Password é retornado

  Scenario: Senha com 72 caracteres (máximo bcrypt) é criada com sucesso
    When Password.create("<72 caracteres>") é chamado
    Then um objeto Password é retornado

  Scenario: Senha com 7 caracteres lança InvalidPasswordError
    When Password.create("1234567") é chamado
    Then InvalidPasswordError é lançado com mensagem indicando mínimo de 8 caracteres

  Scenario: Senha com 73 caracteres lança InvalidPasswordError
    When Password.create("<73 caracteres>") é chamado
    Then InvalidPasswordError é lançado com mensagem indicando máximo de 72 caracteres

  Scenario: matches() retorna true para senha e hash bcrypt correspondentes
    Given que password = Password.create("minhasenha123")
    And hash = bcrypt.hashSync("minhasenha123", 10)
    When password.matches(hash) é chamado
    Then o resultado é true

  Scenario: matches() retorna false para senha e hash bcrypt diferentes
    Given que password = Password.create("minhasenha123")
    And hash = bcrypt.hashSync("outrasenha456", 10)
    When password.matches(hash) é chamado
    Then o resultado é false
```

---

## Feature: Use Case AuthenticateUserUseCase

```gherkin
Feature: AuthenticateUserUseCase
  Como camada de aplicação
  Quero orquestrar a autenticação usando interfaces
  Para manter o Use Case independente de implementações concretas

  Background:
    Given que IUserRepository é injetado como mock
    And que ISessionService é injetado como mock

  Scenario: Execute com credenciais válidas retorna userId, email e token
    Given que o repositório retorna um usuário com hash compatível com a senha
    And que o sessionService.create retorna "jwt-token-mock"
    When useCase.execute({ email: "user@ex.com", password: "senha1234" }) é chamado
    Then o resultado contém { userId, email: "user@ex.com", sessionToken: "jwt-token-mock" }

  Scenario: Execute com email inválido lança InvalidEmailError antes de consultar repositório
    When useCase.execute({ email: "email-invalido", password: "senha1234" }) é chamado
    Then InvalidEmailError é lançado
    And o repositório não é consultado (findByEmail não é chamado)

  Scenario: Execute com senha muito curta lança InvalidPasswordError antes de consultar repositório
    When useCase.execute({ email: "user@ex.com", password: "123" }) é chamado
    Then InvalidPasswordError é lançado
    And o repositório não é consultado (findByEmail não é chamado)

  Scenario: Execute com email não encontrado lança InvalidCredentialsError
    Given que o repositório retorna null para o email informado
    When useCase.execute({ email: "novo@ex.com", password: "senha1234" }) é chamado
    Then InvalidCredentialsError é lançado

  Scenario: Execute com senha incorreta lança InvalidCredentialsError
    Given que o repositório retorna um usuário com hash incompatível com a senha
    When useCase.execute({ email: "user@ex.com", password: "senhaerrada" }) é chamado
    Then InvalidCredentialsError é lançado
    And sessionService.create não é chamado
```

---

## Mapeamento Cenários → Testes Implementados

| Cenário BDD                                    | Arquivo de Teste                              | Caso de Teste |
|------------------------------------------------|-----------------------------------------------|---------------|
| Email válido criado e normalizado              | `lib/auth/email.test.ts`                      | TC-001        |
| Email sem @ lança InvalidEmailError            | `lib/auth/email.test.ts`                      | TC-002        |
| Email com espaços é normalizado                | `lib/auth/email.test.ts`                      | TC-003        |
| Email sem domínio lança InvalidEmailError      | `lib/auth/email.test.ts`                      | TC-004        |
| Dois emails iguais são equivalentes            | `lib/auth/email.test.ts`                      | TC-005        |
| Email case insensitive equals                  | `lib/auth/email.test.ts`                      | TC-006, TC-007|
| Senha com 8 chars criada com sucesso           | `lib/auth/password.test.ts`                   | TC-001        |
| Senha com 7 chars lança InvalidPasswordError   | `lib/auth/password.test.ts`                   | TC-002        |
| Senha com 72 chars criada com sucesso          | `lib/auth/password.test.ts`                   | TC-003        |
| Senha com 73 chars lança InvalidPasswordError  | `lib/auth/password.test.ts`                   | TC-004        |
| matches() true para senha correta              | `lib/auth/password.test.ts`                   | TC-005        |
| matches() false para senha errada              | `lib/auth/password.test.ts`                   | TC-006, TC-007|
| Execute com credenciais válidas retorna token  | `services/user/authenticate-user.test.ts`     | TC-001        |
| Email inválido — repositório não consultado    | `services/user/authenticate-user.test.ts`     | TC-002        |
| Senha curta — repositório não consultado       | `services/user/authenticate-user.test.ts`     | TC-003        |
| Email não encontrado lança erro genérico       | `services/user/authenticate-user.test.ts`     | TC-004        |
| Senha incorreta lança erro genérico            | `services/user/authenticate-user.test.ts`     | TC-005        |
