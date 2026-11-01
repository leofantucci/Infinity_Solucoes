import { createFileRoute } from "@tanstack/react-router";
import { CorporateSite } from "@/components/templates/corporate-site";
import { EditorShell, Field, Group, ImageField, ListField, PalettePicker } from "@/components/editor";
import { corporateDefaults, usePersisted, type CorporateConfig } from "@/lib/site-config";
import corpHero from "@/assets/corp-hero.jpg";

export const Route = createFileRoute("/corporativo")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      {
        title: "Perfil Corporativo | Sites para Empresas | Infinity Soluções",
      },
      {
        name: "description",
        content:
          "Conheça o modelo de Perfil Corporativo da Infinity Soluções. Uma opção de site institucional personalizado para empresas apresentarem seus serviços, equipe, diferenciais e formas de contato.",
      },
      {
        name: "robots",
        content: "noindex, follow",
      },
      {
        name: "googlebot",
        content: "noindex, follow",
      },
      {
        property: "og:title",
        content: "Perfil Corporativo | Infinity Soluções",
      },
      {
        property: "og:description",
        content:
          "Um modelo de site institucional personalizado para empresas fortalecerem sua presença digital e apresentarem seus negócios.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://infinity-solucoes.com/corporativo",
      },
      {
        property: "og:site_name",
        content: "Infinity Soluções",
      },
      {
        property: "og:locale",
        content: "pt_BR",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Perfil Corporativo | Infinity Soluções",
      },
      {
        name: "twitter:description",
        content: "Sites institucionais personalizados para empresas e negócios.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://infinity-solucoes.com/corporativo",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const [c, setC, reset] = usePersisted<CorporateConfig>("laf-corporativo", corporateDefaults);

  const set =
    <K extends keyof CorporateConfig>(k: K) =>
    (v: CorporateConfig[K]) =>
      setC((p) => ({ ...p, [k]: v }));

  const t = (k: keyof CorporateConfig, label: string, long?: boolean) => (
    <Field label={label} value={c[k] as string} onChange={set(k) as (v: string) => void} long={long} />
  );

  return (
    <>
      <CorporateSite c={c} />

      <EditorShell title="Seu site, com sua cara!" onReset={reset}>
        <Group title="Paleta de cores">
          <PalettePicker value={c.palette} onChange={set("palette")} />
        </Group>

        <Group title="Sua empresa">
          {t("empresa", "Nome da empresa")}
          {t("sigla", "Sigla do logo (2 letras)")}
          {t("segmento", "Segmento")}
          {t("cidade", "Cidade")}
          {t("selo1", "Selo 1 (CNPJ, registro...)")}
          {t("selo2", "Selo 2 (anos de mercado...)")}
          {t("horarioResumo", "Horário (linha 1)")}
          {t("horarioResumo2", "Horário (linha 2)")}
          <ImageField label="Foto principal" value={c.fotoHero} onChange={set("fotoHero")} />
        </Group>

        <Group title="Textos">
          {t("titulo", "Frase principal")}
          {t("destaque", "Trecho em destaque")}
          {t("subtitulo", "Subtítulo", true)}
        </Group>

        <Group title="Sobre">
          {t("sobreTitulo", "Título")}
          {t("sobreTexto", "Texto", true)}
          {t("responsavel", "Responsável")}
          {t("diferencial", "Diferencial")}
          <ImageField label="Foto da seção" value={c.fotoSobre} onChange={set("fotoSobre")} />
        </Group>

        <Group title="Serviços">
          {t("servicosTitulo", "Título da seção")}
          <ListField
            items={c.servicos}
            onChange={set("servicos")}
            addLabel="Adicionar serviço"
            make={() => ({ t: "Novo serviço", d: "Descrição" })}
            render={(s, u) => (
              <>
                <Field label="Nome" value={s.t} onChange={(v) => u({ t: v })} />
                <Field label="Descrição" value={s.d} onChange={(v) => u({ d: v })} />
              </>
            )}
          />
        </Group>

        <Group title="Equipe">
          {t("equipeTitulo", "Título da seção")}
          <ListField
            items={c.equipe}
            onChange={set("equipe")}
            addLabel="Adicionar pessoa"
            make={() => ({
              nome: "Nome",
              cargo: "Cargo · Formações",
              registro: "Registro",
            })}
            render={(m, u) => (
              <>
                <Field label="Nome" value={m.nome} onChange={(v) => u({ nome: v })} />
                <Field label="Cargo e formações" value={m.cargo} onChange={(v) => u({ cargo: v })} />
                <Field label="Registro" value={m.registro} onChange={(v) => u({ registro: v })} />
              </>
            )}
          />
        </Group>

        <Group title="Galeria">
          <ListField
            items={c.galeria}
            onChange={set("galeria")}
            addLabel="Adicionar foto"
            make={() => ({ img: corpHero, t: "Legenda" })}
            render={(g, u) => (
              <>
                <ImageField label="Trocar foto" value={g.img} onChange={(v) => u({ img: v })} />
                <Field label="Legenda" value={g.t} onChange={(v) => u({ t: v })} />
              </>
            )}
          />
        </Group>

        <Group title="Contato">
          {t("contatoTitulo", "Título")}
          {t("contatoTexto", "Texto", true)}
          {t("whatsapp", "WhatsApp")}
          {t("telefone", "Telefone")}
          {t("endereco", "Endereço")}
          {t("instagram", "Instagram (sem o @)")}
          {t("facebook", "Link do Facebook")}
          <ListField
            items={c.horarios}
            onChange={set("horarios")}
            addLabel="Adicionar horário"
            make={() => ({ day: "Dia", time: "Horário" })}
            render={(h, u) => (
              <>
                <Field label="Dia" value={h.day} onChange={(v) => u({ day: v })} />
                <Field label="Horário" value={h.time} onChange={(v) => u({ time: v })} />
              </>
            )}
          />
        </Group>
      </EditorShell>
    </>
  );
}
