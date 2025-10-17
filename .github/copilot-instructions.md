# Copilot Instructions for RideX-Frontend

## Project Overview
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS, PostCSS
- **UI Components:** Custom components in `src/components/ui/` and shared elements in `src/components/Shared/`
- **Assets:** Images and JSON files in `src/Assets/` and `public/`
- **Routing:** Pages and layouts organized under `src/app/` with nested routes for features (e.g., dashboard, rider, user)

## Key Workflows
- **Development:**
  - Start dev server: `npm run dev` (default port 3000)
  - Hot reload is enabled for all changes in `src/app/`
- **Build:**
  - Production build: `npm run build`
  - Static assets: Place in `public/` or `src/Assets/`
- **Linting:**
  - Configured via `eslint.config.mjs`
- **Styling:**
  - Tailwind config: `tailwind.config.js`
  - Global styles: `src/app/globals.css`

## Architectural Patterns
- **App Structure:**
  - Each feature (e.g., dashboard, rider, user) is a folder under `src/app/` with its own `page.jsx` and sometimes `layout.jsx`.
  - Shared hooks in `src/app/hooks/` (e.g., `AuthProvider.jsx`, `ProtectedRoute.jsx`).
  - UI primitives in `src/components/ui/` (e.g., `button.jsx`, `table.jsx`).
- **Component Conventions:**
  - Use functional components and hooks.
  - Shared logic/components live in `Shared/` or `hooks/`.
  - Feature-specific components are nested under their respective route folders.
- **Auth & Routing:**
  - Auth logic in `src/app/hooks/` (see `AuthProvider.jsx`).
  - Route protection via `ProtectedRoute.jsx` and `GuestOnlyRoute.jsx`.

## Integration Points
- **External:**
  - No backend API integration details found in README; check feature folders for fetch/axios usage.
- **Fonts:**
  - Uses `next/font` for optimized font loading (see README).

## Project-Specific Conventions
- **File Naming:**
  - Use `.jsx` for React components, `.js` for utilities/config.
  - Page entry points are always `page.jsx`.
- **Component Organization:**
  - UI primitives in `ui/`, shared logic in `Shared/`, feature components under their route.
- **Assets:**
  - Images and JSON assets in `src/Assets/` and `public/`.

## Example Patterns
- **Dashboard Feature:**
  - `src/app/dashboard/` contains both admin and user dashboard logic, with further subfolders for features (e.g., `admin/promotions-discounts/`).
- **Hooks Usage:**
  - Custom hooks for theme/context in `src/app/hooks/themeContext.js`, `useTheme.js`.

## How to Extend
- Add new features by creating a folder under `src/app/` with a `page.jsx`.
- Add new UI primitives to `src/components/ui/`.
- Use shared hooks/components for cross-cutting concerns.

---

_If any section is unclear or missing, please provide feedback to improve these instructions._
