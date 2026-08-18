import { describe, expect, it } from "vitest";
import { isModoOperacaoAdmin, isModoVisualizacaoAdmin } from "../client/src/lib/painelPreview";

describe("modo de visualização administrativa", () => {
  it("nunca coloca o painel administrativo em modo somente leitura", () => {
    expect(isModoVisualizacaoAdmin("/painel/admin", "?visualizacao=admin")).toBe(false);
  });

  it("permite o modo somente leitura apenas quando solicitado explicitamente", () => {
    expect(isModoVisualizacaoAdmin("/painel/expert", "?modo=leitura")).toBe(true);
    expect(isModoVisualizacaoAdmin("/painel/lancador", "?modo=leitura")).toBe(true);
    expect(isModoVisualizacaoAdmin("/painel/expert", "")).toBe(false);
  });

  it("trata o antigo link visualizacao=admin como ambiente operacional, não como somente leitura", () => {
    expect(isModoOperacaoAdmin("/painel/expert", "?visualizacao=admin")).toBe(true);
    expect(isModoOperacaoAdmin("/painel/lancador", "?operacao=admin")).toBe(true);
    expect(isModoOperacaoAdmin("/painel/admin", "?operacao=admin")).toBe(false);
    expect(isModoVisualizacaoAdmin("/painel/expert", "?visualizacao=admin")).toBe(false);
  });
});
