/** Wordmark oficial com variante azul para fundo claro e branca para fundo escuro. */
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export function LogoInsider({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { theme } = useTheme();
  const src = theme === "light" ? "/manus-storage/LOGO_INSIDER_AZUL_ee788ab9.svg" : "/manus-storage/LOGO_INSIDER_BRANCO_98928175.svg";
  return <img src={src} alt="FL Insider" className={cn("insider-wordmark h-auto", compact ? "h-8 w-auto" : "w-40", className)} />;
}
