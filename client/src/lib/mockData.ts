/**
 * Dados simulados do protótipo "Parcerias — Matching de Experts e Lançadores".
 * Estilo editorial (ideas.md): dados estruturados por ROMA/Avatar para
 * permitir triagem e score de aderência no painel do admin.
 */

export type Papel = "admin" | "expert" | "lancador";

export interface Avatar {
  /** Quem é o cliente ideal */
  quem: string;
  /** Dores principais */
  dores: string[];
  /** Ambição / transformação buscada */
  ambicao: string;
}

export interface Projeto {
  id: string;
  nome: string;
  nicho: string;
  /** ROMA: a transformação que o produto promete na vida do Avatar */
  roma: string;
  avatar: Avatar;
  /** Especialidades do Expert neste projeto */
  especialidades: string[];
  /** Resultado anterior ou status */
  status: "Em preparação" | "Em andamento" | "Concluído";
  resultadoAnterior?: string;
}

export interface Expert {
  id: string;
  nome: string;
  cargo: string;
  bio: string;
  fotoUrl: string;
  instagram: string;
  especialidadesGerais: string[];
  nivel: string;
  projetos: Projeto[];
  /** Acesso liberado pelo admin após triagem */
  acessoLiberado: boolean;
  liberadoPorAdmin?: string;
  liberadoEm?: string;
  historicoLancamentos: number;
}

export interface Lancador {
  id: string;
  nome: string;
  cargo: string;
  bio: string;
  fotoUrl: string;
  instagram: string;
  /** Nicho em que atua / nicho da audiência */
  nicho: string;
  /** Perfil da audiência que o Lançador possui ou quer construir */
  audiencia: string;
  /** Momento do lançamento */
  stage: "Começando" | "Em crescimento" | "Experiente";
  /** Situação atual: está buscando um Expert? */
  buscandoExpert: boolean;
  /** Resultado do melhor lançamento */
  resultado: string;
}

export type StatusMatch =
  | "triagem" // proposta criada pelo admin, aguardando
  | "proposta_enviada" // lançador pode ver e decidir
  | "aceita"
  | "recusada";

export interface Match {
  id: string;
  expertId: string;
  lancadorId: string;
  projetoId: string;
  /** Score de aderência entre a ROMA do Expert e o perfil do Lançador */
  score: number;
  justificativa: string;
  status: StatusMatch;
  criadoEm: string;
  atualizadoEm?: string;
}

export const experts: Expert[] = [
  {
    id: "exp-1",
    nome: "Dra. Marina Valle",
    cargo: "Nutricionista Funcional",
    bio: "Há 9 anos ajudando mulheres a transformar a relação com a comida e com o corpo, com foco em metabolismo e hábitos sustentáveis.",
    fotoUrl: "https://i.pravatar.cc/300?img=47",
    instagram: "@drmarinavalle",
    especialidadesGerais: ["Nutrição", "Saúde feminina", "Emagrecimento"],
    nivel: "Expert — 3 lançamentos concluídos",
    historicoLancamentos: 3,
    projetos: [
      {
        id: "exp-1-proj-1",
        nome: "Método Corpo Leve",
        nicho: "Saúde e Bem-estar",
        roma: "Emagrecer de forma definitiva comendo o que ama",
        avatar: {
          quem: "Mulheres de 30 a 50 anos, que já tentaram várias dietas restritivas e voltam a engordar",
          dores: ["Efeito sanfona", "Culpa ao comer", "Metabolismo lento percebido"],
          ambicao: "Perder peso sem abrir mão do prazer de comer e da vida social",
        },
        especialidades: ["Nutrição comportamental", "Reeducação alimentar"],
        status: "Em preparação",
      },
    ],
    acessoLiberado: false,
  },
  {
    id: "exp-2",
    nome: "Rafael Borges",
    cargo: "Especialista em Finanças Pessoais",
    bio: "Ex-executivo de banco que hoje ensina famílias a sair das dívidas e construir patrimônio com método e disciplina.",
    fotoUrl: "https://i.pravatar.cc/300?img=12",
    instagram: "@rafaelborgesfin",
    especialidadesGerais: ["Finanças", "Investimentos", "Organização financeira"],
    nivel: "Expert — 5 lançamentos concluídos",
    historicoLancamentos: 5,
    projetos: [
      {
        id: "exp-2-proj-1",
        nome: "Organiza + Patrimônio",
        nicho: "Finanças",
        roma: "Sair das dívidas e acumular os primeiros R$ 100 mil investidos",
        avatar: {
          quem: "Casais e profissionais de 28 a 45 anos endividados no cartão, que sentem vergonha da própria situação financeira",
          dores: ["Dívidas no cartão e cheque especial", "Vergonha de falar de dinheiro", "Sensação de nunca sair do lugar"],
          ambicao: "Ter controle do dinheiro e construir patrimônio com segurança",
        },
        especialidades: ["Sair das dívidas", "Investimentos para iniciantes"],
        status: "Em andamento",
        resultadoAnterior: "Lançamento anterior: R$ 312 mil em 7 dias",
      },
    ],
    acessoLiberado: true,
    liberadoPorAdmin: "Ana (Admin)",
    liberadoEm: "10/08/2026",
  },
  {
    id: "exp-3",
    nome: "Camila Duarte",
    cargo: "Mentora de Maternidade",
    bio: "Psicóloga perinatal, dedica-se a transformar o puerpério em uma fase de vínculo e não de sobrevivência.",
    fotoUrl: "https://i.pravatar.cc/300?img=44",
    instagram: "@camiladuarte.mente",
    especialidadesGerais: ["Maternidade", "Saúde mental", "Puerpério"],
    nivel: "Expert — 1 lançamento concluído",
    historicoLancamentos: 1,
    projetos: [
      {
        id: "exp-3-proj-1",
        nome: "Maternidade Serena",
        nicho: "Maternidade",
        roma: "Viver os primeiros meses do bebê com serenidade em vez de culpa e exaustão",
        avatar: {
          quem: "Mães de primeira viagem, de 25 a 38 anos, que se sentem sobrecarregadas e cobradas pela maternidade perfeita",
          dores: ["Exaustão física e emocional", "Culpa por não dar conta", "Sensação de solidão no puerpério"],
          ambicao: "Se sentir tranquila, confiante e presente com o bebê",
        },
        especialidades: ["Puerpério", "Vínculo mãe-bebê", "Saúde mental materna"],
        status: "Em preparação",
      },
    ],
    acessoLiberado: false,
  },
  {
    id: "exp-4",
    nome: "Thiago Mendes",
    cargo: "Treinador de Performance Masculina",
    bio: "Prepara homens de 35+ para retomar energia, foco e disposição usando ciência do sono, treino e testosterona natural.",
    fotoUrl: "https://i.pravatar.cc/300?img=15",
    instagram: "@thiagomendes.fit",
    especialidadesGerais: ["Performance", "Saúde masculina", "Hábitos"],
    nivel: "Expert — 2 lançamentos concluídos",
    historicoLancamentos: 2,
    projetos: [
      {
        id: "exp-4-proj-1",
        nome: "Protocolo Vitalidade 35+",
        nicho: "Saúde e Performance",
        roma: "Recuperar a energia e a disposição dos 25 anos depois dos 35",
        avatar: {
          quem: "Homens de 35 a 55 anos, executivos e empresários, com cansaço crônico, sono ruim e queda de disposição",
          dores: ["Cansaço crônico", "Sono fragmentado", "Sensação de envelhecer antes do tempo"],
          ambicao: "Voltar a ter energia, foco e presença na família e no trabalho",
        },
        especialidades: ["Sono", "Hormônios naturais", "Treino eficiente"],
        status: "Concluído",
        resultadoAnterior: "Lançamento anterior: R$ 87 mil em 7 dias",
      },
    ],
    acessoLiberado: true,
    liberadoPorAdmin: "Ana (Admin)",
    liberadoEm: "09/08/2026",
  },
];

export const lancadores: Lancador[] = [
  {
    id: "lan-1",
    nome: "Juliana Ferreira",
    cargo: "Lançadora — Saúde e Bem-estar",
    bio: "Construiu audiência de 180 mil seguidores no Instagram falando de autocuidado feminino. Preparando o primeiro lançamento no nicho de emagrecimento.",
    fotoUrl: "https://i.pravatar.cc/300?img=26",
    instagram: "@juhferreira.bem",
    nicho: "Saúde e Bem-estar feminino",
    audiencia: "Mulheres de 28 a 48 anos, interessadas em autocuidado, estética e qualidade de vida",
    stage: "Começando",
    buscandoExpert: true,
    resultado: "Ainda sem lançamento",
  },
  {
    id: "lan-2",
    nome: "Pedro Almeida",
    cargo: "Lançador — Finanças",
    bio: "Audiência de 95 mil seguidores engajados em conteúdo de dinheiro. Já fez um lançamento com outro expert, faturou R$ 41 mil.",
    fotoUrl: "https://i.pravatar.cc/300?img=33",
    instagram: "@pedroalmeidadin",
    nicho: "Finanças pessoais",
    audiencia: "Homens e casais de 28 a 45 anos, endividados ou iniciantes em investimentos",
    stage: "Em crescimento",
    buscandoExpert: true,
    resultado: "R$ 41 mil no último lançamento",
  },
  {
    id: "lan-3",
    nome: "Beatriz Nogueira",
    cargo: "Lançadora — Maternidade",
    bio: "Mãe de três, audiência de 310 mil seguidoras no nicho de maternidade real. Quer lançar um produto de transformação junto a uma expert.",
    fotoUrl: "https://i.pravatar.cc/300?img=32",
    instagram: "@bea.nogueira.mae",
    nicho: "Maternidade",
    audiencia: "Mães de 24 a 40 anos, que consomem conteúdo sobre criação real e sem filtros",
    stage: "Experiente",
    buscandoExpert: true,
    resultado: "R$ 214 mil no último lançamento",
  },
  {
    id: "lan-4",
    nome: "Lucas Prado",
    cargo: "Lançador — Performance",
    bio: "Audência de 60 mil seguidores no nicho de alta performance para executivos. Busca expert com autoridade científica.",
    fotoUrl: "https://i.pravatar.cc/300?img=53",
    instagram: "@lucasprado.hp",
    nicho: "Alta performance",
    audiencia: "Homens executivos e empresários de 32 a 55 anos, que buscam otimização de vida",
    stage: "Experiente",
    buscandoExpert: true,
    resultado: "R$ 156 mil no último lançamento",
  },
];

export const matches: Match[] = [
  {
    id: "mat-1",
    expertId: "exp-2",
    lancadorId: "lan-2",
    projetoId: "exp-2-proj-1",
    score: 91,
    justificativa:
      "A ROMA de Rafael (sair das dívidas e acumular R$ 100 mil) conversa diretamente com a audiência de Pedro: casais e profissionais endividados. Nicho idêntico, stage compatível e histórico comprovado de lançamento.",
    status: "aceita",
    criadoEm: "07/08/2026",
    atualizadoEm: "08/08/2026",
  },
  {
    id: "mat-2",
    expertId: "exp-1",
    lancadorId: "lan-1",
    projetoId: "exp-1-proj-1",
    score: 88,
    justificativa:
      "A ROMA de Marina (emagrecer comendo o que ama) é altamente aderente à audiência de Juliana (mulheres 28-48, autocuidado). Avatar praticamente idêntico; falta apenas alinhar o cronograma de lançamento.",
    status: "proposta_enviada",
    criadoEm: "12/08/2026",
  },
  {
    id: "mat-3",
    expertId: "exp-3",
    lancadorId: "lan-3",
    projetoId: "exp-3-proj-1",
    score: 94,
    justificativa:
      "Aderência máxima: a ROMA de Camila (serenidade no puerpério) fala a língua exata da audiência de Beatriz (maternidade real, sem culpa). Audiência de 310 mil seguidoras amplifica um expert iniciante.",
    status: "triagem",
    criadoEm: "13/08/2026",
  },
  {
    id: "mat-4",
    expertId: "exp-4",
    lancadorId: "lan-4",
    projetoId: "exp-4-proj-1",
    score: 85,
    justificativa:
      "A ROMA de Thiago (energia dos 25 anos depois dos 35) casa com o público executivo de Lucas. Ponto de atenção: o lançamento de Thiago já foi realizado uma vez — definir se será relançamento ou novo formato.",
    status: "proposta_enviada",
    criadoEm: "11/08/2026",
  },
  {
    id: "mat-5",
    expertId: "exp-4",
    lancadorId: "lan-2",
    projetoId: "exp-4-proj-1",
    score: 32,
    justificativa:
      "Aderência baixa: a audiência de Pedro é focada em finanças, não em performance masculina. Nichos divergentes — não recomendado.",
    status: "recusada",
    criadoEm: "08/08/2026",
    atualizadoEm: "09/08/2026",
  },
];

/** Simula um match "em aberto": Expert de acesso liberado ainda não pareado */
export const matchAberto = {
  expertId: "exp-4",
  lancadorId: "lan-3",
};

export function getExpert(id: string) {
  return experts.find((e) => e.id === id);
}

export function getLancador(id: string) {
  return lancadores.find((l) => l.id === id);
}

export function getProjeto(expertId: string, projetoId: string) {
  return getExpert(expertId)?.projetos.find((p) => p.id === projetoId);
}
