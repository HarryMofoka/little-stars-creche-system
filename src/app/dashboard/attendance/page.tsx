"use client";

import { useMemo, useState } from "react";
import { LogIn, LogOut, Search, UserX, X } from "lucide-react";

import { toast } from "sonner";

import { PageTitle, Pill } from "@/components/lms/LmsBlocks";
import { classrooms, today as TODAY, type AttendanceState, type Child } from "@/data/lms";
import { useLms } from "@/lib/lms-store";
import { useScopedData } from "@/lib/lms-access";

function now(): string {
  return new Date().toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const tone: Record<AttendanceState, "success" | "neutral" | "danger"> = {
  in: "success",
  out: "neutral",
  absent: "danger",
};

const label: Record<AttendanceState, string> = {
  in: "On site",
  out: "Collected",
  absent: "Absent",
};

/** yyyy-mm-dd shifted by whole days, kept as a string so it stays URL/filter friendly. */
function shiftDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const fieldClass =
  "w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary";

export default function Attendance() {
  const { setAttendance } = useLms();
  const scoped = useScopedData();

  const [room, setRoom] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState(shiftDays(TODAY, -6));
  const [to, setTo] = useState(TODAY);
  const [state, setState] = useState<AttendanceState | "all">("all");

  const enrolled = useMemo(
    () => scoped.children.filter((c) => c.status === "enrolled"),
    [scoped.children],
  );

  const nameOf = (c: Child) => `${c.firstName} ${c.lastName}`;
  const matchesFilters = (c: Child) =>
    (room === "all" || c.classroom === room) &&
    (query.trim() === "" ||
      nameOf(c).toLowerCase().includes(query.trim().toLowerCase()) ||
      c.classroom.toLowerCase().includes(query.trim().toLowerCase()));

  const roll = enrolled.filter(matchesFilters);
  const showToday = TODAY >= from && TODAY <= to;

  const recordFor = (id: string, date = TODAY) =>
    scoped.attendance.find((r) => r.childId === id && r.date === date) ?? {
      childId: id,
      date,
      state: "absent" as AttendanceState,
      checkIn: null,
      checkOut: null,
    };

  /** Every record in range matching the filters, newest day first. */
  const history = useMemo(() => {
    const byId = new Map(scoped.children.map((c) => [c.id, c]));
    return scoped.attendance
      .filter((r) => r.date >= from && r.date <= to && r.date !== TODAY)
      .filter((r) => state === "all" || r.state === state)
      .map((r) => ({ record: r, child: byId.get(r.childId) }))
      .filter((row): row is { record: typeof row.record; child: Child } =>
        Boolean(row.child && matchesFilters(row.child)),
      )
      .sort((a, b) =>
        a.record.date === b.record.date
          ? nameOf(a.child).localeCompare(nameOf(b.child))
          : b.record.date.localeCompare(a.record.date),
      );
  }, [scoped.attendance, scoped.children, from, to, state, room, query]);

  const todayRoll = roll.filter((c) => state === "all" || recordFor(c.id).state === state);

  function checkIn(id: string, name: string) {
    setAttendance({ childId: id, date: TODAY, state: "in", checkIn: now(), checkOut: null });
    toast.success(`${name} checked in`);
  }

  function checkOut(id: string, name: string) {
    const current = recordFor(id);
    setAttendance({ ...current, state: "out", checkOut: now() });
    toast.success(`${name} collected`);
  }

  function markAbsent(id: string, name: string) {
    setAttendance({ childId: id, date: TODAY, state: "absent", checkIn: null, checkOut: null });
    toast(`${name} marked absent`);
  }

  function resetFilters() {
    setRoom("all");
    setQuery("");
    setFrom(shiftDays(TODAY, -6));
    setTo(TODAY);
    setState("all");
  }

  const present = todayRoll.filter((c) => recordFor(c.id).state === "in").length;
  const filtersActive =
    room !== "all" || query.trim() !== "" || state !== "all" || from !== shiftDays(TODAY, -6) || to !== TODAY;

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Daily attendance"
        title={`Register · ${longDate(TODAY)}`}
        action={
          <Pill tone="brand">
            {present} of {todayRoll.length} on site
            {room === "all" ? "" : ` in ${room}`}
          </Pill>
        }
      />

      {/* Filters — stacked on mobile, inline from md up */}
      <div className="dash-card space-y-4 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search child or classroom"
              aria-label="Search attendance by child or classroom"
              className={`${fieldClass} pl-11`}
            />
          </label>
          <select
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            aria-label="Filter by classroom"
            className={fieldClass}
          >
            <option value="all">All classrooms</option>
            {classrooms.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="block text-xs font-medium text-muted-foreground">
            From
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className={`${fieldClass} mt-1.5`}
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            To
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className={`${fieldClass} mt-1.5`}
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Status
            <select
              value={state}
              onChange={(e) => setState(e.target.value as AttendanceState | "all")}
              className={`${fieldClass} mt-1.5`}
            >
              <option value="all">All statuses</option>
              <option value="in">On site</option>
              <option value="out">Collected</option>
              <option value="absent">Absent</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="min-w-0 text-xs text-muted-foreground">
            {todayRoll.length} on today&rsquo;s register · {history.length} earlier record
            {history.length === 1 ? "" : "s"} in range
          </p>
          {filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {showToday && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-tight">Today</h2>

          {/* Mobile: three columns only — child, status, actions */}
          <div className="dash-card divide-y divide-border md:hidden">
            {todayRoll.map((c) => {
              const record = recordFor(c.id);
              const name = nameOf(c);
              return (
                <div
                  key={c.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="truncate text-xs tabular-nums text-muted-foreground">
                      {record.checkIn ?? "—"} → {record.checkOut ?? "—"}
                    </p>
                  </div>
                  <Pill tone={tone[record.state]}>{label[record.state]}</Pill>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Check in ${name}`}
                      onClick={() => checkIn(c.id, name)}
                      disabled={record.state === "in"}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-40"
                    >
                      <LogIn className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Check out ${name}`}
                      onClick={() => checkOut(c.id, name)}
                      disabled={record.state !== "in"}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:opacity-40"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Mark ${name} absent`}
                      onClick={() => markAbsent(c.id, name)}
                      disabled={record.state === "absent"}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40"
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {todayRoll.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                No children match these filters.
              </p>
            )}
          </div>

          <div className="hidden overflow-x-auto dash-card p-1 md:block">
            <table className="w-full min-w-[38rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="whitespace-nowrap px-6 py-3 font-medium">Child</th>
                  <th className="whitespace-nowrap px-6 py-3 font-medium">Classroom</th>
                  <th className="whitespace-nowrap px-6 py-3 font-medium">Status</th>
                  <th className="whitespace-nowrap px-6 py-3 font-medium">Check in</th>
                  <th className="whitespace-nowrap px-6 py-3 font-medium">Check out</th>
                  <th className="whitespace-nowrap px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todayRoll.map((c) => {
                  const record = recordFor(c.id);
                  const name = nameOf(c);
                  return (
                    <tr key={c.id} className="border-b border-border last:border-b-0">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">{name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                        {c.classroom}
                      </td>
                      <td className="px-6 py-4">
                        <Pill tone={tone[record.state]}>{label[record.state]}</Pill>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 tabular-nums text-muted-foreground">
                        {record.checkIn ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 tabular-nums text-muted-foreground">
                        {record.checkOut ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => checkIn(c.id, name)}
                            disabled={record.state === "in"}
                            className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-40"
                          >
                            Check in
                          </button>
                          <button
                            type="button"
                            onClick={() => checkOut(c.id, name)}
                            disabled={record.state !== "in"}
                            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-40"
                          >
                            Check out
                          </button>
                          <button
                            type="button"
                            onClick={() => markAbsent(c.id, name)}
                            disabled={record.state === "absent"}
                            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40"
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {todayRoll.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      No children match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight">
          Earlier check-ins {from === to ? "" : `· ${shortDate(from)} – ${shortDate(to)}`}
        </h2>

        {/* Mobile: day + child, status, times */}
        <div className="dash-card divide-y divide-border md:hidden">
          {history.map(({ record, child }) => (
            <div
              key={`${record.childId}-${record.date}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{nameOf(child)}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {shortDate(record.date)} · {child.classroom}
                </p>
                <p className="truncate text-xs tabular-nums text-muted-foreground">
                  {record.checkIn ?? "—"} → {record.checkOut ?? "—"}
                </p>
              </div>
              <Pill tone={tone[record.state]}>{label[record.state]}</Pill>
            </div>
          ))}
          {history.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No records in this date range.
            </p>
          )}
        </div>

        <div className="hidden overflow-x-auto dash-card p-1 md:block">
          <table className="w-full min-w-[38rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="whitespace-nowrap px-6 py-3 font-medium">Date</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Child</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Classroom</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Status</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Check in</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium">Check out</th>
              </tr>
            </thead>
            <tbody>
              {history.map(({ record, child }) => (
                <tr
                  key={`${record.childId}-${record.date}`}
                  className="border-b border-border last:border-b-0 hover:bg-muted/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                    {shortDate(record.date)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium">{nameOf(child)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                    {child.classroom}
                  </td>
                  <td className="px-6 py-4">
                    <Pill tone={tone[record.state]}>{label[record.state]}</Pill>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 tabular-nums text-muted-foreground">
                    {record.checkIn ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 tabular-nums text-muted-foreground">
                    {record.checkOut ?? "—"}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    No records in this date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
