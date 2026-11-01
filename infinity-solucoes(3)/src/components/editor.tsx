import { Link } from "@tanstack/react-router";
import { useId, type ReactNode } from "react";
import { ArrowLeft, Plus, RotateCcw, SlidersHorizontal, Trash2, Upload } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { fileToDataUrl, palettes } from "@/lib/site-config";

export function EditorShell({ title, onReset, children }: { title: string; onReset: () => void; children: ReactNode }) {
  return (
    <div className="laf fixed bottom-5 left-5 z-40 flex gap-2">
      <Link
        to="/"
        aria-label="Voltar para Infinity Soluções"
        className="grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-foreground shadow-lg hover:bg-secondary"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="h-12 rounded-full bg-primary px-5 text-primary-foreground shadow-lg hover:bg-primary/90">
            <SlidersHorizontal className="h-4 w-4" /> Personalizar
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="laf w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display">{title}</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 px-4 pb-10">
            {children}
            <Button
              variant="outline"
              onClick={() => confirm("Voltar ao modelo original?") && onReset()}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4" /> Restaurar modelo original
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3 border-t border-border pt-5">
      <legend className="pr-2 text-xs font-semibold uppercase tracking-widest text-accent-ink">{title}</legend>
      {children}
    </fieldset>
  );
}

export function Field({
  label,
  value,
  onChange,
  long,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  long?: boolean | undefined;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      {long ? (
        <Textarea id={id} value={value} rows={3} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <img src={value} alt="" className="h-14 w-14 shrink-0 rounded-md border border-border object-cover" />
      <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-dashed border-input px-3 py-2 text-xs hover:bg-secondary">
        <Upload className="h-4 w-4" /> {label}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) onChange(await fileToDataUrl(f));
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

export function PalettePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {palettes.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={`rounded-lg border p-2.5 text-left transition-colors ${value === p.id ? "border-foreground ring-2 ring-ring" : "border-border hover:bg-secondary"}`}
        >
          <span className="flex gap-1">
            <span className="h-5 w-5 rounded-full border border-border" style={{ background: p.primary }} />
            <span className="h-5 w-5 rounded-full border border-border" style={{ background: p.accent }} />
          </span>
          <span className="mt-1.5 block text-xs font-semibold">{p.nome}</span>
          <span className="block text-[11px] leading-tight text-muted-foreground">{p.significado}</span>
        </button>
      ))}
    </div>
  );
}

export function ListField<T>({
  items,
  onChange,
  make,
  render,
  addLabel,
}: {
  items: T[];
  onChange: (v: T[]) => void;
  make: () => T;
  addLabel: string;
  render: (item: T, set: (patch: Partial<T>) => void) => ReactNode;
}) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="relative space-y-2 rounded-lg border border-border p-3 pr-10">
          {render(it, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))))}
          <button
            type="button"
            aria-label="Remover"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, make()])}>
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}
