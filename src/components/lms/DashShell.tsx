"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Search,
  Plus,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

import { BrandMark, BrandWordmark } from "@/components/site/BrandMark";
import { roleLabels, useAuth } from "@/lib/auth";
import { useActivity } from "@/lib/activity";

const modules = [
  { title: "Overview", url: "/dashboard" as const },
  { title: "Children", url: "/dashboard/children" as const },
  { title: "Attendance", url: "/dashboard/attendance" as const },
  { title: "Reports", url: "/dashboard/reports" as const },
  { title: "Staff", url: "/dashboard/staff" as const },
  { title: "Fees", url: "/dashboard/fees" as const },
  { title: "Inbox", url: "/dashboard/notifications" as const },
  { title: "Admin", url: "/dashboard/admin" as const },
];

export function DashTopBar() {
  const pathname = usePathname();
  const { session, initials, can, signOut } = useAuth();
  const router = useRouter();
  const { unreadCount } = useActivity();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);
  const visible = modules.filter((m) => can(m.url));

  // Close the mobile drawer whenever navigation happens.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 pt-4 sm:px-6 lg:flex lg:gap-4">
      <div className="flex min-w-0 items-center gap-2">
        {/* Hamburger — primary navigation on mobile */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="icon-orb shrink-0 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Logo — fixed mark size, single baseline, never wraps */}
        <Link href="/dashboard" className="flex h-10 min-w-0 shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-ink-foreground">
            <BrandMark className="h-6 w-6" />
          </span>
          <span className="hidden truncate sm:block">
            <BrandWordmark className="text-base" />
          </span>
        </Link>
      </div>

      {/* Frosted glass pill navigation */}
      <nav className="nav-pill mx-auto hidden items-center gap-1 border border-foreground/8 bg-card/50 px-2 py-1.5 lg:flex">
        {visible.map((m) => (
          <Link
            key={m.url}
            href={m.url}
            className={`rounded-full px-4 py-2 text-sm font-medium leading-none tracking-tight transition-colors ${
              isActive(m.url)
                ? "bg-ink text-ink-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            {m.title}
          </Link>
        ))}
      </nav>

      <div className="flex h-10 shrink-0 items-center gap-2 justify-self-end">
        <button type="button" aria-label="Search" className="icon-orb hidden sm:inline-flex">
          <Search className="h-4 w-4" />
        </button>
        <Link
          href="/dashboard/notifications"
          aria-label="Notifications"
          title="Notifications"
          className="icon-orb relative hidden sm:inline-flex"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-semibold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
        <Link href="/" aria-label="Back to website" className="icon-orb hidden sm:inline-flex">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <button
          type="button"
          aria-label="Sign out"
          title="Sign out"
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
          className="icon-orb"
        >
          <LogOut className="h-4 w-4" />
        </button>
        <span
          title={session ? `${session.name} · ${roleLabels[session.role]}` : undefined}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
        >
          {initials || "LS"}
        </span>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col gap-1 bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-ink-foreground">
                  <BrandMark className="h-5 w-5" />
                </span>
                <BrandWordmark className="truncate text-base" />
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="icon-orb shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {session && (
              <p className="mt-4 truncate rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
                {roleLabels[session.role]} · {session.name}
              </p>
            )}

            <nav className="mt-4 flex flex-col gap-1">
              {visible.map((m) => (
                <Link
                  key={m.url}
                  href={m.url}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(m.url)
                      ? "bg-ink text-ink-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {m.title}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Back to website
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  signOut();
                  router.replace("/login");
                }}
                className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/** Compact module rail — primary navigation below the lg breakpoint. */
export function DashRail({
  items,
}: {
  items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  const pathname = usePathname();
  const { can } = useAuth();
  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);

  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center gap-2 py-6 md:flex">
      {items
        .filter((item) => can(item.url))
        .map((item) => (
          <Link
            key={item.url}
            href={item.url}
            title={item.title}
            aria-label={item.title}
            className={`icon-orb ${isActive(item.url) ? "bg-ink text-ink-foreground hover:text-ink-foreground" : ""}`}
          >
            <item.icon className="h-4 w-4" />
          </Link>
        ))}
      {can("/dashboard/children") && (
        <>
          <span className="mt-2 h-px w-6 bg-border" />
          <Link
            href="/dashboard/children"
            title="Add a child"
            aria-label="Add a child"
            className="icon-orb"
          >
            <Plus className="h-4 w-4" />
          </Link>
        </>
      )}

      {can("/dashboard/admin") && (
        <Link href="/dashboard/admin" title="Admin" aria-label="Admin" className="icon-orb">
          <ShieldCheck className="h-4 w-4" />
        </Link>
      )}
    </aside>
  );
}
