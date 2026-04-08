# 🗓️ Interactive Wall Calendar — Premium UI Component

A stunning, production-quality interactive calendar component that replicates a physical wall calendar aesthetic with modern web technologies.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple?logo=framer)

---

## ✨ Features

### Core
- **Wall Calendar Aesthetic** — Hero mountain image with wave divider, spiral binding decoration
- **Date Range Selector** — Click to select start & end dates with visual range highlighting
- **Integrated Notes System** — Per-day, per-range, and per-month notes with localStorage persistence
- **Fully Responsive** — Desktop side-by-side layout gracefully collapses to mobile stacked view

### Animations & Effects
- 🌊 **Parallax Scrolling** — Hero image moves at a different rate than content
- ☁️ **Floating Clouds** — Animated cloud overlays with parallax offsets
- 🎬 **Page Flip Animation** — 3D rotateY transition when changing months
- 🎯 **Staggered Grid Reveal** — Calendar days appear one-by-one with spring physics
- ✨ **3D Tilt Effect** — Card tilts toward cursor with specular highlight
- 🎨 **Animated Gradient Border** — Subtle rotating conic gradient glow

### Premium UX
- 🌙 **Dark/Light Theme** — Animated toggle with spring rotation, persisted in localStorage
- 📅 **Indian Holiday Markers** — 20+ public holidays with collapsible legend
- ⌨️ **Keyboard Navigation** — Arrow keys to change months
- 📱 **Swipe Gestures** — Swipe left/right on mobile to navigate months
- 💾 **Full Persistence** — All notes and theme preference stored in localStorage
- ⚡ **Skeleton Loading** — Shimmer effect during initial load
- 🔍 **Hover Preview Range** — See the range before committing the second click

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd tuf

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Inter font & SEO meta
│   ├── page.tsx            # Main page rendering WallCalendar
│   └── globals.css         # Design system: tokens, glassmorphism, animations
├── components/
│   ├── WallCalendar.tsx    # Main orchestrator component
│   ├── CalendarHero.tsx    # Parallax hero image with floating clouds
│   ├── CalendarGrid.tsx    # Month grid with staggered animation & selection
│   ├── CalendarNav.tsx     # Previous/Next/Today navigation
│   ├── NotesPanel.tsx      # Tabbed notes (Range / Day / Month)
│   ├── ThemeToggle.tsx     # Animated dark/light mode switch
│   ├── SpiralBinding.tsx   # Decorative spiral wire binding
│   ├── TiltCard.tsx        # 3D mouse-tracking tilt wrapper
│   ├── HolidayLegend.tsx   # Collapsible holiday list
│   └── CalendarSkeleton.tsx # Loading shimmer skeleton
└── store/
    └── calendarStore.ts    # Zustand store: state, actions, holidays, persistence
```

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Zustand** over Context | Minimal boilerplate, no provider wrapping, built-in devtools |
| **CSS custom properties** | Seamless dark mode via class toggle without Tailwind dark: prefix |
| **Glassmorphism** | Premium aesthetic matching Apple-level design language |
| **Spring physics** | Natural, organic feeling animations instead of linear easing |
| **localStorage** | Requirements specify no backend; client-side persistence is durable |

---

## 🎨 Design System

- **Glassmorphism** — `backdrop-filter: blur(20px)` with layered transparency
- **Animated gradients** — Conic gradient rotation on borders
- **Soft shadows** — Multi-layer box-shadows for depth
- **Typography** — Inter font with calculated weights and tracking
- **Color palette** — HSL-tuned blues, indigos, and warm ambers

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| **Desktop** (1024px+) | Side-by-side: Calendar + Notes in flexbox |
| **Tablet** (768-1024px) | Full-width stacked with larger touch targets |
| **Mobile** (<768px) | Vertically stacked, swipe navigation enabled |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous month |
| `→` | Next month |
| `Ctrl+Enter` | Save note |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 11
- **State**: Zustand
- **Icons**: Lucide React
- **Dates**: date-fns
- **Storage**: localStorage

---

## 📄 License

MIT
