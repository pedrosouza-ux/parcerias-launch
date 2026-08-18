import { describe, expect, it } from "vitest";
import { isModoVisualizacaoAdmin } from "../client/src/lib/painelPreview";

describe("modo de visualização administrativa", () => {
  it("nunca coloca o painel administrativo em modo somente leitura", () => {
    expect(isModoVisualizacaoAdmin("/painel/admin", "?visualizacao=admin")).toBe(false);
  });

  it("permite o modo somente leitura apenas nos painéis de Expert e Lançador", () => {
    expect(isModoVisualizacaoAdmin("/painel/expert", "?visualizacao=admin")).toBe(true);
    expect(isModoVisualizacaoAdmin("/painel/lancador", "?visualizacao=admin")).toBe(true);
    expect(isModoVisualizacaoAdmin("/painel/expert", "")).toBe(false);
  });
});
