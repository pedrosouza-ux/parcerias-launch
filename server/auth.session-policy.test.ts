import { decodeJwt } from "jose";
import { describe, expect, it } from "vitest";
import { SESSION_MAX_AGE_MS } from "../shared/const";
import { sdk } from "./_core/sdk";

describe("política de sessão", () => {
  it("emite tokens com duração padrão de doze horas", async () => {
    const token = await sdk.createSessionToken("session-policy-test", {
      name: "Session policy test",
    });
    const payload = decodeJwt(token);

    expect(payload.iat).toBeTypeOf("number");
    expect(payload.exp).toBeTypeOf("number");
    expect((payload.exp! - payload.iat!) * 1000).toBe(SESSION_MAX_AGE_MS);
  });
});
