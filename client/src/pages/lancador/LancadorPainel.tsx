/**
 * Parcerias — Painel de Controle Editorial (ideas.md)
 * Visão do LANÇADOR: vê os Experts propostos em triagem,
 * decide (aceitar/recusar) e acompanha as parcerias formadas.
 */
import { useState } from "react";
import { experts, lancadores, matches, Match, getProjeto } from "@/lib/mockData";
import PainelLayout from "@/components/PainelLayout";
import {
  FotoPerfil,
  SeloAderencia,
  Label,
  LinhaDado,
  InstagramHandle,
  BadgeStatus,
} from "@/components/Compartilhados";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Handshake, UserRound, Check, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MEU_LANCADOR_ID = "lan-1"; // Juliana Ferreira no protótipo

const usuarios = {
  admin: "Ana — Administradora",
  expert: "Marina Valle — Expert",
  lancador: "Juliana Ferreira — Lançadora",
};

export default function LancadorPainel({ onTrocarPapel }: { onTrocarPapel: (p: "admin" | "expert" | "lancador") => void }) {
  const [pagina, setPagina] = useState("experts");
  const [detalhe, setDetalhe] = useState<string | null>(null);
  const [matchesLocais, setMatchesLocais] = useState<Match[]>(matches);
  const eu = lancadores.find((l) => l.id === MEU_LANCADOR_ID)!;

  const propostas = matchesLocais.filter((m) => m.lancadorId === eu.id && (m.status === "proposta_enviada" || m.status === "triagem"));
  const aceitas = matchesLocais.filter((m) => m.lancadorId === eu.id && m.status === "aceita");
  const recusadas = matchesLocais.filter((m) => m.lancadorId === eu.id && m.status === "recusada");

  const decidir = (matchId: string, aceita: boolean) => {
    setMatchesLocais((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, status: aceita ? "aceita" : "recusada", atualizadoEm: "14/08/2026" }
          : m,
      ),
    );
    const m = matchesLocais.find((x) => x.id === matchId);
    const e = m ? experts.find((x) => x.id === m.expertId) : null;
    toast.success(aceita ? "Parceria aceita!" : "Proposta recusada", {
      description: aceita
        ? `${e?.nome} foi notificado e a parceria entra em andamento.`
        : "O administrador foi notificado da sua decisão.",
    });
  };

  return (
    <PainelLayout
      papel="lancador"
      onTrocarPapel={onTrocarPapel}
      nomeUsuario={usuarios.lancador}
      paginaAtiva={pagina}
      onNavegar={setPagina}
      titulo={pagina === "experts" ? "Experts Sugeridos" : "Minhas Parcerias"}
      subtitulo={
        pagina === "experts" ? "Propostas aprovadas na triagem — a decisão final é sua" : "Parcerias formadas e em andamento"
      }
    >
      {pagina === "experts" && (
        <section className="space-y-4 rise-in">
          {propostas.length === 0 && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h3 className="font-display font-semibold">Nenhuma proposta pendente</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Quando um Expert com ROMA aderente à sua audiência for aprovado na triagem, a proposta aparece aqui.
              </p>
            </div>
          )}
          {propostas.map((m, i) => {
            const e = experts.find((x) => x.id === m.expertId);
            if (!e) return null;
            const p = getProjeto(e.id, m.projetoId);
            return (
              <article key={m.id} className="bg-card border border-border rounded-lg overflow-hidden" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <SeloAderencia score={m.score} />
                  <FotoPerfil src={e.fotoUrl} alt={e.nome} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">{e.nome}</h3>
                      <BadgeStatus status="proposta_enviada" />
                    </div>
                    <p className="text-sm text-muted-foreground">{e.cargo}</p>
                    <p className="text-sm mt-1">
                      <strong className="text-primary">ROMA:</strong> {p?.roma}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.justificativa}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" className="gap-1.5 active:scale-[0.97] transition-transform duration-150" onClick={() => decidir(m.id, true)}>
                      <Check className="size-3.5" />
                      Aceitar
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 bg-card hover:bg-accent active:scale-[0.97] transition-all duration-150" onClick={() => decidir(m.id, false)}>
                      <X className="size-3.5" />
                      Recusar
                    </Button>
                  </div>
                </div>
                <div className="px-5 pb-4 flex gap-2">
                  <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-foreground" onClick={() => setDetalhe(m.expertId)}>
                    <UserRound className="size-3.5" />
                    Ver perfil completo do Expert
                  </Button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {pagina === "parcerias" && (
        <section className="space-y-6 rise-in">
          {aceitas.length === 0 && recusadas.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h3 className="font-display font-semibold">Nenhuma parceria formada ainda</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Aceite uma proposta na aba "Experts Sugeridos" para formalizar a parceria.
              </p>
            </div>
          ) : (
            <>
              {aceitas.map((m, i) => {
                const e = experts.find((x) => x.id === m.expertId);
                if (!e) return null;
                const p = getProjeto(e.id, m.projetoId);
                return (
                  <article key={m.id} className="bg-card border border-primary/40 rounded-lg p-5" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <FotoPerfil src={e.fotoUrl} alt={e.nome} size="lg" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-semibold">{e.nome}</h3>
                          <BadgeStatus status="aceita" />
                        </div>
                        <p className="text-sm text-muted-foreground">{e.cargo} · {e.instagram}</p>
                        <p className="text-sm mt-1.5">
                          Projeto: <strong>{p?.nome}</strong> — <span className="text-primary font-medium">{p?.roma}</span>
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1.5 bg-card hover:bg-accent active:scale-[0.97] transition-all duration-150">
                        <MessageCircle className="size-3.5" />
                        Conversar sobre o lançamento
                      </Button>
                    </div>
                  </article>
                );
              })}
              {recusadas.length > 0 && (
                <>
                  <Label className="block mt-4">Decisões anteriores</Label>
                  {recusadas.map((m) => {
                    const e = experts.find((x) => x.id === m.expertId);
                    if (!e) return null;
                    return (
                      <div key={m.id} className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 rounded-md px-4 py-3">
                        <X className="size-4 shrink-0" />
                        <span>
                          Proposta de <strong className="text-foreground">{e.nome}</strong> recusada em {m.atualizadoEm}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </section>
      )}

      <Dialog open={!!detalhe} onOpenChange={() => setDetalhe(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {detalhe && (() => {
            const e = experts.find((x) => x.id === detalhe);
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
                  </div>
                </div>
                <p className="text-sm">{e.bio}</p>
                <div className="rule-double" />
                {e.projetos.map((p) => (
                  <div key={p.id} className="mt-3 bg-secondary/60 rounded-md p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold">{p.nome}</span>
                      <BadgeStatus status={p.status} />
                    </div>
                    <p className="text-sm"><strong className="text-primary">ROMA:</strong> {p.roma}</p>
                    <LinhaDado rotulo="Avatar" valor={<span className="text-right block">{p.avatar.quem}</span>} />
                    <LinhaDado rotulo="Ambição do Avatar" valor={p.avatar.ambicao} />
                    <LinhaDado rotulo="Nicho" valor={p.nicho} />
                  </div>
                ))}
                <Button
                  className="w-full gap-2 mt-4 active:scale-[0.98] transition-transform duration-150"
                  onClick={() => {
                    const match = matchesLocais.find((x) => x.expertId === e.id && x.lancadorId === eu.id);
                    if (match) {
                      decidir(match.id, true);
                      setDetalhe(null);
                    }
                  }}
                >
                  <Handshake className="size-4" />
                  Aceitar parceria com este Expert
                </Button>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </PainelLayout>
  );
}
