import { EventItem } from '../types/event';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-101',
    title: 'AI & Next-Gen LLM Developer Summit 2026',
    category: 'Tech & AI',
    description: 'Explore state-of-the-art AI architectures, agentic workflows, and real-time LLM fine-tuning techniques.',
    longDescription: 'Join world-class AI engineers and researchers for an intensive full-day summit on building autonomous AI agents, multi-modal systems, and deploying enterprise-grade LLM applications. Featuring hands-on code breakdowns and live Q&A sessions.',
    date: 'Oct 28, 2026',
    time: '10:00 AM - 5:00 PM IST',
    location: 'Cyber Hub Auditorium, Tech Park, Bengaluru & Virtual',
    isOnline: false,
    priceGeneral: 49,
    priceVIP: 129,
    totalSeats: 150,
    availableSeats: 34,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    organizer: 'NextAI Foundation',
    speaker: {
      name: 'Dr. Elena Rostova',
      role: 'Principal AI Scientist @ DeepMind Research',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    agenda: [
      '10:00 AM — Keynote: Building Production-Grade Agentic Systems',
      '11:30 AM — Fine-tuning open-source LLMs on specialized domain data',
      '01:00 PM — Networking & Buffet Lunch',
      '02:30 PM — Workshop: Real-time Vector DB Retrieval at Scale',
      '04:15 PM — Panel Discussion & Fireside Q&A'
    ],
    status: 'active'
  },
  {
    id: 'evt-102',
    title: 'Modern UI/UX Design System Workshop',
    category: 'Design & UX',
    description: 'Master micro-interactions, dark mode aesthetics, and scalable design token architecture in Figma & Code.',
    longDescription: 'A practical, hands-on workshop tailored for UI/UX designers and frontend developers aiming to create high-converting, accessible, and visually captivating design systems that scale effortlessly.',
    date: 'Nov 02, 2026',
    time: '2:00 PM - 6:00 PM IST',
    location: 'Online Live Interactive Studio (Zoom)',
    isOnline: true,
    priceGeneral: 29,
    priceVIP: 79,
    totalSeats: 100,
    availableSeats: 8,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80',
    organizer: 'PixelCraft Academy',
    speaker: {
      name: 'Marcus Vance',
      role: 'Head of Product Design @ CraftUI',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    agenda: [
      '02:00 PM — Principles of Premium Dark-Mode Aesthetics',
      '03:15 PM — Building Dynamic Glassmorphism & Token Systems',
      '04:30 PM — Live Figma-to-Code Design Token Export Lab',
      '05:30 PM — Portfolio Reviews & Q&A'
    ],
    status: 'active'
  },
  {
    id: 'evt-103',
    title: 'SaaS Product Scaling & Growth Masterclass',
    category: 'Business',
    description: 'Strategies for scaling B2B SaaS ARR from $100k to $10M+, retention loops, and product-led growth.',
    longDescription: 'Discover proven frameworks used by fast-growing SaaS tech companies to drive user acquisition, slash churn, optimize pricing tiers, and automate sales pipelines.',
    date: 'Nov 10, 2026',
    time: '4:00 PM - 8:00 PM IST',
    location: 'WeWork Innovation Center, Sector 62 & Virtual',
    isOnline: false,
    priceGeneral: 89,
    priceVIP: 199,
    totalSeats: 80,
    availableSeats: 45,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    organizer: 'VentureScale Network',
    speaker: {
      name: 'Sarah Chen',
      role: 'Partner @ TechVentures & Ex-VP Growth',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    agenda: [
      '04:00 PM — Unlocking Product-Led Growth (PLG) Funnels',
      '05:15 PM — Unit Economics: LTV/CAC Optimization',
      '06:30 PM — Investor Pitching & Round B Fundraising',
      '07:30 PM — VIP Networking Cocktail Session'
    ],
    status: 'active'
  },
  {
    id: 'evt-104',
    title: 'Full-Stack Web Performance & Edge Architecture',
    category: 'Workshops',
    description: 'Learn serverless edge functions, instant streaming SSR, and micro-frontend optimization.',
    longDescription: 'Deep-dive technical workshop focusing on web vitals optimization, distributed caching strategies, SQLite at the edge, and zero-bundle size React Server Components.',
    date: 'Nov 18, 2026',
    time: '11:00 AM - 4:00 PM IST',
    location: 'Digital Node Hub & YouTube Stream',
    isOnline: true,
    priceGeneral: 35,
    priceVIP: 85,
    totalSeats: 200,
    availableSeats: 120,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    organizer: 'DevOps & Web Alliance',
    speaker: {
      name: 'Alex Rivera',
      role: 'Staff Infrastructure Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    agenda: [
      '11:00 AM — Sub-100ms Global Web Vitals Masterclass',
      '12:30 PM — Edge Database Routing & Cache Invalidation',
      '02:00 PM — Hands-on Code Audit & Profiling Session'
    ],
    status: 'active'
  },
  {
    id: 'evt-105',
    title: 'Creative Coding & Interactive Visuals Festival',
    category: 'Music & Art',
    description: 'An immersive celebration of generative art, WebGL shaders, live audiovisual performances, and 3D design.',
    longDescription: 'Experience the convergence of technology and digital art. Featuring interactive 3D installations, live algorithmic music generation, and shader programming sessions.',
    date: 'Nov 25, 2026',
    time: '6:00 PM - 11:00 PM IST',
    location: 'ArtTech Arena, Creative District',
    isOnline: false,
    priceGeneral: 59,
    priceVIP: 149,
    totalSeats: 120,
    availableSeats: 0,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    organizer: 'SynthMedia Labs',
    speaker: {
      name: 'Sora Takahashi',
      role: 'Generative Artist & WebGL Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    agenda: [
      '06:00 PM — Doors Open & Interactive Light Installations',
      '07:30 PM — Live Shader Coding Competition',
      '09:00 PM — Audiovisual Generative DJ Set'
    ],
    status: 'sold_out'
  },
  {
    id: 'evt-106',
    title: 'Cybersecurity & Cloud Threat Defense Summit',
    category: 'Tech & AI',
    description: 'Zero-Trust Architecture, Kubernetes Security Posture, and AI-driven Threat Intelligence.',
    longDescription: 'Comprehensive threat mitigation summit for cloud security architects, ethical hackers, and devsecops teams covering cloud infrastructure vulnerability detection.',
    date: 'Dec 05, 2026',
    time: '9:30 AM - 4:30 PM IST',
    location: 'SecureCloud Center & Virtual Pass',
    isOnline: false,
    priceGeneral: 65,
    priceVIP: 155,
    totalSeats: 100,
    availableSeats: 62,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
    organizer: 'CyberShield Global',
    speaker: {
      name: 'David K. Miller',
      role: 'Chief Information Security Officer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    },
    agenda: [
      '09:30 AM — Cloud Attack Vector Analysis 2026',
      '11:00 AM — Zero-Trust Identity & Access Verification',
      '01:30 PM — Simulated Red Team vs. Blue Team Live Capture-The-Flag'
    ],
    status: 'active'
  }
];
