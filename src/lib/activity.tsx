import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { roleLabels, useAuth, type Role } from "@/lib/auth";

/**
 * Audit log + notifications for onboarding and enrolment changes.
 * Demo persistence: browser localStorage, same as the rest of the LMS store.
 */

export type AuditAction =
  | "onboarding.answer"
  | "onboarding.completed"
  | "onboarding.saved"
  | "enrolment.created"
  | "staff.created";

export type AuditEntry = {
  id: string;
  at: string;
  /** Who made the change. */
  actorName: string;
  actorEmail: string;
  actorRole: Role;
  action: AuditAction;
  /** What was changed, in plain language. */
  summary: string;
  /** Optional before → after detail. */
  before?: string;
  after?: string;
  /** Roles allowed to read this entry. */
  audience: Role[];
  /** Parents may only read entries about their own children/account. */
  subjectEmail?: string;
  childId?: string;
};

export type NotificationChannel = "inbox" | "email";
export type NotificationCategory = "onboarding" | "enrolment" | "system";

export type AppNotification = {
  id: string;
  at: string;
  /** Recipient account email. */
  to: string;
  title: string;
  body: string;
  /** Key details rendered as a small definition list. */
  details: Array<{ label: string; value: string }>;
  read: boolean;
  /** How it was delivered — "email" entries were also sent to the parent's inbox. */
  channel?: NotificationChannel;
  category?: NotificationCategory;
  /** Optional subject line used when the notification was emailed. */
  subject?: string;
};

export const notificationCategoryLabels: Record<NotificationCategory, string> = {
  onboarding: "Onboarding",
  enrolment: "Enrolment",
  system: "General",
};


const AUDIT_KEY = "little-stars-audit-v1";
const NOTIFY_KEY = "little-stars-notifications-v1";
const LIMIT = 200;

export const auditActionLabels: Record<AuditAction, string> = {
  "onboarding.answer": "Onboarding answer",
  "onboarding.completed": "Onboarding completed",
  "onboarding.saved": "Onboarding progress saved",
  "enrolment.created": "Enrolment created",
  "staff.created": "Staff record created",
};

type ActivityContextValue = {
  ready: boolean;
  entries: AuditEntry[];
  notifications: AppNotification[];
  /** Entries the signed-in user is allowed to read, newest first. */
  visibleEntries: AuditEntry[];
  /** Notifications addressed to the signed-in user, newest first. */
  myNotifications: AppNotification[];
  unreadCount: number;
  logAudit: (entry: Omit<AuditEntry, "id" | "at">) => void;
  notify: (notification: Omit<AppNotification, "id" | "at" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markNotificationUnread: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearActivity: () => void;

};

const ActivityContext = createContext<ActivityContextValue | null>(null);

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — activity stays in memory */
  }
}

function newId(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEntries(readLocal<AuditEntry[]>(AUDIT_KEY, []));
    setNotifications(readLocal<AppNotification[]>(NOTIFY_KEY, []));
    setReady(true);
  }, []);

  const logAudit = useCallback((entry: Omit<AuditEntry, "id" | "at">) => {
    setEntries((prev) => {
      const next = [{ ...entry, id: newId("a"), at: new Date().toISOString() }, ...prev].slice(
        0,
        LIMIT,
      );
      writeLocal(AUDIT_KEY, next);
      return next;
    });
  }, []);

  const notify = useCallback((notification: Omit<AppNotification, "id" | "at" | "read">) => {
    setNotifications((prev) => {
      const next = [
        { ...notification, id: newId("n"), at: new Date().toISOString(), read: false },
        ...prev,
      ].slice(0, LIMIT);
      writeLocal(NOTIFY_KEY, next);
      return next;
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      writeLocal(NOTIFY_KEY, next);
      return next;
    });
  }, []);

  const markNotificationUnread = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: false } : n));
      writeLocal(NOTIFY_KEY, next);
      return next;
    });
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id);
      writeLocal(NOTIFY_KEY, next);
      return next;
    });
  }, []);


  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      writeLocal(NOTIFY_KEY, next);
      return next;
    });
  }, []);

  const clearActivity = useCallback(() => {
    setEntries([]);
    setNotifications([]);
    writeLocal(AUDIT_KEY, []);
    writeLocal(NOTIFY_KEY, []);
  }, []);

  const value = useMemo<ActivityContextValue>(() => {
    const role = session?.role;
    const email = session?.email;
    const childIds = session?.childIds ?? [];

    const visibleEntries = !role
      ? []
      : entries.filter((entry) => {
          if (!entry.audience.includes(role)) return false;
          // Admins read the whole log; teachers read school-wide setup activity.
          if (role === "admin" || role === "staff") return true;
          // Parents only read entries about their own account or children.
          return (
            entry.subjectEmail === email ||
            entry.actorEmail === email ||
            (entry.childId ? childIds.includes(entry.childId) : false)
          );
        });

    const myNotifications = email ? notifications.filter((n) => n.to === email) : [];

    return {
      ready,
      entries,
      notifications,
      visibleEntries,
      myNotifications,
      unreadCount: myNotifications.filter((n) => !n.read).length,
      logAudit,
      notify,
      markNotificationRead,
      markNotificationUnread,
      markAllNotificationsRead,
      deleteNotification,
      clearActivity,
    };
  }, [
    entries,
    notifications,
    ready,
    session,
    logAudit,
    notify,
    markNotificationRead,
    markNotificationUnread,
    markAllNotificationsRead,
    deleteNotification,
    clearActivity,
  ]);


  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity(): ActivityContextValue {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used inside <ActivityProvider>");
  return ctx;
}

/** "Grace Sibanda (Teacher)" — used in the audit list. */
export function actorLabel(entry: AuditEntry) {
  return `${entry.actorName} (${roleLabels[entry.actorRole]})`;
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
