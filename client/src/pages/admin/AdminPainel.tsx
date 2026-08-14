/**
 * Parcerias — Painel de Controle Editorial (ideas.md)
 * Visão do ADMINISTRADOR: visão global de Experts e Lançadores,
 * detalhe de ROMA/Avatar, triagem de aderência e propostas de match.
 * Estilo: regras hairline, labels mono uppercase, números-protagonistas.
 */
import { useState } from "react";
import { experts, lancadores, matches, getExpert, getLancador, getProjeto } from "@/lib/mockData";
import PainelLayout from "@/components/PainelLayout";
import {
  FotoPerfil,
  SeloAderencia,
  EstadoAcesso,
  Label,
  LinhaDado,
  InstagramHandle,
  BadgeStatus,
} from "@/components/Compartilhados";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Eye, Stamp, Users, Sparkles, Send, Check, X, Lock as LockIconLucide } from "lucide-react";
import { cn } from "@/lib/utils";

const usuarios = {
  admin: "Ana — Administradora",
  expert: "Marina Valle — Expert",
  lancador: "Juliana Ferreira — Lançadora",
};

export default function AdminPainel({ onTrocarPapel }: { onTrocarPapel: (p: "admin" | "expert" | "lancador") => void }) {
  const [pagina, setPagina] = useState("experts");
  const [detalheExpert, setDetalheExpert] = useState<string | null>(null);
  const [detalheLancador, setDetalheLancador] = useState<string | null>(null);
  const [matchSelecionado, setMatchSelecionado] = useState<string | null>(null);

  const match = matches.find((m) => m.id === matchSelecionado);
  const expertSel = matches.find((m) => m.id === matchSelecionado)
    ? getExpert(matches.find((m) => m.id === matchSelecionado)!.expertId)
    : null;
  const lancSel = match ? getLancador(match.lancadorId) : null;
  const projetoSel = match && expertSel ? getProjeto(expertSel.id, match.projetoId) : null;

  const pendentes = matches.filter((m) => m.status === "triagem");

  return (
    <PainelLayout
      papel="admin"
      onTrocarPapel={onTrocarPapel}
      nomeUsuario={usuarios.admin}
      paginaAtiva={pagina}
      onNavegar={setPagina}
      titulo={
        pagina === "experts" ? "Experts cadastrados" :
        pagina === "lancadores" ? "Lançadores cadastrados" :
        pagina === "triagem" ? "Triagem de Aderência" : "Propostas de Parceria"
      }
      subtitulo={
        pagina === "experts" ? "Visão global · ROMA e projetos de cada Expert" :
        pagina === "lancadores" ? "Visão global · Audiência, nicho e stage de cada Lançador" :
        pagina === "triagem" ? "Avalie a aderência entre a ROMA do Expert e o perfil do Lançador" :
        "Propostas criadas pela triagem e decisões dos Lançadores"
      }
    >
      {pagina === "experts" && (
        <section className="space-y-4 rise-in">
          {experts.map((e, i) => (
            <article
              key={e.id}
              className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow duration-200"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <FotoPerfil src={e.fotoUrl} alt={e.nome} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-semibold">{e.nome}</h2>
                  <BadgeStatus status={e.projetos[0]?.status ?? ""} />
                  <BadgeStatus status={e.acessoLiberado ? "aceita" : "triagem"} />
                </div>
                <p className="text-sm text-muted-foreground">{e.cargo} · {e.nivel}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <InstagramHandle handle={e.instagram} />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-display font-semibold text-foreground">{e.projetos[0]?.roma}</span>
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="shrink-0 gap-2 bg-card hover:bg-accent active:scale-[0.97] transition-all duration-150"
                onClick={() => setDetalheExpert(e.id)}
              >
                <Eye className="size-4" />
                Ver ROMA e projetos
              </Button>
            </article>
          ))}
        </section>
      )}

      {pagina === "lancadores" && (
        <section className="space-y-4 rise-in">
          {lancadores.map((l, i) => (
            <article
              key={l.id}
              className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <FotoPerfil src={l.fotoUrl} alt={l.nome} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-semibold">{l.nome}</h2>
                  <BadgeStatus status={l.stage} />
                  {l.buscandoExpert && <BadgeStatus status="proposta_enviada" />}
                </div>
                <p className="text-sm text-muted-foreground">{l.cargo} · {l.nicho}</p>
                <p className="text-sm mt-1.5">{l.audiencia}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <InstagramHandle handle={l.instagram} />
                  <span className="text-sm text-muted-foreground">{l.resultado}</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="shrink-0 gap-2 bg-card hover:bg-accent active:scale-[0.97] transition-all duration-150"
                onClick={() => setDetalheLancador(l.id)}
              >
                <Users className="size-4" />
                Ver perfil completo
              </Button>
            </article>
          ))}
        </section>
      )}

      {pagina === "triagem" && (
        <section className="space-y-4 rise-in">
          <div className="bg-accent/60 border border-border rounded-lg p-5 flex gap-3 items-start">
            <Sparkles className="size-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm">
              A triagem cruza a <strong>ROMA</strong> do Expert com a <strong>audiência, o nicho e o stage</strong> do
              Lançador. O score é uma sugestão do sistema; a decisão final é sua.
            </p>
          </div>
          {matches.map((m, i) => {
            const e = getExpert(m.expertId);
            const l = getLancador(m.lancadorId);
            if (!e || !l) return null;
            const eEmTriagem = m.status === "triagem";
            return (
              <article
                key={m.id}
                className={cn(
                  "bg-card border rounded-lg p-5",
                  eEmTriagem ? "border-primary/50 shadow-sm" : "border-border",
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <SeloAderencia score={m.score} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-semibold">{e.nome}</h3>
                      <span className="text-muted-foreground text-sm">× </span>
                      <h3 className="font-display text-base font-semibold">{l.nome}</h3>
                      <BadgeStatus status={m.status} />
                      {eEmTriagem && <span className="label-ed text-primary">Prioridade</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.justificativa}</p>
                    <p className="text-sm mt-1.5">
                      <Label className="mr-2">Roma do Expert</Label>
                      <span className="font-medium">{getProjeto(e.id, m.projetoId)?.roma}</span>
                    </p>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Button
                      size="sm"
                      className={cn("gap-1.5 active:scale-[0.97] transition-transform duration-150", eEmTriagem && "stamp-in")}
                      disabled={!eEmTriagem}
                      onClick={() => {
                        toast.success(`Match proposto entre ${e.nome} e ${l.nome}`, {
                          description: "Proposta enviada ao Lançador para aceite ou recusa.",
                        });
                        setMatchSelecionado(m.id);
                      }}
                    >
                      <Send className="size-3.5" />
                      Propor match
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 bg-card hover:bg-accent active:scale-[0.97] transition-all duration-150"
                      onClick={() => setMatchSelecionado(m.id)}
                    >
                      <Eye className="size-3.5" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {pagina === "matches" && (
        <section className="space-y-4 rise-in">
          {matches.map((m, i) => {
            const e = getExpert(m.expertId);
            const l = getLancador(m.lancadorId);
            if (!e || !l) return null;
            return (
              <article
                key={m.id}
                className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <SeloAderencia score={m.score} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold">{e.nome}</h3>
                    <span className="text-muted-foreground text-sm">×</span>
                    <h3 className="font-display text-base font-semibold">{l.nome}</h3>
                    <BadgeStatus status={m.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Criado em {m.criadoEm}{m.atualizadoEm ? ` · Atualizado em ${m.atualizadoEm}` : ""}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 gap-1.5 bg-card hover:bg-accent active:scale-[0.97] transition-all duration-150"
                  onClick={() => setMatchSelecionado(m.id)}
                >
                  <Eye className="size-3.5" />
                  Detalhes
                </Button>
              </article>
            );
          })}
        </section>
      )}

      {/* Detalhe do Expert */}
      <Dialog open={!!detalheExpert} onOpenChange={() => setDetalheExpert(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {detalheExpert && (() => {
            const e = getExpert(detalheExpert);
            if (!e) return null;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">{e.nome}</DialogTitle>
                  <DialogDescription>{e.cargo}</DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-4">
                  <FotoPerfil src={e.fotoUrl} alt={e.nome} size="lg" />
                  <div className="flex-1">
                    <InstagramHandle handle={e.instagram} />
                    <p className="text-sm text-muted-foreground mt-1">{e.nivel}</p>
                    <EstadoAcesso liberado={e.acessoLiberado} liberadoPorAdmin={e.liberadoPorAdmin} liberadoEm={e.liberadoEm} />
                  </div>
                </div>
                <p className="text-sm">{e.bio}</p>
                <div className="rule-double" />
                <Label className="mt-2">Projetos & ROMA</Label>
                {e.projetos.map((p) => (
                  <div key={p.id} className="mt-3 bg-secondary/60 rounded-md p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold">{p.nome}</span>
                      <BadgeStatus status={p.status} />
                    </div>
                    <p className="text-sm"><strong className="text-primary">ROMA:</strong> {p.roma}</p>
                    <LinhaDado rotulo="Avatar" valor={<span className="text-right block">{p.avatar.quem}</span>} />
                    {p.avatar.dores.map((d, i) => (
                      <p key={i} className="text-sm text-muted-foreground pl-3 border-l-2 border-border">
                        Dor: {d}
                      </p>
                    ))}
                    <LinhaDado rotulo="Ambição" valor={p.avatar.ambicao} />
                    <LinhaDado rotulo="Nicho" valor={p.nicho} />
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  {!e.acessoLiberado ? (
                    <Button
                      className="gap-2 flex-1 active:scale-[0.98] transition-transform duration-150"
                      onClick={() => {
                        toast.success(`Acesso liberado para ${e.nome}`, {
                          description: "O Expert agora pode ver os Lançadores disponíveis.",
                        });
                        setDetalheExpert(null);
                      }}
                    >
                      <Stamp className="size-4" />
                      Liberar acesso aos Lançadores
                    </Button>
                  ) : (
                    <Button variant="outline" className="gap-2 flex-1 bg-card hover:bg-accent">
                      <LockIcon />
                      Revogar acesso (demo)
                    </Button>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Detalhe do Lançador */}
      <Dialog open={!!detalheLancador} onOpenChange={() => setDetalheLancador(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {detalheLancador && (() => {
            const l = getLancador(detalheLancador);
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
                  <LinhaDado rotulo="Audiência" valor={l.audiencia} />
                  <LinhaDado rotulo="Stage" valor={l.stage} />
                  <LinhaDado rotulo="Buscando Expert" valor={l.buscandoExpert ? "Sim" : "Não"} />
                  <LinhaDado rotulo="Melhor resultado" valor={l.resultado} />
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Detalhe do Match */}
      <Dialog open={!!matchSelecionado} onOpenChange={() => setMatchSelecionado(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {match && expertSel && lancSel && projetoSel && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl flex items-center gap-3">
                  Proposta de Parceria
                  <SeloAderencia score={match.score} className="w-14 h-14" />
                </DialogTitle>
                <DialogDescription>{match.justificativa}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/60 rounded-md p-3">
                  <Label>Expert</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <FotoPerfil src={expertSel.fotoUrl} alt={expertSel.nome} size="sm" />
                    <div>
                      <p className="text-sm font-semibold">{expertSel.nome}</p>
                      <p className="text-xs text-muted-foreground">{expertSel.cargo}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary/60 rounded-md p-3">
                  <Label>Lançador</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <FotoPerfil src={lancSel.fotoUrl} alt={lancSel.nome} size="sm" />
                    <div>
                      <p className="text-sm font-semibold">{lancSel.nome}</p>
                      <p className="text-xs text-muted-foreground">{lancSel.cargo}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-md p-4">
                <Label>Projeto & ROMA</Label>
                <p className="font-display font-semibold mt-1">{projetoSel.nome}</p>
                <p className="text-sm mt-1"><strong className="text-primary">ROMA:</strong> {projetoSel.roma}</p>
                <p className="text-sm text-muted-foreground mt-2">Avatar: {projetoSel.avatar.quem}</p>
              </div>
              <div className="space-y-1">
                <LinhaDado rotulo="Criado em" valor={match.criadoEm} />
                <LinhaDado rotulo="Status" valor={<BadgeStatus status={match.status} />} />
              </div>
              <div className="flex gap-2">
                <Button className="gap-2 flex-1 active:scale-[0.98] transition-transform duration-150">
                  <Check className="size-4" />
                  Aprovar e notificar Lançador
                </Button>
                <Button variant="outline" className="gap-2 flex-1 bg-card hover:bg-accent">
                  <X className="size-4" />
                  Arquivar proposta
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PainelLayout>
  );
}

function LockIcon() {
  return <span className="inline-flex items-center gap-2"><LockIconLucide className="size-4" />Revogar acesso (demo)</span>;
}
