import type { Metadata } from "next";
import { HeartHandshake, Leaf, Users, ShieldCheck } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { CtaBand, PageHero } from "@/components/site/SiteBlocks";
import { staff } from "@/data/lms";
import approachReading from "@/assets/approach-reading.jpg";

export const metadata: Metadata = {
  title: "Our Approach & Team — Little Stars Preschool",
  description:
    "How Little Stars teaches: unhurried routines, play-led learning, small ratios and the teachers who make it work.",
  openGraph: {
    title: "Our Approach & Team — Little Stars Preschool",
    description:
      "Play-led learning, small ratios and a team of qualified early childhood teachers in Rosebank.",
  },
};

const principles = [
  {
    icon: Leaf,
    title: "Play is the curriculum",
    copy: "Children build language, maths and empathy through play. We plan the play, not the worksheets.",
  },
  {
    icon: Users,
    title: "Small groups, known faces",
    copy: "Every child has a key teacher who tracks their week and speaks to their family directly.",
  },
  {
    icon: HeartHandshake,
    title: "Feelings get named",
    copy: "We coach children through frustration and conflict rather than sending them away from it.",
  },
  {
    icon: ShieldCheck,
    title: "Safety without fuss",
    copy: "Signed-in collection, allergy-aware kitchen, first-aid-trained staff in every room.",
  },
];

export default function About() {
  const approachImgSrc = typeof approachReading === "string" ? approachReading : approachReading.src;

  return (
    <div className="min-h-screen bg-background">
      <main>
        <PageHero eyebrow="Our approach" title={<>Unhurried days, deliberate learning.</>}>
          Little Stars opened in 2018 with eleven children and one rule: no child should
          spend the day waiting to be noticed.
        </PageHero>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid border border-border bg-card md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="border-b border-r border-border p-8 lg:p-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <p.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-6 text-xl font-semibold tracking-tight">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              </div>
            ))}
          </div>

          <img
            src={approachImgSrc}
            alt="A teacher reading with toddlers at Little Stars"
            width={1200}
            height={1400}
            loading="lazy"
            className="mt-12 h-80 w-full rounded-lg border border-border object-cover"
          />
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <p className="eyebrow mb-5 text-muted-foreground">The team</p>
            <h2 className="max-w-2xl font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl">
              Qualified, long-serving, and on first-name terms with every family.
            </h2>

            <div className="mt-12 grid border border-border md:grid-cols-2 lg:grid-cols-3">
              {staff.map((member) => (
                <div key={member.id} className="border-b border-r border-border p-8">
                  <h3 className="text-lg font-semibold tracking-tight">{member.name}</h3>
                  <p className="mt-1 text-sm text-primary">{member.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {member.classroom} · with us since {new Date(member.since).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
