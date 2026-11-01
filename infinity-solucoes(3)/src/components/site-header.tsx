import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import infinityIcon from "@/assets/infinity-icon-nova.png.asset.json";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links: { to: "/" | "/individual" | "/corporativo"; hash?: string; label: string }[] = [
  { to: "/", label: "Início" },
  { to: "/", hash: "contato", label: "Contato" },
  { to: "/individual", label: "Individual" },
  { to: "/corporativo", label: "Corporativo" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#701C9D]/25 bg-[#0A050F]/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={infinityIcon.url}
            alt="Ícone Infinity"
            className="h-9 w-9 object-contain drop-shadow-[0_0_12px_rgba(177,44,222,0.5)] transition-transform group-hover:scale-105"
          />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-white tracking-wide">Infinity</span>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-[#D56BF2] font-semibold">Soluções</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, hash, label }) => (
            <Link
              key={label}
              to={to}
              {...(hash ? { hash } : {})}
              className="rounded-full px-4 py-2 text-sm font-medium text-purple-200/70 transition-all hover:bg-[#701C9D]/20 hover:text-white"
              activeProps={{
                className:
                  "bg-[#701C9D]/30 text-white font-semibold border border-[#B12CDE]/40 shadow-[0_0_10px_rgba(177,44,222,0.2)]",
              }}
              activeOptions={{ exact: to === "/" && !hash, includeHash: true }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Menu Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Abrir menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#701C9D]/30 bg-[#12071f]/80 text-purple-200 transition-colors hover:bg-[#701C9D]/20 hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 border-l border-[#701C9D]/30 bg-[#0E0617] text-white">
            <nav className="mt-8 flex flex-col gap-2">
              {links.map(({ to, hash, label }) => (
                <Link
                  key={label}
                  to={to}
                  {...(hash ? { hash } : {})}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-purple-200/80 transition-colors hover:bg-[#701C9D]/30 hover:text-white"
                  activeProps={{ className: "bg-[#701C9D]/30 text-white font-semibold border border-[#B12CDE]/40" }}
                  activeOptions={{ exact: to === "/" && !hash, includeHash: true }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
