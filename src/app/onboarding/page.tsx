"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

import { BrandMark, BrandWordmark } from "@/components/site/BrandMark";
import { authField } from "@/components/site/AuthSplit";
import { useAuth, roleLabels, type OnboardingAnswers, type Role } from "@/lib/auth";
import { onboardingIntroByRole, stepsForRole } from "@/lib/onboarding-questions";
import { useLms } from "@/lib/lms-store";
import { useActivity } from "@/lib/activity";

/** Age band chosen during onboarding maps onto a Little Stars classroom. */
const classroomForAge: Record<string, string> = {
  "3 – 18 months": "Sunbeams",
  "18 months – 3 years": "Moonbeams",
  "3 – 4 years": "Comets",
  "4 – 6 years": "Stargazers",
};

const startDateFor: Record<string, number> = {
  "As soon as possible": 0,
  "Next month": 30,
  "Next term": 90,
  "Still deciding": 60,
};

function isoDaysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function OnboardingPage() {
  const {
    session,
    ready,
    completeOnboarding,
    onboardingDraft,
    saveOnboardingDraft,
    updateSession,
  } = useAuth();
  const { createChild, createStaff } = useLms();
  const { logAudit, notify } = useActivity();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [restored, setRestored] = useState(false);
  /** Last answers already written to the audit log, so we only record real changes. */
  const loggedRef = useRef<OnboardingAnswers>({});

  const role: Role = session?.role ?? "parent";
  const steps = stepsForRole(role);

  useEffect(() => {
    if (ready && !session) router.replace("/signup");
  }, [ready, session, router]);

  // Pick up where the user left off, once, after storage has been read.
  useEffect(() => {
    if (!ready || restored) return;
    setRestored(true);
    if (onboardingDraft) {
      setAnswers(onboardingDraft.answers);
      loggedRef.current = { ...onboardingDraft.answers };
      setIndex(Math.min(onboardingDraft.step, steps.length - 1));
    }
  }, [ready, restored, onboardingDraft, steps.length]);

  const step = steps[Math.min(index, steps.length - 1)]!;
  const value = answers[step.key] ?? "";
  const canContinue = step.optional || value.trim().length > 0;
  const answeredCount = steps.filter((s) => (answers[s.key] ?? "").trim().length > 0).length;
  const progress = ((index + 1) / steps.length) * 100;

  /** Record every answer that changed since the last audit write. */
  function auditAnswerChanges(nextAnswers: OnboardingAnswers) {
    const changes: Array<{ label: string; before: string; after: string }> = [];
    if (!session) return changes;
    steps.forEach((s) => {
      const before = (loggedRef.current[s.key] ?? "").trim();
      const after = (nextAnswers[s.key] ?? "").trim();
      if (before === after) return;
      changes.push({ label: s.label, before, after });
      logAudit({
        actorName: session.name,
        actorEmail: session.email,
        actorRole: session.role,
        action: "onboarding.answer",
        summary: `${s.label} updated in ${roleLabels[session.role].toLowerCase()} onboarding`,
        before,
        after,
        audience: ["admin", "staff", session.role],
        subjectEmail: session.email,
      });
    });
    loggedRef.current = { ...nextAnswers };
    return changes;
  }

  function goTo(nextIndex: number, nextAnswers: OnboardingAnswers = answers) {
    auditAnswerChanges(nextAnswers);
    setIndex(nextIndex);
    saveOnboardingDraft({ answers: nextAnswers, step: nextIndex, total: steps.length, role });
  }

  /** Turn saved answers into real LMS records for the signed-in role. */
  function applyAnswers(a: OnboardingAnswers) {
    if (!session) return;

    if (session.role === "parent") {
      const fullName = (a["childName"] ?? "").trim();
      if (!fullName) return;
      const parts = fullName.split(/\s+/);
      const firstName = parts[0]!;
      const lastName = parts.slice(1).join(" ") || session.name.split(" ").slice(-1)[0] || "";
      const classroom = classroomForAge[a["ageGroup"] ?? ""] ?? "Comets";
      const startDate = isoDaysFromNow(startDateFor[a["startDate"] ?? ""] ?? 0);
      const created = createChild({
        firstName,
        lastName,
        birthDate: "",
        classroom,
        status: "enrolled",
        startDate,
        allergies: (a["allergies"] ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        notes: [a["schedule"], a["priority"], a["notes"]].filter(Boolean).join(" · "),
        guardians: [
          {
            name: session.name,
            relation: "Parent",
            phone: "",
            email: session.email,
          },
        ],
      });
      updateSession({ childIds: [...(session.childIds ?? []), created.id] });

      logAudit({
        actorName: session.name,
        actorEmail: session.email,
        actorRole: session.role,
        action: "enrolment.created",
        summary: `Enrolment record created for ${firstName} ${lastName}`.trim(),
        after: `${classroom} · starts ${startDate}`,
        audience: ["admin", "staff", "parent"],
        subjectEmail: session.email,
        childId: created.id,
      });

      notify({
        to: session.email,
        channel: "email",
        category: "enrolment",
        subject: `${firstName}'s enrolment record is ready`,
        title: `${firstName}'s enrolment record is ready`,
        body: `We've created ${firstName} ${lastName}'s enrolment from your setup answers. A teacher will confirm the first day with you by phone.`.trim(),
        details: [
          { label: "Child", value: `${firstName} ${lastName}`.trim() },
          { label: "Classroom", value: classroom },
          { label: "Enrolment status", value: "Enrolled" },
          { label: "Start date", value: startDate },
          {
            label: "Days needed",
            value: a["schedule"] ?? "To be confirmed",
          },
          {
            label: "Allergies noted",
            value: (a["allergies"] ?? "").trim() || "None recorded",
          },
        ],
      });

      toast.success(`${firstName}'s enrolment record is ready`);
      return;
    }

    if (session.role === "staff") {
      const classroom = a["classroom"] ?? "All classrooms";
      createStaff({
        name: session.name,
        role: a["staffRole"] ?? "Teacher",
        classroom,
        email: session.email,
        phone: a["phone"] ?? "",
        since: isoDaysFromNow(0),
      });
      updateSession({ classroom });
      logAudit({
        actorName: session.name,
        actorEmail: session.email,
        actorRole: session.role,
        action: "staff.created",
        summary: `${session.name} added to the ${classroom} roster`,
        after: a["staffRole"] ?? "Teacher",
        audience: ["admin", "staff"],
        subjectEmail: session.email,
      });
      toast.success(`You're on the ${classroom} roster`);
    }
  }

  function finish(nextAnswers: OnboardingAnswers) {
    const wasCompleted = Boolean(session?.onboarded);
    const changes = auditAnswerChanges(nextAnswers);
    if (!wasCompleted) applyAnswers(nextAnswers);
    completeOnboarding(nextAnswers, role);
    if (session) {
      const answered = steps.filter((s) => (nextAnswers[s.key] ?? "").trim().length > 0).length;
      const when = new Date().toLocaleString("en-ZA", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      logAudit({
        actorName: session.name,
        actorEmail: session.email,
        actorRole: session.role,
        action: "onboarding.completed",
        summary: wasCompleted
          ? `${roleLabels[session.role]} onboarding answers updated`
          : `${roleLabels[session.role]} onboarding completed`,
        after: `${answered} of ${steps.length} questions answered`,
        audience: ["admin", "staff", session.role],
        subjectEmail: session.email,
      });

      if (wasCompleted && changes.length > 0) {
        notify({
          to: session.email,
          channel: "email",
          category: "onboarding",
          subject: `Your Little Stars answers were updated (${changes.length} change${changes.length > 1 ? "s" : ""})`,
          title: `${changes.length} onboarding answer${changes.length > 1 ? "s" : ""} updated`,
          body: `We emailed ${session.email} a confirmation of the changes made to your Little Stars setup on ${when}. If this wasn't you, please contact the office.`,
          details: [
            { label: "Updated on", value: when },
            { label: "Updated by", value: session.name },
            ...changes.map((c) => ({
              label: c.label,
              value: `${c.before || "Not answered"} → ${c.after || "Cleared"}`,
            })),
          ],
        });
        toast.success(`Changes saved — confirmation emailed to ${session.email}`);
        router.push("/dashboard");
        return;
      }

      if (!wasCompleted && session.role === "parent") {
        notify({
          to: session.email,
          channel: "email",
          category: "onboarding",
          subject: "Your Little Stars setup is complete",
          title: "Your Little Stars setup is complete",
          body: "Thank you — your family space is ready. You can download a printable summary of your answers from your dashboard at any time.",
          details: [
            { label: "Completed by", value: session.name },
            { label: "Completed on", value: when },
            { label: "Questions answered", value: `${answered} of ${steps.length}` },
            { label: "Child", value: (nextAnswers["childName"] ?? "").trim() || "Not provided" },
          ],
        });
      }
    }
    toast.success("All set — welcome to Little Stars");
    router.push("/dashboard");
  }

  function next() {
    if (!canContinue) return;
    if (index < steps.length - 1) {
      goTo(index + 1);
      return;
    }
    finish(answers);
  }

  function skipStep() {
    const nextAnswers = { ...answers };
    delete nextAnswers[step.key];
    setAnswers(nextAnswers);
    if (index < steps.length - 1) {
      goTo(index + 1, nextAnswers);
      return;
    }
    finish(nextAnswers);
  }

  function finishLater() {
    auditAnswerChanges(answers);
    saveOnboardingDraft({ answers, step: index, total: steps.length, role });
    if (session) {
      logAudit({
        actorName: session.name,
        actorEmail: session.email,
        actorRole: session.role,
        action: "onboarding.saved",
        summary: `Onboarding progress saved at step ${index + 1} of ${steps.length}`,
        audience: ["admin", "staff", session.role],
        subjectEmail: session.email,
      });
    }
    toast.success("Progress saved — resume any time from your dashboard");
    router.push("/dashboard");
  }

  const stepImgSrc = typeof step.image === "string" ? step.image : (step.image as { src: string }).src;

  return (
    <div className="dash-canvas min-h-screen">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-8">
        <div className="relative hidden overflow-hidden rounded-[1.75rem] lg:block">
          <img
            key={step.image}
            src={stepImgSrc}
            alt={step.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
          <div className="relative flex h-full min-h-[32rem] flex-col justify-end p-8">
            <Link href="/" className="flex items-center gap-2.5 text-ink-foreground">
              <BrandMark className="h-9 w-9" />
              <BrandWordmark className="text-base" />
            </Link>
            <p className="mt-6 max-w-sm font-display text-3xl leading-tight text-ink-foreground">
              {step.question}
            </p>
            <p className="mt-2 max-w-sm text-sm text-ink-foreground/70">
              {onboardingIntroByRole[role]}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="dash-card w-full p-8">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {steps.map((s, i) => {
                  const answered = (answers[s.key] ?? "").trim().length > 0;
                  const active = i === index;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      aria-label={`Go to step ${i + 1}`}
                      aria-current={active ? "step" : undefined}
                      onClick={() => goTo(i)}
                      className={`h-2.5 rounded-full transition-all ${
                        active
                          ? "w-7 bg-primary"
                          : answered
                            ? "w-2.5 bg-primary/50 hover:bg-primary/70"
                            : "w-2.5 bg-muted-foreground/25 hover:bg-muted-foreground/40"
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {answeredCount} of {steps.length} answered
              </p>
            </div>

            <p className="eyebrow mt-6 text-muted-foreground">
              {roleLabels[role]} setup · Step {index + 1} of {steps.length}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">{step.question}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{step.helper}</p>

            <img
              src={stepImgSrc}
              alt={step.alt}
              loading="lazy"
              className="mt-5 h-40 w-full rounded-2xl object-cover lg:hidden"
            />

            <div className="mt-6 space-y-2.5">
              {step.options ? (
                step.options.map((option) => {
                  const selected = value === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [step.key]: option }))}
                      className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                        selected
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                      {selected && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <label className="block text-sm font-medium">
                  Your answer
                  <input
                    type="text"
                    value={value}
                    placeholder={step.placeholder}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [step.key]: e.target.value }))
                    }
                    className={authField}
                  />
                </label>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => goTo(Math.max(0, index - 1))}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={skipStep}
                  className="rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!canContinue}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-40"
                >
                  {index === steps.length - 1 ? "Save and finish" : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={finishLater}
              className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Save and finish later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
