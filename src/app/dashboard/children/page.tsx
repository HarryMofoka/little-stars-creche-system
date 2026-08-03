"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";

import { PageTitle, Pill } from "@/components/lms/LmsBlocks";
import { ChildForm, emptyChild } from "@/components/lms/ChildForm";
import { classrooms, formatAge, type EnrolmentStatus } from "@/data/lms";
import { useLms } from "@/lib/lms-store";
import { useScopedData } from "@/lib/lms-access";

const statusTone: Record<EnrolmentStatus, "success" | "warning" | "neutral"> = {
  enrolled: "success",
  waitlist: "warning",
  graduated: "neutral",
};

const filters: Array<{ label: string; value: EnrolmentStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Enrolled", value: "enrolled" },
  { label: "Waitlist", value: "waitlist" },
  { label: "Graduated", value: "graduated" },
];

export default function ChildrenList() {
  const { createChild, archiveChild } = useLms();
  const [showArchived, setShowArchived] = useState(false);
  const scoped = useScopedData(showArchived);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<EnrolmentStatus | "all">("all");
  const [room, setRoom] = useState<string>("all");
  const [adding, setAdding] = useState(false);

  const rows = useMemo(
    () =>
      scoped.children.filter((c) => {
        const name = `${c.firstName} ${c.lastName}`.toLowerCase();
        const matchesQuery = name.includes(query.trim().toLowerCase());
        const matchesStatus = status === "all" || c.status === status;
        const matchesRoom = room === "all" || c.classroom === room;
        return matchesQuery && matchesStatus && matchesRoom;
      }),
    [scoped.children, query, status, room],
  );

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Children & enrolment"
        title="Learner register"
        action={
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" /> {adding ? "Close form" : "Add a child"}
          </button>
        }
      />

      {adding && (
        <ChildForm
          initial={emptyChild(classrooms[0])}
          classrooms={[...classrooms]}
          submitLabel="Create enrolment"
          onCancel={() => setAdding(false)}
          onSubmit={(draft) => {
            createChild(draft);
            setAdding(false);
            toast.success(`${draft.firstName} ${draft.lastName} added`);
          }}
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            aria-label="Search children by name"
            className="w-full rounded-full border border-input bg-card py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex overflow-hidden rounded-full dash-card">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                status === f.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          aria-label="Filter by classroom"
          className="rounded-full border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="all">All classrooms</option>
          {classrooms.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Show archived
        </label>
      </div>

      <div className="overflow-x-auto dash-card p-1">
        <table className="w-full min-w-[64rem] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="whitespace-nowrap px-5 py-3 font-medium">Child</th>
              <th className="w-28 whitespace-nowrap px-5 py-3 font-medium">Age</th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">Classroom</th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">Status</th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">Allergies</th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">Guardian</th>
              <th className="whitespace-nowrap px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                <td className="px-5 py-4">
                  <Link
                    href={`/dashboard/children/${c.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {c.firstName} {c.lastName}
                  </Link>
                  {c.archived && (
                    <span className="ml-2 text-xs text-muted-foreground">archived</span>
                  )}
                </td>
                <td className="w-28 whitespace-nowrap px-5 py-4 tabular-nums text-muted-foreground">
                  {formatAge(c.birthDate)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{c.classroom}</td>
                <td className="px-5 py-4">
                  <Pill tone={statusTone[c.status]}>{c.status}</Pill>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                  {c.allergies.length ? c.allergies.join(", ") : "None"}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{c.guardians[0]?.name || "—"}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/children/${c.id}`}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        archiveChild(c.id, !c.archived);
                        toast(c.archived ? "Enrolment restored" : "Enrolment archived");
                      }}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      {c.archived ? "Restore" : "Archive"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                  No children match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
