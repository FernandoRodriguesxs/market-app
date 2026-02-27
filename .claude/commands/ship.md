---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Bash(git push:*), Bash(git log:*)
description: Preparar todas as alterações, criar commit seguindo Conventional Commits e enviar para o remoto
---

## Contexto

- Status do repositório: `git status --short`
- Branch atual: `git branch --show-current`
- Commits recentes para referência de estilo: `git log --oneline -5`
- Alterações a serem commitadas: `git diff --stat`

## Instruções

1. Execute `git status` para ver todos os arquivos não rastreados e modificados
2. Execute `git diff` para ver alterações preparadas e não preparadas
3. Analise todas as alterações e elabore uma mensagem de commit seguindo o formato Conventional Commits:
   - `feat:` para novas funcionalidades
   - `fix:` para correções de bugs
   - `refactor:` para refatoração de código
   - `chore:` para tarefas de manutenção
   - `docs:` para alterações de documentação
4. Prepare todas as alterações com `git add -A`
5. Envie para o repositório remoto
6. Execute `git status` para confirmar o sucesso

IMPORTANTE: Siga as convenções de commit do CLAUDE.md. Use o formato HEREDOC para mensagens de commit.
