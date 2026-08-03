"use client";

import { useMemo, useState } from "react";
import { Bell, Check, Inbox, Mail, RotateCcw, Trash2 } from "lucide-react";

import { PageTitle, Pill } from "@/components/lms/LmsBlocks";
import { useAuth } from "@/lib/auth";
import {
  formatWhen,
  notificationCategoryLabels,
  useActivity,
  type AppNotification,
  type NotificationCategory,
} from "@/lib/activity";

type Filter = "all" | "unread" | "read";

function categoryOf(note: AppNotification): NotificationCategory {
  return note.category ?? "system";
}

export default function NotificationsInbox() {
  const { session } = useAuth();
  const {
    myNotifications,
    unreadCount,
    markNotificationRead,
    markNotificationUnread,
    markAllNotificationsRead,
    deleteNotification,
  } = useActivity();

  const [filter, setFilter] = useState<Filter>("all");
  const [category, setCategory] = useState<NotificationCategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const shown = useMemo(
    () =>
      myNotifications.filter((n) => {
        if (filter === "unread" && n.read) return false;
        if (filter === "read" && !n.read) return false;
        if (category !== "all" && categoryOf(n) !== category) return false;
        return true;
      }),
    [myNotifications, filter, category],
  );

  return (
    <div className="space-y-8">
      <PageTitle eyebrow="Inbox" title="Notifications" />
      {session && (
        <p className="-mt-6 text-sm text-muted-foreground">
          Every onboarding and enrolment update sent to {session.email}. {unreadCount} unread.
        </p>
      )}

      <section className="dash-card">
        <div className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "unread", "read"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? "border-transparent bg-ink text-ink-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                {f}
                {f === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
              </button>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
            {(["all", "onboarding", "enrolment", "system"] as Array<
              NotificationCategory | "all"
            >).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  category === c
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                {c === "all" ? "All types" : notificationCategoryLabels[c]}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="justify-self-start rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-muted sm:justify-self-end"
            >
              Mark all read
            </button>
          )}
        </div>

        <ul className="divide-y divide-border">
          {shown.map((note) => {
            const open = openId === note.id;
            const emailed = note.channel === "email";
            return (
              <li key={note.id} className={note.read ? "" : "bg-accent/40"}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-4 py-4 sm:px-6">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                    {emailed ? <Mail className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenId(open ? null : note.id);
                      if (!note.read) markNotificationRead(note.id);
                    }}
                    className="min-w-0 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`truncate text-sm ${note.read ? "font-medium" : "font-semibold"}`}
                      >
                        {note.title}
                      </span>
                      {!note.read && <Pill tone="brand">New</Pill>}
                      <Pill>{notificationCategoryLabels[categoryOf(note)]}</Pill>
                      {emailed && <Pill>Emailed</Pill>}
                    </div>
                    <p
                      className={`mt-1 text-sm text-muted-foreground ${open ? "" : "line-clamp-2"}`}
                    >
                      {note.body}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatWhen(note.at)}</p>
                  </button>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={note.read ? "Mark as unread" : "Mark as read"}
                      title={note.read ? "Mark as unread" : "Mark as read"}
                      onClick={() =>
                        note.read ? markNotificationUnread(note.id) : markNotificationRead(note.id)
                      }
                      className="rounded-full border border-border p-2 transition-colors hover:bg-muted"
                    >
                      {note.read ? (
                        <RotateCcw className="h-3.5 w-3.5" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      aria-label="Delete notification"
                      title="Delete"
                      onClick={() => deleteNotification(note.id)}
                      className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="px-4 pb-5 sm:px-6 sm:pl-[4.5rem]">
                    {note.subject && (
                      <p className="text-xs text-muted-foreground">
                        Email subject: <span className="font-medium">{note.subject}</span>
                      </p>
                    )}
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
                  </div>
                )}
              </li>
            );
          })}

          {shown.length === 0 && (
            <li className="flex flex-col items-center gap-2 px-6 py-14 text-center">
              <Inbox className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium">Nothing here</p>
              <p className="text-sm text-muted-foreground">
                Onboarding and enrolment updates for your account will appear in this inbox.
              </p>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
