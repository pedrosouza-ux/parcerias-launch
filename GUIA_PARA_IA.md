# Sistema de Parcerias — Guia de Transferência

## Objetivo

Este repositório contém o protótipo web da **Central de Parcerias FL Insider**, concebida para apoiar a Rodada de Parcerias do Encontro Insider. A aplicação é um frontend estático em React 19, TypeScript, Vite e Tailwind CSS 4.

## Regra de negócio que orienta a interface

O produto **não é um sistema de match**. A operação administrativa avalia manualmente os projetos de Experts segundo Nicho, Avatar, ROMA e maturidade. Apenas projetos elegíveis entram no catálogo. Lançadores exploram livremente esse catálogo e registram interesse para que a equipe organize uma conversa presencial na Rodada de Parcerias.

| Papel | Acesso e responsabilidade |
|---|---|
| Administrador | Visualiza cadastros, executa triagem qualitativa e organiza reuniões. |
| Expert | Visualiza somente seu próprio projeto, ROMA, Avatar, status da triagem e agenda. Não visualiza Lançadores. |
| Lançador | Visualiza todos os projetos elegíveis, aplica filtros, consulta detalhes e declara interesse. |

O sistema não calcula score de compatibilidade, não sugere parceiros e não formaliza contratos.

## Como executar localmente

```bash
pnpm install
pnpm dev
```

Para a checagem de tipos:

```bash
pnpm run check
```

## Estrutura importante

| Caminho | Conteúdo |
|---|---|
| `client/src/pages/Home.tsx` | Landing e explicação do fluxo validado. |
| `client/src/pages/admin/AdminPainel.tsx` | Cadastro, triagem manual e agenda administrativa. |
| `client/src/pages/expert/ExpertPainel.tsx` | Visão restrita do Expert. |
| `client/src/pages/lancador/LancadorPainel.tsx` | Catálogo curado e interesse em reunião. |
| `client/src/lib/mockData.ts` | Domínio e dados simulados atuais. |
| `client/src/components/Compartilhados.tsx` | Badges, checklist e componentes de status. |
| `client/src/index.css` | Tokens e tema visual oficial Insider. |
| `ideas.md` | Direção de design adotada. |
| `todo.md` | Histórico resumido das entregas e tarefas. |

## Identidade visual e ativos

A pasta `identidade-visual/` do pacote contém o manual e os arquivos oficiais enviados pelo usuário. A paleta principal aplicada utiliza azul-marinho `#1E2241`, com as fontes Alexandria (títulos) e Roboto (textos). Alguns ativos de logo são referenciados no código por URLs de armazenamento gerenciado; os originais também acompanham o pacote.

## Documentação complementar

Na pasta `documentacao/` estão a regra de negócio consolidada e a análise de impacto que justificam o fluxo atual. Use esses documentos como fonte de verdade antes de alterar a aplicação.
