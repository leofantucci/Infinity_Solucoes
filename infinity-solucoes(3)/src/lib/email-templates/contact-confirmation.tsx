import React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

function Confirmation({ nome = "Cliente", mensagem = "", resumo = "", tipo = "", finalidade = "contato", nota }: { nome?: string; mensagem?: string; resumo?: string; tipo?: string; finalidade?: string; nota?: number }) {
  return <Html lang="pt-BR"><Head /><Preview>Cópia do seu envio à Infinity Soluções</Preview><Body style={{ backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" }}><Container style={{ maxWidth: "560px", padding: "28px 24px" }}>
    <Heading>Cópia do seu envio</Heading><Text>Olá, {nome}. Esta é a cópia do seu {finalidade} enviado à Infinity Soluções.</Text><Text>Tipo: {tipo}</Text>{nota && <Text>Nota: {nota}/5</Text>}<Text style={{ whiteSpace: "pre-wrap" }}>{mensagem}</Text>{resumo && <Text style={{ whiteSpace: "pre-wrap" }}>{resumo}</Text>}
  </Container></Body></Html>;
}
export const template = { component: Confirmation, subject: "Cópia do seu envio | Infinity Soluções", displayName: "Confirmação de contato", previewData: { nome: "Maria", tipo: "Perfil Individual", mensagem: "Gostaria de um orçamento." } } satisfies TemplateEntry;