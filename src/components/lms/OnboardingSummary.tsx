"use client";

import Link from "next/link";
import { CheckCircle2, CircleDashed, Download } from "lucide-react";
import { toast } from "sonner";

import { roleLabels, useAuth } from "@/lib/auth";
import { stepsForRole } from "@/lib/onboarding-questions";
import { useScopedData } from "@/lib/lms-access";
import { downloadOnboardingPdf } from "@/lib/onboarding-pdf";

/**
 * Read-only recap of the onboarding questions and the answers given so far.
 * Works both mid-flow (from the saved draft) and after finishing.
 */
export function OnboardingSummary() {
  const { session, onboardingRecord, onboardingDraft } = useAuth();
  const scoped = useScopedData();
  if (!session) return null;

  const answers = onboardingRecord?.answers ?? onboardingDraft?.answers ?? null;
  if (!answers) return null;

  const steps = stepsForRole(onboardingRecord?.role ?? onboardingDraft?.role ?? session.role);
  const answered = steps.filter((s) => (answers[s.key] ?? "").trim().length > 0).length;
  const finished = Boolean(session.onboarded && onboardingRecord);
  const savedAt = onboardingRecord?.savedAt
    ? new Date(onboardingRecord.savedAt).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  function download() {
    downloadOnboardingPdf({
      name: session!.name,
      email: session!.email,
      roleLabel: roleLabels[session!.role],
      savedAt: onboardingRecord?.savedAt,
      answers: steps.map((s) => ({ label: s.label, value: (answers![s.key] ?? "").trim() })),
      children: scoped.children,
    });
    toast.success("Your printable summary is downloading");
  }

  return (
    <section className="dash-card p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-muted-foreground">Your setup answers</p>
          <h2 className="mt-1 text-base font-semibold tracking-tight">
            {finished ? "Onboarding summary" : "Review before you finish"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {answered} of {steps.length} questions answered
            {savedAt ? ` · saved ${savedAt}` : ""}. This view is read-only.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
          <Link
            href="/onboarding"
            className="rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-muted"
          >
            {finished ? "Update answers" : "Continue setup"}
          </Link>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {steps.map((s) => {
          const answer = (answers[s.key] ?? "").trim();
          return (
            <div
              key={s.key}
              className="rounded-2xl border border-border bg-card/60 px-4 py-3"
            >
              <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                {answer ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                ) : (
                  <CircleDashed className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="truncate">{s.label}</span>
              </dt>
              <dd className={`mt-1 text-sm ${answer ? "font-medium" : "text-muted-foreground"}`}>
                {answer || "Not answered yet"}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
