/**
 * Parcerias — Painel de Controle Editorial (ideas.md)
 * Componentes compartilhados: foto de perfil, selo de aderência (carimbo),
 * estado de acesso bloqueado/liberado, linhas de dado estilo jornal.
 */
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Lock, Unlock, Instagram } from "lucide-react";

export function FotoPerfil({ src, alt, size = "md" }: { src: string; alt: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "size-20" : size === "sm" ? "size-9" : "size-12";
  return (
    <img
      src={src}
      alt={alt}
      className={cn(dim, "rounded-full border-2 border-card shadow-sm object-cover shrink-0")}
    />
  );
}

/** Selo de aderência — elemento assinatura: número-protagonista em estilo carimbo */
export function SeloAderencia({ score, className }: { score: number; className?: string }) {
  const cor =
    score >= 80 ? "text-primary" : score >= 60 ? "text-[oklch(0.6_0.12_65)]" : "text-muted-foreground";
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-full border-2 border-dashed border-current w-16 h-16", cor, className)}
      style={{ borderColor: "currentColor" }}>
      <span className="font-display text-2xl font-bold leading-none">{score}</span>
      <span className="label-ed mt-0.5" style={{ color: "currentColor" }}>Aderência</span>
    </div>
  );
}

/** Estado de acesso do Expert aos Lançadores */
export function EstadoAcesso({ liberado, liberadoPorAdmin, liberadoEm }: {
  liberado: boolean;
  liberadoPorAdmin?: string;
  liberadoEm?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
        liberado ? "border-primary/40 bg-primary/5" : "border-border bg-muted/60",
      )}
    >
      {liberado ? <Unlock className="size-4 text-primary" /> : <Lock className="size-4 text-muted-foreground" />}
      <div className="flex flex-col">
        <span className={cn("font-semibold", liberado ? "text-primary" : "text-muted-foreground")}>
          {liberado ? "Acesso liberado" : "Aguardando triagem"}
        </span>
        {liberado ? (
          <span className="text-xs text-muted-foreground">
            Liberado por {liberadoPorAdmin} em {liberadoEm}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            O Expert não vê os Lançadores até a triagem do administrador
          </span>
        )}
      </div>
    </div>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("label-ed", className)}>{children}</span>;
}

export function LinhaDado({ rotulo, valor }: { rotulo: string; valor: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-border/60 last:border-b-0">
      <Label>{rotulo}</Label>
      <span className="text-sm font-medium text-right">{valor}</span>
    </div>
  );
}

export function InstagramHandle({ handle }: { handle: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Instagram className="size-3.5" />
      {handle}
    </span>
  );
}

export function BadgeStatus({ status }: { status: string }) {
  const estilos: Record<string, string> = {
    "Em preparação": "bg-muted text-muted-foreground",
    "Em andamento": "bg-accent text-accent-foreground",
    "Concluído": "bg-primary/10 text-primary",
    "Começando": "bg-muted text-muted-foreground",
    "Em crescimento": "bg-accent text-accent-foreground",
    "Experiente": "bg-primary/10 text-primary",
    "aceita": "bg-primary/10 text-primary",
    "recusada": "bg-muted text-muted-foreground",
    "triagem": "bg-accent text-accent-foreground",
    "proposta_enviada": "bg-primary/10 text-primary",
  };
  const labels: Record<string, string> = {
    "Em preparação": "Em preparação",
    "Em andamento": "Em andamento",
    "Concluído": "Concluído",
    "Começando": "Começando",
    "Em crescimento": "Em crescimento",
    "Experiente": "Experiente",
    "aceita": "Parceria aceita",
    "recusada": "Recusada",
    "triagem": "Em triagem",
    "proposta_enviada": "Proposta enviada",
  };
  return (
    <span className={cn("inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold", estilos[status] ?? "bg-muted text-muted-foreground")}>
      {labels[status] ?? status}
    </span>
  );
}
