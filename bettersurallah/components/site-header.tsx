"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/transparency", label: "Transparency" },
  { href: "/projects", label: "Projects" },
  { href: "/officials", label: "Officials" },
  { href: "/about", label: "About" },
];

const normalize = (p: string) => (p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p);

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="relative z-10 border-b border-ink/10 bg-base">
      <div className="h-1.5 w-full bg-blue" />
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <Link href="/">
          <Image src="/logo.png" alt="BetterSurallah.org" width={131} height={40} priority className="h-10 w-auto" />
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-1">
          {LINKS.map(({ href, label }) => {
            const active = normalize(pathname) === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  active ? "bg-blue text-white" : "text-ink-soft hover:bg-mist hover:text-blue"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
