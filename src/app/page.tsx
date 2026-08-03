import Link from "next/link";
import {
  Baby,
  BookOpen,
  Blocks,
  Sun,
  Clock,
  HeartHandshake,
  ShieldCheck,
  Leaf,
  Users,
  CalendarCheck,
  ClipboardList,
  Star,
} from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { CtaBand, ShimmerLink } from "@/components/site/SiteBlocks";
import heroClassroom from "@/assets/hero-classroom.jpg";
import approachReading from "@/assets/approach-reading.jpg";
import gardenPlay from "@/assets/garden-play.jpg";

const accreditations = [
  { name: "ECD Registered", icon: ShieldCheck },
  { name: "Montessori Trained", icon: Leaf },
  { name: "Paediatric First Aid", icon: HeartHandshake },
  { name: "1:5 Ratios", icon: Users },
  { name: "Nut-Aware Kitchen", icon: Star },
  { name: "Parent App", icon: ClipboardList },
];

const programmes = [
  {
    name: "Sunbeams",
    age: "3 – 18 months",
    icon: Baby,
    copy: "Gentle infant care with individual feed, sleep and cuddle routines logged for every parent.",
  },
  {
    name: "Moonbeams",
    age: "18 months – 3 years",
    icon: Blocks,
    copy: "Movement, messy play and first words in a calm room built for busy little bodies.",
  },
  {
    name: "Comets",
    age: "3 – 4 years",
    icon: BookOpen,
    copy: "Story circles, early numeracy and lots of outdoor time as friendships take shape.",
  },
  {
    name: "Stargazers",
    age: "4 – 6 years",
    icon: Sun,
    copy: "School readiness: literacy, numeracy, confidence and the routines Grade R expects.",
  },
];

const rhythm = [
  { time: "06:30", title: "Doors open", copy: "Soft landing, breakfast and free play as families arrive." },
  { time: "08:30", title: "Morning circle", copy: "Songs, weather, news and the plan for the day." },
  { time: "09:15", title: "Focused learning", copy: "Small-group work at each child's own level." },
  { time: "10:30", title: "Garden time", copy: "Climbing, sand, water and bare feet on grass." },
  { time: "12:00", title: "Lunch & rest", copy: "A cooked meal, then quiet time or a nap." },
  { time: "14:00", title: "Creative studio", copy: "Art, music, building and dramatic play." },
  { time: "17:30", title: "Doors close", copy: "Daily report sent to every parent before pick-up." },
];

const testimonials = [
  {
    quote:
      "The daily report is the first thing I open at lunch. I always know how her morning went before I see her.",
    name: "Thandi N.",
    detail: "Mum to Amara, Comets",
  },
  {
    quote:
      "Our son was very shy. Six months in he is leading the music circle. The teachers just knew how to reach him.",
    name: "Nomsa K.",
    detail: "Mum to Ayanda, Moonbeams",
  },
  {
    quote:
      "Grade R was a non-event because Little Stars had already built the routines and confidence.",
    name: "Marius P.",
    detail: "Dad to Zoë, Stargazers",
  },
];

export default function Home() {
  const heroImgSrc = typeof heroClassroom === "string" ? heroClassroom : heroClassroom.src;
  const approachImgSrc = typeof approachReading === "string" ? approachReading : approachReading.src;
  const gardenImgSrc = typeof gardenPlay === "string" ? gardenPlay : gardenPlay.src;

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero — full-bleed image, centered content */}
        <section className="relative isolate h-[100svh] min-h-[100svh] overflow-hidden bg-ink">
          <img
            src={heroImgSrc}
            alt="Toddlers playing with wooden toys in a bright Little Stars classroom"
            width={1400}
            height={1100}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(180deg, oklch(0 0 0 / 0.72) 0%, oklch(0 0 0 / 0.55) 45%, oklch(0 0 0 / 0.8) 100%)",
            }}
          />
          <div className="relative mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
            <p className="eyebrow mb-6 text-ink-foreground/70">
              Creche &amp; preschool · Rosebank, Johannesburg
            </p>
            <h1 className="mb-8 font-display text-5xl font-light leading-[1.03] tracking-tight text-ink-foreground sm:text-7xl">
              <span className="block">Little Stars.</span>
              <span className="block">Where every child</span>
              <span className="block italic">shines bright.</span>
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-ink-foreground/85">
              Warm, unhurried days for ages three months to six years — with a teacher who
              knows your child and a daily report that tells you everything.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <ShimmerLink to="/contact">Book a tour</ShimmerLink>
              <Link
                href="/programmes"
                className="rounded-full border border-ink-foreground/30 px-6 py-3 text-center text-base font-medium text-ink-foreground backdrop-blur transition-colors hover:bg-ink-foreground/10"
              >
                See the programmes
              </Link>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="bg-ink">
          <div className="mx-auto max-w-7xl px-6 pb-12">
            <p className="eyebrow mb-8 text-center text-ink-muted">
              Trusted by 120 families across four classrooms
            </p>
            <div className="grid grid-cols-2 border border-ink-border md:grid-cols-3 lg:grid-cols-6">
              {accreditations.map((item) => (
                <div
                  key={item.name}
                  className="flex h-24 items-center justify-center gap-2 border-b border-r border-ink-border px-6 text-ink-foreground/70 transition-opacity hover:text-ink-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium tracking-tight">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programmes */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5 text-muted-foreground">Programmes</p>
            <h2 className="font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl">
              Four rooms, each built around the age inside it.
            </h2>
          </div>

          <div className="mt-12 grid border border-border bg-card md:grid-cols-2 lg:grid-cols-4">
            {programmes.map((p) => (
              <div
                key={p.name}
                className="border-b border-r border-border p-8 transition-colors hover:bg-muted/60"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{p.name}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{p.age}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Daily rhythm */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-5 text-muted-foreground">A day at Little Stars</p>
              <h2 className="font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                A rhythm children can feel coming.
              </h2>
              <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
                Predictable days lower anxiety and free children up to explore. Here is
                what an ordinary Tuesday looks like.
              </p>
              <img
                src={approachImgSrc}
                alt="A Little Stars teacher reading a picture book to a small group of toddlers"
                width={1200}
                height={1400}
                loading="lazy"
                className="mt-10 hidden h-72 w-full rounded-lg border border-border object-cover lg:block"
              />
            </div>

            <div className="border border-border">
              {rhythm.map((item) => (
                <div
                  key={item.time}
                  className="flex gap-6 border-b border-border p-6 last:border-b-0"
                >
                  <span className="flex w-14 shrink-0 items-start gap-1 pt-0.5 text-sm font-medium text-primary">
                    <Clock className="h-4 w-4" />
                    {item.time}
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parent app preview */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-5 text-muted-foreground">For parents and teachers</p>
              <h2 className="font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                Every check-in, nap and milestone in one place.
              </h2>
              <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
                Our teachers record attendance, meals, naps and learning milestones as the
                day happens. Families get the full picture; the office gets clean records.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: CalendarCheck, label: "Live daily register" },
                  { icon: ClipboardList, label: "Daily reports per child" },
                  { icon: Star, label: "Milestone tracking" },
                  { icon: Users, label: "Guardian & allergy records" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-3 border border-border bg-card p-4"
                  >
                    <f.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium tracking-tight">
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/dashboard"
                  className="inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Open the staff dashboard
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-ink p-3">
              <div className="rounded-md bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <span className="text-sm font-semibold tracking-tight">Comets · today</span>
                  <span className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                    12 of 14 in
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { name: "Amara Ndlovu", detail: "Checked in 07:42", tone: "text-success" },
                    { name: "Ruby Naidoo", detail: "Absent — flu", tone: "text-destructive" },
                    { name: "Zoë Petersen", detail: "Collected 13:10", tone: "text-muted-foreground" },
                    { name: "Liam Fourie", detail: "Napped 12:15 – 14:00", tone: "text-muted-foreground" },
                  ].map((row) => (
                    <div key={row.name} className="flex items-center justify-between px-5 py-4">
                      <span className="text-sm font-medium tracking-tight">{row.name}</span>
                      <span className={`text-xs ${row.tone}`}>{row.detail}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-5 py-4">
                  <p className="text-xs text-muted-foreground">
                    Milestone logged: “Writes own name” · Zoë Petersen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <p className="eyebrow mb-5 text-muted-foreground">From our families</p>
            <div className="grid border border-border lg:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.name} className="border-b border-r border-border p-8">
                  <blockquote className="font-display text-2xl font-light leading-snug">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-muted-foreground"> · {t.detail}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <img
              src={gardenImgSrc}
              alt="Children playing in the Little Stars garden sandpit in afternoon light"
              width={1400}
              height={900}
              loading="lazy"
              className="mt-12 h-80 w-full rounded-lg border border-border object-cover"
            />
          </div>
        </section>

        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  );
}
