import { useEffect, useState } from "react";
import retrato from "@/assets/ind-retrato.jpg";
import ambiente from "@/assets/ind-ambiente.jpg";
import srv1 from "@/assets/srv-1.jpg";
import srv2 from "@/assets/srv-2.jpg";
import srv3 from "@/assets/srv-3.jpg";
import corpHero from "@/assets/corp-hero.jpg";
import corpEquipe from "@/assets/corp-equipe.jpg";
import corpAtendimento from "@/assets/corp-atendimento.jpg";

export type Palette = {
  id: string;
  nome: string;
  significado: string;
  primary: string;
  accent: string;
  ink: string;
  accentFg: string;
};

// Combinações baseadas na psicologia das cores (arquivo cores.txt).
export const palettes: Palette[] = [
  {
    id: "azul-dourado",
    nome: "Azul & Dourado",
    significado: "Confiança, segurança e prestígio",
    primary: "#1E40AF",
    accent: "#F59E0B",
    ink: "#B45309",
    accentFg: "#000000",
  },
  {
    id: "preto-dourado",
    nome: "Preto & Dourado",
    significado: "Elegância, autoridade e sucesso",
    primary: "#000000",
    accent: "#F59E0B",
    ink: "#B45309",
    accentFg: "#000000",
  },
  {
    id: "verde-dourado",
    nome: "Verde & Dourado",
    significado: "Saúde, crescimento e prosperidade",
    primary: "#14532D",
    accent: "#F59E0B",
    ink: "#B45309",
    accentFg: "#000000",
  },
  {
    id: "turquesa",
    nome: "Turquesa",
    significado: "Bem-estar, clareza e comunicação",
    primary: "#0E7C86",
    accent: "#67E8F9",
    ink: "#0E7C86",
    accentFg: "#000000",
  },
  {
    id: "azul-claro",
    nome: "Azul Sereno",
    significado: "Profissionalismo e tranquilidade",
    primary: "#1E40AF",
    accent: "#93C5FD",
    ink: "#3B82F6",
    accentFg: "#000000",
  },
  {
    id: "roxo",
    nome: "Roxo",
    significado: "Exclusividade, sabedoria e luxo",
    primary: "#650C83",
    accent: "#D56BF2",
    ink: "#A42FAE",
    accentFg: "#2A0A38",
  },
  {
    id: "marrom-bege",
    nome: "Marrom & Bege",
    significado: "Aconchego, estabilidade e naturalidade",
    primary: "#78350F",
    accent: "#D2B48C",
    ink: "#A16207",
    accentFg: "#000000",
  },
  {
    id: "rosa",
    nome: "Rosa",
    significado: "Cuidado, delicadeza e proximidade",
    primary: "#DB2777",
    accent: "#F9A8D4",
    ink: "#DB2777",
    accentFg: "#000000",
  },
];

export const getPalette = (id: string) => palettes.find((p) => p.id === id) ?? palettes[0]!;

export function paletteStyle(id: string): React.CSSProperties {
  const p = getPalette(id);
  return {
    "--primary": p.primary,
    "--primary-foreground": "#FFFFFF",
    "--accent": p.accent,
    "--accent-foreground": p.accentFg,
    "--accent-ink": p.ink,
    "--ring": p.ink,
    "--deep": `color-mix(in oklab, ${p.primary} 75%, black)`,
    "--deep-2": p.primary,
  } as React.CSSProperties;
}

export const CONTACT_WHATSAPP = "5511924762202";
export const CONTACT_WHATSAPP_DISPLAY = "(11) 92476-2202";

/** Converte qualquer telefone em dígitos com DDI 55. */
export function phoneDigits(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (!d) return "";
  return d.length <= 11 ? `55${d}` : d;
}

export function waLink(phone: string, msg: string) {
  return `https://wa.me/${phoneDigits(phone)}?text=${encodeURIComponent(msg)}`;
}

export const igUrl = (handle: string) => `https://www.instagram.com/${handle.replace(/^@/, "")}/`;
export const mapsEmbed = (addr: string) => `https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`;
export const mapsUrl = (addr: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;

export type Hour = { day: string; time: string };

export type IndividualConfig = {
  palette: string;
  nome: string;
  profissao: string;
  registro: string;
  marca: string;
  cidade: string;
  titulo: string;
  destaque: string;
  subtitulo: string;
  intro: string;
  foto: string;
  fotoAmbiente: string;
  formacoes: { label: string; text: string }[];
  servicosTitulo: string;
  servicos: { title: string; text: string; img: string }[];
  instagram: string;
  instagramTexto: string;
  galeria: string[];
  whatsapp: string;
  telefone: string;
  email: string;
  endereco: string;
  horarios: Hour[];
};

export const individualDefaults: IndividualConfig = {
  palette: "roxo",
  nome: "Seu Nome",
  profissao: "Sua Profissão",
  registro: "Seu Registro Profissional",
  marca: "Sua Empresa",
  cidade: "Sua Cidade/UF",
  titulo: "Sua frase de impacto com uma palavra em",
  destaque: "destaque",
  subtitulo: "Descreva em uma ou duas linhas o que você faz e como transforma a vida dos seus clientes.",
  intro: "Conte um pouco da sua trajetória, sua experiência e o que torna o seu atendimento único.",
  foto: retrato,
  fotoAmbiente: ambiente,
  formacoes: [
    { label: "Graduação", text: "Sua graduação pela Sua Universidade." },
    { label: "Especialização", text: "Sua especialização ou pós-graduação." },
    { label: "Mestrado", text: "Seu mestrado ou curso avançado." },
    { label: "Experiência", text: "Seus principais cargos e conquistas." },
  ],
  servicosTitulo: "Seus serviços, do primeiro contato ao resultado.",
  servicos: [
    { title: "Seu Serviço 1", text: "Breve descrição do seu primeiro serviço.", img: srv1 },
    { title: "Seu Serviço 2", text: "Breve descrição do seu segundo serviço.", img: srv2 },
    { title: "Seu Serviço 3", text: "Breve descrição do seu terceiro serviço.", img: srv3 },
    { title: "Seu Serviço 4", text: "Breve descrição do seu quarto serviço.", img: ambiente },
    { title: "Seu Serviço 5", text: "Breve descrição do seu quinto serviço.", img: retrato },
    { title: "Seu Serviço 6", text: "Breve descrição do seu sexto serviço.", img: srv1 },
  ],
  instagram: "seuperfil",
  instagramTexto: "Conteúdos e novidades toda semana.",
  galeria: [srv1, srv2, srv3, ambiente, retrato, srv1],
  whatsapp: "(00) 00000-0000",
  telefone: "(00) 00000-0000",
  email: "seuemail@empresa.com",
  endereco: "Seu endereço, número — Sua Cidade/UF",
  horarios: [
    { day: "Segunda a Sexta", time: "das 8h às 18h" },
    { day: "Sábado", time: "das 8h às 12h" },
    { day: "Domingo", time: "Fechado" },
  ],
};

export type CorporateConfig = {
  palette: string;
  empresa: string;
  sigla: string;
  segmento: string;
  cidade: string;
  titulo: string;
  destaque: string;
  subtitulo: string;
  selo1: string;
  selo2: string;
  horarioResumo: string;
  horarioResumo2: string;
  fotoHero: string;
  fotoSobre: string;
  sobreTitulo: string;
  sobreTexto: string;
  responsavel: string;
  diferencial: string;
  servicosTitulo: string;
  servicos: { t: string; d: string }[];
  equipeTitulo: string;
  equipe: { nome: string; cargo: string; registro: string }[];
  galeria: { img: string; t: string }[];
  contatoTitulo: string;
  contatoTexto: string;
  whatsapp: string;
  telefone: string;
  endereco: string;
  instagram: string;
  facebook: string;
  horarios: Hour[];
};

export const corporateDefaults: CorporateConfig = {
  palette: "roxo",
  empresa: "Sua Empresa",
  sigla: "SE",
  segmento: "Seu segmento",
  cidade: "Sua Cidade",
  titulo: "Sua empresa em",
  destaque: "mãos de confiança.",
  subtitulo: "Apresente em poucas linhas os serviços da sua empresa e o que faz vocês serem a melhor escolha.",
  selo1: "Seu CNPJ ou registro",
  selo2: "Seus anos de experiência",
  horarioResumo: "Seg a Sex · 08h às 18h",
  horarioResumo2: "Sábado · 08h às 12h",
  fotoHero: corpHero,
  fotoSobre: corpAtendimento,
  sobreTitulo: "Sua missão em uma frase marcante.",
  sobreTexto: "Conte a história da sua empresa, seus valores e como vocês cuidam de cada cliente.",
  responsavel: "Seu Nome · Seu Cargo",
  diferencial: "Seu principal diferencial competitivo.",
  servicosTitulo: "Tudo o que seu cliente precisa, em um só lugar.",
  servicos: [
    { t: "Seu Serviço 1", d: "Descrição curta do serviço." },
    { t: "Seu Serviço 2", d: "Descrição curta do serviço." },
    { t: "Seu Serviço 3", d: "Descrição curta do serviço." },
    { t: "Seu Serviço 4", d: "Descrição curta do serviço." },
    { t: "Seu Serviço 5", d: "Descrição curta do serviço." },
    { t: "Seu Serviço 6", d: "Descrição curta do serviço." },
  ],
  equipeTitulo: "Profissionais em quem você pode confiar.",
  equipe: [
    { nome: "Nome do Sócio", cargo: "Cargo · Suas formações", registro: "Registro 00000" },
    { nome: "Nome da Diretora", cargo: "Cargo · Suas formações", registro: "Registro 00000" },
    { nome: "Nome do Gerente", cargo: "Cargo · Suas formações", registro: "Registro 00000" },
    { nome: "Nome da Consultora", cargo: "Cargo · Suas formações", registro: "Registro 00000" },
  ],
  galeria: [
    { img: corpHero, t: "Nosso ambiente" },
    { img: corpAtendimento, t: "Atendimento próximo" },
    { img: corpEquipe, t: "Nossa equipe" },
    { img: srv3, t: "Treinamentos e eventos" },
  ],
  contatoTitulo: "Vamos conversar sobre o seu projeto?",
  contatoTexto: "Fale com a nossa equipe pelo WhatsApp e receba um atendimento personalizado.",
  whatsapp: "(00) 00000-0000",
  telefone: "(00) 0000-0000",
  endereco: "Seu endereço, número - Bairro, Sua Cidade - UF",
  instagram: "suaempresa",
  facebook: "https://www.facebook.com/suaempresa",
  horarios: [
    { day: "Segunda a sexta", time: "08:00 – 18:00" },
    { day: "Sábado", time: "08:00 – 12:00" },
    { day: "Domingo", time: "Fechado" },
  ],
};

/** Guarda a personalização do cliente no navegador. */
export function usePersisted<T extends object>(key: string, defaults: T) {
  const [value, setValue] = useState<T>(defaults);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) setValue({ ...defaults, ...JSON.parse(s) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota */
    }
  }, [key, value, loaded]);
  return [value, setValue, () => setValue(defaults)] as const;
}

/** Reduz a imagem enviada para caber no navegador. */
export function fileToDataUrl(file: File, max = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
