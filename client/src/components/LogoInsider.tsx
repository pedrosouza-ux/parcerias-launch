/** Wordmark oficial com adaptação de contraste para modo claro e escuro. */
import { cn } from "@/lib/utils";

export function LogoInsider({ className, compact = false }: { className?: string; compact?: boolean }) {
  return <img src="/manus-storage/LOGO_INSIDER_BRANCO_98928175.svg" alt="FL Insider" className={cn("insider-wordmark h-auto", compact ? "h-8 w-auto" : "w-40", className)} />;
}
