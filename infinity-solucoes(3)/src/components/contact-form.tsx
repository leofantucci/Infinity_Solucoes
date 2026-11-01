import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { sendContact } from "@/lib/contact.functions";
import { contactSchema, contactWhatsApp, OWNER_EMAIL } from "@/lib/contact-data";

const field =
  "w-full rounded-lg border border-[#701C9D]/40 bg-[#140722]/80 px-4 py-3 text-sm text-purple-100 placeholder:text-purple-300/40 transition-all focus:border-[#B12CDE] focus:bg-[#180929] focus:outline-none focus:ring-2 focus:ring-[#B12CDE]/30";

export function ContactForm() {
  const send = useServerFn(sendContact);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [wa, setWa] = useState<string | null>(null);
  const [contatoTipo, setContatoTipo] = useState<"email" | "telefone">("email");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Verifique os campos");
    setStatus("sending");
    try {
      const r = await send({ data: parsed.data });
      setWa(r.whatsapp);
      setStatus("done");
      window.open(r.whatsapp, "_blank", "noopener,noreferrer");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Erro ao enviar");
    }
  }

  return (
    <section id="contato" className="relative z-10 border-t border-[#701C9D]/25 bg-[#0A050F]/70 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D56BF2]">Contato</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">Vamos criar o seu site?</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-purple-200/70">
            Preencha o formulário e entraremos em contato rapidamente para entender sua necessidade.
          </p>
          <div className="mt-8 flex items-center gap-3 text-xs text-purple-300/60">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Atendimento disponível e resposta rápida
          </div>
        </div>

        {status === "done" ? (
          <div className="rounded-2xl border border-[#701C9D]/40 bg-[#12071f]/90 p-8 shadow-[0_8px_32px_rgba(112,28,157,0.2)] backdrop-blur-md">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              <h3 className="font-display text-2xl font-bold text-white">Pedido enviado com sucesso!</h3>
            </div>
            <p className="mt-3 text-sm text-purple-200/80">
              Recebemos sua mensagem. Se preferir atendimento imediato, clique no botão abaixo para nos chamar
              diretamente no WhatsApp:
            </p>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(5,150,105,0.4)] transition-all hover:bg-emerald-500 hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" /> Continuar pelo WhatsApp
              </a>
            )}
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="grid gap-4 rounded-2xl border border-[#701C9D]/30 bg-[#12071f]/85 p-6 md:p-8 shadow-[0_8px_32px_rgba(112,28,157,0.18)] backdrop-blur-md"
            noValidate
          >
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <label className="grid gap-1.5 text-sm font-medium text-purple-200">
              Nome
              <input name="nome" required maxLength={100} placeholder="Seu nome completo" className={field} />
            </label>

            <div className="rounded-lg border border-[#701C9D]/40 bg-[#0A050F]/90 p-0 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setContatoTipo("email")}
                    className={`cursor-pointer w-full rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all ${
                      contatoTipo === "email"
                        ? "bg-[#B12CDE] text-white shadow-sm shadow-[#B12CDE]/30"
                        : "text-purple-300/70 hover:text-white"
                    }`}
                  >
                    E-mail
                  </button>
                  <button
                    type="button"
                    onClick={() => setContatoTipo("telefone")}
                    className={`cursor-pointer w-full rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all ${
                      contatoTipo === "telefone"
                        ? "bg-[#B12CDE] text-white shadow-sm shadow-[#B12CDE]/30"
                        : "text-purple-300/70 hover:text-white"
                    }`}
                  >
                    WhatsApp / Telefone
                  </button>
                </div>

              {contatoTipo === "email" ? (
                <div>
                  <label className="grid gap-1.5 text-sm font-medium text-purple-200">
                    E-mail
                    <input
                      name="contato"
                      type="email"
                      required
                      maxLength={255}
                      placeholder="seu@email.com"
                      className={field}
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <label className="grid gap-1.5 text-sm font-medium text-purple-200">
                    Telefone / WhatsApp
                    <input
                      name="telefone"
                      type="tel"
                      required
                      maxLength={20}
                      placeholder="(11) 99999-0000"
                      className={field}
                    />
                  </label>
                </div>
              )}
            </div>

            <label className="grid gap-1.5 text-sm font-medium text-purple-200">
              Tipo do site
              <select name="tipo" required defaultValue="individual" className={`${field} cursor-pointer`}>
                <option value="individual" className="bg-[#12071f] text-white">
                  Perfil Individual
                </option>
                <option value="corporativo" className="bg-[#12071f] text-white">
                  Perfil Corporativo
                </option>
              </select>
            </label>

            <label className="grid gap-1.5 text-sm font-medium text-purple-200">
              Mensagem
              <textarea
                name="mensagem"
                required
                rows={4}
                maxLength={2000}
                placeholder="Descreva o serviço que você precisa: sua área de atuação, o que quer mostrar no site, prazos..."
                className={field}
              />
            </label>

            {error && (
              <p
                className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-300"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 inline-flex items-center justify-center gap-2 justify-self-start rounded-full bg-gradient-to-r from-[#701C9D] to-[#B12CDE] px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(177,44,222,0.35)] transition-all hover:scale-[1.02] hover:from-[#B12CDE] hover:to-[#D56BF2] disabled:opacity-60 cursor-pointer"
            >
              <Send className="h-4 w-4" /> {status === "sending" ? "Enviando pedido..." : "Enviar pedido"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
