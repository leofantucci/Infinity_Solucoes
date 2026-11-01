import { afterEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("@lovable.dev/email-js", () => ({
  sendLovableEmail: send,
  EmailAPIError: class extends Error {},
}));
vi.mock("@react-email/render", () => ({ render: vi.fn().mockResolvedValue("Email content") }));
vi.mock("@/lib/email-templates/registry", () => ({
  TEMPLATES: { "contact-confirmation": { component: () => null, subject: "Confirmação" } },
}));

import { sendTemplateEmail } from "@/lib/email-templates/send-email";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("Official email sender", () => {
  it("sends from contato@infinity-solucoes.com through the configured delegated domain", async () => {
    vi.stubEnv("LOVABLE_API_KEY", "test-key");
    send.mockResolvedValue(undefined);
    await sendTemplateEmail("contact-confirmation", "customer@example.com", {
      idempotencyKey: "test-contact-confirmation",
    });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: { name: "Infinity Soluções", address: "contato@infinity-solucoes.com" },
        sender_domain: "notify.infinity-solucoes.com",
        to: "customer@example.com",
      }),
      expect.any(Object),
    );
  });
});