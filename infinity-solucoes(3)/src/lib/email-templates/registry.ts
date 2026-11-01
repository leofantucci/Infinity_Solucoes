import type { ComponentType } from "react";
import React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import { template as newLeadTemplate } from "./new-lead";
import { template as confirmationTemplate } from "./contact-confirmation";

export interface TemplateEntry {
  component: ComponentType<any>;
  subject: string | ((data: Record<string, any>) => string);
  displayName?: string;
  previewData?: Record<string, any>;
  to?: string;
}

// 1. Template para o cliente (agradecimento com avaliação)
function ReviewCustomerEmail({ nome = "Cliente", nota = 5, mensagem, tipoContato, contato }: { nome?: string; nota?: number; mensagem?: string; tipoContato?: string; contato?: string }) {
  const tipoTexto = tipoContato === "email" ? "E-mail" : "WhatsApp / Telefone";
  return React.createElement(
    Html,
    { lang: "pt-BR" },
    React.createElement(Head),
    React.createElement(Preview, null, "Agradecemos sua avaliação"),
    React.createElement(
      Body,
      { style: { backgroundColor: "#faf5ff", fontFamily: "Arial, sans-serif", padding: "24px 0" } },
      React.createElement(
        Container,
        {
          style: {
            maxWidth: "560px",
            backgroundColor: "#ffffff",
            padding: "32px 24px",
            borderRadius: "16px",
            border: "1px solid #f3e8ff",
          },
        },
        React.createElement(
          Heading,
          { style: { color: "#650c83", fontSize: "24px", marginBottom: "16px" } },
          "Infinity Soluções",
        ),
        React.createElement(
          Text,
          { style: { fontSize: "16px", color: "#1f2937", lineHeight: "1.6" } },
          "Olá ",
          React.createElement("strong", null, nome),
          ", muito obrigado por deixar uma avaliação no nosso site! Sua opinião é muito importante e ficamos felizes em ouvir você!",
        ),
        React.createElement(
          Text,
          { style: { fontSize: "14px", color: "#6b7280", marginTop: "20px" } },
          `Nota: ${"★".repeat(nota)}${"☆".repeat(5 - nota)} (${nota}/5 estrelas)`,
        ),
        ...(mensagem ? [
          React.createElement(
            Text,
            {
              style: {
                marginTop: "16px",
                padding: "16px",
                backgroundColor: "#f3f4f6",
                borderRadius: "8px",
                whiteSpace: "pre-wrap",
              },
            },
            mensagem,
          ),
        ] : []),
        React.createElement(
          Text,
          { style: { marginTop: "16px", fontSize: "12px", color: "#6b7280" } },
          `Contato: ${tipoTexto} ${contato || "—"}`,
        ),
        React.createElement(
          Text,
          {
            style: {
              fontSize: "12px",
              color: "#9ca3af",
              marginTop: "28px",
              borderTop: "1px solid #f3e8ff",
              paddingTop: "14px",
            },
          },
          "Infinity Soluções · contato@infinity-solucoes.com",
        ),
      ),
    ),
  );
}

// 2. Template de notificação para você
function ReviewNotificationEmail({ nome, tipoContato, contato, nota = 5, mensagem }: any) {
  return React.createElement(
    Html,
    { lang: "pt-BR" },
    React.createElement(Head),
    React.createElement(Preview, null, `Nova avaliação no site (${nota}/5 estrelas)`),
    React.createElement(
      Body,
      { style: { backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif", padding: "24px 0" } },
      React.createElement(
        Container,
        {
          style: {
            maxWidth: "560px",
            backgroundColor: "#ffffff",
            padding: "32px 24px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          },
        },
        React.createElement(Heading, { style: { color: "#650c83", fontSize: "20px" } }, "⭐ Nova Avaliação Recebida"),
        React.createElement(Text, null, React.createElement("strong", null, "Nome: "), nome),
        React.createElement(
          Text,
          null,
          React.createElement("strong", null, tipoContato === "email" ? "E-mail: " : "Telefone: "),
          contato,
        ),
        React.createElement(
          Text,
          null,
          React.createElement("strong", null, "Nota: "),
          `${"★".repeat(nota)}${"☆".repeat(5 - nota)} (${nota}/5)`,
        ),
        React.createElement(
          Text,
          {
            style: {
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
            },
          },
          mensagem,
        ),
      ),
    ),
  );
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  "new-lead": newLeadTemplate,
  "contact-confirmation": confirmationTemplate,
  "review-customer": {
    component: ReviewCustomerEmail,
    subject: "Agradecemos sua avaliação | Infinity Soluções",
    displayName: "Agradecimento de Avaliação",
  },
  "review-notification": {
    component: ReviewNotificationEmail,
    subject: "Nova Avaliação de Cliente | Infinity Soluções",
    displayName: "Notificação de Avaliação",
  },
};
