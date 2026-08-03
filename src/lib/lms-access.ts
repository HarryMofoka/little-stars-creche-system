import { useMemo } from "react";

import { useLms } from "@/lib/lms-store";
import { useAuth } from "@/lib/auth";
import type { Child } from "@/data/lms";

/**
 * Role-scoped view of the demo data.
 * Admins see everything, teachers see their classroom, parents see their own children.
 * Archived records are excluded unless `includeArchived` is requested.
 */
export function useScopedData(includeArchived = false) {
  const { data } = useLms();
  const { session } = useAuth();

  return useMemo(() => {
    const role = session?.role ?? "parent";

    const inScope = (child: Child) => {
      if (role === "admin") return true;
      if (role === "staff") return !session?.classroom || child.classroom === session.classroom;
      return (session?.childIds ?? []).includes(child.id);
    };

    const children = data.children.filter(
      (c) => inScope(c) && (includeArchived || !c.archived),
    );
    const ids = new Set(children.map((c) => c.id));

    return {
      role,
      children,
      attendance: data.attendance.filter((a) => ids.has(a.childId)),
      reports: data.reports.filter((r) => ids.has(r.childId)),
      milestones: data.milestones.filter((m) => ids.has(m.childId)),
      invoices: data.invoices.filter((i) => ids.has(i.childId)),
      staff: data.staff.filter((s) => includeArchived || !s.archived),
      programmes: data.programmes.filter((p) => includeArchived || !p.archived),
    };
  }, [data, session, includeArchived]);
}
