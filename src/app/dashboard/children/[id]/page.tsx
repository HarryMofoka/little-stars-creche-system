"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageTitle, Pill } from "@/components/lms/LmsBlocks";
import { ChildForm } from "@/components/lms/ChildForm";
import { classroomAges, classrooms, formatAge, formatMoney } from "@/data/lms";
import { useLms } from "@/lib/lms-store";
import { useScopedData } from "@/lib/lms-access";

export default function ChildDetail() {
  const params = useParams();
  const id = params.id as string;
  const { updateChild, archiveChild } = useLms();
  const scoped = useScopedData(true);
  const [editing, setEditing] = useState(false);

  const child = scoped.children.find((c) => c.id === id);

  if (!child) {
    return (
      <div className="space-y-6">
        <PageTitle eyebrow="Children" title="Child not found" />
        <Link href="/dashboard/children" className="text-sm text-primary hover:underline">
          Back to the register
        </Link>
      </div>
    );
  }

  const reports = scoped.reports.filter((r) => r.childId === child.id);
  const childMilestones = scoped.milestones.filter((m) => m.childId === child.id);
  const childInvoices = scoped.invoices.filter((i) => i.childId === child.id);
  const { id: _id, ...draft } = child;

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/children"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the register
      </Link>

      <PageTitle
        eyebrow={`${child.classroom} · ${classroomAges[child.classroom] ?? ""}`}
        title={`${child.firstName} ${child.lastName}`}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {editing ? "Close editor" : "Edit details"}
            </button>
            <button
              type="button"
              onClick={() => {
                archiveChild(child.id, !child.archived);
                toast(child.archived ? "Enrolment restored" : "Enrolment archived");
              }}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              {child.archived ? "Restore enrolment" : "Archive enrolment"}
            </button>
          </div>
        }
      />

      {editing && (
        <ChildForm
          initial={draft}
          classrooms={[...classrooms]}
          submitLabel="Save changes"
          onCancel={() => setEditing(false)}
          onSubmit={(next) => {
            updateChild(child.id, next);
            setEditing(false);
            toast.success("Details updated");
          }}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="dash-card p-6">
          <h2 className="text-sm font-semibold tracking-tight">Enrolment</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <Pill tone={child.status === "enrolled" ? "success" : "neutral"}>
                  {child.archived ? "archived" : child.status}
                </Pill>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Age</dt>
              <dd>{formatAge(child.birthDate)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Date of birth</dt>
              <dd>{child.birthDate}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Started</dt>
              <dd>{child.startDate || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Allergies</dt>
              <dd>{child.allergies.length ? child.allergies.join(", ") : "None"}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
            {child.notes || "No notes yet."}
          </p>
        </section>

        <section className="dash-card p-6">
          <h2 className="text-sm font-semibold tracking-tight">Guardians</h2>
          <div className="mt-4 space-y-4 text-sm">
            {child.guardians.map((g) => (
              <div key={g.email || g.name}>
                <p className="font-medium">
                  {g.name} <span className="text-muted-foreground">· {g.relation}</span>
                </p>
                <p className="text-muted-foreground">{g.phone}</p>
                <p className="text-muted-foreground">{g.email}</p>
              </div>
            ))}
            {child.guardians.length === 0 && (
              <p className="text-muted-foreground">No guardian captured yet.</p>
            )}
          </div>
        </section>

        <section className="dash-card p-6">
          <h2 className="text-sm font-semibold tracking-tight">Fees</h2>
          <div className="mt-4 space-y-3 text-sm">
            {childInvoices.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{i.period}</span>
                <span className="flex items-center gap-2">
                  {formatMoney(i.amount)}
                  <Pill tone={i.status === "paid" ? "success" : "warning"}>{i.status}</Pill>
                </span>
              </div>
            ))}
            {childInvoices.length === 0 && (
              <p className="text-muted-foreground">No invoices yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="dash-card">
        <h2 className="border-b border-border px-6 py-4 text-sm font-semibold tracking-tight">
          Milestones
        </h2>
        <div className="divide-y divide-border">
          {childMilestones.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="text-sm font-medium">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.area}</p>
              </div>
              <Pill tone={m.achieved ? "success" : "neutral"}>
                {m.achieved ? m.observedOn : "In progress"}
              </Pill>
            </div>
          ))}
          {childMilestones.length === 0 && (
            <p className="px-6 py-6 text-sm text-muted-foreground">No milestones logged yet.</p>
          )}
        </div>
      </section>

      <section className="dash-card">
        <h2 className="border-b border-border px-6 py-4 text-sm font-semibold tracking-tight">
          Recent daily reports
        </h2>
        <div className="divide-y divide-border">
          {reports.map((r) => (
            <div key={r.id} className="px-6 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{r.date}</span>
                <Pill tone="brand">{r.mood}</Pill>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{r.note}</p>
            </div>
          ))}
          {reports.length === 0 && (
            <p className="px-6 py-6 text-sm text-muted-foreground">No reports yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
