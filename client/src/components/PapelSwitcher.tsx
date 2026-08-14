/**
 * Parcerias — Painel de Controle Editorial (ideas.md)
 * Seletor de papel: simula login como Admin, Expert ou Lançador no protótipo.
 * Estilo: labels mono uppercase, botão com acento vermelho-selo.
 */
import { Papel } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShieldCheck, UserRound, Rocket, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const papeis: { id: Papel; nome: string; icone: React.ReactNode; desc: string }[] = [
  { id: "admin", nome: "Administrador", icone: <ShieldCheck className="size-4" />, desc: "Triagem e visão global" },
  { id: "expert", nome: "Expert", icone: <UserRound className="size-4" />, desc: "Projetos, ROMA e Lançadores" },
  { id: "lancador", nome: "Lançador", icone: <Rocket className="size-4" />, desc: "Propostas de parceria" },
];

interface PapelSwitcherProps {
  papel: Papel;
  onTrocar: (p: Papel) => void;
  nomeUsuario: string;
}

export default function PapelSwitcher({ papel, onTrocar, nomeUsuario }: PapelSwitcherProps) {
  const atual = papeis.find((p) => p.id === papel)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 h-9 bg-card border-border font-medium hover:bg-accent active:scale-[0.97] transition-all duration-150">
          {atual.icone}
          <span>{atual.nome}</span>
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="label-ed">Entrar como</DropdownMenuLabel>
        {papeis.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => onTrocar(p.id)}
            className={cn("gap-3 py-2.5", papel === p.id && "bg-accent font-semibold")}
          >
            {p.icone}
            <div className="flex flex-col">
              <span>{p.nome}</span>
              <span className="text-xs text-muted-foreground">{p.desc}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <div className="rule-double my-1" />
        <DropdownMenuLabel className="label-ed">{nomeUsuario}</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
