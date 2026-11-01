import { useState } from "react";
import {
  MessageCircle,
  Menu,
  X,
  MapPin,
  Star,
  ArrowRight,
  ShieldCheck,
  Clock,
  Instagram,
  Facebook,
  Briefcase,
  Target,
  LineChart,
  Users,
  Lightbulb,
  Handshake,
  Settings,
  Award,
  Sparkles,
  CalendarCheck,
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  CONTACT_WHATSAPP,
  CONTACT_WHATSAPP_DISPLAY,
  igUrl,
  mapsEmbed,
  mapsUrl,
  paletteStyle,
  waLink,
  type CorporateConfig,
} from "@/lib/site-config";

const icons = [Briefcase, Target, LineChart, Users, Lightbulb, Handshake, Settings, Award, Sparkles];
const nav = [
  ["Sobre", "#sobre"],
  ["Serviços", "#servicos"],
  ["Equipe", "#equipe"],
  ["Contato", "#contato"],
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-[0.3em] ${light ? "text-accent" : "text-primary"}`}>
      {children}
    </p>
  );
}

export function CorporateSite({ c }: { c: CorporateConfig }) {
  const [open, setOpen] = useState(false);
  const wa = (msg: string) => waLink(CONTACT_WHATSAPP, msg);
  const WA = wa(`Olá! Vim pelo site e gostaria de mais informações.`);
  const WaButton = ({ children }: { children: React.ReactNode }) => (
    <a
      href={WA}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground shadow-glow transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle className="h-4 w-4" /> {children}
    </a>
  );
  const initials = (n: string) =>
    n
      .replace(/^(Dra?|Sr|Sra)\.\s/, "")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("");

  return (
    <div
      className="tpl-corporate min-h-screen overflow-x-hidden bg-background font-sans text-foreground"
      style={paletteStyle(c.palette)}
    >
      <header className="relative border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#" className="flex items-center gap-3 leading-none">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary font-display font-bold text-primary-foreground">
              {c.sigla}
            </span>
            <span>
              <span className="block font-display text-xl font-semibold">{c.empresa}</span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {c.segmento} · {c.cidade}
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {nav.map(([l, h]) => (
              <a key={h} href={h} className="text-muted-foreground transition-colors hover:text-foreground">
                {l}
              </a>
            ))}
            <WaButton>Fale conosco</WaButton>
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-4 border-t border-border px-5 py-5 md:hidden">
            {nav.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)}>
                {l}
              </a>
            ))}
            <WaButton>Falar pelo WhatsApp</WaButton>
          </nav>
        )}
      </header>

      <section className="relative bg-glow pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.1fr_1fr]">
          <div className="reveal">
            <Eyebrow>
              {c.segmento} · {c.cidade}
            </Eyebrow>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              {c.titulo} <span className="text-ice">{c.destaque}</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">{c.subtitulo}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <WaButton>Falar pelo WhatsApp</WaButton>
              <a
                href="#servicos"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-7 py-3.5 text-sm font-bold transition-colors hover:bg-secondary"
              >
                Ver serviços <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> {c.selo1}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" /> {c.servicos.length} serviços
              </span>
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" /> {c.selo2}
              </span>
            </div>
          </div>
          <div className="reveal relative">
            <img
              src={c.fotoHero}
              alt={`Ambiente da ${c.empresa}`}
              width={1280}
              height={960}
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-glow"
            />
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-deep px-5 py-4 text-deep-foreground shadow-glow">
              <Clock className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-bold">{c.horarioResumo}</p>
                <p className="text-xs opacity-75">{c.horarioResumo2}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <img
            src={c.fotoSobre}
            alt={`Atendimento ${c.empresa}`}
            loading="lazy"
            className="aspect-square w-full rounded-[2rem] object-cover"
          />
          <div>
            <Eyebrow>Sobre a empresa</Eyebrow>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">{c.sobreTitulo}</h2>
            <p className="mt-5 whitespace-pre-line text-muted-foreground">{c.sobreTexto}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {(
                [
                  [ShieldCheck, "Responsável", c.responsavel],
                  [CalendarCheck, "Diferencial", c.diferencial],
                ] as const
              ).map(([Icon, t, d]) => (
                <div key={t} className="rounded-2xl border border-border bg-card p-5 text-center">
                  <Icon className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-3 font-bold">{t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="bg-deep-fade py-24 text-deep-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow light>Serviços</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-4xl sm:text-5xl">{c.servicosTitulo}</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.servicos.map(({ t, d }, i) => {
              const I = icons[i % icons.length] ?? Briefcase;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-deep-foreground/10 bg-deep-foreground/5 p-7 transition-colors hover:bg-deep-foreground/10"
                >
                  <I className="h-8 w-8 text-accent" />
                  <h3 className="mt-5 font-display text-2xl">{t}</h3>
                  <p className="mt-2 text-sm opacity-75">{d}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-12">
            <WaButton>Quero um orçamento</WaButton>
          </div>
        </div>
      </section>

      <section id="equipe" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow>Equipe</Eyebrow>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{c.equipeTitulo}</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.equipe.map((m, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-2xl border border-border bg-card p-7 text-center transition-shadow hover:shadow-glow"
              >
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-secondary font-display text-xl text-primary">
                  {initials(m.nome)}
                </div>
                <h3 className="font-display text-2xl leading-tight">{m.nome}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{m.cargo}</p>
                <p className="mt-5 flex items-center justify-center gap-2 self-stretch border-t border-border pt-4 text-xs font-bold tracking-widest text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" /> {m.registro}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Eyebrow>Galeria</Eyebrow>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Conheça a {c.empresa}.</h2>
          <Carousel opts={{ align: "start", loop: true }} className="mt-12">
            <CarouselContent>
              {c.galeria.map((g, i) => (
                <CarouselItem key={i} className="basis-[85%] sm:basis-1/2">
                  <figure>
                    <img
                      src={g.img}
                      alt={g.t}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-2xl object-cover"
                    />
                    <figcaption className="mt-3 font-display text-lg">{g.t}</figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex justify-end gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      <section id="contato" className="py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2">
          <div>
            <Eyebrow>Contato</Eyebrow>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">{c.contatoTitulo}</h2>
            <p className="mt-4 text-muted-foreground">{c.contatoTexto}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WaButton>Falar no WhatsApp</WaButton>
            </div>
            <div className="mt-10 rounded-2xl border border-border bg-card p-6">
              <p className="flex items-center gap-2 font-bold">
                <Clock className="h-5 w-5 text-primary" /> Horário de funcionamento
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {c.horarios.map((h, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{h.day}</span>
                    <span className="text-muted-foreground">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-5 rounded-2xl bg-card p-8 shadow-glow">
            <a href={WA} target="_blank" rel="noreferrer" className="flex items-start gap-4 hover:opacity-80">
              <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-bold">WhatsApp</p>
                <p className="text-muted-foreground">{CONTACT_WHATSAPP}</p>
              </div>
            </a>
            <a
              href={mapsUrl(c.endereco)}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-4 hover:opacity-80"
            >
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-bold">Endereço</p>
                <p className="text-muted-foreground">{c.endereco}</p>
              </div>
            </a>
            <div className="flex gap-6">
              <a
                href={igUrl(`seu-nome`)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-bold hover:opacity-80"
              >
                <Instagram className="h-5 w-5 text-primary" /> Instagram
              </a>
              <a
                href={c.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-bold hover:opacity-80"
              >
                <Facebook className="h-5 w-5 text-primary" /> Facebook
              </a>
            </div>
            <iframe
              title="Mapa"
              className="h-64 w-full rounded-xl border-0"
              loading="lazy"
              src={mapsEmbed(c.endereco)}
            />
          </div>
        </div>
      </section>

      <Avaliacao c={c} />

      <footer className="border-t border-border py-10 pb-24 text-center text-sm text-muted-foreground">
        <p className="font-display text-lg text-foreground">{c.empresa}</p>
        <p className="mt-2">{c.endereco}</p>
        <p className="mt-1">{c.responsavel}</p>
        <p className="mt-4">
          © {new Date().getFullYear()} {c.empresa}
        </p>
      </footer>

      <a
        href={WA}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-glow transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

function Avaliacao({ c }: { c: CorporateConfig }) {
  const [nota, setNota] = useState(0);
  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = `Avaliação pelo site\nNome: ${f.get("nome")}\nE-mail: ${f.get("email")}\nNota: ${"★".repeat(nota)}${"☆".repeat(5 - nota)} (${nota}/5)\nMensagem: ${f.get("msg")}`;
    window.open(waLink(CONTACT_WHATSAPP, msg), "_blank", "noopener,noreferrer");
  };
  const input =
    "w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";
  return (
    <section className="bg-deep-fade py-24 text-deep-foreground">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <div>
          <Eyebrow light>Depoimentos</Eyebrow>
          <h2 className="mt-3 font-display text-5xl sm:text-6xl">Conte como foi sua experiência!</h2>
        </div>
        <form onSubmit={enviar} className="space-y-4 rounded-2xl bg-card p-7 text-card-foreground shadow-glow">
          <input name="nome" required maxLength={80} placeholder="Nome" className={input} />
          <input name="email" type="email" required maxLength={120} placeholder="E-mail" className={input} />
          <div className="flex gap-1" role="radiogroup" aria-label="Nota">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setNota(n)} aria-label={`${n} estrelas`}>
                <Star
                  className={`h-7 w-7 transition-colors ${n <= nota ? "fill-accent text-accent" : "text-border"}`}
                />
              </button>
            ))}
          </div>
          <textarea name="msg" required maxLength={800} rows={4} placeholder="Mensagem" className={input} />
          <button
            disabled={!nota}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-opacity disabled:opacity-40"
          >
            Enviar avaliação
          </button>
        </form>
      </div>
    </section>
  );
}
