---
allowed-tools: Bash(git branch:*), Bash(git fetch:*), Bash(git pull:*), Bash(git checkout:*), Bash(git merge:*), Bash(git status:*)
description: Atualizar a branch atual com as últimas alterações do repositório remoto
---

## Contexto

- Branch atual: `git branch --show-current`

## Instruções

1. Salve o nome da branch atual em uma variável.
2. Busque as últimas alterações do repositório remoto com `git fetch origin`.
3. Verifique se a branch atual é a 'main' ou 'master'.
4. Se for, simplesmente execute `git pull origin main` (ou `master`).
5. Se não for, execute os seguintes passos:
   a. Mude para a branch principal com `git checkout main` (ou `master`).
   b. Atualize a branch principal com `git pull origin main` (ou `master`).
   c. Volte para a branch original com `git checkout <nome-da-branch-original>`.
   d. Faça o merge da branch principal na branch atual com `git merge main` (ou `master`).
6. Execute `git status` para confirmar o sucesso da operação.

IMPORTANTE: Adapte os nomes da branch principal ('main' ou 'master') conforme a convenção do seu repositório.
