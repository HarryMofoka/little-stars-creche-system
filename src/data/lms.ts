// Demo data for the Little Stars learner management system.
// No backend yet: these typed samples power every dashboard screen.

export type EnrolmentStatus = "enrolled" | "waitlist" | "graduated";
export type AttendanceState = "in" | "out" | "absent";
export type InvoiceStatus = "paid" | "pending" | "overdue";

export type Guardian = {
  name: string;
  relation: string;
  phone: string;
  email: string;
};

export type Child = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  classroom: string;
  status: EnrolmentStatus;
  startDate: string;
  allergies: string[];
  notes: string;
  guardians: Guardian[];
  archived?: boolean;
};

export type AttendanceRecord = {
  childId: string;
  /** ISO date (yyyy-mm-dd) the record belongs to. */
  date: string;
  state: AttendanceState;
  checkIn: string | null;
  checkOut: string | null;
};


export type DailyReport = {
  id: string;
  childId: string;
  date: string;
  meals: string;
  nap: string;
  mood: string;
  note: string;
};

export type Milestone = {
  id: string;
  childId: string;
  area: "Language" | "Motor" | "Social" | "Numeracy" | "Creative";
  title: string;
  achieved: boolean;
  observedOn: string | null;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  classroom: string;
  email: string;
  phone: string;
  since: string;
  archived?: boolean;
};

export type Invoice = {
  id: string;
  childId: string;
  period: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
};

export const classrooms = ["Sunbeams", "Moonbeams", "Comets", "Stargazers"] as const;

export const classroomAges: Record<string, string> = {
  Sunbeams: "3 months – 18 months",
  Moonbeams: "18 months – 3 years",
  Comets: "3 – 4 years",
  Stargazers: "4 – 6 years",
};

export const children: Child[] = [
  {
    id: "c1",
    firstName: "Amara",
    lastName: "Ndlovu",
    birthDate: "2022-04-18",
    classroom: "Comets",
    status: "enrolled",
    startDate: "2025-01-14",
    allergies: ["Peanuts"],
    notes: "Loves the reading corner. Needs a quiet space after lunch.",
    guardians: [
      {
        name: "Thandi Ndlovu",
        relation: "Mother",
        phone: "+27 82 445 1120",
        email: "thandi.n@example.com",
      },
      {
        name: "Sipho Ndlovu",
        relation: "Father",
        phone: "+27 83 210 8842",
        email: "sipho.n@example.com",
      },
    ],
  },
  {
    id: "c2",
    firstName: "Liam",
    lastName: "Fourie",
    birthDate: "2023-09-02",
    classroom: "Moonbeams",
    status: "enrolled",
    startDate: "2025-03-03",
    allergies: [],
    notes: "Settling in well, still learning to share blocks.",
    guardians: [
      {
        name: "Elsa Fourie",
        relation: "Mother",
        phone: "+27 71 337 4410",
        email: "elsa.f@example.com",
      },
    ],
  },
  {
    id: "c3",
    firstName: "Zoë",
    lastName: "Petersen",
    birthDate: "2021-11-27",
    classroom: "Stargazers",
    status: "enrolled",
    startDate: "2024-07-15",
    allergies: ["Lactose"],
    notes: "Ready for early literacy extension work.",
    guardians: [
      {
        name: "Marius Petersen",
        relation: "Father",
        phone: "+27 84 902 1177",
        email: "marius.p@example.com",
      },
    ],
  },
  {
    id: "c4",
    firstName: "Kofi",
    lastName: "Mensah",
    birthDate: "2024-06-11",
    classroom: "Sunbeams",
    status: "enrolled",
    startDate: "2026-01-19",
    allergies: [],
    notes: "Two naps a day, bottle at 10:00.",
    guardians: [
      {
        name: "Akua Mensah",
        relation: "Mother",
        phone: "+27 76 118 2093",
        email: "akua.m@example.com",
      },
    ],
  },
  {
    id: "c5",
    firstName: "Ruby",
    lastName: "Naidoo",
    birthDate: "2022-02-08",
    classroom: "Comets",
    status: "enrolled",
    startDate: "2025-02-10",
    allergies: ["Eggs"],
    notes: "Confident climber, loves outdoor time.",
    guardians: [
      {
        name: "Priya Naidoo",
        relation: "Mother",
        phone: "+27 82 774 6631",
        email: "priya.n@example.com",
      },
    ],
  },
  {
    id: "c6",
    firstName: "Noah",
    lastName: "van Wyk",
    birthDate: "2023-01-30",
    classroom: "Moonbeams",
    status: "enrolled",
    startDate: "2025-08-04",
    allergies: [],
    notes: "Comfort blanket stays in his bag.",
    guardians: [
      {
        name: "Hanna van Wyk",
        relation: "Mother",
        phone: "+27 79 552 3341",
        email: "hanna.vw@example.com",
      },
    ],
  },
  {
    id: "c7",
    firstName: "Imani",
    lastName: "Dube",
    birthDate: "2021-08-22",
    classroom: "Stargazers",
    status: "graduated",
    startDate: "2023-01-16",
    allergies: [],
    notes: "Graduated to Grade R in January 2026.",
    guardians: [
      {
        name: "Lerato Dube",
        relation: "Mother",
        phone: "+27 72 664 8890",
        email: "lerato.d@example.com",
      },
    ],
  },
  {
    id: "c8",
    firstName: "Ethan",
    lastName: "Brooks",
    birthDate: "2024-12-05",
    classroom: "Sunbeams",
    status: "waitlist",
    startDate: "2026-09-01",
    allergies: [],
    notes: "Family toured in June, waiting on an infant space.",
    guardians: [
      {
        name: "Claire Brooks",
        relation: "Mother",
        phone: "+27 83 441 7725",
        email: "claire.b@example.com",
      },
    ],
  },
  {
    id: "c9",
    firstName: "Sana",
    lastName: "Patel",
    birthDate: "2022-10-14",
    classroom: "Comets",
    status: "waitlist",
    startDate: "2026-10-01",
    allergies: ["Peanuts", "Shellfish"],
    notes: "Sibling of a current Stargazer.",
    guardians: [
      {
        name: "Nikhil Patel",
        relation: "Father",
        phone: "+27 81 220 4416",
        email: "nikhil.p@example.com",
      },
    ],
  },
  {
    id: "c10",
    firstName: "Ayanda",
    lastName: "Khumalo",
    birthDate: "2023-05-19",
    classroom: "Moonbeams",
    status: "enrolled",
    startDate: "2025-11-03",
    allergies: [],
    notes: "Fluent in isiZulu and English, loves music circle.",
    guardians: [
      {
        name: "Nomsa Khumalo",
        relation: "Mother",
        phone: "+27 82 990 3312",
        email: "nomsa.k@example.com",
      },
    ],
  },
];

export const attendanceToday: AttendanceRecord[] = [
  // Monday 3 August 2026 — the live register.
  { childId: "c1", date: "2026-08-03", state: "in", checkIn: "07:42", checkOut: null },
  { childId: "c2", date: "2026-08-03", state: "in", checkIn: "08:05", checkOut: null },
  { childId: "c3", date: "2026-08-03", state: "out", checkIn: "07:30", checkOut: "13:10" },
  { childId: "c4", date: "2026-08-03", state: "in", checkIn: "08:20", checkOut: null },
  { childId: "c5", date: "2026-08-03", state: "absent", checkIn: null, checkOut: null },
  { childId: "c6", date: "2026-08-03", state: "in", checkIn: "08:38", checkOut: null },
  { childId: "c10", date: "2026-08-03", state: "out", checkIn: "07:55", checkOut: "12:45" },

  // Previous week, so date-range filters have real history to search.
  { childId: "c1", date: "2026-07-31", state: "out", checkIn: "07:48", checkOut: "16:05" },
  { childId: "c2", date: "2026-07-31", state: "out", checkIn: "08:12", checkOut: "15:40" },
  { childId: "c3", date: "2026-07-31", state: "absent", checkIn: null, checkOut: null },
  { childId: "c4", date: "2026-07-31", state: "out", checkIn: "08:02", checkOut: "16:20" },
  { childId: "c6", date: "2026-07-31", state: "out", checkIn: "08:30", checkOut: "15:55" },
  { childId: "c10", date: "2026-07-31", state: "out", checkIn: "07:50", checkOut: "12:50" },
  { childId: "c1", date: "2026-07-30", state: "out", checkIn: "07:55", checkOut: "16:10" },
  { childId: "c2", date: "2026-07-30", state: "out", checkIn: "08:20", checkOut: "15:35" },
  { childId: "c3", date: "2026-07-30", state: "out", checkIn: "07:35", checkOut: "13:05" },
  { childId: "c5", date: "2026-07-30", state: "out", checkIn: "08:45", checkOut: "15:50" },
  { childId: "c6", date: "2026-07-30", state: "absent", checkIn: null, checkOut: null },
  { childId: "c10", date: "2026-07-29", state: "out", checkIn: "07:58", checkOut: "12:40" },
  { childId: "c4", date: "2026-07-29", state: "out", checkIn: "08:08", checkOut: "16:15" },
  { childId: "c1", date: "2026-07-29", state: "out", checkIn: "07:44", checkOut: "16:00" },
];

/** The demo "today" the register and filters default to. */
export const today = "2026-08-03";


export const dailyReports: DailyReport[] = [
  {
    id: "r1",
    childId: "c1",
    date: "2026-08-03",
    meals: "Ate all of breakfast and most of lunch",
    nap: "12:30 – 13:40",
    mood: "Cheerful",
    note: "Told a long story about her weekend at circle time.",
  },
  {
    id: "r2",
    childId: "c2",
    date: "2026-08-03",
    meals: "Half of lunch, full snack",
    nap: "12:15 – 14:00",
    mood: "Settled",
    note: "Practised stacking cups with a teacher for 20 minutes.",
  },
  {
    id: "r3",
    childId: "c4",
    date: "2026-08-03",
    meals: "Two bottles, pureed pear",
    nap: "09:30 – 10:20, 13:00 – 14:30",
    mood: "Calm",
    note: "Rolled from back to tummy twice on the mat.",
  },
  {
    id: "r4",
    childId: "c3",
    date: "2026-08-02",
    meals: "Full plate at lunch",
    nap: "No nap (quiet reading instead)",
    mood: "Energetic",
    note: "Wrote her own name unassisted for the first time.",
  },
  {
    id: "r5",
    childId: "c6",
    date: "2026-08-02",
    meals: "Full breakfast, small lunch",
    nap: "12:40 – 14:10",
    mood: "Tired",
    note: "Needed extra comfort at drop-off, happy by mid-morning.",
  },
  {
    id: "r6",
    childId: "c10",
    date: "2026-08-02",
    meals: "Full plate at lunch and snack",
    nap: "12:20 – 13:50",
    mood: "Playful",
    note: "Led the shaker song in music circle.",
  },
];

export const milestones: Milestone[] = [
  {
    id: "m1",
    childId: "c1",
    area: "Language",
    title: "Speaks in full sentences",
    achieved: true,
    observedOn: "2026-05-12",
  },
  {
    id: "m2",
    childId: "c1",
    area: "Numeracy",
    title: "Counts to twenty",
    achieved: true,
    observedOn: "2026-06-30",
  },
  {
    id: "m3",
    childId: "c1",
    area: "Social",
    title: "Resolves small conflicts with words",
    achieved: false,
    observedOn: null,
  },
  {
    id: "m4",
    childId: "c2",
    area: "Motor",
    title: "Walks up stairs holding a rail",
    achieved: true,
    observedOn: "2026-04-08",
  },
  {
    id: "m5",
    childId: "c2",
    area: "Language",
    title: "Uses fifty or more words",
    achieved: false,
    observedOn: null,
  },
  {
    id: "m6",
    childId: "c3",
    area: "Language",
    title: "Writes own name",
    achieved: true,
    observedOn: "2026-08-02",
  },
  {
    id: "m7",
    childId: "c3",
    area: "Creative",
    title: "Draws a recognisable figure",
    achieved: true,
    observedOn: "2026-03-19",
  },
  {
    id: "m8",
    childId: "c4",
    area: "Motor",
    title: "Rolls back to tummy",
    achieved: true,
    observedOn: "2026-08-03",
  },
  {
    id: "m9",
    childId: "c4",
    area: "Social",
    title: "Responds to own name",
    achieved: true,
    observedOn: "2026-07-11",
  },
  {
    id: "m10",
    childId: "c5",
    area: "Motor",
    title: "Balances on one foot",
    achieved: false,
    observedOn: null,
  },
  {
    id: "m11",
    childId: "c6",
    area: "Numeracy",
    title: "Sorts shapes by colour",
    achieved: true,
    observedOn: "2026-06-04",
  },
  {
    id: "m12",
    childId: "c10",
    area: "Creative",
    title: "Keeps a beat with an instrument",
    achieved: true,
    observedOn: "2026-07-28",
  },
];

export const staff: StaffMember[] = [
  {
    id: "s1",
    name: "Bongi Mahlangu",
    role: "Principal",
    classroom: "All classrooms",
    email: "bongi@littlestars.co.za",
    phone: "+27 82 110 4478",
    since: "2018-01-15",
  },
  {
    id: "s2",
    name: "Chantel Adams",
    role: "Lead teacher",
    classroom: "Stargazers",
    email: "chantel@littlestars.co.za",
    phone: "+27 83 664 2210",
    since: "2020-04-06",
  },
  {
    id: "s3",
    name: "Grace Sibanda",
    role: "Lead teacher",
    classroom: "Comets",
    email: "grace@littlestars.co.za",
    phone: "+27 71 220 9931",
    since: "2021-08-02",
  },
  {
    id: "s4",
    name: "Jaco Steyn",
    role: "Assistant teacher",
    classroom: "Moonbeams",
    email: "jaco@littlestars.co.za",
    phone: "+27 79 442 1180",
    since: "2023-02-13",
  },
  {
    id: "s5",
    name: "Fatima Isaacs",
    role: "Infant carer",
    classroom: "Sunbeams",
    email: "fatima@littlestars.co.za",
    phone: "+27 84 337 5529",
    since: "2022-05-09",
  },
  {
    id: "s6",
    name: "Dineo Molefe",
    role: "Administrator",
    classroom: "Front office",
    email: "dineo@littlestars.co.za",
    phone: "+27 82 771 6640",
    since: "2019-09-30",
  },
];

export const invoices: Invoice[] = [
  { id: "i1", childId: "c1", period: "August 2026", amount: 4200, status: "paid", dueDate: "2026-08-01" },
  { id: "i2", childId: "c2", period: "August 2026", amount: 4600, status: "pending", dueDate: "2026-08-07" },
  { id: "i3", childId: "c3", period: "August 2026", amount: 3900, status: "paid", dueDate: "2026-08-01" },
  { id: "i4", childId: "c4", period: "August 2026", amount: 5200, status: "overdue", dueDate: "2026-07-25" },
  { id: "i5", childId: "c5", period: "August 2026", amount: 4200, status: "pending", dueDate: "2026-08-07" },
  { id: "i6", childId: "c6", period: "August 2026", amount: 4600, status: "paid", dueDate: "2026-08-01" },
  { id: "i7", childId: "c10", period: "August 2026", amount: 4600, status: "overdue", dueDate: "2026-07-25" },
  { id: "i8", childId: "c1", period: "July 2026", amount: 4200, status: "paid", dueDate: "2026-07-01" },
  { id: "i9", childId: "c3", period: "July 2026", amount: 3900, status: "paid", dueDate: "2026-07-01" },
  { id: "i10", childId: "c2", period: "July 2026", amount: 4600, status: "paid", dueDate: "2026-07-01" },
  { id: "i11", childId: "c4", period: "July 2026", amount: 5200, status: "overdue", dueDate: "2026-07-01" },
  { id: "i12", childId: "c1", period: "June 2026", amount: 4200, status: "paid", dueDate: "2026-06-01" },
  { id: "i13", childId: "c2", period: "June 2026", amount: 4600, status: "paid", dueDate: "2026-06-01" },
  { id: "i14", childId: "c3", period: "June 2026", amount: 3900, status: "paid", dueDate: "2026-06-01" },
  { id: "i15", childId: "c5", period: "June 2026", amount: 4200, status: "pending", dueDate: "2026-06-07" },
  { id: "i16", childId: "c1", period: "May 2026", amount: 4200, status: "paid", dueDate: "2026-05-01" },
  { id: "i17", childId: "c4", period: "May 2026", amount: 5200, status: "paid", dueDate: "2026-05-01" },
  { id: "i18", childId: "c6", period: "May 2026", amount: 4600, status: "paid", dueDate: "2026-05-01" },
  { id: "i19", childId: "c2", period: "April 2026", amount: 4600, status: "paid", dueDate: "2026-04-01" },
  { id: "i20", childId: "c3", period: "April 2026", amount: 3900, status: "paid", dueDate: "2026-04-01" },
  { id: "i21", childId: "c10", period: "April 2026", amount: 4600, status: "paid", dueDate: "2026-04-01" },
  { id: "i22", childId: "c1", period: "March 2026", amount: 4200, status: "paid", dueDate: "2026-03-01" },
  { id: "i23", childId: "c5", period: "March 2026", amount: 4200, status: "paid", dueDate: "2026-03-01" },
  { id: "i24", childId: "c6", period: "February 2026", amount: 4600, status: "paid", dueDate: "2026-02-01" },
  { id: "i25", childId: "c4", period: "February 2026", amount: 5200, status: "paid", dueDate: "2026-02-01" },
];


/** Monthly school finance history (demo figures, in rand). */
export type FinanceMonth = {
  month: string;
  collected: number;
  billed: number;
  expenses: number;
};

export const financeHistory: FinanceMonth[] = [
  { month: "Feb", collected: 28400, billed: 30600, expenses: 21300 },
  { month: "Mar", collected: 31200, billed: 32800, expenses: 22800 },
  { month: "Apr", collected: 29800, billed: 31400, expenses: 24100 },
  { month: "May", collected: 33600, billed: 34200, expenses: 23500 },
  { month: "Jun", collected: 32100, billed: 35000, expenses: 25400 },
  { month: "Jul", collected: 34800, billed: 35600, expenses: 24900 },
  { month: "Aug", collected: 12700, billed: 31300, expenses: 18600 },
];

/** Where this month's outgoings go (demo figures, in rand). */
export const expenseBreakdown: Array<{ label: string; amount: number }> = [
  { label: "Salaries", amount: 12400 },
  { label: "Meals & snacks", amount: 2600 },
  { label: "Learning materials", amount: 1700 },
  { label: "Facilities & utilities", amount: 1900 },
];


export function childName(id: string): string {
  const child = children.find((c) => c.id === id);
  return child ? `${child.firstName} ${child.lastName}` : "Unknown child";
}

export function ageInMonths(birthDate: string, today = new Date("2026-08-03")): number {
  const birth = new Date(birthDate);
  return (
    (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())
  );
}

export function formatAge(birthDate: string): string {
  const months = ageInMonths(birthDate);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} mo`;
  return rest === 0 ? `${years} yr` : `${years} yr ${rest} mo`;
}

export function formatMoney(amount: number): string {
  return `R ${amount.toLocaleString("en-ZA")}`;
}

/* ---------------------------------------------------------------------------
 * Programmes & fee schedules (admin-managed)
 * ------------------------------------------------------------------------- */

export type Programme = {
  id: string;
  name: string;
  ages: string;
  ratio: string;
  monthlyFee: number;
  includes: string[];
  archived: boolean;
};

export const programmes: Programme[] = [
  {
    id: "p1",
    name: "Sunbeams",
    ages: "3 months – 18 months",
    ratio: "1 carer to 4 infants",
    monthlyFee: 5200,
    includes: ["Bottle & feed logging", "Two nap cycles", "Nappies included", "Daily photo update"],
    archived: false,
  },
  {
    id: "p2",
    name: "Moonbeams",
    ages: "18 months – 3 years",
    ratio: "1 teacher to 6 toddlers",
    monthlyFee: 4600,
    includes: ["Messy play studio", "Potty-training support", "Cooked lunch & snacks", "Music circle"],
    archived: false,
  },
  {
    id: "p3",
    name: "Comets",
    ages: "3 – 4 years",
    ratio: "1 teacher to 8 children",
    monthlyFee: 4200,
    includes: ["Story & phonics circle", "Early numeracy", "Garden time twice daily", "Termly progress report"],
    archived: false,
  },
  {
    id: "p4",
    name: "Stargazers",
    ages: "4 – 6 years",
    ratio: "1 teacher to 10 children",
    monthlyFee: 3900,
    includes: ["School readiness plan", "Handwriting & literacy", "Grade R transition visit", "Milestone portfolio"],
    archived: false,
  },
];
