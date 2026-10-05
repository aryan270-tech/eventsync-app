# EventSync — Modern Event & Workshop Booking Platform

> **End-Term Software Project Submission**  
> **Student Name:** Independent Engineering Project  
> **Submission Deadline:** 27 October 2026, 11:59 PM IST  
> **Official Form:** [Submit Project Here](https://forms.gle/sBy4sfqyiRG2Zpom9)

---

## 📌 Problem Statement
Organizing and attending professional conferences, workshops, and summits requires a reliable, transparent workflow. Attendees struggle with opaque seat availability, missing digital passes, and complex cancellation processes. Event organizers lack real-time visibility into revenue metrics and capacity occupancy rates across their event catalog.

## 🎯 Target Users
- **Event Attendees / Developers / Students:** Seeking to discover tech summits, reserve ticket tiers, receive scannable digital passes, and manage or cancel bookings easily.
- **Event Organizers / Hosts:** Requiring a real-time command dashboard to publish events, track revenue streams, monitor seat occupancy rates, and manage event availability status.

## 💡 Solution
**EventSync** is a full-stack, browser-based web application that provides a complete end-to-end event ticketing & management lifecycle:
1. **Interactive Event Discovery**: Search, category filtering, and real-time seat inventory indicators.
2. **Deterministic Booking Engine**: Multi-tier pricing calculation (General vs. VIP), seat allocation with zero-overbooking protection, and client-side form validation.
3. **Digital Pass Passport Generation**: Instant issuance of a scannable digital pass with a unique Booking ID (`EVT-XXXXXX`) and dynamic QR code.
4. **My Bookings & Seat Restoration**: Complete user booking history with a seat release workflow that restores inventory upon cancellation.
5. **Organizer Command Studio**: Revenue analytics dashboard, total capacity occupancy tracking, and a modal form to publish new events dynamically.

---

## 🔥 Key Workflows & Features

| Workflow | Description | Engineering Highlights |
| :--- | :--- | :--- |
| **Workflow 1: Discovery & Filtering** | Search events by title, speaker, or category (*Tech & AI, Design, Business, Workshops, Music*). | Real-time query parsing, instant category chip filter. |
| **Workflow 2: Interactive Slot & Ticket Reservation** | View agenda, speaker profile, select ticket tier (General vs. VIP), choose quantity. | Tier price calculation, input validation. |
| **Workflow 3: Booking Checkout & Pass Generation** | Process booking, deduct seat inventory, trigger confetti, generate digital pass. | Atomic seat decrement, LocalStorage sync, QR code generation. |
| **Workflow 4: My Bookings & Cancellation** | View active/past tickets, open pass modal, or cancel reservation. | **Seat Restoration Engine**: Canceling refunds seats back to inventory. |
| **Workflow 5: Organizer Command Studio** | Live KPI stats (Revenue, Occupancy %, Published count) & event creation form. | Real-time metric aggregation, active status toggles. |

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **UI & Aesthetics**: Custom Glassmorphism Design System, HSL Dark Palette, `Inter` & `Outfit` Google Typography
- **Iconography & Visuals**: `lucide-react`, `canvas-confetti`
- **State Management**: React Context API with `localStorage` persistence
- **Build Tool**: Vite (Lightning fast compilation)

---

## 🏗️ Architecture & Component Design

```
src/
├── types/
│   └── event.ts             # Event, TicketTier, BookingItem, EventFilter models
├── context/
│   └── EventContext.tsx     # Centralized State Engine (Bookings, Seats, LocalStorage)
├── mock/
│   └── initialEvents.ts     # Pre-populated rich mock conferences dataset
├── utils/
│   └── formatters.ts        # Currency formatters, ID generators, QR code builder
├── components/
│   ├── Navbar.tsx           # Global header & active tab router
│   ├── EventCard.tsx        # Event display card with occupancy progress bar
│   ├── EventDetailModal.tsx # Detailed event schedule & speaker showcase
│   ├── BookingModal.tsx     # Step-by-step ticket reservation wizard
│   ├── TicketPass.tsx       # Digital Event Pass with dynamic QR code
│   ├── MyBookings.tsx       # User pass history & seat cancellation workflow
│   ├── OrganizerDashboard.tsx # Real-time revenue analytics & event publisher
│   └── Toast.tsx            # Global notification system
├── tests/
│   └── booking.test.ts      # Unit tests for seat logic & inventory
├── App.tsx                  # Main app router & view renderer
└── main.tsx                 # Application entrypoint
```

---

## 🚀 Local Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd eventsync-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🔒 Environment Variables
EventSync runs entirely in client memory and LocalStorage, requiring **zero paid API keys or secret environment variables**. This guarantees 100% reliable execution during evaluation without key expiration risks.

---

## 📋 Evaluation Checklist Verification

- [x] **Functional Software Application**: Contains active booking logic, seat inventory deduction, and cancellation workflows.
- [x] **Clear Target User**: Built for attendees reserving passes and organizers tracking revenue.
- [x] **5 Complete Core Workflows**: Discovery, Ticket Checkout, Pass Generation, Cancellation, and Organizer Dashboard.
- [x] **Error & Failure Handling**: Validates seat counts, prevents overbooking, validates email formats.
- [x] **No Secrets Exposed**: Pure client architecture.
- [x] **Git Version Control**: Incremental commit history.
- [x] **Documentation**: Complete README setup & architecture guide.
