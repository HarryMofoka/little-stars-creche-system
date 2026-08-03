"use client";

import { SiteFooter } from "@/components/site/SiteFooter";
import { CtaBand, PageHero } from "@/components/site/SiteBlocks";
import { classroomAges, formatMoney } from "@/data/lms";
import { useLms } from "@/lib/lms-store";

export default function Programmes() {
  const { data } = useLms();
  const details = data.programmes.filter((p) => !p.archived);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <PageHero eyebrow="Programmes" title={<>Four classrooms, one gentle standard of care.</>}>
          Fees cover meals, materials and the full daily programme. Aftercare until 17:30
          is included in every room.
        </PageHero>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid border border-border bg-card lg:grid-cols-2">
            {details.map((d) => (
              <article key={d.id} className="border-b border-r border-border p-8 lg:p-10">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight">{d.name}</h2>
                  <span className="text-sm font-medium text-primary">
                    {formatMoney(d.monthlyFee)} / month
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {d.ages || classroomAges[d.name]} · {d.ratio}
                </p>
                <ul className="mt-6 space-y-3">
                  {d.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-12 border border-border p-8">
            <p className="eyebrow mb-4 text-muted-foreground">Good to know</p>
            <div className="grid gap-6 md:grid-cols-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                A once-off registration fee of R 950 secures a place and covers the
                enrolment pack.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Sibling discount of 10% applies to the younger child&apos;s monthly fee.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Fees are invoiced on the first of each month and are payable within seven
                days.
              </p>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
