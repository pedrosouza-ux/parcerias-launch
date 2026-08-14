/**
 * Parcerias — Painel de Controle Editorial (ideas.md)
 * Layout do painel: sidebar esquerda fixa (navegação por papel),
 * wordmark Fraunces com logo selo, labels mono uppercase, regras hairline.
 */
import { ReactNode } from "react";
import { Papel } from "@/lib/mockData";
import PapelSwitcher from "@/components/PapelSwitcher";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  contagem?: number;
}

const navegacao: Record<Papel, NavItem[]> = {
  admin: [
    { id: "experts", label: "Experts", contagem: 4 },
    { id: "lancadores", label: "Lançadores", contagem: 4 },
    { id: "triagem", label: "Triagem de Aderência", contagem: 1 },
    { id: "matches", label: "Propostas" },
  ],
  expert: [
    { id: "meus-projetos", label: "Meus Projetos & ROMA" },
    { id: "lancadores", label: "Lançadores" },
    { id: "propostas", label: "Minhas Propostas" },
  ],
  lancador: [
    { id: "experts", label: "Experts Sugeridos" },
    { id: "parcerias", label: "Minhas Parcerias" },
  ],
};

export function useNavegacao(papel: Papel) {
  return navegacao[papel];
}

interface PainelLayoutProps {
  papel: Papel;
  onTrocarPapel: (p: Papel) => void;
  nomeUsuario: string;
  paginaAtiva: string;
  onNavegar: (id: string) => void;
  children: ReactNode;
  titulo: string;
  subtitulo?: string;
}

export default function PainelLayout({
  papel,
  onTrocarPapel,
  nomeUsuario,
  paginaAtiva,
  onNavegar,
  children,
  titulo,
  subtitulo,
}: PainelLayoutProps) {
  const nav = navegacao[papel];
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar sticky top-0 h-screen">
        <div className="p-5 flex items-center gap-3">
          <img
            src="/manus-storage/parcerias-logo_e0f61586.png"
            alt="Parcerias"
            className="size-10"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-tight">Parcerias<span className="text-primary">.</span></span>
            <span className="label-ed mt-1.5">Painel de Curadoria</span>
          </div>
        </div>
        <div className="rule-double mx-5" />
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onNavegar(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-all duration-150 active:scale-[0.98]",
                paginaAtiva === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
              )}
              style={paginaAtiva === item.id ? { animationDelay: `${i * 40}ms` } : undefined}
            >
              <span>{item.label}</span>
              {item.contagem !== undefined && (
                <span
                  className={cn(
                    "font-mono text-xs font-semibold px-1.5 py-0.5 rounded-sm",
                    paginaAtiva === item.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {item.contagem}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="rule-double mx-5" />
        <div className="p-4">
          <p className="label-ed mb-1">Sessão</p>
          <p className="text-sm font-medium">{nomeUsuario}</p>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border px-5 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="font-display text-lg lg:text-xl font-semibold leading-tight">{titulo}</h1>
            {subtitulo && <p className="text-xs text-muted-foreground hidden sm:block">{subtitulo}</p>}
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <img src="/manus-storage/parcerias-logo_e0f61586.png" alt="Parcerias" className="size-8" />
          </div>
          <PapelSwitcher papel={papel} onTrocar={onTrocarPapel} nomeUsuario={nomeUsuario} />
        </header>

        {/* Navegação mobile */}
        <nav className="lg:hidden sticky top-16 z-10 bg-background border-b border-border overflow-x-auto">
          <div className="flex px-4 gap-1 py-2 min-w-max">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavegar(item.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors",
                  paginaAtiva === item.id
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent",
                )}
              >
                {item.label}
                {item.contagem !== undefined && <span className="ml-1.5 font-mono text-xs opacity-70">{item.contagem}</span>}
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-1 px-5 lg:px-8 py-6 lg:py-8 max-w-6xl w-full">{children}</main>

        <footer className="px-5 lg:px-8 py-5 border-t border-border">
          <p className="label-ed">
            Protótipo · Dados simulados para validação de fluxo · Parcerias
          </p>
        </footer>
      </div>
    </div>
  );
}
