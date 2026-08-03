import Link from "next/link";

import { BrandMark, BrandWordmark } from "@/components/site/BrandMark";

export function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 border border-ink-border md:grid-cols-4">
          <div className="border-ink-border p-8 md:border-r">
            <div className="flex items-center gap-2.5 text-ink-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <BrandMark className="h-5 w-5" />
              </span>
              <BrandWordmark className="text-base" />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Where every child shines bright. A registered creche and preschool for ages
              3 months to 6 years.
            </p>
          </div>

          <div className="border-ink-border p-8 md:border-r">
            <p className="eyebrow text-ink-muted">Explore</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/programmes" className="text-sm text-ink-foreground/80 hover:text-ink-foreground">
                Programmes
              </Link>
              <Link href="/about" className="text-sm text-ink-foreground/80 hover:text-ink-foreground">
                Our approach
              </Link>
              <Link href="/contact" className="text-sm text-ink-foreground/80 hover:text-ink-foreground">
                Fees &amp; enrolment
              </Link>
              <Link href="/dashboard" className="text-sm text-ink-foreground/80 hover:text-ink-foreground">
                Staff dashboard
              </Link>
            </div>
          </div>

          <div className="border-ink-border p-8 md:border-r">
            <p className="eyebrow text-ink-muted">Visit</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-foreground/80">
              14 Acacia Road
              <br />
              Rosebank, Johannesburg
              <br />
              Mon – Fri, 06:30 – 17:30
            </p>
          </div>

          <div className="p-8">
            <p className="eyebrow text-ink-muted">Contact</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-foreground/80">
              hello@littlestars.co.za
              <br />
              +27 11 447 2210
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-ink-muted">
          © {new Date().getFullYear()} Little Stars Preschool. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
