import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, UserCheck, ChevronRight, Shield, Sparkles, Zap, Star, Quote, Trash2, Lock } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import infinityLogo from "@/assets/infinity-logo-nova.png.asset.json";
import retrato from "@/assets/ind-retrato.jpg";
import corpHero from "@/assets/corp-hero.jpg";
import { ContactForm } from "@/components/contact-form";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      {
        title: "Infinity Soluções | Sites Profissionais e Presença Digital de Alto Nível",
      },
      {
        name: "description",
        content:
          "Transforme sua empresa com soluções digitais modernas, seguras e de alta performance. Modelos exclusivos para autônomos e empresas consolidadas.",
      },
      {
        property: "og:title",
        content: "Infinity Soluções | Sites Profissionais e Presença Digital de Alto Nível",
      },
      {
        property: "og:description",
        content:
          "Transforme sua empresa com soluções digitais modernas, seguras e de alta performance. Modelos exclusivos para autônomos e empresas consolidadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndexPage,
});

/* =========================================================================
   CONFIGURAÇÃO DO AMBIENTE E PARALLAX MULTICAMADA
   ========================================================================= */
const CONFIG = {
  rowSpacing: 160,
  farLayerFactor: 0.12,
  midLayerFactor: 0.28,
  mouseInfluence: 42,
};

// Símbolos Flutuantes Principais
const FLOATING_SHAPES = [
  {
    top: "18%",
    right: "6%",
    size: 130,
    speed: 0.0012,
    ampX: 68,
    ampY: 38,
    phase: 1.8,
    color: "#B12CDE",
    rotBase: 12,
    opacity: 0.55,
  },
  {
    top: "58%",
    left: "5%",
    size: 105,
    speed: 0.001,
    ampX: 46,
    ampY: 26,
    phase: 3.2,
    color: "#701C9D",
    rotBase: 8,
    opacity: 0.45,
  },
  {
    top: "76%",
    right: "8%",
    size: 125,
    speed: 0.0008,
    ampX: 60,
    ampY: 34,
    phase: 4.6,
    color: "#D56BF2",
    rotBase: -15,
    opacity: 0.5,
  },
];

/* =========================================================================
   GLIFO DO SÍMBOLO DO INFINITO (TRAJETO COMPLETO COM AMBOS OS LAÇOS)
   ========================================================================= */
const INFINITY_PATH = "M 80,45 C 100,18 148,18 148,45 C 148,72 100,72 80,45 C 60,18 12,18 12,45 C 12,72 60,72 80,45 Z";

function InfinityGlyph() {
  return (
    <svg
      viewBox="0 0 160 90"
      className="h-9 w-16 sm:h-11 sm:w-22 md:h-12 md:w-24 opacity-35 transition-all duration-300 hover:opacity-80 hover:scale-110"
    >
      <path d={INFINITY_PATH} fill="none" stroke="#701C9D" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================================
   SISTEMA DE BACKGROUND INTEGRADO E HIPER-RESPONSIVO
   ========================================================================= */
function BackgroundInfinityMesh() {
  const farLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [rowCount, setRowCount] = useState(25);
  const mousePos = useRef({ x: 0, y: 0 });
  const mouseTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateDocumentDimensions = () => {
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight * 2,
      );
      const rows = Math.ceil(docHeight / CONFIG.rowSpacing) + 2;
      setRowCount(Math.max(rows, 18));
    };

    updateDocumentDimensions();
    window.addEventListener("resize", updateDocumentDimensions);
    const observer = new ResizeObserver(updateDocumentDimensions);
    observer.observe(document.body);

    const handleMouseMove = (e: MouseEvent) => {
      mouseTarget.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    let startTime = performance.now();

    const render = () => {
      const now = performance.now();
      const elapsed = now - startTime;

      mousePos.current.x += (mouseTarget.current.x - mousePos.current.x) * 0.12;
      mousePos.current.y += (mouseTarget.current.y - mousePos.current.y) * 0.12;

      const scrollY = window.scrollY;

      if (farLayerRef.current) {
        const farY = scrollY * CONFIG.farLayerFactor;
        const farMouseX = mousePos.current.x * (CONFIG.mouseInfluence * 0.4);
        const farMouseY = mousePos.current.y * (CONFIG.mouseInfluence * 0.4);
        farLayerRef.current.style.transform = `translate3d(${farMouseX}px, ${farY + farMouseY}px, 0)`;
      }

      if (midLayerRef.current) {
        const midY = scrollY * CONFIG.midLayerFactor;
        const midMouseX = mousePos.current.x * CONFIG.mouseInfluence;
        const midMouseY = mousePos.current.y * CONFIG.mouseInfluence;
        midLayerRef.current.style.transform = `translate3d(${midMouseX}px, ${midY + midMouseY}px, 0)`;
      }

      floatingRefs.current.forEach((el, i) => {
        const cfg = FLOATING_SHAPES[i];
        if (!el || !cfg) return;

        const t = elapsed * cfg.speed + cfg.phase;
        const sinT = Math.sin(t);
        const cosT = Math.cos(t);

        const lemX = (cfg.ampX * cosT) / (1 + sinT * sinT);
        const lemY = (cfg.ampY * sinT * cosT) / (1 + sinT * sinT);

        const mouseReactiveX = mousePos.current.x * 26 * (i % 2 === 0 ? 1 : -1);
        const mouseReactiveY = mousePos.current.y * 26 * (i % 2 === 0 ? -1 : 1);

        const rot = cfg.rotBase + Math.sin(t * 1.5) * 12 + mousePos.current.x * 8;

        el.style.transform = `translate3d(${lemX + mouseReactiveX}px, ${lemY + mouseReactiveY}px, 0) rotate(${rot}deg)`;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateDocumentDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* 1. Camada de Fundo (Acompanha a página do topo ao rodapé) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg className="absolute h-0 w-0">
          <defs>
            <pattern id="hexGrid" width="48" height="84" patternUnits="userSpaceOnUse">
              <path
                d="M 24,0 L 48,14 L 48,42 L 24,56 L 0,42 L 0,14 Z M 24,56 L 48,70 L 48,98 L 24,112 L 0,98 L 0,70 Z"
                fill="none"
                stroke="#701C9D"
                strokeWidth="0.8"
                strokeOpacity="0.08"
              />
            </pattern>
          </defs>
        </svg>

        <div className="absolute inset-0 z-0 opacity-80">
          <svg className="h-full w-full">
            <rect width="100%" height="100%" fill="url(#hexGrid)" />
          </svg>
        </div>

        <div className="absolute -top-24 right-[-5%] h-[650px] w-[650px] rounded-full bg-[#701C9D]/25 blur-[160px]" />
        <div className="absolute top-[35%] -left-48 h-[750px] w-[750px] rounded-full bg-[#B12CDE]/18 blur-[180px]" />
        <div className="absolute top-[70%] -right-32 h-[700px] w-[700px] rounded-full bg-[#D56BF2]/12 blur-[170px]" />

        <div ref={farLayerRef} className="absolute inset-0 z-[1] will-change-transform">
          <div className="absolute -top-12 -left-16 rotate-12 opacity-[0.09]">
            <svg viewBox="0 0 160 90" className="h-56 w-88">
              <path d={INFINITY_PATH} fill="none" stroke="#D56BF2" strokeWidth="2.8" />
            </svg>
          </div>
          <div className="absolute top-[38%] -right-24 -rotate-12 opacity-[0.08]">
            <svg viewBox="0 0 160 90" className="h-64 w-96">
              <path d={INFINITY_PATH} fill="none" stroke="#B12CDE" strokeWidth="2.8" />
            </svg>
          </div>
          <div className="absolute top-[75%] -left-20 rotate-45 opacity-[0.09]">
            <svg viewBox="0 0 160 90" className="h-56 w-88">
              <path d={INFINITY_PATH} fill="none" stroke="#701C9D" strokeWidth="2.8" />
            </svg>
          </div>
        </div>

        <div ref={midLayerRef} className="absolute inset-0 z-[2] will-change-transform">
          {Array.from({ length: rowCount }).map((_, rowIndex) => {
            const mod = rowIndex % 3;
            const cols = mod === 1 ? ["15%", "50%", "85%"] : ["30%", "70%"];

            return (
              <div
                key={rowIndex}
                className="absolute left-0 right-0 flex items-center justify-around"
                style={{ top: `${rowIndex * CONFIG.rowSpacing + 25}px` }}
              >
                {cols.map((colPos, colIdx) => (
                  <div key={colIdx} className="absolute -translate-x-1/2" style={{ left: colPos }}>
                    <InfinityGlyph />
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div
          className="absolute inset-0 z-[4]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(0,0,0,0.55) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.55) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.55) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.55) 75%)",
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.98) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.98) 100%)",
          }}
        />
      </div>

      {/* 2. Infinitos Flutuantes FIXOS na viewport (Laço duplo completo) */}
      <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden" aria-hidden="true">
        {FLOATING_SHAPES.map((cfg, i) => (
          <div
            key={i}
            ref={(el) => {
              floatingRefs.current[i] = el;
            }}
            className="absolute will-change-transform"
            style={{
              top: cfg.top,
              left: cfg.left,
              right: cfg.right,
              opacity: cfg.opacity,
            }}
          >
            <svg viewBox="0 0 160 90" style={{ width: `${cfg.size}px`, height: `${(cfg.size * 90) / 160}px` }}>
              <path
                d={INFINITY_PATH}
                fill="none"
                stroke={cfg.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_18px_rgba(213,107,242,0.9)]"
              />
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}

/* =========================================================================
   BARRA LATERAL DE ALTURA / SEÇÃO
   ========================================================================= */
const SECTIONS = [
  { id: "inicio", label: "Início" },
  { id: "modelos", label: "Modelos" },
  { id: "contato", label: "Contato" },
  { id: "avaliacoes", label: "Avaliações" },
];

function SideNavTracker() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center rounded-full border border-[#701C9D]/40 bg-[#0A050F]/85 px-3 py-6 shadow-2xl backdrop-blur-xl"
      aria-label="Navegador de Seções"
    >
      <nav className="relative flex flex-col items-center justify-between h-60">
        {/* Linha de trilha de fundo (atravessa todas as bolinhas de cima a baixo) */}
        <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-0.5 rounded-full bg-[#701C9D]/30" />

        {/* Linha preenchida com a % lida da página */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 rounded-full bg-gradient-to-b from-[#B12CDE] via-[#D56BF2] to-[#B12CDE] transition-all duration-150"
          style={{ height: `calc(${scrollProgress}% * 0.92)` }}
        />

        {/* Bolinhas das seções */}
        {SECTIONS.map((sec, idx) => {
          // Quando estiver no início, acende também a segunda bolinha (modelos)
          const isModelosLitAtStart = activeSection === "inicio" && sec.id === "modelos";
          const isSectionActive = activeSection === sec.id || isModelosLitAtStart;
          const dotThreshold = (idx / (SECTIONS.length - 1)) * 100;
          const isPassed = scrollProgress >= dotThreshold;
          const isLit = isSectionActive || isPassed;

          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className="group relative z-10 flex items-center justify-center p-1.5 focus:outline-none cursor-pointer"
              title={sec.label}
              aria-label={`Rolar para ${sec.label}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isLit
                    ? "h-3.5 w-3.5 bg-[#D56BF2] shadow-[0_0_12px_#D56BF2] ring-4 ring-[#0A050F] scale-110"
                    : "h-2.5 w-2.5 bg-purple-400/40 ring-4 ring-[#0A050F] hover:bg-purple-300 hover:scale-125"
                }`}
              />

              <span className="pointer-events-none absolute right-8 rounded-md border border-[#701C9D]/40 bg-[#14071D] px-2.5 py-1 text-[11px] font-semibold tracking-wider text-[#D56BF2] opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1 whitespace-nowrap">
                {sec.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

/* =========================================================================
   SISTEMA DE AVALIAÇÕES (LOCALSTORAGE + SENHA DE MODERAÇÃO)
   ========================================================================= */
interface ReviewItem {
  id: string;
  nome: string;
  nota: number;
  mensagem: string;
  criadoEm: string;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "def-1",
    nome: "Dra. Camila Nogueira",
    nota: 5,
    mensagem:
      "A Infinity Soluções superou todas as expectativas. Meu consultório hoje recebe agendamentos diretos e a autoridade visual da página é impecável.",
    criadoEm: "15/10/2026",
  },
  {
    id: "def-2",
    nome: "Roberto Mendes - CEO Nexus Log",
    nota: 5,
    mensagem:
      "Estrutura empresarial fantástica. Transição transparente, design moderno e segurança de ponta. Recomendo fortemente.",
    criadoEm: "22/10/2026",
  },
  {
    id: "def-3",
    nome: "Lucas Ferreira Consultoria",
    nota: 5,
    mensagem: "Velocidade inacreditável de entrega e um suporte humanizado que faz toda a diferença nos negócios.",
    criadoEm: "28/10/2026",
  },
];

const STORAGE_KEY = "infinity_avaliacoes_v1";

function ReviewSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    if (typeof window === "undefined") return DEFAULT_REVIEWS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignora erro de JSON parse
    }
    return DEFAULT_REVIEWS;
  });

  const [nome, setNome] = useState("");
  const [tipoContato, setTipoContato] = useState<"email" | "telefone">("email");
  const [contato, setContato] = useState("");
  const [nota, setNota] = useState(5);
  const [hoverNota, setHoverNota] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [, startTransition] = useTransition();

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (!nome.trim() || !contato.trim() || !mensagem.trim()) {
      setStatus("error");
      setFeedbackMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setStatus("submitting");

    const nova: ReviewItem = {
      id: Date.now().toString(),
      nome: nome.trim(),
      nota,
      mensagem: mensagem.trim(),
      criadoEm: new Date().toLocaleDateString("pt-BR"),
    };

    startTransition(() => {
      const atualizadas = [nova, ...reviews];
      setReviews(atualizadas);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas));
      } catch {
        // Ignora erro de storage cheio
      }
      setNome("");
      setContato("");
      setMensagem("");
      setNota(5);
      setStatus("success");
      setFeedbackMsg("Avaliação publicada com sucesso! Obrigado pelo feedback.");
    });
  };

  const handleConfirmarExclusao = () => {
    if (adminPassword !== "Bob@Marley") {
      setDeleteError("Senha incorreta. Apenas a administração pode excluir avaliações.");
      return;
    }

    if (!reviewToDelete) return;

    const filtradas = reviews.filter((r) => r.id !== reviewToDelete);
    setReviews(filtradas);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
    } catch {
      // Ignora erro
    }

    setDeleteModalOpen(false);
    setReviewToDelete(null);
    setAdminPassword("");
    setDeleteError("");
  };

  const mediaNota =
    reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.nota, 0) / reviews.length).toFixed(1) : "5.0";

  return (
    <section
      id="avaliacoes"
      className="relative z-10 border-t border-[#701C9D]/20 bg-[#0E0614]/70 py-24 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#B12CDE]/40 bg-[#701C9D]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#D56BF2]">
            <Star className="h-3.5 w-3.5 fill-current" />
            Experiências Reais
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-white md:text-5xl">O que nossos clientes dizem</h2>
          <p className="mt-3 text-base text-purple-200/70">
            Média geral de <span className="font-bold text-[#D56BF2]">{mediaNota} / 5.0</span> estrelas baseada na
            satisfação de quem confia na Infinity Soluções.
          </p>
        </div>

        {/* Grade de Avaliações */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="relative flex flex-col justify-between rounded-2xl border border-[#701C9D]/30 bg-[#14071D]/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-[#D56BF2]/50 hover:shadow-[0_10px_30px_rgba(177,44,222,0.15)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < rev.nota ? "fill-amber-400 text-amber-400" : "text-purple-900/40"}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setReviewToDelete(rev.id);
                      setDeleteModalOpen(true);
                      setDeleteError("");
                    }}
                    className="p-1 text-purple-400/40 hover:text-red-400 transition-colors cursor-pointer"
                    title="Excluir avaliação (Requer Senha)"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <Quote className="mt-4 h-8 w-8 text-[#701C9D]/40" />
                <p className="mt-2 text-sm leading-relaxed text-purple-100/90 italic">"{rev.mensagem}"</p>
              </div>

              <div className="mt-6 border-t border-[#701C9D]/20 pt-4 flex items-center justify-between text-xs text-purple-300/60">
                <span className="font-bold text-white">{rev.nome}</span>
                <span>{rev.criadoEm}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Formulário para Enviar Avaliação */}
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-[#701C9D]/40 bg-[#14071D]/90 p-8 shadow-2xl backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white text-center">Deixe sua avaliação</h3>
          <p className="mt-1 text-center text-xs text-purple-300/70">
            Seu depoimento ajuda outros empresários e autônomos a escolherem com segurança.
          </p>

          <form onSubmit={handleSalvar} className="mt-8 space-y-5">
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <label className="text-sm font-medium text-purple-200">Sua nota para nosso atendimento / serviço</label>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNota(star)}
                    onMouseEnter={() => setHoverNota(star)}
                    onMouseLeave={() => setHoverNota(0)}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= (hoverNota || nota) ? "fill-amber-400 text-amber-400" : "text-purple-900/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-purple-200">Nome completo *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome ou da sua empresa"
                  className="mt-1.5 w-full rounded-xl border border-[#701C9D]/40 bg-[#0A050F]/80 px-4 py-3 text-sm text-white placeholder-purple-300/30 outline-none transition-all focus:border-[#D56BF2] focus:ring-2 focus:ring-[#D56BF2]/20"
                />
              </div>

              <div>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-purple-200">Contato (Privado) *</label>
                  <div className="inline-flex rounded-lg border border-[#701C9D]/40 bg-[#0A050F]/90 p-0.5">
                    <button
                      type="button"
                      onClick={() => setTipoContato("email")}
                      className={`cursor-pointer rounded-md px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                        tipoContato === "email"
                          ? "bg-[#B12CDE] text-white shadow-sm shadow-[#B12CDE]/30"
                          : "text-purple-300/70 hover:text-white"
                      }`}
                    >
                      E-mail
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoContato("telefone")}
                      className={`cursor-pointer rounded-md px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                        tipoContato === "telefone"
                          ? "bg-[#B12CDE] text-white shadow-sm shadow-[#B12CDE]/30"
                          : "text-purple-300/70 hover:text-white"
                      }`}
                    >
                      WhatsApp / Tel
                    </button>
                  </div>
                </div>

                <input
                  type={tipoContato === "email" ? "email" : "tel"}
                  required
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  placeholder={tipoContato === "email" ? "seu@email.com" : "(11) 99999-0000"}
                  className="mt-1.5 w-full rounded-xl border border-[#701C9D]/40 bg-[#0A050F]/80 px-4 py-3 text-sm text-white placeholder-purple-300/30 outline-none transition-all focus:border-[#D56BF2] focus:ring-2 focus:ring-[#D56BF2]/20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-purple-200">
                Seu depoimento sobre o trabalho da Infinity Soluções *
              </label>
              <textarea
                required
                rows={4}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Conte-nos como foi sua experiência com nossos serviços..."
                className="mt-1.5 w-full rounded-xl border border-[#701C9D]/40 bg-[#0A050F]/80 px-4 py-3 text-sm text-white placeholder-purple-300/30 outline-none transition-all focus:border-[#D56BF2] focus:ring-2 focus:ring-[#D56BF2]/20"
              />
            </div>

            {feedbackMsg && (
              <p
                className={`text-center text-xs font-semibold ${
                  status === "error" ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {feedbackMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-full bg-gradient-to-r from-[#B12CDE] via-[#D56BF2] to-[#701C9D] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#701C9D]/30 transition-all hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              {status === "submitting" ? "Enviando..." : "Publicar Avaliação"}
            </button>
          </form>
        </div>
      </div>

      {/* Modal Seguro de Confirmação de Exclusão */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#701C9D]/50 bg-[#14071D] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-purple-200">
              <Lock className="h-5 w-5 text-[#D56BF2]" />
              <h4 className="text-base font-bold text-white">Confirmação de Segurança</h4>
            </div>
            <p className="mt-2 text-xs text-purple-300/70">
              Para evitar exclusões indevidas, insira a senha administrativa para remover esta avaliação.
            </p>

            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Digite a senha administrativa"
              className="mt-4 w-full rounded-xl border border-[#701C9D]/40 bg-[#0A050F] px-4 py-2.5 text-sm text-white placeholder-purple-300/30 outline-none focus:border-[#D56BF2]"
            />

            {deleteError && <p className="mt-2 text-xs text-rose-400">{deleteError}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setAdminPassword("");
                  setDeleteError("");
                }}
                className="rounded-lg px-4 py-2 text-xs text-purple-300 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarExclusao}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   PÁGINA PRINCIPAL
   ========================================================================= */
function IndexPage() {
  const options = [
    {
      to: "/individual",
      icon: UserCheck,
      img: retrato, // 💡 Foto real do modelo individual
      title: "Modelo Profissional Autônomo",
      text: "Ideal para médicos, advogados, consultores e especialistas que buscam autoridade imediata, agendamentos diretos e alta conversão.",
      tag: "Mais Popular",
    },
    {
      to: "/corporativo", // 💡 Rota corrigida para /corporativo
      icon: Briefcase,
      img: corpHero, // 💡 Foto real do modelo corporativo
      title: "Modelo Empresarial Completo",
      text: "Soluções robustas para pequenas, médias e grandes empresas: catálogo estruturado, captação B2B e infraestrutura corporativa.",
      tag: "Corporativo",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0A050F] text-slate-100 overflow-x-hidden selection:bg-[#B12CDE] selection:text-white">
      {/* Sistema Geométrico e Parallax */}
      <BackgroundInfinityMesh />

      {/* Barra Lateral de Progresso e Seções */}
      <SideNavTracker />

      {/* Conteúdo Principal (Hero) */}
      <main id="inicio" className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-10 md:pt-20">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#B12CDE]/40 bg-[#701C9D]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#D56BF2] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D56BF2] animate-ping" />
            Soluções empresariais e sites personalizados
          </p>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
            Sua presença digital no patamar de{" "}
            <span className="bg-gradient-to-r from-[#D56BF2] via-[#B12CDE] to-[#701C9D] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(213,107,242,0.4)]">
              grandes líderes
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-purple-200/80 md:text-xl">
            Criamos plataformas de alto padrão, combinando estética sofisticada, segurança de dados e máxima performance
            comercial. Selecione um formato e veja o impacto gerado para seu negócio.
          </p>
        </div>

        {/* Grid de Modelos com Glassmorphism Dark Premium */}
        {/* Grid de Modelos com Efeito Hover */}
        <div id="modelos" className="mt-16 grid gap-8 md:grid-cols-2">
          {options.map(({ to, icon: Icon, img, title, text, tag }) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden rounded-3xl border border-[#701C9D]/30 bg-[#14071D]/75 p-2 shadow-[0_12px_40px_rgba(10,5,15,0.6)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#D56BF2]/60 hover:shadow-[0_20px_50px_rgba(177,44,222,0.25)]"
            >
              <div className="relative h-64 overflow-hidden rounded-2xl">
                <img
                  src={img}
                  alt={title}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-[2px] group-hover:brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A050F] via-[#0A050F]/40 to-transparent transition-opacity group-hover:opacity-90" />

                {/* Texto 'Clique para saber mais' no centro que surge no hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#D56BF2]/60 bg-[#701C9D]/85 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(213,107,242,0.5)] backdrop-blur-md">
                    Clique para saber mais
                    <ChevronRight className="h-4 w-4 text-[#D56BF2]" />
                  </span>
                </div>

                <span className="absolute top-4 right-4 rounded-full border border-[#D56BF2]/40 bg-[#701C9D]/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  {tag}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-[#D56BF2]">
                  <div className="rounded-xl border border-[#701C9D]/50 bg-[#701C9D]/20 p-2.5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#D56BF2]">{title}</h3>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-purple-200/70">{text}</p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#D56BF2] transition-all group-hover:translate-x-1">
                  Explorar demonstração completa
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pilares de Segurança e Modernidade */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-4 rounded-2xl border border-[#701C9D]/30 bg-[#14071D]/60 p-5 backdrop-blur-md">
            <div className="rounded-xl bg-[#701C9D]/25 p-2 text-[#D56BF2]">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">Máxima Blindagem</h4>
              <p className="mt-1 text-xs text-purple-300/70">
                Padrões rígidos de privacidade e proteção técnica de dados.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-[#701C9D]/30 bg-[#14071D]/60 p-5 backdrop-blur-md">
            <div className="rounded-xl bg-[#701C9D]/25 p-2 text-[#D56BF2]">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">Carregamento Instantâneo</h4>
              <p className="mt-1 text-xs text-purple-300/70">
                Otimizado para reter visitantes e converter leads com agilidade.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-[#701C9D]/30 bg-[#14071D]/60 p-5 backdrop-blur-md">
            <div className="rounded-xl bg-[#701C9D]/25 p-2 text-[#D56BF2]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">Identidade Memorável</h4>
              <p className="mt-1 text-xs text-purple-300/70">
                Design proprietário desenvolvido para diferenciar sua marca no mercado.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Formulário Geral de Contato */}
      <div id="contato" className="relative z-10 mx-auto max-w-4xl px-5 pb-24">
        <ContactForm />
      </div>

      {/* Área de Avaliações */}
      <ReviewSection />

      {/* Rodapé Oficial Infinity Soluções (Frase primeiro, logo depois, tudo centralizado) */}
      <footer className="relative z-10 border-t border-[#701C9D]/20 bg-[#0A050F] py-12 text-center text-xs text-purple-300/60">
        <div className="mb-6 flex justify-center">
          <p className="inline-flex items-center gap-3 rounded-full border border-[#B12CDE]/40 bg-[#701C9D]/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#D56BF2] backdrop-blur-md">
            {/* 3 pontos animados à esquerda com espaçamento idêntico (gap-1.5) */}
            <span className="inline-flex items-center gap-1.5" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D56BF2] animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D56BF2] animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D56BF2] animate-bounce [animation-delay:300ms]" />
            </span>

            <span>Site sujeito a alterações</span>

            {/* 3 pontos animados à direita com espaçamento idêntico (gap-1.5) */}
            <span className="inline-flex items-center gap-1.5" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D56BF2] animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D56BF2] animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D56BF2] animate-bounce [animation-delay:300ms]" />
            </span>
          </p>
        </div>

        <img
          src={infinityLogo.url}
          alt="Logo Infinity Soluções"
          className="mx-auto h-36 w-auto object-contain opacity-90 transition-opacity hover:opacity-100"
        />
      </footer>
    </div>
  );
}
