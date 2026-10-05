# EventSync — Real-Time Event & Ticket Booking Platform

A full-stack web application that allows users to discover events, book tickets with real-time seat management, generate digital passes, and manage bookings — backed by Firebase Authentication and Firestore database.

**Live Demo:** https://eventsync-app.vercel.app  
**GitHub:** https://github.com/aryan270-tech/eventsync-app

---

## 📌 Problem Statement

Organizing and attending professional conferences suffers from fragmented workflows. Attendees struggle with opaque seat availability, missing digital tickets, and complex cancellation processes. Event organizers lack real-time visibility into revenue metrics, seat occupancy rates, and catalog management.

---

## 🎯 Target Users

- **Attendees / Students / Developers** — Browse events, book tickets (General or VIP), receive scannable digital passes, manage and cancel bookings.
- **Event Organizers / Hosts** — Publish new events, track real-time seat occupancy, monitor revenue analytics, toggle event status (Active/Paused).

---

## 💡 Solution

EventSync is an end-to-end event ticketing platform with:

1. **Authentication** — Email/password login with role selection (Attendee or Organizer)
2. **Event Discovery** — Multi-field search, category filters, availability filters
3. **Booking Wizard** — Tiered pricing (General vs VIP), seat validation, Firestore persistence
4. **Digital Ticket Pass** — Unique booking reference, scannable QR code, attendee details
5. **Booking Management** — View all bookings, cancel with automatic seat restoration
6. **Organizer Studio** — Create events, track revenue, monitor seat occupancy per event

---

## 🔥 Key Features

- 🔐 **Firebase Authentication** — Secure email/password login, role-based access (Attendee / Organizer)
- 🗄️ **Firestore Database** — All bookings, events, and user profiles persist permanently
- 🔍 **Global Search** — Search by title, category, speaker, location, description
- 🎟️ **Multi-Tier Tickets** — General and VIP pricing with real-time availability check
- 📱 **Digital Ticket Pass** — Visual pass with unique booking ID and QR code
- 🔄 **Seat Restoration** — Cancelling a booking automatically restores seats in Firestore
- 📊 **Organizer Analytics** — Revenue, seat occupancy, event status management
- ✅ **Role-Based Access** — Organizer Studio only visible to organizer accounts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Vanilla CSS, Glassmorphism, Google Fonts (Inter, Outfit) |
| Authentication | Firebase Authentication (Email/Password) |
| Database | Cloud Firestore (NoSQL) |
| State Management | React Context API |
| Icons | lucide-react |
| Animations | canvas-confetti |
| Deployment | Vercel |
| Version Control | Git + GitHub |

---

## 🏗️ Architecture

```
eventsync-app/
├── src/
│   ├── firebase/
│   │   └── config.ts            # Firebase app initialization (env vars)
│   ├── context/
│   │   ├── AuthContext.tsx      # Firebase Auth state, login/signup/logout
│   │   └── EventContext.tsx     # Events + Bookings state (Firestore)
│   ├── services/
│   │   ├── eventService.ts      # Firestore CRUD for events
│   │   └── bookingService.ts    # Firestore CRUD for bookings
│   ├── pages/
│   │   └── AuthPage.tsx         # Login / Signup page with role selection
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation, search, user avatar, logout
│   │   ├── EventCard.tsx        # Event listing card with seat availability
│   │   ├── EventDetailModal.tsx # Full event detail with agenda & speaker
│   │   ├── BookingModal.tsx     # Ticket booking wizard (tier, qty, form)
│   │   ├── TicketPass.tsx       # Digital ticket pass with QR code
│   │   ├── MyBookings.tsx       # User's bookings from Firestore
│   │   ├── OrganizerDashboard.tsx # Revenue analytics + event publisher
│   │   └── Toast.tsx            # Notification system
│   ├── types/event.ts           # TypeScript interfaces
│   ├── mock/initialEvents.ts    # Seed data (auto-loaded to Firestore on first run)
│   └── utils/formatters.ts      # Currency, ID generators, QR builder
├── .env                         # Firebase config (not committed to Git)
├── .gitignore                   # Excludes .env and node_modules
├── index.html                   # HTML entry point
├── vite.config.ts               # Vite bundler config
└── tsconfig.json                # TypeScript config
```

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js v18+
- npm
- A Firebase project (see Environment Variables below)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aryan270-tech/eventsync-app.git
   cd eventsync-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables** — create a `.env` file in the root:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000**

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firestore Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |

> These are client-side config values (not secrets). Firebase security is enforced via Firestore Security Rules.  
> Never commit your `.env` file — it is already listed in `.gitignore`.

---

## 🌐 Deployment

The application is live at: **https://eventsync-app.vercel.app**

Deployed via Vercel connected to this GitHub repository. Every push to `main` triggers an automatic redeployment. Firebase environment variables are configured in Vercel's project settings.

### To deploy your own instance:
1. Fork this repository
2. Create a Firebase project at https://console.firebase.google.com
3. Enable Email/Password Authentication
4. Create a Firestore database (Production mode)
5. Import to Vercel → add all 6 `VITE_FIREBASE_*` environment variables
6. Deploy

---

## 📋 Core Workflows

| # | Workflow | Description |
|---|---|---|
| 1 | **Authentication** | Sign up with role → Login → Logout |
| 2 | **Event Discovery** | Search + filter by category/availability |
| 3 | **Ticket Booking** | Select tier → Fill details → Confirm → Digital pass |
| 4 | **Booking Management** | View bookings → Cancel → Seats restored |
| 5 | **Organizer Studio** | Create event → Track revenue + occupancy |

---

## 👤 Test Accounts (for evaluator)

Create accounts directly on the live site:
- **Attendee** — Sign up at https://eventsync-app.vercel.app → select "Attendee"
- **Organizer** — Sign up at https://eventsync-app.vercel.app → select "Organizer"
