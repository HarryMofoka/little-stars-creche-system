"use client";

import Link from "next/link";
import { useState } from "react";

import { PageTitle, Pill } from "@/components/lms/LmsBlocks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScopedData } from "@/lib/lms-access";

const areas = ["Language", "Motor", "Social", "Numeracy", "Creative"] as const;

export default function Reports() {
  const scoped = useScopedData();
  const [childFilter, setChildFilter] = useState<string>("all");

  const nameOf = (childId: string) => {
    const child = scoped.children.find((c) => c.id === childId);
    return child ? `${child.firstName} ${child.lastName}` : "—";
  };

  const reports = scoped.reports.filter((r) => childFilter === "all" || r.childId === childFilter);
  const marks = scoped.milestones.filter((m) => childFilter === "all" || m.childId === childFilter);

  return (
    <div className="space-y-8">
      <PageTitle eyebrow="Daily reports & milestones" title="Learning record" />

      <select
        value={childFilter}
        onChange={(e) => setChildFilter(e.target.value)}
        aria-label="Filter by child"
        className="rounded-full border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
      >
        <option value="all">All children</option>
        {scoped.children.map((c) => (
          <option key={c.id} value={c.id}>
            {c.firstName} {c.lastName}
          </option>
        ))}
      </select>

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">Daily reports</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {reports.map((r) => {
              const child = scoped.children.find((c) => c.id === r.childId);
              return (
                <article key={r.id} className="dash-card p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/dashboard/children/${r.childId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {nameOf(r.childId)}
                    </Link>
                    <Pill tone="brand">{r.mood}</Pill>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {child?.classroom} · {r.date}
                  </p>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Meals</dt>
                      <dd>{r.meals}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Nap</dt>
                      <dd>{r.nap}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                    {r.note}
                  </p>
                </article>
              );
            })}
            {reports.length === 0 && (
              <p className="text-sm text-muted-foreground">No reports for this selection.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="mt-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {areas.map((area) => {
              const areaMarks = marks.filter((m) => m.area === area);
              if (areaMarks.length === 0) return null;
              return (
                <section key={area} className="dash-card">
                  <h2 className="border-b border-border px-6 py-4 text-sm font-semibold tracking-tight">
                    {area}
                  </h2>
                  <div className="divide-y divide-border">
                    {areaMarks.map((m) => (
                      <div key={m.id} className="flex items-center justify-between gap-4 px-6 py-4">
                        <div>
                          <p className="text-sm font-medium">{m.title}</p>
                          <p className="text-xs text-muted-foreground">{nameOf(m.childId)}</p>
                        </div>
                        <Pill tone={m.achieved ? "success" : "neutral"}>
                          {m.achieved ? m.observedOn : "In progress"}
                        </Pill>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
            {marks.length === 0 && (
              <p className="text-sm text-muted-foreground">No milestones for this selection.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
