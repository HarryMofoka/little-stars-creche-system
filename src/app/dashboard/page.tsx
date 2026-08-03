"use client";

import Link from "next/link";
import { Users, CalendarCheck, Receipt, Star } from "lucide-react";

import { PageTitle, StatCard, Pill } from "@/components/lms/LmsBlocks";
import { OnboardingSummary } from "@/components/lms/OnboardingSummary";
import { NotificationsPanel } from "@/components/lms/NotificationsPanel";
import { AuditLog } from "@/components/lms/AuditLog";

import { classrooms, formatMoney, today } from "@/data/lms";
import { useScopedData } from "@/lib/lms-access";
import { useAuth } from "@/lib/auth";

export default function Overview() {
  const scoped = useScopedData();
  const { session, can, onboardingDraft } = useAuth();

  const showResume = Boolean(session && !session.onboarded);
  const draftStep = onboardingDraft ? onboardingDraft.step + 1 : 1;
  const draftTotal = onboardingDraft?.total ?? 5;

  const enrolled = scoped.children.filter((c) => c.status === "enrolled");
  const todayAttendance = scoped.attendance.filter((a) => a.date === today);
  const present = todayAttendance.filter((a) => a.state === "in").length;
  const absent = todayAttendance.filter((a) => a.state === "absent").length;

  const outstanding = scoped.invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const achieved = scoped.milestones.filter((m) => m.achieved).length;
  const nameOf = (childId: string) => {
    const child = scoped.children.find((c) => c.id === childId);
    return child ? `${child.firstName} ${child.lastName}` : "—";
  };

  const visibleRooms =
    scoped.role === "admin"
      ? [...classrooms]
      : Array.from(new Set(scoped.children.map((c) => c.classroom)));

  return (
    <div className="space-y-10">
      <PageTitle
        eyebrow="Overview"
        title={session ? `Welcome back, ${session.name.split(" ")[0]}` : "Today at Little Stars"}
      />

      {showResume && (
        <div className="dash-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow text-muted-foreground">Setup unfinished</p>
            <h2 className="mt-1 text-base font-semibold tracking-tight">
              Finish setting up your family space
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You stopped at step {draftStep} of {draftTotal}. Pick up right where you left off.
            </p>
            <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.round(((draftStep - 1) / draftTotal) * 100)}%` }}
              />
            </div>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Resume onboarding
          </Link>
        </div>
      )}

      <NotificationsPanel />

      <OnboardingSummary />

      <AuditLog />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={scoped.role === "parent" ? "Your children" : "Enrolled"}
          value={String(enrolled.length)}
          detail={`${scoped.children.filter((c) => c.status === "waitlist").length} on the waitlist`}
          icon={Users}
        />
        <StatCard
          label="On site now"
          value={String(present)}
          detail={`${absent} absent today`}
          icon={CalendarCheck}
        />
        <StatCard
          label="Fees outstanding"
          value={formatMoney(outstanding)}
          detail={`${scoped.invoices.filter((i) => i.status === "overdue").length} invoices overdue`}
          icon={Receipt}
        />
        <StatCard
          label="Milestones logged"
          value={String(achieved)}
          detail={`${scoped.milestones.length - achieved} still in progress`}
          icon={Star}
        />
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="dash-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold tracking-tight">Classrooms</h2>
            {can("/dashboard/attendance") && (
              <Link href="/dashboard/attendance" className="text-xs text-primary hover:underline">
                Open register
              </Link>
            )}
          </div>
          <div className="divide-y divide-border">
            {visibleRooms.map((room) => {
              const roll = scoped.children.filter(
                (c) => c.classroom === room && c.status === "enrolled",
              );
              const inRoom = roll.filter((c) =>
                todayAttendance.some((a) => a.childId === c.id && a.state === "in"),
              ).length;
              return (
                <div key={room} className="flex items-center justify-between px-6 py-4">
                  <span className="text-sm font-medium">{room}</span>
                  <span className="text-sm text-muted-foreground">
                    {inRoom} of {roll.length} present
                  </span>
                </div>
              );
            })}
            {visibleRooms.length === 0 && (
              <p className="px-6 py-6 text-sm text-muted-foreground">No classrooms assigned.</p>
            )}
          </div>
        </div>

        <div className="dash-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold tracking-tight">Recent activity</h2>
            <Link href="/dashboard/reports" className="text-xs text-primary hover:underline">
              All reports
            </Link>
          </div>
          <div className="divide-y divide-border">
            {scoped.reports.slice(0, 5).map((report) => (
              <div key={report.id} className="px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{nameOf(report.childId)}</span>
                  <Pill tone="brand">{report.date}</Pill>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{report.note}</p>
              </div>
            ))}
            {scoped.reports.length === 0 && (
              <p className="px-6 py-6 text-sm text-muted-foreground">No reports yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
