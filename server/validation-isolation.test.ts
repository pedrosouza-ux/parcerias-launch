import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { expertProfiles, projects, registrations, users } from "../drizzle/schema";
import { canDeclareValidationInterest, declareValidationProjectInterest, getDb, getValidationParticipantUserId, isValidationExpertOpenId, listValidationEligibleProjects, listValidationExpertInterests, listValidationLauncherInterests, validationOpenIdByRole } from "../server/db";

describe("escopo dos dados demonstrativos", () => {
  it("mantém o modo operacional apontado apenas para os dois participantes fictícios identificados", () => {
    expect(validationOpenIdByRole).toEqual({
      expert: "demo-expert-validacao-01",
      lancador: "demo-lancador-validacao-01",
    });
    expect(Object.values(validationOpenIdByRole)).not.toContain("OWNER_OPEN_ID");
  });

  it("rejeita proprietários e projetos que não pertencem ao Expert demonstrativo", () => {
    const catalogoMisturado = [
      { projectId: 7, ownerOpenId: "demo-expert-validacao-01" },
      { projectId: 8, ownerOpenId: "participante-real-01" },
    ];
    const catalogoDemonstrativo = catalogoMisturado.filter(item => isValidationExpertOpenId(item.ownerOpenId));

    expect(catalogoDemonstrativo).toEqual([{ projectId: 7, ownerOpenId: "demo-expert-validacao-01" }]);
    expect(isValidationExpertOpenId("participante-real-01")).toBe(false);
    expect(isValidationExpertOpenId(null)).toBe(false);
    expect(canDeclareValidationInterest({ status: "eligible", ownerOpenId: "participante-real-01" })).toBe(false);
    expect(canDeclareValidationInterest({ status: "submitted", ownerOpenId: "demo-expert-validacao-01" })).toBe(false);
    expect(canDeclareValidationInterest({ status: "eligible", ownerOpenId: "demo-expert-validacao-01" })).toBe(true);
  });

  it("consulta o catálogo operacional exclusivamente no escopo do projeto demonstrativo", async () => {
    const catalogo = await listValidationEligibleProjects();
    expect(catalogo.every(({ project }) => project.name.includes("Validação"))).toBe(true);
  });

  it("consulta interesses e reuniões somente dentro do par demonstrativo", async () => {
    const [interessesDoLancador, interessesDoExpert] = await Promise.all([
      listValidationLauncherInterests(),
      listValidationExpertInterests(),
    ]);
    expect(interessesDoLancador.every(({ project }) => project.name.includes("Validação"))).toBe(true);
    expect(interessesDoExpert.every(({ project }) => project.name.includes("Validação"))).toBe(true);
  });

  it("rejeita a declaração demonstrativa para um projeto elegível real", async () => {
    const db = await getDb();
    if (!db) throw new Error("Banco indisponível para o teste de isolamento.");
    const suffix = `fixture-isolamento-${Date.now()}`;
    let fixtureUserId: number | null = null;

    try {
      await db.insert(users).values({ openId: suffix, name: "Fixture de isolamento", loginMethod: "test", role: "user" });
      const [fixtureUser] = await db.select().from(users).where(eq(users.openId, suffix)).limit(1);
      if (!fixtureUser) throw new Error("Não foi possível criar a fixture de isolamento.");
      fixtureUserId = fixtureUser.id;

      await db.insert(registrations).values({ userId: fixtureUser.id, requestedRole: "expert", status: "approved", fullName: "Fixture de isolamento" });
      const [fixtureRegistration] = await db.select().from(registrations).where(eq(registrations.userId, fixtureUser.id)).limit(1);
      if (!fixtureRegistration) throw new Error("Não foi possível criar a inscrição da fixture.");

      await db.insert(expertProfiles).values({ userId: fixtureUser.id, registrationId: fixtureRegistration.id, generalSpecialties: [] });
      const [fixtureProfile] = await db.select().from(expertProfiles).where(eq(expertProfiles.userId, fixtureUser.id)).limit(1);
      if (!fixtureProfile) throw new Error("Não foi possível criar o perfil da fixture.");

      await db.insert(projects).values({
        expertProfileId: fixtureProfile.id,
        name: "Projeto real de isolamento",
        niche: "Teste",
        subniche: "Isolamento",
        specialties: [],
        maturity: "validated",
        avatarDescription: "Perfil de teste sem acesso ao ambiente demonstrativo.",
        pains: [],
        ambition: "Validar a proteção.",
        roma: "Transformação de teste.",
        mechanism: "Mecanismo de teste.",
        offerFormat: "Workshop",
        priceRange: "R$ 0",
        mainChannel: "Teste",
        primaryLink: "https://example.com/test",
        status: "eligible",
      });
      const [fixtureProject] = await db.select().from(projects).where(eq(projects.expertProfileId, fixtureProfile.id)).limit(1);
      if (!fixtureProject) throw new Error("Não foi possível criar o projeto da fixture.");

      const launcherUserId = await getValidationParticipantUserId("lancador");
      await expect(declareValidationProjectInterest({ userId: launcherUserId, projectId: fixtureProject.id })).resolves.toBeNull();
    } finally {
      if (fixtureUserId) await db.delete(users).where(eq(users.id, fixtureUserId));
    }
  });
});
