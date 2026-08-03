"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { PageTitle, Pill } from "@/components/lms/LmsBlocks";
import { classrooms, type StaffMember } from "@/data/lms";
import { useLms } from "@/lib/lms-store";
import { useScopedData } from "@/lib/lms-access";

const field =
  "mt-1.5 w-full rounded-full border border-input bg-card px-4 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

type Draft = Omit<StaffMember, "id">;

const emptyDraft: Draft = {
  name: "",
  role: "Lead teacher",
  classroom: classrooms[0],
  email: "",
  phone: "",
  since: "",
  archived: false,
};

function StaffForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: Draft;
  submitLabel: string;
  onSubmit: (draft: Draft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(initial);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(draft);
      }}
      className="dash-card space-y-4 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm font-medium">
          Name
          <input required value={draft.name} onChange={(e) => set("name", e.target.value)} className={field} />
        </label>
        <label className="block text-sm font-medium">
          Role
          <input required value={draft.role} onChange={(e) => set("role", e.target.value)} className={field} />
        </label>
        <label className="block text-sm font-medium">
          Classroom
          <select
            value={draft.classroom}
            onChange={(e) => set("classroom", e.target.value)}
            className={field}
          >
            {[...classrooms, "All classrooms", "Front office"].map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Email
          <input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} className={field} />
        </label>
        <label className="block text-sm font-medium">
          Phone
          <input value={draft.phone} onChange={(e) => set("phone", e.target.value)} className={field} />
        </label>
        <label className="block text-sm font-medium">
          Start date
          <input type="date" value={draft.since} onChange={(e) => set("since", e.target.value)} className={field} />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Staff() {
  const { createStaff, updateStaff, archiveStaff } = useLms();
  const [showArchived, setShowArchived] = useState(false);
  const scoped = useScopedData(showArchived);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const roster = scoped.staff;
  const editing = roster.find((s) => s.id === editingId);

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Staff"
        title="Team roster"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="brand">{roster.filter((s) => !s.archived).length} team members</Pill>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setAdding((v) => !v);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" /> {adding ? "Close form" : "Add team member"}
            </button>
          </div>
        }
      />

      {adding && (
        <StaffForm
          initial={emptyDraft}
          submitLabel="Add to roster"
          onCancel={() => setAdding(false)}
          onSubmit={(draft) => {
            createStaff(draft);
            setAdding(false);
            toast.success(`${draft.name} added to the roster`);
          }}
        />
      )}

      {editing && (
        <StaffForm
          initial={editing}
          submitLabel="Save changes"
          onCancel={() => setEditingId(null)}
          onSubmit={(draft) => {
            updateStaff(editing.id, draft);
            setEditingId(null);
            toast.success("Roster updated");
          }}
        />
      )}

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.target.checked)}
        />
        Show archived staff
      </label>

      <div className="overflow-x-auto dash-card p-1">
        <table className="w-full min-w-[38rem] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="whitespace-nowrap px-6 py-3 font-medium">Name</th>
              <th className="whitespace-nowrap px-6 py-3 font-medium">Role</th>
              <th className="whitespace-nowrap px-6 py-3 font-medium">Classroom</th>
              <th className="whitespace-nowrap px-6 py-3 font-medium">Children in room</th>
              <th className="whitespace-nowrap px-6 py-3 font-medium">Contact</th>
              <th className="whitespace-nowrap px-6 py-3 font-medium">Since</th>
              <th className="whitespace-nowrap px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((member) => {
              const roomCount = scoped.children.filter(
                (c) => c.classroom === member.classroom && c.status === "enrolled",
              ).length;
              return (
                <tr
                  key={member.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium">
                    {member.name}
                    {member.archived && (
                      <span className="ml-2 text-xs text-muted-foreground">archived</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{member.role}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{member.classroom}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                    {roomCount > 0 ? roomCount : "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                    <span className="block">{member.email}</span>
                    <span className="block text-xs">{member.phone}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{member.since || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAdding(false);
                          setEditingId(member.id);
                        }}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          archiveStaff(member.id, !member.archived);
                          toast(member.archived ? "Team member restored" : "Team member archived");
                        }}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        {member.archived ? "Restore" : "Archive"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
