import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:pb-28 lg:pt-24">
        <p className="eyebrow mb-6 text-ink-muted">{eyebrow}</p>
        <h1 className="max-w-3xl font-display text-5xl font-light leading-[1.05] tracking-tight text-ink-foreground sm:text-6xl">
          {title}
        </h1>
        {children && (
          <div className="mt-8 max-w-xl text-lg leading-relaxed text-ink-foreground/80">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function ShimmerLink({
  to,
  children,
}: {
  to: "/contact" | "/programmes" | "/dashboard" | "/about";
  children: ReactNode;
}) {
  return (
    <span className="inline-block rounded-md cta-shimmer">
      <Link
        href={to}
        className="relative flex items-center justify-center gap-2 rounded bg-primary px-6 py-3 text-base font-medium tracking-tight text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        {children}
        <ArrowUpRight className="h-5 w-5" />
      </Link>
    </span>
  );
}

export function CtaBand() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-10 border border-ink-border p-10 lg:grid-cols-2 lg:p-16">
          <div>
            <p className="eyebrow mb-5 text-ink-muted">Enrolment for 2027 is open</p>
            <h2 className="font-display text-4xl font-light leading-tight tracking-tight text-ink-foreground sm:text-5xl">
              Come and see a morning at Little Stars.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-foreground/80">
              Tours run every Tuesday and Thursday at 09:30. Meet the teachers, see the
              classrooms, and ask us anything.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <ShimmerLink to="/contact">Book a tour</ShimmerLink>
            <Link
              href="/programmes"
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink-foreground"
            >
              Or browse the programmes first
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
