"use client";

import { useState } from "react";
import { Receipt, CircleCheck, TriangleAlert, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageTitle, Pill, StatCard } from "@/components/lms/LmsBlocks";
import {
  expenseBreakdown,
  financeHistory,
  formatMoney,
  type InvoiceStatus,
} from "@/data/lms";
import { useLms } from "@/lib/lms-store";
import { useScopedData } from "@/lib/lms-access";

const filters: Array<{ label: string; value: InvoiceStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

const tone: Record<InvoiceStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  overdue: "danger",
};

const donutTones = [
  "var(--color-primary)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-muted-foreground)",
];

/** Shared chart panel so every visualisation carries the same dashboard chrome. */
function ChartPanel({
  eyebrow,
  title,
  detail,
  legend,
  children,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  legend?: Array<{ label: string; color: string; value?: string }>;
  children: React.ReactElement;
}) {
  return (
    <div className="dash-card p-6">
      <div className="min-w-0">
        <p className="eyebrow text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-bold tracking-tight">{title}</h2>
        {detail && <p className="mt-1 text-sm text-muted-foreground">{detail}</p>}
      </div>
      <div className="mt-6 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
      {legend && (
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {legend.map((l) => (
            <li key={l.label} className="flex min-w-0 items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: l.color }}
              />
              <span className="truncate text-muted-foreground">{l.label}</span>
              {l.value && <span className="tabular-nums font-medium">{l.value}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  fontSize: 12,
  color: "var(--color-foreground)",
} as const;

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

const monthNames: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

/** What the user drilled into from a chart: a month of cashflow, or one expense line. */
type Drill =
  | { kind: "month"; month: string; focus: "collected" | "expenses" | "net" }
  | { kind: "expense"; label: string };

export default function Fees() {
  const { updateInvoice } = useLms();
  const scoped = useScopedData();
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");
  const [drill, setDrill] = useState<Drill | null>(null);

  const invoices = scoped.invoices;
  const drillPeriod =
    drill?.kind === "month" ? `${monthNames[drill.month] ?? drill.month} 2026` : null;
  const rows = invoices
    .filter((i) => status === "all" || i.status === status)
    .filter((i) => !drillPeriod || i.period === drillPeriod);
  const nameOf = (childId: string) => {
    const child = scoped.children.find((c) => c.id === childId);
    return child ? `${child.firstName} ${child.lastName}` : "—";
  };

  const total = (s: InvoiceStatus) =>
    invoices.filter((i) => i.status === s).reduce((sum, i) => sum + i.amount, 0);

  const canEdit = scoped.role !== "parent";
  const isAdmin = scoped.role === "admin";

  /* Year and month roll-ups for the finance visualisations. */
  const thisMonth = financeHistory[financeHistory.length - 1]!;
  const yearCollected = financeHistory.reduce((s, m) => s + m.collected, 0);
  const yearExpenses = financeHistory.reduce((s, m) => s + m.expenses, 0);
  const yearBilled = financeHistory.reduce((s, m) => s + m.billed, 0);
  const monthExpenses = expenseBreakdown.reduce((s, e) => s + e.amount, 0);
  const collectionRate = Math.round((yearCollected / yearBilled) * 100);
  const net = yearCollected - yearExpenses;

  const cashflow = financeHistory.map((m) => ({
    month: m.month,
    Collected: m.collected,
    Expenses: m.expenses,
  }));
  const netTrend = financeHistory.map((m) => ({
    month: m.month,
    Net: m.collected - m.expenses,
  }));
  const statusSplit = (["paid", "pending", "overdue"] as InvoiceStatus[]).map((s) => ({
    label: s,
    amount: total(s),
  }));

  /* Records behind the current drill-down selection. */
  const drillMonth =
    drill?.kind === "month" ? financeHistory.find((m) => m.month === drill.month) : undefined;
  const drillInvoices = drillPeriod ? invoices.filter((i) => i.period === drillPeriod) : [];
  const drillPayments = drillInvoices.filter((i) => i.status === "paid");
  const drillExpense =
    drill?.kind === "expense" ? expenseBreakdown.find((e) => e.label === drill.label) : undefined;

  function drillIntoMonth(month: string | undefined, focus: "collected" | "expenses" | "net") {
    if (!month) return;
    setDrill({ kind: "month", month, focus });
    setStatus("all");
  }

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Fees"
        title="Invoices"
        action={<Pill tone="brand">{collectionRate}% collected year to date</Pill>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Collected" value={formatMoney(total("paid"))} icon={CircleCheck} />
        <StatCard label="Pending" value={formatMoney(total("pending"))} icon={Receipt} />
        <StatCard label="Overdue" value={formatMoney(total("overdue"))} icon={TriangleAlert} />
      </div>

      {isAdmin && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Collected this month"
              value={formatMoney(thisMonth.collected)}
              detail={`of ${formatMoney(thisMonth.billed)} billed`}
              icon={CircleCheck}
            />
            <StatCard
              label="Spent this month"
              value={formatMoney(monthExpenses)}
              detail="Salaries, meals, materials, facilities"
              icon={Wallet}
            />
            <StatCard
              label="Collected this year"
              value={formatMoney(yearCollected)}
              detail={`${collectionRate}% of ${formatMoney(yearBilled)} billed`}
              icon={TrendingUp}
            />
            <StatCard
              label="Net this year"
              value={formatMoney(net)}
              detail={`${formatMoney(yearExpenses)} out across the school`}
              icon={Receipt}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ChartPanel
                eyebrow="Whole school"
                title="Money in vs money out"
                detail="Fees collected against total school spend, month by month. Click a bar to open its invoices."
                legend={[
                  { label: "Collected", color: "var(--color-primary)" },
                  { label: "Spent", color: "var(--color-warning)" },
                ]}
              >
                <BarChart data={cashflow} barGap={6} style={{ cursor: "pointer" }}>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" {...axis} />
                  <YAxis
                    {...axis}
                    width={52}
                    tickFormatter={(v: number) => `R${Math.round(v / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => formatMoney(Number(v))}
                    cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                  />
                  <Bar
                    dataKey="Collected"
                    fill="var(--color-primary)"
                    radius={[8, 8, 0, 0]}
                    onClick={(d: { month?: string }) => drillIntoMonth(d.month, "collected")}
                  />
                  <Bar
                    dataKey="Expenses"
                    fill="var(--color-warning)"
                    radius={[8, 8, 0, 0]}
                    onClick={(d: { month?: string }) => drillIntoMonth(d.month, "expenses")}
                  />
                </BarChart>
              </ChartPanel>
            </div>

            <ChartPanel
              eyebrow="This month"
              title="Where the money goes"
              detail={`${formatMoney(monthExpenses)} out this month. Click a slice for the detail.`}
              legend={expenseBreakdown.map((e, index) => ({
                label: e.label,
                color: donutTones[index % donutTones.length]!,
                value: formatMoney(e.amount),
              }))}
            >
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="amount"
                  nameKey="label"
                  innerRadius={54}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="none"
                  style={{ cursor: "pointer" }}
                  onClick={(d: { label?: string }) =>
                    d.label && setDrill({ kind: "expense", label: d.label })
                  }
                >
                  {expenseBreakdown.map((e, index) => (
                    <Cell key={e.label} fill={donutTones[index % donutTones.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatMoney(Number(v))} />
              </PieChart>
            </ChartPanel>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ChartPanel
              eyebrow="Trend"
              title="Net position"
              detail="Fees collected minus school spend each month. Click a month to open its records."
            >
              <AreaChart
                data={netTrend}
                style={{ cursor: "pointer" }}
                onClick={(e: { activeLabel?: string }) => drillIntoMonth(e?.activeLabel, "net")}
              >
                <defs>
                  <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" {...axis} />
                <YAxis
                  {...axis}
                  width={52}
                  tickFormatter={(v: number) => `R${Math.round(v / 1000)}k`}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatMoney(Number(v))} />
                <Area
                  type="monotone"
                  dataKey="Net"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#netFill)"
                />
              </AreaChart>
            </ChartPanel>

            <div className="dash-card p-6">
              <p className="eyebrow text-muted-foreground">Open invoices</p>
              <h2 className="mt-1 text-lg font-bold tracking-tight">Invoice health</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                How this month&apos;s billing is tracking across families.
              </p>
              <div className="mt-6 space-y-5">
                {statusSplit.map((s) => {
                  const all = statusSplit.reduce((sum, x) => sum + x.amount, 0) || 1;
                  const pct = Math.round((s.amount / all) * 100);
                  return (
                    <div key={s.label}>
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                        <p className="min-w-0 truncate text-sm font-medium capitalize">{s.label}</p>
                        <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
                          {formatMoney(s.amount)} · {pct}%
                        </p>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${
                            s.label === "paid"
                              ? "bg-success"
                              : s.label === "pending"
                                ? "bg-warning"
                                : "bg-destructive"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {drill && (
        <div className="dash-card p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <p className="eyebrow text-muted-foreground">Drill-down</p>
              <h2 className="mt-1 text-lg font-bold tracking-tight">
                {drill.kind === "month"
                  ? `${monthNames[drill.month] ?? drill.month} 2026`
                  : drill.label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {drill.kind === "month"
                  ? `Invoices and payments behind the ${
                      drill.focus === "expenses"
                        ? "spend"
                        : drill.focus === "net"
                          ? "net position"
                          : "collected"
                    } figure for this month.`
                  : "This line of school spend for the current month."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrill(null)}
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              Close
            </button>
          </div>

          {drill.kind === "month" && drillMonth && (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Billed", value: drillMonth.billed },
                  { label: "Collected", value: drillMonth.collected },
                  { label: "Spent", value: drillMonth.expenses },
                  { label: "Net", value: drillMonth.collected - drillMonth.expenses },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border p-4">
                    <p className="eyebrow text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-base font-semibold tabular-nums">
                      {formatMoney(s.value)}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm font-semibold">
                Payment records ({drillPayments.length} paid of {drillInvoices.length} invoices)
              </p>
              <div className="mt-3 divide-y divide-border">
                {drillInvoices.map((i) => (
                  <div
                    key={i.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{nameOf(i.childId)}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {i.id.toUpperCase()} · due {i.dueDate}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Pill tone={tone[i.status]}>{i.status}</Pill>
                      <span className="text-sm font-medium tabular-nums">
                        {formatMoney(i.amount)}
                      </span>
                    </div>
                  </div>
                ))}
                {drillInvoices.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No invoice records captured for this month.
                  </p>
                )}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                The invoice table below is filtered to this month.
              </p>
            </>
          )}

          {drill.kind === "expense" && drillExpense && (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border p-4">
                <p className="eyebrow text-muted-foreground">Amount</p>
                <p className="mt-1 text-base font-semibold tabular-nums">
                  {formatMoney(drillExpense.amount)}
                </p>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="eyebrow text-muted-foreground">Share of spend</p>
                <p className="mt-1 text-base font-semibold tabular-nums">
                  {Math.round((drillExpense.amount / (monthExpenses || 1)) * 100)}%
                </p>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="eyebrow text-muted-foreground">Month spend</p>
                <p className="mt-1 text-base font-semibold tabular-nums">
                  {formatMoney(monthExpenses)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

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

      <div className="overflow-x-auto dash-card p-1">
        <table className="w-full min-w-[38rem] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="whitespace-nowrap px-6 py-3 font-medium">Invoice</th>
              <th className="whitespace-nowrap px-6 py-3 font-medium">Child</th>
              <th className="whitespace-nowrap px-6 py-3 font-medium">Period</th>
              <th className="whitespace-nowrap px-6 py-3 font-medium">Due</th>
              <th className="whitespace-nowrap px-6 py-3 font-medium">Status</th>
              <th className="whitespace-nowrap px-6 py-3 text-right font-medium">Amount</th>
              {canEdit && (
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                <td className="px-6 py-4 font-medium uppercase">{i.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                  {nameOf(i.childId)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{i.period}</td>
                <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{i.dueDate}</td>
                <td className="px-6 py-4">
                  <Pill tone={tone[i.status]}>{i.status}</Pill>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right font-medium tabular-nums">
                  {formatMoney(i.amount)}
                </td>
                {canEdit && (
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateInvoice(i.id, { status: "paid" });
                          toast.success(`${i.id.toUpperCase()} marked paid`);
                        }}
                        disabled={i.status === "paid"}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-40"
                      >
                        Mark paid
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateInvoice(i.id, { status: "pending" });
                          toast(`${i.id.toUpperCase()} set to pending`);
                        }}
                        disabled={i.status === "pending"}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-40"
                      >
                        Pending
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={canEdit ? 7 : 6}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No invoices with that status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
