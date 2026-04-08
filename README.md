<div align="center">
  <img src="public/hero image.png" alt="Interactive Wall Calendar" width="800" style="border-radius: 12px; margin-bottom: 24px;">

  # Interactive Wall Calendar
  
  **Frontend Engineering Challenge Submission**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Framer](https://img.shields.io/badge/Framer_Motion-11-f51197?style=flat-square&logo=framer)](https://www.framer.com/motion/)
  [![GSAP](https://img.shields.io/badge/GSAP-React-88CE02?style=flat-square&logo=greensock)](https://greensock.com/)
</div>

<br />

## Overview
This repository contains my submission for the Frontend Engineering Challenge. The objective was to build a polished, highly interactive React calendar component inspired by the layout and tactile feel of a physical wall calendar. 

The application focuses on a strong visual hierarchy, seamless date-range selection, and an integrated contextual notes system while remaining strictly frontend-focused per the challenge requirements.

## Core Features

- **Physical Wall Calendar Layout**: The user interface is anchored by a dynamic hero section that mimics a hanging wall calendar, complete with a responsive spiral binding indicator and 3D parallax effects tracking cursor movement.
- **Date Range Selection**: Full support for selecting start and end dates. The grid clearly highlights boundaries and intermediate days, with separate logic for weekend coloring and disabled out-of-month dates.
- **Contextual Notes System**: An integrated notepad allowing users to save notes. The internal logic adapts contextually: it defaults to a general month memo but immediately shifts to date-specific or range-specific notes when calendar days are selected.
- **Responsive Architecture**: The layout is engineered to support both expansive desktop environments (utilizing a side-by-side structure) and constrained mobile devices (elegantly collapsing into a stacked, touch-friendly grid).
- **Dark Mode Support**: Full theme toggling built directly into the Tailwind configuration.

## Technical Architecture & Constraints

As requested by the evaluation criteria, no backend or database was used. 

- **State Management**: Handled via `Zustand`. Data persistence across reloads (including the notes functionality) is securely managed through client-side `localStorage`.
- **Animation Strategy**: A hybrid approach was taken to maximize performance. `GSAP` orchestrates the master entrance timeline to avoid layout thrashing during the initial load, while `Framer Motion` handles the continuous, physics-based interactions (such as the 3D card tilt and hover states).
- **Styling**: Implemented exclusively with Tailwind CSS v4, utilizing custom CSS variables to handle the glassmorphism and theme switching without heavy boilerplate.

## Setup & Local Development

Node.js is required to run the development server.

1. **Clone the repository**
   ```bash
   git clone https://github.com/AyanAhmedKhan/tuf-calendar-challenge.git
   cd tuf-calendar-challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the localized server**
   ```bash
   npm run dev
   ```

4. **View the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Submission Details
- **Video Demonstration**: [Insert Video Link Here]
- **Live Demo**: [https://tuf-omega.vercel.app/](https://tuf-omega.vercel.app/)

All feedback is welcome. Thank you for your time reviewing the code and component architecture.
