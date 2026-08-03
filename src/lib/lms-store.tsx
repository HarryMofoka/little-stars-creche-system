import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  attendanceToday as seedAttendance,
  children as seedChildren,
  dailyReports as seedReports,
  invoices as seedInvoices,
  milestones as seedMilestones,
  programmes as seedProgrammes,
  staff as seedStaff,
  type AttendanceRecord,
  type Child,
  type DailyReport,
  type Invoice,
  type Milestone,
  type Programme,
  type StaffMember,
} from "@/data/lms";

/** Everything the dashboard can edit. Demo persistence: browser localStorage. */
export type LmsData = {
  children: Child[];
  attendance: AttendanceRecord[];
  reports: DailyReport[];
  milestones: Milestone[];
  staff: StaffMember[];
  invoices: Invoice[];
  programmes: Programme[];
};

const seed: LmsData = {
  children: seedChildren,
  attendance: seedAttendance,
  reports: seedReports,
  milestones: seedMilestones,
  staff: seedStaff,
  invoices: seedInvoices,
  programmes: seedProgrammes,
};

const STORAGE_KEY = "little-stars-lms-v1";

function newId(prefix: string): string {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
}

type LmsContextValue = {
  data: LmsData;
  ready: boolean;
  resetDemoData: () => void;

  // children & enrolments
  createChild: (child: Omit<Child, "id">) => Child;
  updateChild: (id: string, patch: Partial<Child>) => void;
  archiveChild: (id: string, archived?: boolean) => void;

  // attendance
  setAttendance: (record: AttendanceRecord) => void;
  clearAttendance: (childId: string, date?: string) => void;

  // staff
  createStaff: (member: Omit<StaffMember, "id">) => void;
  updateStaff: (id: string, patch: Partial<StaffMember>) => void;
  archiveStaff: (id: string, archived?: boolean) => void;

  // programmes / fee schedules
  createProgramme: (programme: Omit<Programme, "id">) => void;
  updateProgramme: (id: string, patch: Partial<Programme>) => void;
  archiveProgramme: (id: string, archived?: boolean) => void;

  // invoices
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
};

const LmsContext = createContext<LmsContextValue | null>(null);

export function LmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LmsData>(seed);
  const [ready, setReady] = useState(false);

  // Load after mount so server and first client render match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...seed, ...(JSON.parse(raw) as Partial<LmsData>) });
    } catch {
      /* ignore corrupt demo data */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full or unavailable — demo data stays in memory */
    }
  }, [data, ready]);

  const patchList = useCallback(
    <K extends keyof LmsData>(key: K, fn: (list: LmsData[K]) => LmsData[K]) => {
      setData((prev) => ({ ...prev, [key]: fn(prev[key]) }));
    },
    [],
  );

  const value = useMemo<LmsContextValue>(() => {
    return {
      data,
      ready,
      resetDemoData: () => setData(seed),

      createChild: (child) => {
        const created: Child = { ...child, id: newId("c") };
        patchList("children", (list) => [created, ...list]);
        return created;
      },
      updateChild: (id, patch) =>
        patchList("children", (list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      archiveChild: (id, archived = true) =>
        patchList("children", (list) => list.map((c) => (c.id === id ? { ...c, archived } : c))),

      setAttendance: (record) =>
        patchList("attendance", (list) => {
          const same = (a: AttendanceRecord) =>
            a.childId === record.childId && a.date === record.date;
          return list.some(same) ? list.map((a) => (same(a) ? record : a)) : [...list, record];
        }),
      clearAttendance: (childId, date) =>
        patchList("attendance", (list) =>
          list.filter((a) => !(a.childId === childId && (date === undefined || a.date === date))),
        ),


      createStaff: (member) =>
        patchList("staff", (list) => [{ ...member, id: newId("s") }, ...list]),
      updateStaff: (id, patch) =>
        patchList("staff", (list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s))),
      archiveStaff: (id, archived = true) =>
        patchList("staff", (list) => list.map((s) => (s.id === id ? { ...s, archived } : s))),

      createProgramme: (programme) =>
        patchList("programmes", (list) => [...list, { ...programme, id: newId("p") }]),
      updateProgramme: (id, patch) =>
        patchList("programmes", (list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      archiveProgramme: (id, archived = true) =>
        patchList("programmes", (list) => list.map((p) => (p.id === id ? { ...p, archived } : p))),

      updateInvoice: (id, patch) =>
        patchList("invoices", (list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i))),
    };
  }, [data, ready, patchList]);

  return <LmsContext.Provider value={value}>{children}</LmsContext.Provider>;
}

export function useLms(): LmsContextValue {
  const ctx = useContext(LmsContext);
  if (!ctx) throw new Error("useLms must be used inside <LmsProvider>");
  return ctx;
}
