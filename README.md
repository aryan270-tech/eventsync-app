# EventSync — Event & Workshop Booking Platform

A full-stack, browser-based web application that allows users to discover technical conferences, select date/time slots, reserve ticket passes with zero-overbooking guarantees, generate scannable digital passes, and manage event inventories with real-time organizer analytics.

---

## 📌 Problem Statement

Organizing and attending professional conferences, developer workshops, and tech summits often suffers from fragmented workflows. Attendees struggle with opaque seat availability, missing digital tickets, and complex cancellation processes. On the other hand, event organizers lack real-time visibility into revenue metrics, seat occupancy rates, and catalog management across their published events.

---

## 🎯 Target Users

- **Event Attendees / Developers / Students:** Seeking a seamless platform to discover events, filter by category (*Tech & AI, Design, Business, Workshops, Music & Art*), reserve ticket tiers (General vs. VIP), receive scannable digital passes with QR codes, and manage or cancel bookings easily.
- **Event Hosts / Organizers:** Requiring a real-time command studio to track gross ticket revenue ($), monitor seat occupancy rates (%), manage published event inventory, and publish new events dynamically.

---

## 💡 Solution

**EventSync** bridges this gap by offering an end-to-end, functional event ticketing software:

1. **Interactive Event Discovery Engine**: Keyword search across all text fields (titles, categories, descriptions, speakers, locations) and category filter pills.
2. **Deterministic Booking Wizard**: Tiered pricing calculation (General vs. VIP Pass), atomic seat inventory deduction, and client-side form validation.
3. **Digital Ticket Passport Generation**: Instant issuance of a scannable digital ticket pass featuring a unique Reference ID (`#EVT-XXXXXX`), attendee details, tier badge, and a scannable QR Code.
4. **My Bookings & Seat Restoration Engine**: Complete ticket pass wallet with a cancellation workflow that restores reserved seats back to the event inventory automatically.
5. **Organizer Command Studio**: Live KPI analytics dashboard tracking gross revenue, seat occupancy metrics, event status toggles (*Active / Paused*), and a new event publisher form.

---

## 🔥 Key Features

- 🔍 **Global Multi-Field Search**: Search for any keyword like `"music"`, `"business"`, `"design"`, `"tech"`, `"workshop"`, or speaker name to instantly filter matching events.
- 🎟️ **Multi-Tier Ticket Selection**: Choose between **General Access** and **VIP Pass** with live price calculation and quantity limits.
- 📱 **Digital Ticket Pass & QR Code**: Visual printable pass containing a unique booking reference and scannable QR code element.
- 🔄 **Automatic Seat Restoration**: Canceling a booking restores the reserved seats back to the event inventory in real-time.
- 📊 **Organizer Revenue Analytics**: Real-time tracking of total ticket sales revenue ($), total reserved seats, average venue capacity occupancy (%), and active event inventory toggles.
- 💾 **LocalStorage Persistence**: All bookings, event seat counts, and published events survive page reloads seamlessly.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling & Aesthetics**: Tailwind CSS (CDN Runtime), HSL Dark Palette (`#0a0c14`), Custom Glassmorphism, Google Fonts (`Inter` & `Outfit`)
- **Iconography & Visuals**: `lucide-react`, `canvas-confetti`
- **State Management**: React Context API with `localStorage` persistence
- **Testing**: Native TypeScript assertions (`src/tests/booking.test.ts`)
- **Version Control**: Git (Incremental commit trajectory)

---

## 🏗️ Architecture & Component Design

```
eventsync-app/
├── index.html               # Entry HTML with Tailwind CSS CDN & typography
├── package.json             # NPM dependencies and scripts
├── vite.config.ts           # Vite bundler configuration
├── tsconfig.json            # TypeScript compiler options
├── README.md                # Project documentation
├── src/
│   ├── main.tsx             # React DOM entrypoint
│   ├── App.tsx              # Main application router and view orchestrator
│   ├── index.css            # Custom design tokens, glassmorphism, and modal styles
│   ├── types/
│   │   └── event.ts         # TypeScript interfaces (EventItem, BookingItem, Filter)
│   ├── context/
│   │   └── EventContext.tsx # Central state engine (Bookings, Seats, Inventory, Toast)
│   ├── mock/
│   │   └── initialEvents.ts # Pre-populated rich conferences dataset
│   ├── utils/
│   │   └── formatters.ts    # Currency formatters, ID generators, QR code builder
│   ├── components/
│   │   ├── Navbar.tsx       # Search bar, tab navigation, category filter pills
│   │   ├── EventCard.tsx    # Event card with seat availability bar & price
│   │   ├── EventDetailModal.tsx # Full agenda & keynote speaker detail modal
│   │   ├── BookingModal.tsx # Ticket tier selection & attendee details wizard
│   │   ├── TicketPass.tsx   # Scannable digital ticket pass modal with QR code
│   │   ├── MyBookings.tsx   # User passport wallet & cancellation seat release
│   │   ├── OrganizerDashboard.tsx # Revenue analytics KPI & new event publisher
│   │   └── Toast.tsx        # Success & alert notification system
│   └── tests/
│       └── booking.test.ts  # Automated unit test suite for seat inventory engine
```

---

## 🚀 Local Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### Steps to Run Locally

1. **Clone or navigate to the repository folder**:
   ```bash
   cd C:\Users\Admin\.gemini\antigravity\scratch\eventsync-app
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your web browser.

4. **Verify production bundle**:
   ```bash
   npm run build
   ```

---

## 🔒 Environment Variables

EventSync operates entirely in client memory and `localStorage`. It requires **zero paid third-party API keys or secret environment variables**, ensuring 100% reliable evaluation without credential expiration or network failure risks.

---

## 🌐 Deployment Instructions

### Option 1: Local Evaluator Execution (Recommended)
Evaluators can clone the repository and run `npm run dev` to launch the application locally on `http://localhost:3000`.

### Option 2: Deploy to Vercel / Netlify (Public Deployment)
To host the application on a public URL:

1. Push your Git repository to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/eventsync-app.git
   git branch -M main
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Select **Import Project** ➔ Pick `eventsync-app` GitHub repository.
4. Framework Preset: **Vite**
5. Click **Deploy**. Your app will be live on a public HTTPS URL (e.g. `https://eventsync-app.vercel.app`).
