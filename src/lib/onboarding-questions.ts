import onboardingFamily from "@/assets/onboarding-family.jpg";
import onboardingRoutine from "@/assets/onboarding-routine.jpg";
import approachReading from "@/assets/approach-reading.jpg";
import gardenPlay from "@/assets/garden-play.jpg";
import heroClassroom from "@/assets/hero-classroom.jpg";
import { classrooms } from "@/data/lms";
import type { Role } from "@/lib/auth";

/**
 * Onboarding questions per role. Parents describe their child (which becomes an
 * enrolment record), teachers describe their classroom, admins describe the school.
 */
export type OnboardingStep = {
  key: string;
  question: string;
  /** Short label used in the read-only dashboard summary. */
  label: string;
  helper: string;
  image: any;
  alt: string;
  options?: string[];
  placeholder?: string;
  optional?: boolean;
};

const parentSteps: OnboardingStep[] = [
  {
    key: "childName",
    question: "Who are we welcoming?",
    label: "Child's name",
    helper: "Your child's full name is how their teachers will greet them every morning.",
    image: onboardingFamily,
    alt: "A parent hugging their toddler at preschool drop-off",
    placeholder: "e.g. Amara Ndlovu",
  },
  {
    key: "ageGroup",
    question: "How old is your little one?",
    label: "Age group",
    helper: "This decides which classroom and daily rhythm suits them best.",
    image: heroClassroom,
    alt: "A bright Little Stars classroom",
    options: ["3 – 18 months", "18 months – 3 years", "3 – 4 years", "4 – 6 years"],
  },
  {
    key: "startDate",
    question: "When would you like to start?",
    label: "Preferred start",
    helper: "We'll pencil this in as their first day and confirm by phone.",
    image: onboardingRoutine,
    alt: "Teacher and children in a morning circle",
    options: ["As soon as possible", "Next month", "Next term", "Still deciding"],
  },
  {
    key: "schedule",
    question: "Which days do you need?",
    label: "Schedule",
    helper: "You can change this later from your family space.",
    image: onboardingRoutine,
    alt: "Children arriving for the day",
    options: ["Five full days", "Five half days", "Three days a week", "Flexible / occasional"],
  },
  {
    key: "priority",
    question: "What matters most to you this year?",
    label: "Focus for the year",
    helper: "We'll highlight this first in your daily reports.",
    image: approachReading,
    alt: "A teacher reading with a child",
    options: [
      "Early literacy and language",
      "Confidence and social play",
      "Sleep and feeding routines",
      "Outdoor and physical play",
    ],
  },
  {
    key: "allergies",
    question: "Any allergies or medical notes?",
    label: "Allergies",
    helper: "Separate several with commas. Leave blank if there are none.",
    image: gardenPlay,
    alt: "Children playing in the Little Stars garden",
    placeholder: "e.g. Peanuts, dairy",
    optional: true,
  },
  {
    key: "notes",
    question: "Anything else we should know?",
    label: "Notes for teachers",
    helper: "Comfort objects, nap habits — small details make big differences.",
    image: gardenPlay,
    alt: "A quiet reading corner at Little Stars",
    placeholder: "e.g. Naps at 12:30, loves her blue bunny",
    optional: true,
  },
];

const staffSteps: OnboardingStep[] = [
  {
    key: "staffRole",
    question: "What's your role at Little Stars?",
    label: "Role",
    helper: "This sets the tools you see first in your dashboard.",
    image: heroClassroom,
    alt: "A teacher setting up a classroom",
    options: ["Lead teacher", "Assistant teacher", "Baby room practitioner", "Support staff"],
  },
  {
    key: "classroom",
    question: "Which classroom are you responsible for?",
    label: "Classroom",
    helper: "Your registers and reports are scoped to this room.",
    image: onboardingRoutine,
    alt: "Children in a morning circle",
    options: [...classrooms],
  },
  {
    key: "shift",
    question: "Which shift do you usually work?",
    label: "Shift",
    helper: "We use this for the roster and to prefill check-in times.",
    image: gardenPlay,
    alt: "Children playing outdoors",
    options: ["Early (06:30 – 14:30)", "Standard (07:30 – 16:00)", "Late (10:00 – 18:00)"],
  },
  {
    key: "phone",
    question: "Best contact number?",
    label: "Phone",
    helper: "Used for roster changes and emergencies only.",
    image: approachReading,
    alt: "A teacher reading with a child",
    placeholder: "e.g. +27 82 000 0000",
    optional: true,
  },
  {
    key: "focus",
    question: "What would you like support with?",
    label: "Support focus",
    helper: "We'll surface relevant guidance in your reports module.",
    image: onboardingFamily,
    alt: "A teacher greeting a family",
    options: [
      "Observation and milestone tracking",
      "Behaviour and social play",
      "Parent communication",
      "Curriculum planning",
    ],
    optional: true,
  },
];

const adminSteps: OnboardingStep[] = [
  {
    key: "schoolName",
    question: "What's the name of your school?",
    label: "School name",
    helper: "Shown on invoices and parent communication.",
    image: heroClassroom,
    alt: "A bright preschool classroom",
    placeholder: "e.g. Little Stars Preschool",
  },
  {
    key: "capacity",
    question: "How many children can you take?",
    label: "Capacity",
    helper: "Used for waitlist and occupancy figures.",
    image: onboardingRoutine,
    alt: "Children in a morning circle",
    options: ["Up to 30", "30 – 60", "60 – 100", "More than 100"],
  },
  {
    key: "billingCycle",
    question: "How do you bill families?",
    label: "Billing cycle",
    helper: "This sets the default period on new fee schedules.",
    image: gardenPlay,
    alt: "Children playing outdoors",
    options: ["Monthly", "Termly", "Weekly"],
  },
  {
    key: "priority",
    question: "What do you want to get on top of first?",
    label: "First priority",
    helper: "We'll pin this module to the top of your dashboard.",
    image: approachReading,
    alt: "A teacher reading with a child",
    options: ["Attendance accuracy", "Fee collection", "Staff rosters", "Parent reporting"],
  },
  {
    key: "notes",
    question: "Anything specific about your setup?",
    label: "Setup notes",
    helper: "Multiple sites, aftercare, transport — anything worth recording.",
    image: onboardingFamily,
    alt: "A parent and child at drop-off",
    placeholder: "e.g. Two sites, aftercare until 17:30",
    optional: true,
  },
];

export const onboardingStepsByRole: Record<Role, OnboardingStep[]> = {
  parent: parentSteps,
  staff: staffSteps,
  admin: adminSteps,
};

export const onboardingIntroByRole: Record<Role, string> = {
  parent: "Tell us about your child so we can prepare their family space.",
  staff: "A few details about your classroom and shift set up your teaching tools.",
  admin: "Set the basics for your school so the dashboard reflects how you run it.",
};

export function stepsForRole(role: Role | undefined): OnboardingStep[] {
  return onboardingStepsByRole[role ?? "parent"];
}
