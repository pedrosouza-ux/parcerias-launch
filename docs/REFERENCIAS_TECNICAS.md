# Referências técnicas de automação

## Runtime de ações do GitHub

Em agosto de 2026, a integração contínua foi atualizada para `pnpm/action-setup@v6`. A versão anterior emitia aviso porque executava sobre Node 20. A documentação oficial do `pnpm/action-setup` apresenta `@v6` como a versão corrente para pnpm 10 e anteriores, enquanto a orientação do GitHub indica que os consumidores devem manter as ações atualizadas para o runtime Node 24.

| Fonte | Uso no projeto |
|---|---|
| [pnpm/action-setup](https://github.com/pnpm/action-setup) | Referência oficial da ação de instalação do pnpm e de seu uso com pnpm 10. |
| [GitHub Actions: depreciação do Node 20](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/) | Fundamenta a atualização das ações para compatibilidade com Node 24. |

> A atualização deve ser comprovada na próxima execução remota da CI. O workflow mantém Node 22 para o projeto e atualiza somente a ação responsável por disponibilizar o pnpm.

## Evidência de execução

A execução `32404920949` da branch `main`, associada ao commit `2b9b664`, concluiu com sucesso após a atualização para `pnpm/action-setup@v6`. A verificação remota executou testes, TypeScript, auditoria de dependências e build sem emitir o aviso anterior de runtime Node 20.

As anotações do job `96541628450` foram consultadas pela API do GitHub após a execução e retornaram uma lista vazia (`[]`). Essa inspeção confirma objetivamente que o aviso de descontinuação do runtime Node 20 não voltou a ser emitido nessa versão.
