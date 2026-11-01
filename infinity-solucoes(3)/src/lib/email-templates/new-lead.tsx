import React from "react";
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  nome?: string;
  telefone?: string;
  email?: string;
  tipo?: string;
  mensagem?: string;
  resumo?: string;
  nota?: number;
  finalidade?: string;
}

const NewLead = ({
  nome = "—",
  telefone = "—",
  email = "—",
  tipo = "—",
  mensagem = "—",
  resumo,
  nota,
  finalidade = "contato",
}: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Novo pedido de site de {nome}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Infinity Soluções</Text>
        <Heading style={h1}>Novo pedido de site</Heading>
        <Section style={box}>
          <Text style={row}>
            <b>Nome:</b> {nome}
          </Text>
          <Text style={row}>
            <b>Telefone:</b> {telefone}
          </Text>
          <Text style={row}>
            <b>E-mail:</b> {email}
          </Text>
          <Text style={row}>
            <b>Tipo de site:</b> {tipo}
          </Text>
          <Text style={row}>
            <b>Finalidade:</b> {finalidade}
          </Text>
          {nota && (
            <Text style={row}>
              <b>Nota:</b> {nota}/5
            </Text>
          )}
        </Section>
        <Hr style={hr} />
        <Text style={label}>Mensagem</Text>
        <Text style={msg}>{mensagem}</Text>
        {resumo && <Text style={msg}>{resumo}</Text>}
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: NewLead,
  subject: (d: Record<string, any>) => `Novo pedido de site: ${d?.["nome"] ?? "cliente"} (${d?.["tipo"] ?? ""})`,
  displayName: "Novo pedido de site",
  to: "infinitysolucoes77@gmail.com",
  previewData: {
    nome: "Maria Silva",
    telefone: "(11) 99999-0000",
    email: "maria@exemplo.com",
    tipo: "Perfil Individual",
    mensagem: "Quero um site para meu consultório.",
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" };
const container = { padding: "28px 24px", maxWidth: "560px" };
const brand = {
  color: "#b7791f",
  fontSize: "12px",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  margin: 0,
};
const h1 = { color: "#1e3a8a", fontSize: "24px", margin: "8px 0 20px" };
const box = { backgroundColor: "#f5f7fb", padding: "12px 18px", borderRadius: "8px" };
const row = { fontSize: "14px", color: "#222", margin: "6px 0" };
const hr = { borderColor: "#e5e7eb", margin: "20px 0" };
const label = { fontSize: "12px", color: "#666", textTransform: "uppercase" as const, margin: 0 };
const msg = { fontSize: "15px", color: "#222", whiteSpace: "pre-wrap" as const };
