import { jsPDF } from "jspdf";

import type { Child } from "@/data/lms";

/**
 * Printable summary of a person's onboarding answers plus any child enrolment
 * records created from them. Rendered with jsPDF so it downloads client-side.
 */
export type OnboardingPdfInput = {
  name: string;
  email: string;
  roleLabel: string;
  savedAt?: string | undefined;
  answers: Array<{ label: string; value: string }>;
  children: Child[];
};

const BRAND: [number, number, number] = [0, 75, 176];
const INK: [number, number, number] = [17, 17, 17];
const MUTED: [number, number, number] = [110, 110, 110];
const LINE: [number, number, number] = [226, 223, 216];

export function buildOnboardingPdf(input: OnboardingPdfInput): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // Header band
  doc.setFillColor(...INK);
  doc.rect(0, 0, pageWidth, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Little Stars Preschool", margin, 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Where every child shines bright", margin, 66);
  doc.setFontSize(9);
  doc.text(
    `Generated ${new Date().toLocaleString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    pageWidth - margin,
    46,
    { align: "right" },
  );

  y = 140;

  function ensureSpace(needed: number) {
    if (y + needed <= pageHeight - 60) return;
    doc.addPage();
    y = 72;
  }

  function heading(text: string, eyebrow?: string) {
    ensureSpace(60);
    if (eyebrow) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...BRAND);
      doc.text(eyebrow.toUpperCase(), margin, y);
      y += 14;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...INK);
    doc.text(text, margin, y);
    y += 10;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(1);
    doc.line(margin, y, margin + contentWidth, y);
    y += 22;
  }

  /** Label on the left, wrapped value on the right. */
  function row(label: string, value: string) {
    const labelWidth = 170;
    const valueWidth = contentWidth - labelWidth;
    const lines = doc.splitTextToSize(value || "Not answered", valueWidth) as string[];
    const height = Math.max(lines.length * 14, 18);
    ensureSpace(height + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    doc.text(doc.splitTextToSize(label, labelWidth - 12) as string[], margin, y);
    doc.setTextColor(...INK);
    doc.text(lines, margin + labelWidth, y);
    y += height + 8;
  }

  // Who this belongs to
  heading(input.name, "Setup summary");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(
    `${input.roleLabel} · ${input.email}${
      input.savedAt
        ? ` · answers saved ${new Date(input.savedAt).toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`
        : ""
    }`,
    margin,
    y,
  );
  y += 30;

  heading("Onboarding answers");
  if (input.answers.length === 0) {
    row("No answers", "Onboarding has not been completed yet.");
  } else {
    input.answers.forEach((a) => row(a.label, a.value));
  }

  y += 10;
  heading("Child enrolment records");
  if (input.children.length === 0) {
    row("No records", "No child enrolment record has been created yet.");
  } else {
    input.children.forEach((child, index) => {
      if (index > 0) y += 6;
      ensureSpace(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...INK);
      doc.text(`${child.firstName} ${child.lastName}`.trim(), margin, y);
      y += 18;
      row("Classroom", child.classroom);
      row("Enrolment status", child.status);
      row("Start date", child.startDate || "To be confirmed");
      row("Date of birth", child.birthDate || "To be confirmed");
      row("Allergies", child.allergies.length ? child.allergies.join(", ") : "None recorded");
      row("Notes", child.notes || "—");
      row(
        "Guardians",
        child.guardians
          .map((g) => `${g.name} (${g.relation})${g.email ? ` · ${g.email}` : ""}`)
          .join("\n") || "—",
      );
    });
  }

  // Footer on every page
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(
      "Little Stars Preschool · admin@littlestars.co.za · This summary is for your records.",
      margin,
      pageHeight - 32,
    );
    doc.text(`Page ${page} of ${pages}`, pageWidth - margin, pageHeight - 32, { align: "right" });
  }

  return doc;
}

export function downloadOnboardingPdf(input: OnboardingPdfInput) {
  const doc = buildOnboardingPdf(input);
  const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  doc.save(`little-stars-${slug || "summary"}.pdf`);
}
