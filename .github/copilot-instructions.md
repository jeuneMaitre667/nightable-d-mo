# NightTable — Copilot Instructions

## Project Overview
NightTable is a premium B2B2C SaaS platform for nightclub table reservations in Paris.
Stack: Next.js 14 (App Router), TypeScript, Supabase, Stripe, Tailwind CSS, OpenAI.

## Coding Rules — Always follow these

### TypeScript
- Always use strict TypeScript. Never use `any` — use `unknown` if type is uncertain.
- Always type function parameters and return values explicitly.
- Use Zod for all form validation and API input validation.
- Import types with `import type { X }` when it's a type-only import.

### Next.js 14 App Router
- Use Server Components by default. Only add 'use client' when strictly necessary
  (event handlers, hooks, browser APIs).
- Use Server Actions for all form submissions and mutations. Never use client-side fetch
  for mutations.
- Always use next/navigation (useRouter, redirect) — never next/router.
- Use next/image for all images with explicit width and height.
- Loading states: always create loading.tsx next to page.tsx for heavy pages.
- Error handling: always create error.tsx next to page.tsx.

### Supabase
- Browser client: import from '@/lib/supabase/client'
- Server client: import from '@/lib/supabase/server' (Server Actions and API Routes only)
- Never use the service role key on the client side.
- Always handle both `data` and `error` from Supabase calls.
- Use `.single()` only when you are certain the row exists — otherwise use `.maybeSingle()`.

### Stripe
- All Stripe calls happen server-side only.
- Always verify webhook signatures before processing events.
- Use Stripe's TypeScript types — never cast event.data.object manually.

### Error Handling
- Server Actions must return `{ success: boolean, error?: string, data?: T }`.
- Never throw errors in Server Actions — catch and return them.
- Always show user-friendly error messages, never raw Supabase/Stripe error strings.

### File naming
- Components: PascalCase (ReservationCard.tsx)
- Utilities/lib: camelCase (calculatePrice.ts)
- Types: PascalCase interfaces, camelCase for simple types
- API routes: always route.ts (never route.js)

### Styling
- Use only Tailwind utility classes. No inline styles except for dynamic values.
- Never use default Tailwind colors (blue-500, red-400...) — use our custom palette.
- Always use the design system from DESIGN_SYSTEM.md.
- Dark mode is the only mode — no light mode variants needed.

### Imports order
1. React / Next.js imports
2. Third-party libraries
3. Internal aliases (@/lib, @/components, @/types)
4. Relative imports
5. Type imports last

### Comments
- Write comments for complex business logic only (pricing engine, commission calculation).
- Never comment obvious code.
- Use TODO: and FIXME: tags for known issues.

## Role-based access — never forget
- client: can only access /dashboard/client/*
- club: can only access /dashboard/club/*
- promoter: can only access /dashboard/promoter/*
- female_vip: can only access /dashboard/vip/*
- admin: can access everything
- Always check role in middleware AND in Server Actions (defense in depth).

## Key business rules to always respect
- A reservation always requires a prepayment of 30-50% of the minimum.
- A promoter commission is only created after payment_intent.succeeded webhook.
- Dynamic price is always rounded to the nearest 25€.
- Promo codes are valid for 48 hours after the first click (cookie expiry).
- A table in 'reserved' or 'occupied' status can never be booked again for the same event.
- Insurance (3-5€) is optional but shown prominently at checkout.
## Auto-Documentation Rules — MANDATORY

Every time you create, modify, or fix ANY file in this project, 
you MUST update these 3 files in the same response. No exceptions.

---

### 1. docs/errors/ERROR_LOG.md
Update when : a bug is fixed, an error is handled, a workaround is added.

Format to append :
---
**[DATE] — [ERROR TITLE]**
- File(s) affected: `path/to/file.ts`
- Error: [exact error message or behavior]
- Root cause: [why it happened]
- Fix applied: [what was changed]
- Status: ✅ Resolved
---

### 2. docs/PROJECT_STATUS.md
Update after EVERY coding session or feature addition.

Sections to keep current :
- **Done** : move completed items here with ✅
- **In progress** : what is currently being built
- **Todo** : upcoming tasks in priority order
- **Session log** : append one line per session :
  [DATE] — [what was built or fixed] — [current blockers if any]

### 3. CHANGELOG.md
Update when : any file is created, modified, or deleted.

Format to append under ## Unreleased :
### Added
- [filename or feature] : [one line description]

### Changed  
- [filename or feature] : [what changed and why]

### Fixed
- [filename or feature] : [bug description + fix summary]

---

## Enforcement

- Never finish a response that touches code without updating all 3 files.
- If a file does not exist yet, create it with the correct structure.
- If you are only answering a question without touching code, skip the updates.
- Always update docs AFTER the code changes, not before.
- Keep entries concise — one line per file touched is enough. 