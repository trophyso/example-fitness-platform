# TrophyFitness - Example App

A Strava-lite fitness tracker built with Next.js and Trophy to demonstrate gamification features.

## Features

- **Activity Logging:** Track Run, Cycle, and Swim activities.
- **Leaderboards:** Weekly competition based on distance.
- **Profile:** XP progression, Levels, and Badges.
- **Dark Mode:** "Active Dark" theme.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** TailwindCSS + Shadcn/UI
- **Gamification:** Trophy SDK (`@trophyso/node`)

## Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file with your Trophy API Key:
   ```env
   TROPHY_API_KEY=your_api_key_here
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Folder Structure

- `app/actions.ts`: Server actions for Trophy integration.
- `app/leaderboards/`: Leaderboard pages.
- `app/profile/`: User profile and stats.
- `components/`: UI components (NavBar, Dialogs).
