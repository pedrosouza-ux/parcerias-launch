/**
 * Parcerias FL Insider — sidebar neutra, alto contraste e hierarquia operacional.
 */
import { ReactNode } from "react";
import { Papel } from "@/lib/mockData";
import PapelSwitcher from "@/components/PapelSwitcher";
import { LogoInsider } from "@/components/LogoInsider";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    { id: "triagem", label: "Triagem manual", contagem: 1 },
    { id: "agenda", label: "Reuniões" },
    { id: "fluxo", label: "Fluxo BPMN" },
  ],
  expert: [
    { id: "meu-projeto", label: "Meu projeto" },
    { id: "cadastro", label: "Cadastro do projeto" },
    { id: "reunioes", label: "Minhas reuniões" },
  ],
  lancador: [
    { id: "projetos", label: "Projetos disponíveis" },
    { id: "reunioes", label: "Minhas reuniões" },
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
      <aside className="sidebar-shell hidden lg:flex w-64 shrink-0 flex-col sticky top-0 h-screen">
        <div className="sidebar-brand p-6 pb-5 flex items-center">
          <LogoInsider className="sidebar-logo" />
        </div>
        <div className="sidebar-divider mx-5" />
        <nav className="flex-1 px-3 py-5 space-y-1">
          {nav.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onNavegar(item.id)}
              className={cn(
                "sidebar-nav-item w-full flex items-center justify-between px-3 py-2.5 text-sm transition-all duration-150 active:scale-[0.98]",
                paginaAtiva === item.id
                  ? "sidebar-nav-active font-semibold"
                  : "sidebar-nav-idle",
              )}
              style={paginaAtiva === item.id ? { animationDelay: `${i * 40}ms` } : undefined}
            >
              <span>{item.label}</span>
              {item.contagem !== undefined && (
                <span
                  className={cn(
                    "sidebar-count font-mono text-xs font-semibold px-1.5 py-0.5",
                    paginaAtiva === item.id ? "sidebar-count-active" : "sidebar-count-idle",
                  )}
                >
                  {item.contagem}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-divider mx-5" />
        <div className="sidebar-session m-3 mt-4 p-3.5">
          <p className="sidebar-session-label mb-1.5">Sessão ativa</p>
          <p className="sidebar-session-name">{nomeUsuario}</p>
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
            <LogoInsider compact />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <PapelSwitcher papel={papel} onTrocar={onTrocarPapel} nomeUsuario={nomeUsuario} />
          </div>
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
