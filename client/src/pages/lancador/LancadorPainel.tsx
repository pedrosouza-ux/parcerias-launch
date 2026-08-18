/** Painel do Lançador — catálogo curado e interesses persistentes. */
import { useMemo, useState } from "react";
import PainelLayout from "@/components/PainelLayout";
import { BadgeStatus, Label } from "@/components/Compartilhados";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { CalendarClock, CheckCircle2, Filter, MapPin, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ModoVisualizacao } from "@/components/ModoVisualizacao";

const statusInteresse = { declared: "Interesse declarado", requested: "Em organização", confirmed: "Reunião confirmada", cancelled: "Cancelado", closed: "Encerrado" } as const;
type ItemInteresse = {
  interest: { id: number; status: keyof typeof statusInteresse };
  project: { id: number; name: string };
  meeting: { scheduledFor: Date; location: string } | null;
};

export default function LancadorPainel({ onTrocarPapel, modoVisualizacao = false }: { onTrocarPapel: (p: "admin" | "expert" | "lancador") => void; modoVisualizacao?: boolean }) {
  const [pagina, setPagina] = useState("projetos");
  const [busca, setBusca] = useState("");
  const [nicho, setNicho] = useState("Todos");
  const [detalhe, setDetalhe] = useState<number | null>(null);
  const catalogo = trpc.projects.catalog.useQuery(undefined, { retry: false, enabled: !modoVisualizacao });
  const reunioes = trpc.interests.mineAsLauncher.useQuery(undefined, { retry: false, enabled: !modoVisualizacao });
  const utils = trpc.useUtils();
  const declarar = trpc.interests.declare.useMutation({
    onSuccess: async () => { await utils.interests.mineAsLauncher.invalidate(); setDetalhe(null); toast.success("Interesse registrado", { description: "A operação recebeu seu pedido e organizará o próximo passo da Rodada." }); },
    onError: erro => toast.error("Não foi possível registrar o interesse", { description: erro.message }),
  });
  const listaInteresses = (reunioes.data ?? []) as ItemInteresse[];
  const nichos = ["Todos", ...Array.from(new Set(catalogo.data?.map(item => item.project.niche) ?? []))];
  const projetos = useMemo(() => (catalogo.data ?? []).filter(item => (nicho === "Todos" || item.project.niche === nicho) && `${item.project.name} ${item.project.niche} ${item.project.roma}`.toLocaleLowerCase().includes(busca.toLocaleLowerCase())), [catalogo.data, busca, nicho]);
  const interessePorProjeto = (projectId: number) => listaInteresses.find(item => item.project.id === projectId)?.interest;
  const itemDetalhado = catalogo.data?.find(item => item.project.id === detalhe) ?? null;

  return <PainelLayout papel="lancador" onTrocarPapel={onTrocarPapel} nomeUsuario={modoVisualizacao ? "Administrador" : "Lançador"} paginaAtiva={pagina} onNavegar={setPagina} modoVisualizacao={modoVisualizacao}
    titulo={pagina === "projetos" ? "Projetos disponíveis" : "Minhas reuniões"}
    subtitulo={pagina === "projetos" ? "Explore os projetos validados e escolha onde há potencial de parceria" : "Acompanhe seus interesses e os horários definidos pela operação"}>
      {modoVisualizacao ? <ModoVisualizacao perfil="Lançador" pagina={pagina} /> : <>{pagina === "projetos" && <section className="space-y-5 rise-in"><div className="bg-accent/50 border border-border rounded-lg p-5 flex gap-3"><Sparkles className="size-5 text-primary shrink-0" /><p className="text-sm">Este é um catálogo curado. Todos os projetos exibidos foram validados pela operação em <strong>Nicho, Avatar, ROMA e maturidade</strong>. A escolha de onde avançar é sua.</p></div><div className="flex flex-col md:flex-row gap-3"><label className="relative flex-1"><span className="sr-only">Buscar projetos elegíveis</span><Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" /><input type="search" value={busca} onChange={event => setBusca(event.target.value)} placeholder="Buscar por projeto, nicho ou ROMA" className="w-full min-h-11 pl-9 pr-3 bg-card border border-border rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label><label className="relative w-full md:w-auto"><span className="sr-only">Filtrar projetos por nicho</span><Filter className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" /><select value={nicho} onChange={event => setNicho(event.target.value)} className="min-h-11 w-full pl-9 pr-8 bg-card border border-border rounded-md text-sm appearance-none outline-none focus-visible:ring-2 focus-visible:ring-ring">{nichos.map(item => <option key={item}>{item}</option>)}</select></label></div><p className="label-ed" aria-live="polite">{projetos.length} projetos elegíveis</p>{catalogo.isLoading ? <EstadoVazio texto="Carregando projetos elegíveis…" /> : catalogo.isError ? <EstadoVazio texto="Não foi possível carregar o catálogo agora." /> : projetos.length === 0 ? <EstadoVazio texto="Nenhum projeto corresponde aos filtros selecionados." /> : <div className="grid xl:grid-cols-2 gap-4">{projetos.map((item, index) => { const { project } = item; const interesse = interessePorProjeto(project.id); return <article key={project.id} className="bg-card border border-border rounded-lg p-5 flex flex-col" style={{ animationDelay: `${index * 45}ms` }}><div className="flex justify-between gap-4"><div><Label>{project.niche}</Label><h3 className="font-display text-xl font-semibold mt-2">{project.name}</h3><p className="text-sm text-muted-foreground mt-1">Projeto curado para a Rodada de Parcerias</p></div>{interesse && <BadgeStatus status={statusInteresse[interesse.status]} />}</div><div className="mt-5 pt-4 border-t border-border"><Label>ROMA</Label><p className="text-base mt-1.5 font-medium">{project.roma}</p></div><div className="mt-4"><Label>Avatar</Label><p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{project.avatarDescription}</p></div><div className="mt-auto pt-5 flex flex-col min-[360px]:flex-row gap-2"><Button variant="outline" className="min-h-11 flex-1 bg-card hover:bg-accent" onClick={() => setDetalhe(project.id)}>Ver projeto</Button><Button className="min-h-11 flex-1" disabled={!!interesse || declarar.isPending} onClick={() => declarar.mutate({ projectId: project.id })}>{interesse ? "Interesse registrado" : "Tenho interesse"}</Button></div></article>; })}</div>}</section>}
      {pagina === "reunioes" && <section className="space-y-4 rise-in">{reunioes.isLoading ? <EstadoVazio texto="Carregando seus interesses…" /> : reunioes.isError ? <EstadoVazio texto="Não foi possível carregar suas reuniões." /> : listaInteresses.length === 0 ? <EstadoVazio texto="Você ainda não indicou interesse. Explore os projetos disponíveis para iniciar uma conversa." icone /> : listaInteresses.map(({ interest, project, meeting }) => <article key={interest.id} className="bg-card border border-border rounded-lg p-5 flex gap-4"><div className="size-11 shrink-0 rounded-md bg-primary/10 flex items-center justify-center"><CalendarClock className="size-5 text-primary" /></div><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-display font-semibold">{project.name}</h3><BadgeStatus status={statusInteresse[interest.status]} /></div>{meeting ? <p className="text-sm mt-2 flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" />{new Date(meeting.scheduledFor).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })} · {meeting.location}</p> : <p className="text-sm text-muted-foreground mt-2">Seu interesse foi encaminhado para a organização da Rodada.</p>}</div></article>)}</section>}
      </>}
    <Dialog open={!!itemDetalhado} onOpenChange={() => setDetalhe(null)}><DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">{itemDetalhado && (() => { const { project } = itemDetalhado; const interesse = interessePorProjeto(project.id); return <><DialogHeader><DialogTitle className="font-display text-xl">{project.name}</DialogTitle><DialogDescription>{project.niche} · Projeto curado para a Rodada de Parcerias</DialogDescription></DialogHeader><div><Label>ROMA</Label><p className="font-display text-xl mt-2">{project.roma}</p></div><div className="rule-double" /><div><Label>Avatar</Label><p className="text-sm mt-2">{project.avatarDescription}</p><div className="mt-3 space-y-1.5">{project.pains.map(dor => <p key={dor} className="text-sm text-muted-foreground pl-3 border-l-2 border-primary/40">Dor: {dor}</p>)}</div><p className="text-sm mt-3"><strong>Ambição:</strong> {project.ambition}</p></div><div><Label>Especialidades</Label><p className="text-sm mt-2">{project.specialties.join(" · ")}</p></div><Button className="w-full mt-2 gap-2" disabled={!!interesse || declarar.isPending} onClick={() => declarar.mutate({ projectId: project.id })}>{interesse ? <><CheckCircle2 className="size-4" />Interesse já registrado</> : "Tenho interesse neste projeto"}</Button></>; })()}</DialogContent></Dialog>
  </PainelLayout>;
}

function EstadoVazio({ texto, icone }: { texto: string; icone?: boolean }) { return <div className="bg-card border border-border rounded-lg p-8 text-center"><CalendarClock className={`size-7 mx-auto text-primary mb-2 ${icone ? "" : "hidden"}`} /><p className="text-sm text-muted-foreground">{texto}</p></div>; }
