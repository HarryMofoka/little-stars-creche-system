"use client";

import Link from "next/link";
import { Bell, BellRing, Check } from "lucide-react";

import { formatWhen, useActivity } from "@/lib/activity";
import { useAuth } from "@/lib/auth";

/** Notifications addressed to the signed-in account (parents get enrolment updates). */
export function NotificationsPanel({ limit = 5 }: { limit?: number }) {
  const { session } = useAuth();
  const { myNotifications, unreadCount, markNotificationRead, markAllNotificationsRead } =
    useActivity();
  if (!session || myNotifications.length === 0) return null;

  const shown = myNotifications.slice(0, limit);

  return (
    <section className="dash-card">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border px-6 py-4">
        <div className="min-w-0">
          <p className="eyebrow text-muted-foreground">Notifications</p>
          <h2 className="mt-1 flex items-center gap-2 text-base font-semibold tracking-tight">
            {unreadCount > 0 ? (
              <BellRing className="h-4 w-4 shrink-0 text-primary" />
            ) : (
              <Bell className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="truncate">
              {unreadCount > 0 ? `${unreadCount} new update${unreadCount > 1 ? "s" : ""}` : "All caught up"}
            </span>
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              Mark all read
            </button>
          )}
          <Link
            href="/dashboard/notifications"
            className="shrink-0 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-ink-foreground transition-opacity hover:opacity-90"
          >
            Open inbox
          </Link>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {shown.map((note) => (
          <li key={note.id} className={`px-6 py-4 ${note.read ? "" : "bg-accent/40"}`}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{note.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{note.body}</p>
                {note.details.length > 0 && (
                  <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                    {note.details.map((d) => (
                      <div
                        key={d.label}
                        className="rounded-xl border border-border bg-card/60 px-3 py-2"
                      >
                        <dt className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                          {d.label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{formatWhen(note.at)}</p>
              </div>
              {!note.read && (
                <button
                  type="button"
                  aria-label="Mark as read"
                  onClick={() => markNotificationRead(note.id)}
                  className="shrink-0 rounded-full border border-border p-2 transition-colors hover:bg-muted"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
