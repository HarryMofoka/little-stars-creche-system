"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { BrandMark, BrandWordmark } from "@/components/site/BrandMark";

const links = [
  { label: "Programmes", href: "/programmes" },
  { label: "Our approach", href: "/about" },
  { label: "Visit us", href: "/contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50 w-full px-4 pt-4 sm:px-6">
      <nav className="nav-pill pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 border border-ink-foreground/12 bg-ink/75 px-3 py-2 pl-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 text-ink-foreground">
          <BrandMark className="h-9 w-9 text-primary-foreground" />
          <BrandWordmark className="truncate text-base" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium leading-none tracking-tight transition-colors ${
                  isActive
                    ? "bg-ink-foreground/90 text-ink"
                    : "text-ink-muted hover:bg-ink-foreground/10 hover:text-ink-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full border border-ink-foreground/25 px-4 py-2 text-sm font-medium leading-none text-ink-foreground backdrop-blur transition-colors hover:bg-ink-foreground/10 sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium leading-none text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Get started
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink-foreground/10 hover:text-ink-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="nav-pill pointer-events-auto mx-auto mt-2 max-w-6xl rounded-3xl border border-ink-foreground/12 bg-ink/70 px-4 py-2 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium text-ink-muted transition-colors hover:text-ink-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block py-3 text-base font-medium text-ink-muted transition-colors hover:text-ink-foreground"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
