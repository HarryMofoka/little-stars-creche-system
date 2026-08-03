import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Demo authentication. No backend yet: accounts below are fixed and the signed-in
 * user is remembered in localStorage. Roles decide which dashboard modules load.
 */
export type Role = "admin" | "staff" | "parent";

export type DemoUser = {
  email: string;
  password: string;
  name: string;
  role: Role;
  /** Parents only: the children they may see. */
  childIds?: string[];
  /** Staff only: the classroom they are responsible for. */
  classroom?: string;
};

export const demoUsers: DemoUser[] = [
  {
    email: "admin@littlestars.co.za",
    password: "little-stars",
    name: "Bongi Mahlangu",
    role: "admin",
  },
  {
    email: "teacher@littlestars.co.za",
    password: "little-stars",
    name: "Grace Sibanda",
    role: "staff",
    classroom: "Comets",
  },
  {
    email: "parent@example.com",
    password: "little-stars",
    name: "Thandi Ndlovu",
    role: "parent",
    childIds: ["c1"],
  },
];

export type Session = Omit<DemoUser, "password"> & { onboarded?: boolean };

const STORAGE_KEY = "little-stars-session-v1";
const ACCOUNTS_KEY = "little-stars-accounts-v1";
const ONBOARDING_KEY = "little-stars-onboarding-v1";
const ONBOARDING_DRAFT_KEY = "little-stars-onboarding-draft-v1";


export const roleLabels: Record<Role, string> = {
  admin: "Administrator",
  staff: "Teacher",
  parent: "Parent",
};

/** Which dashboard modules each role may open. */
export const roleModules: Record<Role, string[]> = {
  admin: [
    "/dashboard",
    "/dashboard/children",
    "/dashboard/attendance",
    "/dashboard/reports",
    "/dashboard/staff",
    "/dashboard/fees",
    "/dashboard/admin",
    "/dashboard/notifications",
  ],
  staff: [
    "/dashboard",
    "/dashboard/children",
    "/dashboard/attendance",
    "/dashboard/reports",
    "/dashboard/notifications",
  ],
  parent: ["/dashboard", "/dashboard/reports", "/dashboard/fees", "/dashboard/notifications"],
};

export type OnboardingAnswers = Record<string, string>;

/** A finished (saved) onboarding run, kept per role so answers stay reviewable. */
export type OnboardingRecord = {
  answers: OnboardingAnswers;
  role: Role;
  savedAt: string;
};

/** Partially completed onboarding, so anyone can pick up where they left off. */
export type OnboardingDraft = {
  answers: OnboardingAnswers;
  step: number;
  total: number;
  role?: Role;
};

type AuthContextValue = {
  session: Session | null;
  ready: boolean;
  signIn: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signUp: (input: {
    name: string;
    email: string;
    password: string;
  }) => { ok: true } | { ok: false; error: string };
  signOut: () => void;
  completeOnboarding: (answers: OnboardingAnswers, role?: Role) => void;
  saveOnboardingDraft: (draft: OnboardingDraft) => void;
  updateSession: (patch: Partial<Session>) => void;
  onboardingDraft: OnboardingDraft | null;
  onboarding: OnboardingAnswers | null;
  onboardingRecord: OnboardingRecord | null;
  can: (path: string) => boolean;
  initials: string;
};


const AuthContext = createContext<AuthContextValue | null>(null);

function readLocal<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [onboardingRecord, setOnboardingRecord] = useState<OnboardingRecord | null>(null);
  const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readLocal<Session>(STORAGE_KEY);
    if (stored) setSession(stored);
    // Older versions stored bare answers; wrap them so the shape stays consistent.
    const savedOnboarding = readLocal<OnboardingRecord | OnboardingAnswers>(ONBOARDING_KEY);
    if (savedOnboarding && "answers" in savedOnboarding) {
      setOnboardingRecord(savedOnboarding as OnboardingRecord);
    } else if (savedOnboarding) {
      setOnboardingRecord({
        answers: savedOnboarding as OnboardingAnswers,
        role: stored?.role ?? "parent",
        savedAt: new Date().toISOString(),
      });
    }
    setOnboardingDraft(readLocal<OnboardingDraft>(ONBOARDING_DRAFT_KEY));
    setReady(true);
  }, []);



  const signIn = useCallback((email: string, password: string) => {
    const created = readLocal<DemoUser[]>(ACCOUNTS_KEY) ?? [];
    const match = [...demoUsers, ...created].find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!match) return { ok: false as const, error: "Those details don't match an account." };
    const { password: _password, ...rest } = match;
    const next: Session = { ...rest, onboarded: true };
    setSession(next);
    writeLocal(STORAGE_KEY, next);
    return { ok: true as const };
  }, []);

  const signUp = useCallback(
    ({ name, email, password }: { name: string; email: string; password: string }) => {
      const normalised = email.trim().toLowerCase();
      const created = readLocal<DemoUser[]>(ACCOUNTS_KEY) ?? [];
      if ([...demoUsers, ...created].some((u) => u.email.toLowerCase() === normalised)) {
        return { ok: false as const, error: "An account already uses that email address." };
      }
      if (password.length < 6) {
        return { ok: false as const, error: "Please use a password of at least 6 characters." };
      }
      const account: DemoUser & { onboarded?: boolean } = {
        email: normalised,
        password,
        name: name.trim() || "New parent",
        role: "parent",
        childIds: [],
      };
      writeLocal(ACCOUNTS_KEY, [...created, account]);
      const { password: _password, ...rest } = account;
      const next: Session = { ...rest, onboarded: false };
      setSession(next);
      writeLocal(STORAGE_KEY, next);
      return { ok: true as const };
    },
    [],
  );

  const signOut = useCallback(() => {
    setSession(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const completeOnboarding = useCallback((answers: OnboardingAnswers, role?: Role) => {
    setSession((current) => {
      const record: OnboardingRecord = {
        answers,
        role: role ?? current?.role ?? "parent",
        savedAt: new Date().toISOString(),
      };
      setOnboardingRecord(record);
      writeLocal(ONBOARDING_KEY, record);
      if (!current) return current;
      const next = { ...current, onboarded: true };
      writeLocal(STORAGE_KEY, next);
      return next;
    });
    setOnboardingDraft(null);
    try {
      window.localStorage.removeItem(ONBOARDING_DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const saveOnboardingDraft = useCallback((draft: OnboardingDraft) => {
    setOnboardingDraft(draft);
    writeLocal(ONBOARDING_DRAFT_KEY, draft);
  }, []);

  const updateSession = useCallback((patch: Partial<Session>) => {
    setSession((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      writeLocal(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const can = (path: string) => {
      if (!session) return false;
      return roleModules[session.role].some((allowed) =>
        allowed === "/dashboard" ? path === "/dashboard" : path.startsWith(allowed),
      );
    };
    const initials = session
      ? session.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "";
    return {
      session,
      ready,
      signIn,
      signUp,
      signOut,
      completeOnboarding,
      saveOnboardingDraft,
      updateSession,
      onboardingDraft,
      onboarding: onboardingRecord?.answers ?? null,
      onboardingRecord,
      can,
      initials,
    };
  }, [
    session,
    ready,
    signIn,
    signUp,
    signOut,
    completeOnboarding,
    saveOnboardingDraft,
    updateSession,
    onboardingDraft,
    onboardingRecord,
  ]);




  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
