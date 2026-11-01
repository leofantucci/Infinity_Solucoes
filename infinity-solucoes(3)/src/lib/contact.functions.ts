import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { contactSchema, contactWhatsApp, OWNER_EMAIL, profileLabel } from "./contact-data";

// 1. Envio do Formulário de Contato e Pedidos de Site
const hits = new Map<string, number[]>();

export const sendContact = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for") ?? "anon";
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
    if (recent.length >= 5) throw new Error("Muitas tentativas. Tente novamente em alguns minutos.");
    hits.set(ip, [...recent, now]);

    const tipo = profileLabel(data.tipo);
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const submissionId = crypto.randomUUID();
    const templateData = { ...data, tipo };
    const contatoDestino = data.contatoTipo === "email" ? data.contato : data.telefone;
    const results = await Promise.allSettled([
      sendTemplateEmail("new-lead", OWNER_EMAIL, {
        templateData,
        replyTo: contatoDestino,
        idempotencyKey: `owner-${submissionId}`,
      }),
      sendTemplateEmail("contact-confirmation", contatoDestino, {
        templateData,
        idempotencyKey: `customer-${submissionId}`,
      }),
    ]);
    const emailSent = results.every((result) => result.status === "fulfilled" && result.value.sent);
    return { ok: true, emailSent, whatsapp: contactWhatsApp(data) };
  });

// 2. Envio da Nova Avaliação de Clientes
const reviewSchema = z.object({
  nome: z.string().trim().min(2),
  tipoContato: z.enum(["email", "telefone"]),
  contato: z.string().trim().min(3),
  nota: z.number().int().min(1).max(5),
  mensagem: z.string().trim().min(5),
  honeypot: z.string().optional(),
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => reviewSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.honeypot) return { ok: true };

    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const subId = crypto.randomUUID();

    const tasks: Promise<any>[] = [
      sendTemplateEmail("review-notification", OWNER_EMAIL, {
        templateData: data,
        idempotencyKey: `rev-notify-${subId}`,
      }),
      sendTemplateEmail("review-customer", data.contato, {
        templateData: data,
        idempotencyKey: `rev-cust-${subId}`,
      }),
    ];

    await Promise.allSettled(tasks);
    return { ok: true };
  });
