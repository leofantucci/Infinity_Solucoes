import { z } from "zod";
import { palettes, type IndividualConfig, type CorporateConfig } from "./site-config";

export const CONTACT_WHATSAPP = "5511924762202";
export const OWNER_EMAIL = "infinitysolucoes77@gmail.com";
export const contactSchema = z
  .object({
    nome: z.string().trim().min(2, "Informe seu nome").max(100),
    finalidade: z.enum(["contato", "orcamento", "avaliacao"]).default("contato"),
    nota: z.number().int().min(1).max(5).optional(),
    resumo: z.string().max(60000).optional(),
    website: z.string().max(0).optional(),
    tipo: z.enum(["individual", "corporativo"]),
    contatoTipo: z.enum(["email", "telefone"]).default("email"),
    contato: z
      .string()
      .trim()
      .email("E-mail inválido").max(255)
      .optional()
      .refine((val) => val !== undefined && val !== "", {
        message: "Informe um e-mail válido",
      }),
    telefone: z
      .string()
      .trim()
      .regex(/^[\d\s()+-]{8,20}$/, "Telefone inválido")
      .optional(),
    mensagem: z.string().trim().min(10, "Descreva um pouco mais").max(2000),
  })
  .refine(
    (data) => {
      if (data.contatoTipo === "email") {
        return data.contato !== undefined && data.contato !== "" && data.contato?.includes("@");
      }
      return (
        data.telefone !== undefined && data.telefone !== "" && /^[\d\s()+-]{8,20}$/.test(data.telefone)
      );
    },
    {
      message:
        "Informe um e-mail válido ou um telefone com DDD (8-20 dígitos)",
      path: ["contato"],
    }
  );
export type ContactData = z.infer<typeof contactSchema>;
export const profileLabel = (type: ContactData["tipo"]) =>
  type === "individual" ? "Perfil Individual" : "Perfil Corporativo";
export function contactMessage(data: ContactData) {
  return [
    "Olá, Infinity Soluções!",
    "",
    data.finalidade === "avaliacao" ? "AVALIAÇÃO" : data.finalidade === "orcamento" ? "PEDIDO DE ORÇAMENTO" : "CONTATO",
    `• Nome: ${data.nome}`,
    ...(data.contatoTipo === "email" ? [`• E-mail: ${data.contato}`] : [`• Telefone: ${data.telefone}`]),
    ...(data.nota ? [`• Nota: ${data.nota}/5`] : []),
    `• Mensagem: ${data.mensagem}`,
    ...(data.resumo ? ["", "PERSONALIZAÇÕES DO SITE", data.resumo] : []),
  ].join("\n");
}
export function contactWhatsApp = (data: ContactData) =>
  `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(contactMessage(data))}`;

const labels: Record<string, string> = {
  nome: "Nome",
  profissao: "Profissão",
  registro: "Registro profissional",
  marca: "Marca / empresa",
  cidade: "Cidade",
  titulo: "Frase principal",
  destaque: "Trecho em destaque",
  subtitulo: "Subtítulo",
  intro: "Sobre você",
  foto: "Foto pessoal",
  fotoAmbiente: "Foto do ambiente",
  formacoes: "Formações",
  label: "Título",
  text: "Descrição",
  servicosTitulo: "Título da seção de serviços",
  servicos: "Serviços",
  title: "Nome do serviço",
  img: "Foto",
  instagram: "Instagram",
  instagramTexto: "Texto do Instagram",
  galeria: "Galeria",
  whatsapp: "WhatsApp do modelo",
  telefone: "Telefone do modelo",
  email: "E-mail do modelo",
  endereco: "Endereço",
  horarios: "Horários",
  day: "Dia",
  time: "Horário",
  empresa: "Nome da empresa",
  sigla: "Sigla do logo",
  segmento: "Segmento",
  selo1: "Selo 1",
  selo2: "Selo 2",
  horarioResumo: "Horário resumido 1",
  horarioResumo2: "Horário resumido 2",
  fotoHero: "Foto principal",
  fotoSobre: "Foto da seção sobre",
  sobreTitulo: "Título sobre a empresa",
  sobreTexto: "Sobre a empresa",
  responsavel: "Responsável",
  diferencial: "Diferencial",
  t: "Título / legenda",
  d: "Descrição",
  equipeTitulo: "Título da equipe",
  equipe: "Equipe",
  cargo: "Cargo e formações",
  contatoTitulo: "Título do contato",
  contatoTexto: "Texto do contato",
  facebook: "Facebook",
};
function readableImage(value: string) {
  if (value.startsWith("data:image/"))
    return "Foto personalizada selecionada (enviar o arquivo separadamente no WhatsApp)";
  if (value.startsWith("/")) return `https://infinity-solucoes.com${value}`;
  return value;
}
export function quoteSummary(config: IndividualConfig | CorporateConfig): string {
  const palette = palettes.find((p) => p.id === config.palette);
  const lines = [
    "PALETA DE CORES",
    `• Paleta: ${palette?.nome ?? config.palette}`,
    ...(palette
      ? [
          `• Principal: ${palette.primary}`,
          `• Destaque: ${palette.accent}`,
          `• Texto de destaque: ${palette.ink}`,
          `• Texto sobre destaque: ${palette.accentFg}`,
        ]
      : []),
  ];
  function append(key: string, value: unknown, indent = "") {
    const label = labels[key] ?? key;
    if (Array.isArray(value)) {
      lines.push("", `${indent}${label.toUpperCase()}`);
      value.forEach((item, index) => {
        if (typeof item === "string") lines.push(`${indent}• Foto ${index + 1}: ${readableImage(item)}`);
        else {
          lines.push(`${indent}• Item ${index + 1}`);
          for (const [k, v] of Object.entries(item)) append(k, v, `${indent}  `);
        }
      });
      if (!value.length) lines.push(`${indent}• Nenhum item`);
    } else if (typeof value === "string") {
      const image = /^(foto|img)/.test(key);
      lines.push(`${indent}• ${label}: ${image ? readableImage(value) : value || "Não informado"}`);
    }
  }
  lines.push("", "IDENTIFICAÇÃO, TEXTOS E CONTATO");
  for (const [key, value] of Object.entries(config)) if (key !== "palette") append(key, value);
  return lines.join("\n");
}
