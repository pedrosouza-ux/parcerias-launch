/**
 * Parcerias — "Estrada para Roma" (ideas.md v2)
 * Visão do EXPERT: acesso limitado — vê os próprios projetos e ROMA,
 * e os Lançadores apenas quando o administrador libera o acesso.
 */
import { useState } from "react";
import { experts, matches, lancadores, Match } from "@/lib/mockData";
import PainelLayout from "@/components/PainelLayout";
import {
  FotoPerfil,
  EstadoAcesso,
  Label,
  InstagramHandle,
  BadgeStatus,
} from "@/components/Compartilhados";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Send, Clock, CheckCircle2, XCircle, Lock } from "lucide-react";

const MEU_EXPERT_ID = "exp-1"; // Marina Valle no protótipo

const usuarios = {
  admin: "Ana — Administradora",
  expert: "Marina Valle — Expert",
  lancador: "Juliana Ferreira — Lançadora",
};

const statusLabels: Record<Match["status"], string> = {
  triagem: "Em análise do administrador",
  proposta_enviada: "Proposta enviada ao Lançador",
  aceita: "Parceria aceita",
  recusada: "Proposta recusada",
};

const statusIcons: Record<Match["status"], React.ReactNode> = {
  triagem: <Clock className="size-4 text-muted-foreground" />,
  proposta_enviada: <Send className="size-4 text-primary" />,
  aceita: <CheckCircle2 className="size-4 text-primary" />,
  recusada: <XCircle className="size-4 text-muted-foreground" />,
};

export default function ExpertPainel({ onTrocarPapel }: { onTrocarPapel: (p: "admin" | "expert" | "lancador") => void }) {
  const [pagina, setPagina] = useState("meus-projetos");
  const [detalheLancador, setDetalheLancador] = useState<string | null>(null);
  const expert = experts.find((e) => e.id === MEU_EXPERT_ID)!;
  const meusMatches = matches.filter((m) => m.expertId === expert.id);

  const lancadoresVisiveis = lancadores.filter((l) =>
    meusMatches.some((m) => m.lancadorId === l.id && m.status !== "recusada"),
  );

  return (
    <PainelLayout
      papel="expert"
      onTrocarPapel={onTrocarPapel}
      nomeUsuario={usuarios.expert}
      paginaAtiva={pagina}
      onNavegar={setPagina}
      titulo={
        pagina === "meus-projetos" ? "Meus Projetos & ROMA" :
        pagina === "lancadores" ? "Lançadores" : "Minhas Propostas"
      }
      subtitulo={
        pagina === "meus-projetos" ? "Edite sua ROMA e acompanhe o status dos seus projetos" :
        pagina === "lancadores" ? "Lançadores compatíveis com a sua ROMA" :
        "Acompanhe o andamento das propostas de parceria"
      }
    >
      {pagina === "meus-projetos" && (
        <section className="space-y-6 rise-in">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <FotoPerfil src={expert.fotoUrl} alt={expert.nome} size="lg" />
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold">{expert.nome}</h2>
                <p className="text-sm text-muted-foreground">{expert.cargo} · {expert.nivel}</p>
                <InstagramHandle handle={expert.instagram} />
              </div>
              <EstadoAcesso
                liberado={expert.acessoLiberado}
                liberadoPorAdmin={expert.liberadoPorAdmin}
                liberadoEm={expert.liberadoEm}
              />
            </div>
            <p className="text-sm mt-4 text-muted-foreground">{expert.bio}</p>
          </div>

          {expert.projetos.map((p) => (
            <article key={p.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-secondary/60 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <h3 className="font-display font-semibold">{p.nome}</h3>
                </div>
                <BadgeStatus status={p.status} />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <Label>ROMA — a transformação que o seu produto promove</Label>
                  <p className="font-display text-lg font-medium mt-1.5">{p.roma}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Avatar — seu cliente ideal</Label>
                    <p className="text-sm mt-1.5">{p.avatar.quem}</p>
                    <div className="mt-2 space-y-1.5">
                      {p.avatar.dores.map((d, i) => (
                        <p key={i} className="text-sm text-muted-foreground pl-3 border-l-2 border-primary/40">
                          Dor: {d}
                        </p>
                      ))}
                      <p className="text-sm font-medium">Ambição: {p.avatar.ambicao}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Detalhes do projeto</Label>
                    <p className="text-sm pt-1"><strong>Nicho:</strong> {p.nicho}</p>
                    <p className="text-sm"><strong>Status:</strong> {p.status}</p>
                    {p.resultadoAnterior && (
                      <p className="text-sm"><strong>Histórico:</strong> {p.resultadoAnterior}</p>
                    )}
                    <p className="text-sm"><strong>Especialidades:</strong> {p.especialidades.join(", ")}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {pagina === "lancadores" && (
        <section className="space-y-4 rise-in">
          {!expert.acessoLiberado && (
            <div className="bg-muted/60 border border-border rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Lock className="size-6 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <h3 className="font-display font-semibold">Acesso em análise</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No protótipo, a liberação acontece pelo botão{" "}
                  <strong>"Liberar acesso aos Lançadores"</strong> no perfil do Expert, dentro do painel do Administrador.
                  Enquanto isso, os Lançadores compatíveis com a sua ROMA ficam bloqueados.
                </p>
              </div>
              <Button
                variant="outline"
                className="shrink-0 bg-card hover:bg-accent active:scale-[0.97] transition-all duration-150"
                onClick={() => {
                  onTrocarPapel("admin");
                  toast.info("Navegando para o painel do Admin", {
                    description: "Liberar acesso ao Expert 'Dra. Marina Valle' na aba Experts.",
                  });
                }}
              >
                Ver como o Admin libera
              </Button>
            </div>
          )}

          {lancadoresVisiveis.length === 0 && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h3 className="font-display font-semibold">Nenhum Lançador compatível ainda</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Quando houver aderência entre a sua ROMA e o perfil de um Lançador, eles aparecerão aqui.
              </p>
            </div>
          )}

          {lancadoresVisiveis.map((l, i) => (
            <article key={l.id} className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ animationDelay: `${i * 40}ms` }}>
              <FotoPerfil src={l.fotoUrl} alt={l.nome} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-semibold">{l.nome}</h3>
                  <BadgeStatus status={l.stage} />
                </div>
                <p className="text-sm text-muted-foreground">{l.cargo} · {l.nicho}</p>
                <p className="text-sm mt-1.5">{l.audiencia}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <InstagramHandle handle={l.instagram} />
                  <span className="text-sm text-muted-foreground">{l.resultado}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 bg-card hover:bg-accent active:scale-[0.97] transition-all duration-150"
                onClick={() => setDetalheLancador(l.id)}
              >
                Ver perfil
              </Button>
            </article>
          ))}
        </section>
      )}

      {pagina === "propostas" && (
        <section className="space-y-4 rise-in">
          {meusMatches.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h3 className="font-display font-semibold">Nenhuma proposta ainda</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Propostas de parceria aparecem aqui quando o administrador cruza a sua ROMA com um Lançador.
              </p>
            </div>
          ) : (
            meusMatches.map((m, i) => {
              const l = lancadores.find((x) => x.id === m.lancadorId);
              if (!l) return null;
              return (
                <article key={m.id} className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-center gap-2 shrink-0">{statusIcons[m.status]}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold">
                      {l.nome} <span className="text-muted-foreground font-sans text-sm font-normal">· {l.cargo}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{statusLabels[m.status]}</p>
                    <p className="text-sm mt-1.5 line-clamp-2">{m.justificativa}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <BadgeStatus status={m.status} />
                    <span className="text-xs text-muted-foreground">Criada em {m.criadoEm}</span>
                  </div>
                </article>
              );
            })
          )}
        </section>
      )}

      <Dialog open={!!detalheLancador} onOpenChange={() => setDetalheLancador(null)}>
        <DialogContent className="max-w-lg">
          {detalheLancador && (() => {
            const l = lancadores.find((x) => x.id === detalheLancador);
            if (!l) return null;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">{l.nome}</DialogTitle>
                  <DialogDescription>{l.cargo}</DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-4">
                  <FotoPerfil src={l.fotoUrl} alt={l.nome} size="lg" />
                  <div className="flex-1">
                    <InstagramHandle handle={l.instagram} />
                    <p className="text-sm text-muted-foreground mt-1">{l.nicho}</p>
                    <BadgeStatus status={l.stage} />
                  </div>
                </div>
                <p className="text-sm">{l.bio}</p>
                <div className="rule-double" />
                <div className="space-y-1 mt-2">
                  <p className="label-ed mt-2">Audiência</p>
                  <p className="text-sm">{l.audiencia}</p>
                  <p className="label-ed mt-3">Stage</p>
                  <p className="text-sm">{l.stage}</p>
                  <p className="label-ed mt-3">Melhor resultado</p>
                  <p className="text-sm">{l.resultado}</p>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </PainelLayout>
  );
}
