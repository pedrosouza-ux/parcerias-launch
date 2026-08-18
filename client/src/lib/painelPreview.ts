/** Determina quando o Administrador está apenas visualizando outro perfil. */
export function isModoVisualizacaoAdmin(pathname: string, search: string) {
  const ePainelDeOutroPerfil = pathname === "/painel/expert" || pathname === "/painel/lancador";
  return ePainelDeOutroPerfil && new URLSearchParams(search).get("visualizacao") === "admin";
}
