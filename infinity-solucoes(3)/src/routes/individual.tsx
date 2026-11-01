import { createFileRoute } from "@tanstack/react-router";
import { IndividualSite } from "@/components/templates/individual-site";
import { EditorShell, Field, Group, ImageField, ListField, PalettePicker } from "@/components/editor";
import { individualDefaults, usePersisted, type IndividualConfig } from "@/lib/site-config";
import srv1 from "@/assets/srv-1.jpg";

export const Route = createFileRoute("/individual")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      {
        title: "Perfil Individual | Sites Personalizados | Infinity Soluções",
      },
      {
        name: "description",
        content:
          "Conheça o modelo de Perfil Individual da Infinity Soluções. Uma opção de site personalizado para profissionais que desejam apresentar sua trajetória, formações, serviços e contatos na internet.",
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
        content: "Perfil Individual | Infinity Soluções",
      },
      {
        property: "og:description",
        content:
          "Um modelo de site personalizado para profissionais apresentarem seu trabalho e fortalecerem sua presença digital.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://infinity-solucoes.com/individual",
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
        content: "Perfil Individual | Infinity Soluções",
      },
      {
        name: "twitter:description",
        content: "Sites personalizados para profissionais que desejam apresentar seus serviços e sua trajetória.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://infinity-solucoes.com/individual",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const [c, setC, reset] = usePersisted<IndividualConfig>("laf-individual", individualDefaults);

  const set =
    <K extends keyof IndividualConfig>(k: K) =>
    (v: IndividualConfig[K]) =>
      setC((p) => ({ ...p, [k]: v }));

  const t = (k: keyof IndividualConfig, label: string, long?: boolean) => (
    <Field label={label} value={c[k] as string} onChange={set(k) as (v: string) => void} long={long} />
  );

  return (
    <>
      <IndividualSite c={c} />

      <EditorShell title="Seu site, com sua cara!" onReset={reset}>
        <Group title="Paleta de cores">
          <PalettePicker value={c.palette} onChange={set("palette")} />
        </Group>

        <Group title="Identificação">
          {t("nome", "Seu nome")}
          {t("profissao", "Sua profissão")}
          {t("registro", "Registro profissional")}
          {t("marca", "Sua empresa")}
          {t("cidade", "Sua cidade")}
          <ImageField label="Sua foto" value={c.foto} onChange={set("foto")} />
          <ImageField label="Foto do ambiente" value={c.fotoAmbiente} onChange={set("fotoAmbiente")} />
        </Group>

        <Group title="Textos">
          {t("titulo", "Frase principal")}
          {t("destaque", "Palavra em destaque")}
          {t("subtitulo", "Subtítulo", true)}
          {t("intro", "Sobre você", true)}
        </Group>

        <Group title="Suas formações">
          <ListField
            items={c.formacoes}
            onChange={set("formacoes")}
            addLabel="Adicionar formação"
            make={() => ({ label: "Nova formação", text: "Descrição" })}
            render={(f, s) => (
              <>
                <Field label="Título" value={f.label} onChange={(v) => s({ label: v })} />
                <Field label="Descrição" value={f.text} onChange={(v) => s({ text: v })} long />
              </>
            )}
          />
        </Group>

        <Group title="Seus serviços">
          {t("servicosTitulo", "Título da seção")}
          <ListField
            items={c.servicos}
            onChange={set("servicos")}
            addLabel="Adicionar serviço"
            make={() => ({ title: "Novo serviço", text: "Descrição", img: srv1 })}
            render={(f, s) => (
              <>
                <Field label="Nome" value={f.title} onChange={(v) => s({ title: v })} />
                <Field label="Descrição" value={f.text} onChange={(v) => s({ text: v })} />
                <ImageField label="Trocar foto" value={f.img} onChange={(v) => s({ img: v })} />
              </>
            )}
          />
        </Group>

        <Group title="Instagram">
          {t("instagram", "Seu @ (sem o @)")}
          {t("instagramTexto", "Texto da seção")}
          {c.galeria.map((g, i) => (
            <ImageField
              key={i}
              label={`Foto ${i + 1} da galeria`}
              value={g}
              onChange={(v) => set("galeria")(c.galeria.map((x, j) => (j === i ? v : x)))}
            />
          ))}
        </Group>

        <Group title="Contato">
          {t("whatsapp", "WhatsApp")}
          {t("telefone", "Telefone")}
          {t("email", "E-mail")}
          {t("endereco", "Endereço")}
          <ListField
            items={c.horarios}
            onChange={set("horarios")}
            addLabel="Adicionar horário"
            make={() => ({ day: "Dia", time: "Horário" })}
            render={(h, s) => (
              <>
                <Field label="Dia" value={h.day} onChange={(v) => s({ day: v })} />
                <Field label="Horário" value={h.time} onChange={(v) => s({ time: v })} />
              </>
            )}
          />
        </Group>
      </EditorShell>
    </>
  );
}
