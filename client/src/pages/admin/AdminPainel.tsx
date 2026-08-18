/** Painel Administrador — FL Insider v4: validação, triagem manual e agenda. */
import { useMemo, useState } from "react";
import { experts, interesses, lancadores, getExpert, getLancador, StatusProjeto } from "@/lib/mockData";
import PainelLayout from "@/components/PainelLayout";
import { BadgeStatus, ChecklistTriagem, FotoPerfil, InstagramHandle, Label, LinhaDado } from "@/components/Compartilhados";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarClock, CheckCircle2, ClipboardCheck, Eye, MapPin, UsersRound, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import FluxoBpmn from "@/components/FluxoBpmn";

const usuarios = { admin: "Ana — Administradora", expert: "Marina Valle — Expert", lancador: "Juliana Ferreira — Lançadora" };

export default function AdminPainel({ onTrocarPapel }: { onTrocarPapel: (p: "admin" | "expert" | "lancador") => void }) {
  const [pagina, setPagina] = useState(() => new URLSearchParams(window.location.search).get("area") === "fluxo" ? "fluxo" : "experts");
  const [detalheExpert, setDetalheExpert] = useState<string | null>(null);
  const [detalheLancador, setDetalheLancador] = useState<string | null>(null);
  const [decisoes, setDecisoes] = useState<Record<string, StatusProjeto>>({});
  const emTriagem = useMemo(() => experts.filter((expert) => (decisoes[expert.id] ?? expert.projeto.status) === "Em triagem"), [decisoes]);
  const statusProjeto = (expertId: string, base: StatusProjeto) => decisoes[expertId] ?? base;

  const decidirTriagem = (expertId: string, status: "Elegível para catálogo" | "Não elegível") => {
    setDecisoes((atual) => ({ ...atual, [expertId]: status }));
    toast.success(status === "Elegível para catálogo" ? "Projeto publicado no catálogo" : "Projeto marcado como não elegível", {
      description: "A decisão da triagem manual foi registrada no protótipo.",
    });
  };

  return <PainelLayout papel="admin" onTrocarPapel={onTrocarPapel} nomeUsuario={usuarios.admin} paginaAtiva={pagina} onNavegar={setPagina}
    titulo={pagina === "experts" ? "Experts cadastrados" : pagina === "lancadores" ? "Lançadores cadastrados" : pagina === "triagem" ? "Triagem manual" : pagina === "agenda" ? "Reuniões da Rodada" : "Fluxo operacional BPMN"}
    subtitulo={pagina === "experts" ? "Valide diagnóstico, projeto e status de catálogo" : pagina === "lancadores" ? "Confirme consultoria LEOA e os dados de participação" : pagina === "triagem" ? "Avalie Nicho, Avatar, ROMA e maturidade sem score automatizado" : pagina === "agenda" ? "Acompanhe os interesses e organize os horários presenciais" : "Modelagem BPMN do fluxo de parcerias validado pela operação"}>

    {pagina === "experts" && <section className="space-y-4 rise-in">
      <div className="bg-accent/50 border border-border rounded-lg p-4 flex gap-3"><ClipboardCheck className="size-5 text-primary shrink-0" /><p className="text-sm">Cada Expert possui <strong>um único projeto</strong>. O cadastro só segue para triagem após a confirmação do diagnóstico e dos campos essenciais.</p></div>
      {experts.map((expert, index) => <article key={expert.id} className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ animationDelay: `${index * 40}ms` }}>
        <FotoPerfil src={expert.fotoUrl} alt={expert.nome} size="lg" /><div className="flex-1 min-w-0"><div className="flex flex-wrap gap-2 items-center"><h2 className="font-display text-lg font-semibold">{expert.nome}</h2><BadgeStatus status={expert.statusCadastro} /><BadgeStatus status={statusProjeto(expert.id, expert.projeto.status)} /></div><p className="text-sm text-muted-foreground">{expert.cargo} · {expert.projeto.nicho}</p><p className="text-sm mt-2"><strong className="text-primary">ROMA:</strong> {expert.projeto.roma}</p></div>
        <Button variant="outline" className="min-h-11 w-full sm:w-auto shrink-0 bg-card hover:bg-accent gap-2" onClick={() => setDetalheExpert(expert.id)}><Eye className="size-4" />Ver projeto</Button>
      </article>)}
    </section>}

    {pagina === "lancadores" && <section className="space-y-4 rise-in">
      <div className="bg-accent/50 border border-border rounded-lg p-4 flex gap-3"><UsersRound className="size-5 text-primary shrink-0" /><p className="text-sm">A entrada do Lançador depende de confirmação de participação e da consultoria <strong>LEOA</strong>. Esses dados ficam disponíveis para a operação, não para Experts.</p></div>
      {lancadores.map((lancador, index) => <article key={lancador.id} className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ animationDelay: `${index * 40}ms` }}>
        <FotoPerfil src={lancador.fotoUrl} alt={lancador.nome} size="lg" /><div className="flex-1"><div className="flex flex-wrap gap-2 items-center"><h2 className="font-display text-lg font-semibold">{lancador.nome}</h2><BadgeStatus status={lancador.statusCadastro} /><BadgeStatus status={lancador.leoaConcluida ? "LEOA confirmada" : "LEOA pendente"} /></div><p className="text-sm text-muted-foreground">{lancador.cargo} · {lancador.nicho}</p><p className="text-sm mt-2 line-clamp-1">{lancador.audiencia}</p></div>
        <Button variant="outline" className="min-h-11 w-full sm:w-auto shrink-0 bg-card hover:bg-accent gap-2" onClick={() => setDetalheLancador(lancador.id)}><Eye className="size-4" />Ver cadastro</Button>
      </article>)}
    </section>}

    {pagina === "triagem" && <section className="space-y-4 rise-in">
      <div className="bg-accent/50 border border-border rounded-lg p-5"><p className="label-ed mb-2">Decisão da operação</p><p className="text-sm">Esta etapa não recomenda parceiros, não gera score e não envia propostas. Ela apenas determina se o projeto está completo e <strong>elegível para aparecer no catálogo</strong> dos Lançadores.</p></div>
      {emTriagem.length === 0 ? <div className="bg-card border border-border rounded-lg p-8 text-center"><CheckCircle2 className="size-7 mx-auto text-primary mb-2" /><h3 className="font-display font-semibold">Nenhum projeto aguardando triagem</h3><p className="text-sm text-muted-foreground mt-1">As decisões deste protótipo já foram registradas.</p></div> : emTriagem.map((expert) => <article key={expert.id} className="bg-card border border-primary/35 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-start"><FotoPerfil src={expert.fotoUrl} alt={expert.nome} size="lg" /><div className="flex-1"><div className="flex flex-wrap gap-2 items-center"><h3 className="font-display text-lg font-semibold">{expert.projeto.nome}</h3><BadgeStatus status="Em triagem" /></div><p className="text-sm text-muted-foreground">Expert: {expert.nome} · {expert.projeto.nicho}</p><p className="text-sm mt-3"><Label className="mr-2">ROMA</Label>{expert.projeto.roma}</p><p className="text-sm mt-2"><Label className="mr-2">Avatar</Label>{expert.projeto.avatar.quem}</p><p className="text-sm text-muted-foreground mt-3">{expert.projeto.triagem.observacao}</p></div><div className="w-full lg:w-52 space-y-3"><ChecklistTriagem triagem={expert.projeto.triagem} /><Button className="min-h-11 w-full gap-2" onClick={() => decidirTriagem(expert.id, "Elegível para catálogo")}><CheckCircle2 className="size-4" />Marcar elegível</Button><Button variant="outline" className="min-h-11 w-full gap-2 bg-card hover:bg-accent" onClick={() => decidirTriagem(expert.id, "Não elegível")}><XCircle className="size-4" />Não elegível</Button></div></div>
      </article>)}
    </section>}

    {pagina === "agenda" && <section className="space-y-4 rise-in">
      <div className="bg-accent/50 border border-border rounded-lg p-4 flex gap-3"><CalendarClock className="size-5 text-primary shrink-0" /><p className="text-sm">Interesses declarados entram na fila operacional. A confirmação de mesa e horário é responsabilidade da equipe do evento.</p></div>
      {interesses.map((interesse, index) => { const expert = getExpert(interesse.expertId); const lancador = getLancador(interesse.lancadorId); if (!expert || !lancador) return null; return <article key={interesse.id} className="bg-card border border-border rounded-lg p-5 flex flex-col md:flex-row md:items-center gap-4" style={{ animationDelay: `${index * 40}ms` }}><div className="size-11 rounded-md bg-primary/10 flex items-center justify-center"><CalendarClock className="size-5 text-primary" /></div><div className="flex-1"><div className="flex flex-wrap gap-2 items-center"><h3 className="font-display font-semibold">{expert.projeto.nome}</h3><BadgeStatus status={interesse.status} /></div><p className="text-sm text-muted-foreground mt-1">{expert.nome} · interesse de {lancador.nome}</p>{interesse.agenda ? <p className="text-sm mt-2 flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" />{interesse.agenda.data} às {interesse.agenda.horario} · {interesse.agenda.local}</p> : <p className="text-sm text-muted-foreground mt-2">Aguardando definição de horário e mesa.</p>}</div></article>; })}
    </section>}

    {pagina === "fluxo" && <FluxoBpmn />}

    <Dialog open={!!detalheExpert} onOpenChange={() => setDetalheExpert(null)}><DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">{detalheExpert && (() => { const expert = getExpert(detalheExpert); if (!expert) return null; const projeto = expert.projeto; return <><DialogHeader><DialogTitle className="font-display text-xl">{projeto.nome}</DialogTitle><DialogDescription>Projeto de {expert.nome}</DialogDescription></DialogHeader><div className="flex items-center gap-4"><FotoPerfil src={expert.fotoUrl} alt={expert.nome} size="lg" /><div><p className="font-medium">{expert.nome}</p><InstagramHandle handle={expert.instagram} /><div className="mt-1"><BadgeStatus status={statusProjeto(expert.id, projeto.status)} /></div></div></div><div className="rule-double" /><div><Label>ROMA</Label><p className="font-display text-lg mt-1">{projeto.roma}</p></div><LinhaDado rotulo="Nicho" valor={projeto.nicho} /><LinhaDado rotulo="Maturidade" valor={projeto.maturidade} /><div><Label>Avatar</Label><p className="text-sm mt-1">{projeto.avatar.quem}</p></div><div><Label>Registro da triagem</Label><div className="mt-2"><ChecklistTriagem triagem={projeto.triagem} /></div><p className="text-sm text-muted-foreground mt-3">{projeto.triagem.observacao}</p></div></>; })()}</DialogContent></Dialog>
    <Dialog open={!!detalheLancador} onOpenChange={() => setDetalheLancador(null)}><DialogContent className="max-w-lg">{detalheLancador && (() => { const lancador = getLancador(detalheLancador); if (!lancador) return null; return <><DialogHeader><DialogTitle className="font-display text-xl">{lancador.nome}</DialogTitle><DialogDescription>Cadastro do Lançador</DialogDescription></DialogHeader><div className="flex items-center gap-4"><FotoPerfil src={lancador.fotoUrl} alt={lancador.nome} size="lg" /><div><p className="font-medium">{lancador.cargo}</p><InstagramHandle handle={lancador.instagram} /></div></div><LinhaDado rotulo="Consultoria" valor={lancador.leoaConcluida ? "LEOA confirmada" : "Pendente"} /><LinhaDado rotulo="Nicho" valor={lancador.nicho} /><LinhaDado rotulo="Maturidade" valor={lancador.stage} /><div><Label>Audiência</Label><p className="text-sm mt-1">{lancador.audiencia}</p></div><div><Label>Histórico</Label><p className="text-sm mt-1">{lancador.resultado}</p></div></>; })()}</DialogContent></Dialog>
  </PainelLayout>;
}
