/**
 * Parcerias — Painel de Controle Editorial (ideas.md)
 * Landing do protótipo: hero editorial com hero ilustrado,
 * apresentação do conceito (ROMA, triagem, 3 papéis) e seletor de acesso.
 */
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Papel } from "@/lib/mockData";
import { ShieldCheck, UserRound, Rocket, ArrowRight, CircleDot } from "lucide-react";

export default function Home() {
  const [, navegar] = useLocation();

  const papeis = [
    {
      id: "admin" as Papel,
      nome: "Administrador",
      icone: <ShieldCheck className="size-5" />,
      desc: "Visão global de Experts e Lançadores, triagem de aderência entre ROMA e audiência, e propostas de match.",
      demo: "Ana — Administradora",
    },
    {
      id: "expert" as Papel,
      nome: "Expert",
      icone: <UserRound className="size-5" />,
      desc: "Acesso limitado: gerencia os próprios projetos e ROMA, e vê os Lançadores compatíveis após liberação do admin.",
      demo: "Marina Valle — Expert",
    },
    {
      id: "lancador" as Papel,
      nome: "Lançador",
      icone: <Rocket className="size-5" />,
      desc: "Recebe as propostas de parceria aprovadas na triagem e decide aceitar ou recusar cada Expert sugerido.",
      demo: "Juliana Ferreira — Lançadora",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-5 lg:px-10 py-5 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <img src="/manus-storage/parcerias-logo_e0f61586.png" alt="Parcerias" className="size-10" />
          <span className="font-display text-2xl font-semibold tracking-tight">Parcerias<span className="text-primary">.</span></span>
        </div>
        <span className="label-ed hidden sm:block">Protótipo · Validação de fluxo</span>
      </header>

      {/* Hero */}
      <section className="px-5 lg:px-10 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="rise-in">
          <p className="label-ed mb-4">Matching de Experts e Lançadores</p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold leading-[1.05] tracking-tight">
            Toda parceria começa com uma <span className="text-primary">ROMA</span> bem encontrada.
          </h1>
          <p className="text-lg text-muted-foreground mt-5 max-w-md">
            Conectamos Experts e Lançadores pelo critério que importa: a aderência entre a
            transformação do produto e a audiência de quem lança — com curadoria humana a cada passo.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Button size="lg" className="gap-2 active:scale-[0.97] transition-transform duration-150" onClick={() => navegar("/painel/admin")}>
              Entrar no painel
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-card hover:bg-accent active:scale-[0.97] transition-all duration-150" onClick={() => {
              document.getElementById("papeis")?.scrollIntoView({ behavior: "smooth" });
            }}>
              Ver como funciona
            </Button>
          </div>
        </div>
        <div className="rise-in" style={{ animationDelay: "80ms" }}>
          <img
            src="/manus-storage/parcerias-hero_8b4aa376.png"
            alt="Ilustração do matching entre Expert e Lançador"
            className="w-full rounded-lg border border-border shadow-sm"
          />
        </div>
      </section>

      <div className="px-5 lg:px-10"><div className="rule-double" /></div>

      {/* Como funciona */}
      <section className="px-5 lg:px-10 py-12 lg:py-16">
        <p className="label-ed mb-3">Fluxo de curadoria</p>
        <h2 className="font-display text-3xl font-semibold">Como a triagem funciona</h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          {[
            {
              n: "01",
              titulo: "Expert apresenta a ROMA",
              texto: "Cada Expert cadastra seus projetos e define a ROMA — a transformação que o produto promete na vida do Avatar — com dores e ambições estruturadas.",
            },
            {
              n: "02",
              titulo: "Admin avalia a aderência",
              texto: "O administrador cruza a ROMA do Expert com a audiência, o nicho e o stage de cada Lançador, com um score de aderência sugerido pelo sistema.",
            },
            {
              n: "03",
              titulo: "Lançador decide",
              texto: "A proposta chega ao Lançador, que aceita ou recusa. Só então a parceria é formalizada e o Expert libera a condução do lançamento.",
            },
          ].map((item, i) => (
            <div key={item.n} className="bg-card border border-border rounded-lg p-6 rise-in" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="font-display text-3xl font-bold text-primary/70">{item.n}</span>
              <h3 className="font-display text-lg font-semibold mt-3">{item.titulo}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="px-5 lg:px-10"><div className="rule-double" /></div>

      {/* Seletor de papéis */}
      <section id="papeis" className="px-5 lg:px-10 py-12 lg:py-16">
        <p className="label-ed mb-3">Explore o protótipo</p>
        <h2 className="font-display text-3xl font-semibold">Entre como qualquer um dos três papéis</h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          {papeis.map((p, i) => (
            <button
              key={p.id}
              onClick={() => navegar(`/painel/${p.id}`)}
              className="group text-left bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-sm transition-all duration-200 rise-in active:scale-[0.99]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {p.icone}
                </div>
                <CircleDot className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold mt-4">{p.nome}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
              <p className="label-ed mt-4 text-primary">Demo · {p.demo}</p>
            </button>
          ))}
        </div>
      </section>

      <footer className="px-5 lg:px-10 py-8 border-t border-border">
        <p className="label-ed">Protótipo de validação · Dados simulados · Parcerias</p>
      </footer>
    </div>
  );
}
