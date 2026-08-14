# Parcerias — Matching de Experts e Lançadores
## Brainstorm de Design

## Três abordagens estilísticas

### 1. "Painel de Controle Editorial" (Escolhida)
Estética de painel interno premium com personalidade editorial: fundo claro quente, tipografia serifada de exibição forte, regras finas e terminologia própria do ecossistema (Roma, Avatar, Lançamento). Emocional: confiança, curadoria humana, sofisticação.
**Probabilidade:** 0.06

### 2. "Cartas de Baralho" (Match visual)
Inspirado em cartas de pôquer/baralho — cada perfil como uma "carta" física com textura, cantos e tipografia de carta de jogo. Aderência desenhada como um match de cartas. Emocional: lúdico, tátil.
**Probabilidade:** 0.04

### 3. "Terminal Noturno de Bastidores"
Dark mode com acento âmbar/neon, sensação de sala de controle/backstage de lançamento. Emocional: bastidor, urgência.
**Probabilidade:** 0.03

## Abordagem escolhida: "Painel de Controle Editorial"

- **Design Movement:** Editorial/Editorial-brutalist suave — mistura de painéis administrativos suíços com revistas impressas premium. Referência: dashboards editoriais do FT/The Economist, mas em ferramenta interna.
- **Core Principles:**
  1. Regras finas (hairlines) organizam a informação — divisórias funcionam como pauta de revista, não decoração.
  2. Números e métricas tratados como manchetes — "aderência 87%" é o protagonista visual de cada match.
  3. Terminologia do ecossistema (Roma, Avatar, Lançamento) aparece como labels tipográficos, em caixa alta com tracking largo.
  4. Um acento de cor único e quente (terracota/vermelho-selo) para ações e status — o resto é neutro quente.
- **Color Philosophy:** Fundo marfim quente (#FAF7F2 aprox., oklch ~0.975) evoca papel de revista e confiança editorial; tinta quase-preta quente para texto; acento **vermelho-selo (terracota #C2493A aprox.)** — remete ao "carimbo" de aprovação/curadoria, cor de marca de lançamentos brasileiros (energia, ação). Nenhum azul corporativo, nenhum roxo.
- **Layout Paradigm:** Sidebar esquerda fixa (navegação por papel) + conteúdo em "pautas editoriais": listas com regras hairline, coluna de dados forte à direita, cards assimétricos. Nada de grid centrado uniforme.
- **Signature Elements:**
  1. "Selo de aderência" — círculo/roseta com número grande de score, estilo carimbo.
  2. Labels em caixa alta com tracking largo ("ROMA", "AVATAR", "TRIAGEM") em fonte mono ou serifada small-caps.
  3. Regra horizontal dupla (double rule) estilo jornal separando seções.
- **Interaction Philosophy:** Decisões de curadoria com peso: botões de triagem (liberar acesso / propor match) têm estado claro e micro-feedback de "carimbo". Troca de papel (Admin/Expert/Lançador) via seletor no topo da sidebar, simulando login.
- **Animation:** Entradas com fade+rise sutil (≤250ms, ease-out), stagger de 40ms em listas; hover em linhas com deslocamento de fundo marfim→canela claro; sem animações chamativas em decisões críticas.
- **Typography System:** Display: "Fraunces" (serif quente e característica) para títulos e números-protagonistas; Body: "Archivo" (sans neutra); Dados/labels: "Archivo" 600 uppercase tracking-wide ou mono "IBM Plex Mono" para scores. Hierarquia: H1 Fraunces 600, H2 Fraunces 500, labels mono uppercase 11-12px.
- **Brand Essence:** Painel de curadoria de parcerias para o mundo dos lançamentos — conecta Experts e Lançadores com o rigor de uma redação. Adjetivos: criterioso, quente, editorial.
- **Brand Voice:** Direto, vernáculo do ecossistema. Ex.: "Triagem em dia — 12 Romas aguardando avaliação." / "Liberar acesso? Este Expert atende à Roma do Lançador."
- **Wordmark & Logo:** Wordmark "Parcerias" em Fraunces com "P." precedendo; símbolo: duas setas circulares formando um "match" como um selo/carimbo, em terracota.
- **Signature Brand Color:** Vermelho-selo (terracota) — oklch(0.55 0.15 25) aprox.

## Estrutura de telas (baseada no doc de requisitos)
- Landing/seletor de papel (Admin · Expert · Lançador) para o protótipo
- Admin: visão global (tab Experts / tab Lançadores), detalhe do Expert com ROMA, triagem com score de aderência sugerido + decisão manual, propostas de match pendentes
- Expert: meus projetos (com ROMA), Lançadores (bloqueados até liberação do admin — estado "Acesso liberado" vs "Aguardando triagem"), propostas recebidas
- Lançador: perfis de Experts propostos, aceitar/recusar parceria, parceria ativa

## Style Decisions
(nada ainda)
