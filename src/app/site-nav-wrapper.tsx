"use client";

import { usePathname } from "next/navigation";
import { SiteNav } from "@/components/site/SiteNav";

export function SiteNavWrapper() {
  const pathname = usePathname();
  const showNav = !pathname.startsWith("/dashboard");

  if (!showNav) return null;

  return <SiteNav />;
}
