import { useState, type FormEvent } from "react";
import { MessageCircle, Instagram, Mail, MapPin, ArrowUpRight, GraduationCap, Clock, Star } from "lucide-react";
import {
  CONTACT_WHATSAPP,
  CONTACT_WHATSAPP_DISPLAY,
  igUrl,
  mapsEmbed,
  mapsUrl,
  paletteStyle,
  waLink,
  type IndividualConfig,
} from "@/lib/site-config";

const btn =
  "inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const btnPrimary = `${btn} bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground`;
const btnGhost = `${btn} border border-foreground/25 text-foreground hover:border-accent hover:text-accent-ink`;

export function IndividualSite({ c }: { c: IndividualConfig }) {
  const msg = `Oi! Vim pelo site e gostaria de mais informações.`;
  const wa = waLink(CONTACT_WHATSAPP, msg);
  const ig = igUrl(`seu-nome`);
  const initials = c.marca
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className="tpl-individual min-h-screen bg-background font-sans text-foreground"
      style={paletteStyle(c.palette)}
    >
      <header className="relative border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#inicio" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground">
              {initials}
            </span>
            <span className="font-display text-xl font-semibold leading-none">{c.nome}</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Principal">
            <a href="#sobre" className="hover:text-accent-ink">
              Sobre
            </a>
            <a href="#servicos" className="hover:text-accent-ink">
              Serviços
            </a>
            <a href="#contato" className="hover:text-accent-ink">
              Contato
            </a>
          </nav>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Agendar pelo WhatsApp"
            className={`${btnPrimary} px-4 py-2.5`}
          >
            <MessageCircle className="h-4 w-4" /> <span className="hidden sm:inline">Agendar</span>
          </a>
        </div>
      </header>

      <main>
        <section
          id="inicio"
          className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1.1fr_1fr] md:py-20"
        >
          <div>
            <p className="eyebrow">
              {c.profissao} · {c.cidade}
            </p>
            <h1 className="mt-5 font-display text-5xl font-medium leading-[1.02] md:text-7xl">
              {c.titulo} <em className="text-accent-ink">{c.destaque}</em>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">{c.subtitulo}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                <MessageCircle className="h-4 w-4" /> Agendar pelo WhatsApp
              </a>
              <a href="#servicos" className={btnGhost}>
                Conhecer os serviços
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={c.foto}
              alt={`${c.nome}, ${c.profissao}`}
              width={1024}
              height={1280}
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute -bottom-6 -left-4 hidden bg-primary p-5 text-primary-foreground md:block">
              <p className="font-display text-2xl">{c.marca}</p>
              <p className="text-xs uppercase tracking-widest opacity-70">{c.cidade}</p>
            </div>
          </div>
        </section>

        <section id="sobre" className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
            <div className="grid gap-12 md:grid-cols-[1fr_1.15fr] md:items-start">
              <div>
                <p className="eyebrow">Sobre</p>
                <h2 className="mt-4 font-display text-4xl md:text-5xl">Quem cuida de você.</h2>
                <p className="mt-5 max-w-md whitespace-pre-line text-muted-foreground">{c.intro}</p>
                <img
                  src={c.fotoAmbiente}
                  alt={`Ambiente de ${c.marca}`}
                  loading="lazy"
                  className="mt-8 aspect-[16/9] w-full border border-border object-cover"
                />
              </div>
              <div className="border border-border bg-background">
                <div className="flex items-center gap-5 border-b border-border p-6">
                  <img src={c.foto} alt={c.nome} loading="lazy" className="h-20 w-20 shrink-0 object-cover" />
                  <div>
                    <p className="font-display text-2xl leading-tight">{c.nome}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{c.profissao}</p>
                    <p className="mt-2 text-xs tracking-widest text-accent-ink">{c.registro}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 pt-6">
                  <GraduationCap className="h-4 w-4 text-accent-ink" />
                  <p className="eyebrow">Formação</p>
                </div>
                <dl className="p-6">
                  {c.formacoes.map((f, i) => (
                    <div
                      key={i}
                      className="grid gap-1 border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[150px_1fr] sm:gap-5"
                    >
                      <dt className="pt-0.5 text-xs uppercase tracking-widest text-accent-ink">{f.label}</dt>
                      <dd className="text-sm leading-relaxed text-muted-foreground">{f.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <p className="eyebrow">Serviços</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl md:text-5xl">{c.servicosTitulo}</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {c.servicos.map((s, i) => (
              <article key={i} className="group">
                <div className="overflow-hidden bg-muted">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 text-xs text-accent-ink">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow !text-accent">Instagram</p>
                <h2 className="mt-4 font-display text-4xl md:text-5xl">@{c.instagram.replace(/^@/, "")}</h2>
                <p className="mt-3 max-w-md text-sm opacity-75">{c.instagramTexto}</p>
              </div>
              <a
                href={ig}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btn} border border-primary-foreground/30 hover:border-accent hover:text-accent`}
              >
                <Instagram className="h-4 w-4" /> Seguir no Instagram
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-2 md:grid-cols-6">
              {c.galeria.map((g, i) => (
                <a key={i} href={ig} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
                  <img
                    src={g}
                    alt={`Publicação ${i + 1}`}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-opacity hover:opacity-80"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow">Agende seu atendimento</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Vamos conversar?</h2>
            <p className="mt-4 text-muted-foreground">Fale diretamente comigo pelo WhatsApp.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} mt-8`}>
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
            <ul className="mt-10 divide-y divide-border border-y border-border text-sm">
              {[
                { icon: MessageCircle, label: CONTACT_WHATSAPP_DISPLAY, href: wa },
                { icon: Mail, label: c.email, href: `mailto:${c.email}` },
                { icon: Instagram, label: `@${c.instagram.replace(/^@/, "")}`, href: ig },
                { icon: MapPin, label: c.endereco, href: mapsUrl(c.endereco) },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 py-4 hover:text-accent-ink"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-accent-ink" />
                    <span className="flex-1 break-all sm:break-normal">{label}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-40" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-accent-ink" />
                <p className="eyebrow">Horários de atendimento</p>
              </div>
              <dl className="mt-3 divide-y divide-border">
                {c.horarios.map((h, i) => {
                  const closed = /fechado/i.test(h.time);
                  return (
                    <div key={i} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                      <dt className="text-muted-foreground">{h.day}</dt>
                      <dd className={closed ? "italic text-muted-foreground" : "font-medium"}>{h.time}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
          <iframe
            title="Mapa"
            src={mapsEmbed(c.endereco)}
            loading="lazy"
            className="min-h-[360px] w-full border border-border grayscale"
          />
        </section>

        <Review c={c} />
      </main>

      <footer className="border-t border-border pb-24 sm:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            {c.marca} · {c.nome} · {c.registro}
          </span>
          <span>
            © {new Date().getFullYear()} {c.nome}
          </span>
        </div>
      </footer>
    </div>
  );
}

function Review({ c }: { c: IndividualConfig }) {
  const [rating, setRating] = useState(5);
  const field =
    "w-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = `Oi! Vim pelo site e gostaria de deixar minha avaliação.\n\nNome: ${f.get("name")}\nE-mail: ${f.get("email")}\nNota: ${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)\nMensagem: ${f.get("message")}`;
    window.open(waLink(CONTACT_WHATSAPP, msg), "_blank", "noopener,noreferrer");
  }
  return (
    <section id="avaliar" className="bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.2fr] md:py-24">
        <div>
          <p className="eyebrow">Avaliação</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Conte como foi o seu atendimento.</h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Sua avaliação é enviada diretamente para {c.nome} pelo WhatsApp.
          </p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm">
              Nome
              <input name="name" required maxLength={80} className={field} />
            </label>
            <label className="grid gap-1.5 text-sm">
              E-mail
              <input name="email" type="email" required maxLength={120} className={field} />
            </label>
          </div>
          <div className="flex gap-1" role="radiogroup" aria-label="Nota">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} estrelas`}
                onClick={() => setRating(n)}
              >
                <Star className={`h-7 w-7 ${n <= rating ? "fill-accent text-accent" : "text-border"}`} />
              </button>
            ))}
          </div>
          <label className="grid gap-1.5 text-sm">
            Mensagem
            <textarea name="message" required rows={4} maxLength={600} className={field} />
          </label>
          <button type="submit" className={`${btnPrimary} justify-self-start`}>
            <MessageCircle className="h-4 w-4" /> Enviar avaliação
          </button>
        </form>
      </div>
    </section>
  );
}
