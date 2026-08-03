import { ScrollText, ShieldCheck } from "lucide-react";

import { actorLabel, auditActionLabels, formatWhen, useActivity } from "@/lib/activity";
import { roleLabels, useAuth } from "@/lib/auth";
import { Pill } from "@/components/lms/LmsBlocks";

/**
 * Role-scoped audit trail: admins and teachers see school-wide setup activity,
 * parents only see changes to their own account and children.
 */
export function AuditLog({ limit = 8 }: { limit?: number }) {
  const { session } = useAuth();
  const { visibleEntries } = useActivity();
  if (!session) return null;

  const shown = visibleEntries.slice(0, limit);
  const scopeNote =
    session.role === "admin"
      ? "Every onboarding and enrolment change across the school."
      : session.role === "staff"
        ? "Setup activity for your classroom and the wider school."
        : "Changes to your own setup answers and your child's records.";

  return (
    <section className="dash-card">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border px-6 py-4">
        <div className="min-w-0">
          <p className="eyebrow text-muted-foreground">Audit log</p>
          <h2 className="mt-1 text-base font-semibold tracking-tight">Who changed what</h2>
          <p className="mt-1 text-sm text-muted-foreground">{scopeNote}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          {roleLabels[session.role]} view
        </span>
      </div>

      <ul className="divide-y divide-border">
        {shown.map((entry) => (
          <li key={entry.id} className="px-6 py-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{entry.summary}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {actorLabel(entry)} · {formatWhen(entry.at)}
                </p>
                {(entry.before || entry.after) && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    <span className="line-through">{entry.before || "empty"}</span>
                    <span className="mx-1.5">→</span>
                    <span className="font-medium text-foreground">{entry.after || "cleared"}</span>
                  </p>
                )}
              </div>
              <Pill tone={entry.action === "enrolment.created" ? "brand" : "neutral"}>
                {auditActionLabels[entry.action]}
              </Pill>
            </div>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="flex items-center gap-2 px-6 py-6 text-sm text-muted-foreground">
            <ScrollText className="h-4 w-4" />
            No changes recorded yet.
          </li>
        )}
      </ul>
    </section>
  );
}
