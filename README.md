<div align="center">
  <img src="./public/hero%20image.png" alt="Interactive Wall Calendar" width="850" style="border-radius: 12px; margin-bottom: 24px;">

  # Interactive Wall Calendar
  
  **Frontend Engineering Challenge Submission**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=flat-square)](https://github.com/pmndrs/zustand)
  [![Framer](https://img.shields.io/badge/Physics-Framer_Motion-f51197?style=flat-square&logo=framer)](https://www.framer.com/motion/)
  [![GSAP](https://img.shields.io/badge/Animation-GSAP-88CE02?style=flat-square&logo=greensock)](https://greensock.com/)
</div>

<br />

## 📖 Overview
This repository contains my submission for the Frontend Engineering Challenge. The objective was to build a highly interactive, natively responsive React calendar component inspired by the layout and tactile constraints of a physical wall calendar. 

The application focuses heavily on complex edge cases associated with date calculation, visually rich interactions without sacrificing performance, and an integrated contextual note-taking system—all while remaining strictly frontend-focused per the challenge requirements.

---

## ⚡ Core Features

### 📅 Physical Wall Calendar Emulation
- **Cinematic Rendering**: Implements a staggering 3D tilt effect across the main component container that calculates mouse trajectories in real-time, simulating physical depth.
- **Dynamic Spiral Binding**: A responsive aesthetic binding component that programmatically mounts exactly 12 loops. The specific loop corresponding to the current active month physically displaces and triggers an accent glow as a contextual visual marker.
- **Image anchoring**: The topmost hero container utilizes CSS `clip-path` and dynamic constraints to resize flawlessly alongside grid density adjustments, anchoring the interface.

### 🎯 Intelligent Date Range Selection
- **Visual Pathfinding**: Complete support for `start` and `end` bounding dates. The grid evaluates mouse trajectories globally to dynamically style the "between" constraint states using connecting highlight bands.
- **UX Delineation**: Discrete rendering logic explicitly targets weekends (muted/darkened colors) versus weekdays, alongside dynamic month-lock constraints to disable out-of-scope date interactions efficiently.

### 📝 Context-Aware Notes System
- **State-Driven Memos**: An integrated side-panel that actively evaluates the selection state. If a single day is selected, it scopes notes to that date. If a broad range is highlighted, the notepad dynamically context-switches to intercept notes specifically for that timeframe.
- **Zero-Backend Persistence**: Safely serializes standard note inputs into a unified JSON blob and commits directly to `localStorage`, entirely avoiding server/database requirements.

### 📱 Flawless Responsiveness & Dark Mode
- **Responsive Geometry**: Evaluates window constraints to shift from an expansive horizontal layout into an elegant, stacked touch-friendly interface on mobile widths `(<768px)`, maintaining all click targets and hitboxes effortlessly.
- **Theme Engine**: Complete CSS-variable dark mode implementation that instantly swops primary color scales without re-rendering the layout.

---

## 🛠 Tech Stack

| Technology | Implementation Scope |
|------------|-----------------------|
| **Next.js 15** | Application framing, robust App Router structuring, and optimization pipelines (Image/Font). |
| **React 19** | Component architecture and isolated render-cycle processing. |
| **Tailwind CSS v4** | Granular utility styling leveraging the absolute latest CSS-first unocss engine framework. |
| **Zustand** | Centralized client-side state machine. Extremely lightweight provider replacing standard Redux overhead. |
| **Framer Motion** | Handled continuous physics. Applied strictly to real-time pointer constraints, spring dampening, and mouse mapping. |
| **GSAP (GreenSock)** | Dedicated specifically to orchestrating global, high-performance master entrance timelines targeting DOM nodes securely via `useGSAP`. |
| **Date-fns** | Localized date mathematics and localized string formatting. |

---

## 💡 Architectural Techniques Used

1. **Hybrid Animation Strategy**
   Relying solely on React state to trigger heavily staggered DOM entrances usually leads to crippling layout-thrashing on lower-end devices. Therefore, the architecture splits animation duties: `GSAP` manages the one-time, top-down entrance sequence by manipulating refs directly to keep the heavy lifting off the React render cycle, while `Framer Motion` handles pure isolated physics and continuous user-level interactivity constraints (hover states, spring bounds).

2. **Decoupled Global State**
   Instead of passing localized date, hover, and selection logic via intense prop-drilling within the Calendar context tree, `Zustand` was integrated. All contextual data—from the current viewed month pointer to the saved notes—are committed to a single unified store, resulting in $O(1)$ complexity lookups for any highly-nested grid cell.

3. **Client-Side Persistence Mapping**
   By leveraging `Zustand` hooks alongside `localStorage` event interceptors, the state logic hydrates the layout fully upon mount exactly as it previously existed. 

4. **CSS-Variable Driven Theme System**
   Rather than wrapping components in dense nested ternary operators for dark-mode rendering, standard Tailwind variables are explicitly decoupled. Switching theme boundaries automatically recalibrates `--background`, `--foreground`, and `--accent`, enforcing instantaneous layout transition.

---

## 🚀 Setup & Local Development

Node.js (v18+) is required to run the development server.

1. **Clone the repository**
   ```bash
   git clone https://github.com/AyanAhmedKhan/tuf-calendar-challenge.git
   cd tuf-calendar-challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **View the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📌 Submission Details
- **Video Demonstration**: [Insert Video Link Here]
- **Live Demo**: [https://tuf-omega.vercel.app/](https://tuf-omega.vercel.app/)
