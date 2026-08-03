import { useState } from "react";

import type { Child, EnrolmentStatus } from "@/data/lms";

const statuses: EnrolmentStatus[] = ["enrolled", "waitlist", "graduated"];

export type ChildDraft = Omit<Child, "id">;

export function emptyChild(classroom: string): ChildDraft {
  return {
    firstName: "",
    lastName: "",
    birthDate: "",
    classroom,
    status: "waitlist",
    startDate: "",
    allergies: [],
    notes: "",
    guardians: [{ name: "", relation: "Mother", phone: "", email: "" }],
    archived: false,
  };
}

const field =
  "mt-1.5 w-full rounded-full border border-input bg-card px-4 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

/** Shared create/edit form for a child and their primary guardian. */
export function ChildForm({
  initial,
  classrooms,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: ChildDraft;
  classrooms: string[];
  submitLabel: string;
  onSubmit: (draft: ChildDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ChildDraft>(initial);
  const guardian = draft.guardians[0] ?? { name: "", relation: "", phone: "", email: "" };

  const set = <K extends keyof ChildDraft>(key: K, value: ChildDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(draft);
      }}
      className="dash-card space-y-4 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          First name
          <input
            required
            value={draft.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Last name
          <input
            required
            value={draft.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Date of birth
          <input
            required
            type="date"
            value={draft.birthDate}
            onChange={(e) => set("birthDate", e.target.value)}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Start date
          <input
            type="date"
            value={draft.startDate}
            onChange={(e) => set("startDate", e.target.value)}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Classroom
          <select
            value={draft.classroom}
            onChange={(e) => set("classroom", e.target.value)}
            className={field}
          >
            {classrooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Enrolment status
          <select
            value={draft.status}
            onChange={(e) => set("status", e.target.value as EnrolmentStatus)}
            className={field}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Allergies (comma separated)
          <input
            value={draft.allergies.join(", ")}
            onChange={(e) =>
              set(
                "allergies",
                e.target.value
                  .split(",")
                  .map((a) => a.trim())
                  .filter(Boolean),
              )
            }
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Guardian name
          <input
            value={guardian.name}
            onChange={(e) => set("guardians", [{ ...guardian, name: e.target.value }])}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Guardian phone
          <input
            value={guardian.phone}
            onChange={(e) => set("guardians", [{ ...guardian, phone: e.target.value }])}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Guardian email
          <input
            type="email"
            value={guardian.email}
            onChange={(e) => set("guardians", [{ ...guardian, email: e.target.value }])}
            className={field}
          />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Notes
        <textarea
          value={draft.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>

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
