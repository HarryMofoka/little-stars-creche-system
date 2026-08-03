"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHero } from "@/components/site/SiteBlocks";
import { classrooms, classroomAges } from "@/data/lms";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <PageHero eyebrow="Visit us" title={<>Book a tour, meet the teachers.</>}>
          Tours run every Tuesday and Thursday at 09:30, while the classrooms are busy —
          so you see a real morning, not a staged one.
        </PageHero>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid border border-border bg-card lg:grid-cols-2">
            <div className="border-b border-r border-border p-8 lg:p-12">
              <h2 className="text-2xl font-semibold tracking-tight">Enquire about a place</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We reply within one working day.
              </p>

              <form
                className="mt-8 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                  toast.success("Enquiry sent", {
                    description: "This is a demo form — nothing was stored.",
                  });
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Parent name" name="parent" placeholder="Thandi Ndlovu" />
                  <Field label="Child's name" name="child" placeholder="Amara" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email" name="email" type="email" placeholder="you@example.com" />
                  <Field label="Phone" name="phone" placeholder="+27 82 000 0000" />
                </div>

                <div>
                  <label htmlFor="classroom" className="text-sm font-medium">
                    Classroom of interest
                  </label>
                  <select
                    id="classroom"
                    name="classroom"
                    className="mt-2 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {classrooms.map((room) => (
                      <option key={room} value={room}>
                        {room} · {classroomAges[room]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium">
                    Anything we should know?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Preferred start date, allergies, sibling at the school…"
                    className="mt-2 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Send enquiry
                </button>

                {submitted && (
                  <p className="text-sm text-success">
                    Thank you — we will be in touch about a tour.
                  </p>
                )}
              </form>
            </div>

            <div className="p-8 lg:p-12">
              <h2 className="text-2xl font-semibold tracking-tight">Find us</h2>
              <div className="mt-8 divide-y divide-border border border-border">
                {[
                  { icon: MapPin, label: "14 Acacia Road, Rosebank, Johannesburg" },
                  { icon: Clock, label: "Monday to Friday, 06:30 – 17:30" },
                  { icon: Phone, label: "+27 11 447 2210" },
                  { icon: Mail, label: "hello@littlestars.co.za" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-5">
                    <item.icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 border border-border bg-ink p-8">
                <p className="eyebrow mb-3 text-ink-muted">Waitlist</p>
                <p className="text-sm leading-relaxed text-ink-foreground/80">
                  Sunbeams (infants) is currently full for 2026. We are taking waitlist
                  names for September 2026 and open places from January 2027.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
