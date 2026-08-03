"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  NotebookPen,
  GraduationCap,
  Receipt,
  Bell,
} from "lucide-react";

import { DashRail, DashTopBar } from "@/components/lms/DashShell";
import { roleLabels, useAuth } from "@/lib/auth";

const railItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Children", url: "/dashboard/children", icon: Users },
  { title: "Attendance", url: "/dashboard/attendance", icon: CalendarCheck },
  { title: "Reports", url: "/dashboard/reports", icon: NotebookPen },
  { title: "Staff", url: "/dashboard/staff", icon: GraduationCap },
  { title: "Fees", url: "/dashboard/fees", icon: Receipt },
  { title: "Inbox", url: "/dashboard/notifications", icon: Bell },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div className="dash-canvas flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking your access…</p>
      </div>
    );
  }

  return (
    <div className="dash-canvas min-h-screen">
      <DashTopBar />
      <div className="flex min-h-[calc(100vh-4.5rem)] w-full">
        <DashRail items={railItems} />
        <main className="min-w-0 flex-1 px-4 pb-8 pt-4 md:px-2 md:pr-4 md:pt-0 lg:pr-6">
          <div className="dash-panel min-h-full p-4 sm:p-6 lg:p-10">
            <div className="mb-6 hidden flex-wrap items-center gap-2 md:flex lg:hidden">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                {roleLabels[session.role]} · {session.name}
              </span>
              <Link href="/login" className="text-xs text-primary hover:underline">
                Switch account
              </Link>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
