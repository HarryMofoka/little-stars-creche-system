"use client";

import { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { PageTitle, Pill } from "@/components/lms/LmsBlocks";
import { formatMoney, type Programme } from "@/data/lms";
import { useLms } from "@/lib/lms-store";

const field =
  "mt-1.5 w-full rounded-2xl border border-input bg-card px-4 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

type Draft = Omit<Programme, "id">;

const emptyDraft: Draft = {
  name: "",
  ages: "",
  ratio: "",
  monthlyFee: 0,
  includes: [],
  archived: false,
};

function ProgrammeForm({
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
  const [includes, setIncludes] = useState(initial.includes.join("\n"));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...draft,
          includes: includes
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        });
      }}
      className="dash-card space-y-4 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm font-medium">
          Programme
          <input
            required
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Ages
          <input
            value={draft.ages}
            onChange={(e) => setDraft({ ...draft, ages: e.target.value })}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Ratio
          <input
            value={draft.ratio}
            onChange={(e) => setDraft({ ...draft, ratio: e.target.value })}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Monthly fee (R)
          <input
            type="number"
            min={0}
            value={draft.monthlyFee}
            onChange={(e) => setDraft({ ...draft, monthlyFee: Number(e.target.value) })}
            className={field}
          />
        </label>
      </div>
      <label className="block text-sm font-medium">
        What&apos;s included — one per line
        <textarea
          rows={4}
          value={includes}
          onChange={(e) => setIncludes(e.target.value)}
          className={`${field} rounded-2xl`}
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

export default function Admin() {
  const { data, createProgramme, updateProgramme, archiveProgramme, resetDemoData } = useLms();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editing = data.programmes.find((p) => p.id === editingId);

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Admin"
        title="Programmes & fee schedules"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setAdding((v) => !v);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" /> {adding ? "Close form" : "New programme"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetDemoData();
                toast("Demo data restored");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" /> Reset demo data
            </button>
          </div>
        }
      />

      {adding && (
        <ProgrammeForm
          initial={emptyDraft}
          submitLabel="Create programme"
          onCancel={() => setAdding(false)}
          onSubmit={(draft) => {
            createProgramme(draft);
            setAdding(false);
            toast.success(`${draft.name} added`);
          }}
        />
      )}

      {editing && (
        <ProgrammeForm
          initial={editing}
          submitLabel="Save programme"
          onCancel={() => setEditingId(null)}
          onSubmit={(draft) => {
            updateProgramme(editing.id, draft);
            setEditingId(null);
            toast.success("Fee schedule updated");
          }}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {data.programmes.map((p) => (
          <article key={p.id} className="dash-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{p.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {p.ages} · {p.ratio}
                </p>
              </div>
              <Pill tone={p.archived ? "neutral" : "success"}>
                {p.archived ? "archived" : formatMoney(p.monthlyFee) + " / month"}
              </Pill>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {p.includes.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setEditingId(p.id);
                }}
                className="rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-muted"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  archiveProgramme(p.id, !p.archived);
                  toast(p.archived ? "Programme restored" : "Programme archived");
                }}
                className="rounded-full border border-border px-4 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                {p.archived ? "Restore" : "Archive"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
