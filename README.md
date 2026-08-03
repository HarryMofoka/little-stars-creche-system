# Little Stars Preschool — Bright Beginnings Hub

A modern, full-featured Early Childhood Development (ECD) creche and preschool management platform built with **Next.js 15**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

---

## 🌟 Overview

**Bright Beginnings Hub (Little Stars Preschool)** provides a warm, unhurried early learning experience for children aged 3 months to 6 years in Rosebank, Johannesburg. 

This repository contains both the **public marketing website** and the complete **Learner Management System (LMS) dashboard** for parents, teachers, and administrators.

---

## ✨ Features & Modules

### 🎨 Public Website
- **Hero & Philosophy**: Interactive landing page showcasing Little Stars' play-led learning curriculum and daily rhythms.
- **Programmes & Fees**: Transparent overview of classrooms (*Sunbeams*, *Moonbeams*, *Comets*, *Stargazers*), age bands, teacher-to-child ratios, and fee structures.
- **Our Approach & Team**: In-depth information on ECD principles and teacher profiles.
- **Book a Tour**: Interactive enquiry form and waitlist details for prospective families.
- **Authentication**: Dedicated Sign-In and Sign-Up split-screen views with demo account access.

### 📋 Guided Onboarding Wizard
- **Role-Based Setup**: Tailored questionnaires for **Parents**, **Teachers**, and **Administrators**.
- **Progress Saving**: Auto-saves progress to localStorage allowing users to resume anytime.
- **PDF Export**: Download printable onboarding summary PDFs via `jspdf`.
- **Automatic LMS Sync**: Automatically generates child enrolment records and updates staff rosters upon completion.

### 📊 LMS Dashboard
- **Overview Analytics**: Real-time stats on enrolled children, on-site attendance, outstanding fees, and milestones achieved.
- **Daily Attendance Register**: Check-in and check-out tracking, absent logging, date-range filtering, and mobile-optimized register.
- **Fee Management & Financial Insights**:
  - Invoicing status tracking (Paid, Pending, Overdue).
  - Interactive financial charts (Recharts) for monthly cashflow, category breakdown, and net trends.
  - Drill-down modal for line-item audit.
- **Learner Records & Milestones**: Track developmental milestones across Language, Motor, Social, Numeracy, and Creative domains along with daily meal/nap reports.
- **Staff Directory**: Roster management, classroom assignments, contact info, and status toggles.
- **Notifications Inbox**: In-app and simulated email notification feed with unread indicators and category filters.
- **Admin Console**: Programme fee schedule management and demo data reset controls.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Client Components)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Primitives**: [Radix UI](https://www.radix-ui.com/) (`@radix-ui/*`)
- **State & Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest) & React Context API
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Toasts & Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.17 or higher) and `npm` or `bun` installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HarryMofoka/little-stars-creche-system.git
   cd little-stars-creche-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **`npm run dev`** | `next dev` | Starts the Next.js development server |
| **`npm run build`** | `next build` | Compiles the production build |
| **`npm run start`** | `next start` | Starts the production server after building |
| **`npm run lint`** | `next lint` | Runs ESLint type and style checks |

---

## 📁 Folder Structure

```
.
├── src/
│   ├── app/                    # Next.js App Router pages & layouts
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact & Tour Booking page
│   │   ├── dashboard/          # LMS Dashboard layout & sub-routes
│   │   │   ├── admin/          # Admin fee schedules
│   │   │   ├── attendance/     # Daily register
│   │   │   ├── children/       # Learner records & [id] detail view
│   │   │   ├── fees/           # Financial analytics & invoicing
│   │   │   ├── notifications/  # Notifications inbox
│   │   │   ├── reports/        # Milestones & daily reports
│   │   │   └── staff/          # Staff roster
│   │   ├── login/              # Sign-in page
│   │   ├── onboarding/         # Onboarding wizard
│   │   ├── programmes/         # Programmes & fees public page
│   │   ├── signup/             # Parent registration page
│   │   ├── layout.tsx          # Root layout & providers
│   │   ├── page.tsx            # Homepage
│   │   ├── providers.tsx       # React Query & LMS Providers
│   │   └── site-nav-wrapper.tsx# Conditional public navigation
│   ├── assets/                 # High-resolution image assets
│   ├── components/             # Reusable UI & LMS components
│   │   ├── lms/                # LMS-specific panels & forms
│   │   ├── site/               # Public site navigation, footer, hero
│   │   └── ui/                 # Radix UI primitives & design tokens
│   ├── data/                   # Initial mock datasets (children, staff, fees, reports)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Storage stores, PDF generators, questions
│   └── styles.css              # Tailwind CSS v4 & custom design tokens
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS configuration for Tailwind v4
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies and scripts
```

---

## 🔒 Demo Accounts

You can test the LMS dashboard immediately using pre-configured demo credentials on the [Sign In page](/login):

- **Parent**: `parent@littlestars.co.za` (Password: `little-stars`)
- **Teacher**: `teacher@littlestars.co.za` (Password: `little-stars`)
- **Admin**: `admin@littlestars.co.za` (Password: `little-stars`)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
