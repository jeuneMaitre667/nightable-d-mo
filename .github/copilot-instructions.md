# NightTable — Copilot Instructions

## Project Overview
NightTable is a premium B2B2C SaaS platform for nightclub table reservations in Paris.
Stack: Next.js 14 (App Router), TypeScript, Supabase, Stripe, Tailwind CSS, OpenAI.
5 user roles: client, club, promoter, female_vip, admin.
Design: dark luxury aesthetic — gold (#C9973A) on near-black (#050508). No light mode.

---

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
- Never use .select('*') in production — always specify columns explicitly.

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
- Always use the design system tokens defined below.
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

---

## Role-based access — never forget
- client: can only access /dashboard/client/*
- club: can only access /dashboard/club/*
- promoter: can only access /dashboard/promoter/*
- female_vip: can only access /dashboard/vip/*
- admin: can access everything
- Always check role in middleware AND in Server Actions (defense in depth).

---

## Key business rules to always respect
- A reservation always requires a prepayment of 30-50% of the minimum.
- A promoter commission is only created after payment_intent.succeeded webhook.
- Dynamic price is always rounded to the nearest 25€.
- Promo codes are valid for 48 hours after the first click (cookie expiry).
- A table in 'reserved' or 'occupied' status can never be booked again for the same event.
- Insurance is optional (3€ if minimum < 500€ / 4€ if 500-1000€ / 5€ if > 1000€).
- NightTable Score: +5 attended / -10 no-show / -5 late cancel / min 0 / max 100.
- Resale commission: 5% for NightTable on every resale.
- Auction: only for Pro and Premium clubs, closes 2h before event start.
- Waitlist: notified client has 30 minutes to confirm before next in line is notified.

---

## Server Action Patterns — MANDATORY

### Standard structure for every Server Action
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const Schema = z.object({ ... })

export async function myAction(
  formData: FormData
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    // 1. Validate inputs
    const parsed = Schema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
      return { success: false, error: 'Données invalides' }
    }

    // 2. Check auth
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Non autorisé' }

    // 3. Check role if needed
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (profile?.role !== 'club') return { success: false, error: 'Accès refusé' }

    // 4. Business logic
    const { data, error } = await supabase.from('...').insert({ ... })
    if (error) return { success: false, error: 'Erreur serveur' }

    // 5. Revalidate cache
    revalidatePath('/dashboard/club/events')

    return { success: true, data }

  } catch (err) {
    console.error('[myAction]', err)
    return { success: false, error: 'Une erreur inattendue est survenue' }
  }
}
```

### Additional rules
- Always revalidatePath after a mutation that affects a cached page.
- Always log errors with action name as prefix: [actionName].
- Never use redirect() inside a try/catch — place it after the block.
- Always verify auth AND role in sensitive actions.
- Never trust a client-side ID without verifying ownership in Supabase.

---

## Performance Rules — MANDATORY

### Images
- Always use next/image with explicit width and height.
- Always add priority prop on above-the-fold images (hero, cover photos).
- Always add a descriptive alt — never alt="".
- Prefer webp or avif format.

### Data fetching
- Always parallelize independent fetches with Promise.all().
- Never waterfall fetch (fetch inside fetch) if data is independent.
- Always limit Supabase columns: .select('id, name, status') — never .select('*').

### Bundle
- Always dynamic import for heavy non-critical components:
```typescript
import dynamic from 'next/dynamic'
const FloorPlan = dynamic(() => import('@/components/floor-plan/FloorPlan'), {
  ssr: false // mandatory for Konva.js and any canvas component
})
```
- Always push 'use client' as low as possible in the component tree.

### Skeleton loading
- Always create a loading skeleton for pages with Supabase fetch.
- Skeleton must match the visual structure of the real content.
- Skeleton color: bg-[#12172B] animate-pulse.

---

## Security Rules — MANDATORY

### Validation
- Always validate inputs server-side with Zod in Server Actions,
  even if the form is already validated client-side.
- Always verify that the connected user owns the resource they are modifying —
  never trust a client-provided ID without Supabase ownership check.

### Sensitive data
- Never console.log user data, tokens, or keys.
- Never return full profile data from a public Server Action —
  return only the fields strictly needed.
- Always sanitize free-text inputs before DB insertion.

### Public API (/api/v1)
- Always verify X-NightTable-Key header before any processing.
- Always verify the key belongs to a club with subscription_tier = 'premium'
  and subscription_active = true.
- Rate limit: max 100 requests per minute per api_key.
- Never expose internal Supabase UUIDs in public API responses.

---

## Git Commit Rules — MANDATORY

Every commit message must follow this format:
[type]: [short description in French]

Allowed types:
- feat: nouvelle fonctionnalité
- fix: correction de bug
- chore: maintenance, config, dépendances
- style: changements UI/CSS sans logique métier
- refactor: réécriture sans changement de comportement
- docs: documentation uniquement
- test: ajout ou modification de tests

Correct examples:
- feat: ajouter dashboard promoteur avec métriques CA
- fix: corriger RLS sur client_profiles au signup
- chore: mettre à jour dépendances Stripe vers v14
- docs: synchroniser PROJECT_STATUS après session promoteur

Never:
- "update files"
- "fix bug"
- "wip"
- Generic English messages without context

---

## SEO Rules — Public pages only

### Mandatory metadata on each public page
```typescript
export const metadata: Metadata = {
  title: '[Page title] | NightTable',
  description: '[Description 150 chars max]',
  openGraph: {
    title: '[Title]',
    description: '[Description]',
    image: '[Club or event image URL]',
    type: 'website',
  },
}
```

### Pages concerned
- / (landing)
- /clubs (club list)
- /clubs/[slug] (club page)
- /clubs/[slug]/events/[eventId] (event page)

### Rules
- Always use generateMetadata() dynamic function for [slug] and [eventId] pages.
- Title format: "Réserver une table au [Club] — NightTable Paris"
- Always include og:image (club or event photo).
- Always add noindex on dashboard pages:
  export const metadata = { robots: 'noindex' }

---

## Empty States — MANDATORY

Every list or data display must handle 3 states:

1. LOADING — animate-pulse skeleton matching real content structure
2. ERROR — error message + "Réessayer" button
3. EMPTY — icon + message + actionable CTA

NightTable empty state standard:
- Large icon in gold (30% opacity)
- Title: "[Entity] à venir" or "Aucun[e] [entity] pour le moment"
- Subtitle: short encouragement message
- Primary gold CTA button

Examples:
- No events → "Créez votre première soirée" + "Créer un événement" button
- No reservations → "Aucune réservation ce soir" + "Voir les événements" button
- No promoters → "Ajoutez votre premier promoteur" + "Ajouter" button

Never leave an empty state without a CTA.
Every dead end must guide the user to the next action.

---

## Auto-Documentation Rules — MANDATORY

Every time you create, modify, or fix ANY file in this project,
you MUST update these 3 files in the same response. No exceptions.

### 1. docs/errors/ERROR_LOG.md
Update when: a bug is fixed, an error is handled, a workaround is added.

Format to append:
```
---
**[DATE] — [ERROR TITLE]**
- File(s) affected: `path/to/file.ts`
- Error: [exact error message or behavior]
- Root cause: [why it happened]
- Fix applied: [what was changed]
- Status: ✅ Resolved
---
```

### 2. docs/PROJECT_STATUS.md
Update after EVERY coding session or feature addition.

Sections to keep current:
- **Done**: move completed items here with ✅
- **In progress**: what is currently being built
- **Todo**: upcoming tasks in priority order
- **Session log**: append one line per session:
  [DATE] — [what was built or fixed] — [current blockers if any]

### 3. CHANGELOG.md
Update when: any file is created, modified, or deleted.

Format to append under ## Unreleased:
```
### Added
- [filename or feature]: [one line description]

### Changed
- [filename or feature]: [what changed and why]

### Fixed
- [filename or feature]: [bug description + fix summary]
```

### Enforcement
- Never finish a response that touches code without updating all 3 files.
- If a file does not exist yet, create it with the correct structure.
- If you are only answering a question without touching code, skip the updates.
- Always update docs AFTER the code changes, not before.
- Keep entries concise — one line per file touched is enough.

---

## Component Development Rules — MANDATORY

Every time you create or modify a UI component, follow this full process.

### Step 1 — Reference component.gallery
Before writing any component code, identify the component type and reference:
https://component.gallery/components/

Map your component to one of these categories:
- Form inputs → /components/text-input /components/select /components/checkbox
- Navigation → /components/tabs /components/breadcrumb /components/pagination
- Feedback → /components/toast /components/badge /components/progress-bar
- Overlay → /components/modal /components/popover /components/tooltip
- Layout → /components/accordion /components/card /components/divider
- Data → /components/table /components/list /components/avatar
- Media → /components/carousel /components/image

### Step 2 — Reference design systems for NightTable aesthetic
- IBM Carbon Design System → data tables, dashboards, dense UIs
- Atlassian Design System → forms, modals, feedback components
- Shopify Polaris → cards, badges, navigation patterns
- Radix UI → accessibility patterns, overlays, popovers

Always adapt to NightTable dark luxury aesthetic — never copy light mode patterns.

### Step 3 — Component structure to always follow

Every component file must include:

**1. COMPONENT HEADER** (comment at top of file):
```typescript
// Component: [Name]
// Reference: component.gallery/components/[type]
// Inspired by: [design system name] pattern
// NightTable usage: [where it is used in the app]
```

**2. PROPS INTERFACE** — fully typed, no `any`:
- Always include className?: string for composability
- Always include children?: React.ReactNode if wrappable
- Document each prop with a JSDoc comment

**3. VARIANTS** — define all visual states:
- default, hover, focus, active, disabled, loading, error
- Use NightTable design tokens only (no raw Tailwind colors)

**4. ACCESSIBILITY** — always include:
- Correct ARIA attributes (aria-label, aria-expanded, role...)
- Keyboard navigation (Enter, Space, Escape, Arrow keys)
- Focus visible styles: ring-2 ring-[#C9973A] ring-offset-2 ring-offset-[#050508]
- Minimum touch target 44x44px on mobile

**5. ANIMATION** — always include:
- transition-all duration-200 ease-in-out minimum
- No animation over 300ms
- Respect prefers-reduced-motion:
  @media (prefers-reduced-motion: reduce) { transition: none }

### Step 4 — NightTable Design Tokens

```css
--color-bg-primary:   #050508
--color-bg-secondary: #0A0F2E
--color-bg-card:      #12172B
--color-gold:         #C9973A
--color-gold-light:   #E8C96A
--color-rose:         #C4567A
--color-blue:         #3A6BC9
--color-green:        #3A9C6B
--color-text-primary: #F7F6F3
--color-text-muted:   #888888
```

### Step 5 — Component checklist before finishing
```
[ ] Fully typed props interface — no `any`
[ ] All visual states handled (default/hover/focus/disabled/loading/error)
[ ] 'use client' only if strictly necessary
[ ] No hardcoded colors — only NightTable palette
[ ] ARIA attributes present
[ ] Keyboard navigation handled
[ ] Mobile touch targets >= 44x44px
[ ] Transition/animation present
[ ] prefers-reduced-motion respected
[ ] Component header comment present
[ ] No default Tailwind colors (no blue-500, red-400, gray-100...)
[ ] CHANGELOG.md updated with new component entry
```

---

## Common NightTable Components — Quick Reference

### Button
```
variants: primary (gold fill) | secondary (gold border) | ghost | danger (rose)
sizes: sm | md | lg
states: default | hover | focus | loading (gold spinner) | disabled
primary: bg-[#C9973A] text-[#050508] font-semibold
secondary: border border-[#C9973A] text-[#C9973A] bg-transparent
hover: brightness-110 + subtle gold glow shadow
disabled: opacity-50 cursor-not-allowed pointer-events-none
```

### Card
```
variants: default | elevated | bordered | interactive
always: bg-[#12172B] border border-[#C9973A]/15 rounded-xl p-6
hover (interactive): border-[#C9973A]/40 shadow-[0_4px_24px_rgba(201,151,58,0.08)]
transition: transition-all duration-200
```

### Badge
```
variants:
  available: bg-[#3A9C6B]/15 text-[#3A9C6B] border border-[#3A9C6B]/30
  reserved:  bg-[#C9973A]/15 text-[#C9973A] border border-[#C9973A]/30
  cancelled: bg-[#C4567A]/15 text-[#C4567A] border border-[#C4567A]/30
  pending:   bg-[#888888]/15 text-[#888888] border border-[#888888]/30
size: text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full
```

### Input
```
always: bg-[#0A0F2E] border border-[#2A2F4A] text-[#F7F6F3] rounded-lg
label: text-[11px] uppercase tracking-widest text-[#888888] mb-1
focus: border-[#C9973A] ring-2 ring-[#C9973A]/15 outline-none
error: border-[#C4567A] ring-2 ring-[#C4567A]/15
disabled: opacity-50 cursor-not-allowed bg-[#12172B]
```

### Modal
```
overlay: fixed inset-0 bg-black/70 backdrop-blur-sm z-50
content: bg-[#12172B] border border-[#C9973A]/20 rounded-2xl p-6 max-w-lg w-full
close: top-right X button + close on overlay click + close on Escape key
animation: scale-95 opacity-0 → scale-100 opacity-100 duration-200
```

### Toast / Notification
```
position: fixed top-4 right-4 z-50 flex flex-col gap-2
variants:
  success: border-l-4 border-[#3A9C6B] bg-[#12172B]
  error:   border-l-4 border-[#C4567A] bg-[#12172B]
  info:    border-l-4 border-[#C9973A] bg-[#12172B]
auto-dismiss: 4000ms
animation: slide-in from right, fade-out on dismiss
max visible at once: 3 (stack, oldest auto-dismissed first)
```

### Table
```
container: w-full border border-[#C9973A]/10 rounded-xl overflow-hidden
header: bg-[#0A0F2E] text-[#888888] text-xs uppercase tracking-widest py-3 px-4
rows: alternating bg-[#12172B] / bg-[#0A0F2E]
hover row: bg-[#C9973A]/5 transition-colors duration-150
border between rows: border-b border-[#C9973A]/5
```

### Tabs
```
container: border-b border-[#2A2F4A]
tab active: text-[#C9973A] border-b-2 border-[#C9973A] font-medium
tab inactive: text-[#888888] hover:text-[#F7F6F3]
transition: transition-all duration-200
```

### Tooltip / Popover
```
bg: bg-[#12172B] border border-[#C9973A]/20 rounded-lg p-3 shadow-xl
text: text-[#F7F6F3] text-sm
arrow: border-[#C9973A]/20
delay: 300ms on hover appearance
z-index: z-50
```

### Sidebar (dashboard navigation)
```
container: bg-[#0A0F2E] border-r border-[#C9973A]/10 w-64 min-h-screen
logo area: border-b border-[#C9973A]/10 p-6
nav item inactive: text-[#888888] hover:text-[#F7F6F3] hover:bg-[#C9973A]/5
nav item active: text-[#C9973A] bg-[#C9973A]/8 border-l-2 border-[#C9973A]
transition: transition-all duration-150
mobile: collapses to bottom tab bar (max 5 items) with icons only
```

### Skeleton
```
base: bg-[#12172B] animate-pulse rounded
text line: h-4 w-full rounded mb-2
title: h-6 w-3/4 rounded mb-4
card: h-32 w-full rounded-xl
avatar: h-10 w-10 rounded-full
```

### Floor Plan (Konva.js)
```
canvas background: #0A0F2E
table available: stroke #C9973A strokeWidth 1.5 fill transparent
table reserved:  fill #2A2F4A stroke #444
table occupied:  fill #1A2A1A stroke #3A9C6B
table selected:  fill #C9973A stroke #C9973A (text dark)
table promo:     stroke #C4567A fill transparent
table size: 80x60px rounded corners (cornerRadius 8)
tooltip on hover: dark card with name, capacity, price
mode booking: only 'available' tables are clickable
mode edit: drag & drop enabled, callback onPositionChange
```

---

## Token Optimization Rules — MANDATORY

### Model selection
Use the right model for each task — never default to the most powerful:

- GPT-4o        → generate full components, Server Actions, debug standard bugs
- GPT-4o mini   → rename, reformat, small fixes, simple questions
- Claude Sonnet → complex bugs, full feature architecture, deep reasoning
- o1            → last resort only — logic bugs in pricing, commissions, algorithms

### Prompt discipline
- Always target a single file or function per prompt — never ask to
  regenerate multiple files at once
- Always specify the exact file path and line number when fixing a bug:
  "Dans src/lib/reservation.actions.ts ligne 67, corrige uniquement..."
- Never use vague prompts: "refais le dashboard", "améliore le code"
- Always describe the expected behavior AND the observed behavior when debugging

### # file: usage — load only what is strictly necessary
- # file:BUSINESS_RULES.md     → business logic, commissions, pricing, roles
- # file:DESIGN_SYSTEM.md      → any UI component creation or modification
- # file:ARCHITECTURE.md       → new file creation, folder structure questions
- # file:copilot-instructions.md → only if rules themselves are in question
- Never load all 4 files at once unless the task genuinely requires all of them

### Context hygiene
- Close all VSCode tabs not related to the current task before prompting
  (Copilot reads all open tabs as context)
- When working on a module, keep open only:
  the target file + its direct dependencies + the relevant .md rule file

### Inline vs Chat
- Use inline autocompletion (Ctrl+I / Cmd+I on selection) for:
  renaming, reformatting, completing a started function, small corrections
- Use Chat only for:
  generating full files, debugging, architectural questions
- Inline consumes far fewer tokens than Chat — default to inline first

### Prompt templates by task type

Bug fix:
"Dans [filepath] ligne [N], [observed behavior] au lieu de [expected behavior].
Corrige uniquement cette fonction en respectant les règles du projet."

New component:
"# file:DESIGN_SYSTEM.md
Crée [ComponentName] dans [filepath].
Usage: [where it is used].
Props: [list].
Variants: [list]."

New Server Action:
"# file:BUSINESS_RULES.md
Crée [actionName] dans [filepath].
Règles métier à respecter: [specific rules from BUSINESS_RULES.md].
Retourne { success, data, error }."

Architecture question:
"# file:ARCHITECTURE.md
[Question précise sur la structure ou l'organisation du code]"

---

## Responsive & Visual Consistency Rules — MANDATORY

Every time you create or modify a page or component, you MUST
ensure perfect rendering on both web and mobile. No exceptions.

---

### Breakpoints — always use these exact values
- Mobile  : default (no prefix) — 0 to 767px
- Tablet  : md: — 768px to 1023px
- Desktop : lg: — 1024px and above

Never use sm: as a primary breakpoint — design mobile first,
then adapt for md: and lg:

---

### Layout rules by screen size

**Sidebar**
- Desktop (lg:) : visible, fixed left, width 200px, full height
- Mobile/Tablet  : hidden, replaced by bottom tab bar
  Bottom tab bar : fixed bottom-0, bg-[#111318],
  border-t border-white/5, flex justify-around
  Max 5 items with icon + label 10px, height 64px
  Safe area : pb-safe or pb-4 for iPhone notch

**Page container**
- Desktop : margin-left 200px (sidebar width), padding 32px
- Tablet  : margin-left 0, padding 24px
- Mobile  : margin-left 0, padding 16px

**Metric cards grid**
- Desktop : grid-cols-4
- Tablet  : grid-cols-2
- Mobile  : grid-cols-2 (smaller) or grid-cols-1 if content heavy

**Two-column layouts (chart + sidebar)**
- Desktop : flex-row, chart 60% / panel 40%
- Tablet  : flex-row, chart 55% / panel 45%
- Mobile  : flex-col, chart full width first, panel below

**Tables**
- Desktop : all columns visible
- Tablet  : hide 1-2 less important columns
- Mobile  : never use full table — use card list instead
  Each row becomes a Card with the key info stacked vertically
  Always show : client name + main amount + status badge
  Hide : secondary columns (canal, zone description, etc.)

**Modals**
- Desktop : centered, max-width 480px, rounded-xl
- Mobile  : bottom sheet style
  position fixed bottom-0, width full, rounded-t-xl
  max-height 85vh, overflow-y-auto
  drag handle at top : w-10 h-1 bg-white/20 rounded-full mx-auto mb-4

**Forms**
- Desktop : can be 2 columns for related fields (prénom + nom)
- Mobile  : always single column, never 2 columns
- Input height : always min-h-[48px] on mobile (touch target)
- Button height : always min-h-[48px] on mobile

**Navigation in page (Tabs)**
- Desktop : horizontal tabs, all visible
- Mobile  : scrollable horizontal tabs, overflow-x-auto
  scrollbar hidden : [&::-webkit-scrollbar]:hidden

---

### Typography scaling

**Page titles**
- Desktop : text-xl (20px)
- Mobile  : text-lg (18px)

**Cormorant metric numbers**
- Desktop : text-4xl (36px)
- Mobile  : text-2xl (24px)

**Body text**
- Desktop : text-sm (14px)
- Mobile  : text-sm (14px) — never go below 13px on mobile

**Labels uppercase**
- Desktop : text-[11px]
- Mobile  : text-[10px]

---

### Touch targets — MANDATORY on mobile
- Every clickable element : min-h-[44px] min-w-[44px]
- Buttons : always h-11 or h-12 on mobile
- Table row actions : use dropdown menu on mobile instead
  of multiple inline buttons
- Never place two tap targets closer than 8px apart on mobile

---

### Images & media
- Always next/image with explicit width and height
- Always fill + object-cover inside a relative container
- Always add priority on above-the-fold images
- Club cover photos : aspect-video (16/9) desktop,
  aspect-[4/3] mobile
- Avatar : always fixed size, never % based

---

### Performance — mandatory on every page

**Server Components first**
- Every page.tsx must be a Server Component by default
- Only extract 'use client' for the interactive parts
- Example : page.tsx fetches data (server),
  PageClient.tsx handles interactions (client)

**Data fetching**
- Always Promise.all() for independent parallel fetches
- Always add loading.tsx next to every page.tsx
- Always add error.tsx next to every page.tsx
- Skeleton must match the exact structure of the real content

**Images**
- Always lazy load below-the-fold images (default next/image behavior)
- Always priority on hero images

**Bundle**
- Always dynamic import for heavy components :
  const FloorPlan = dynamic(() => import('@/components/floor-plan/FloorPlan'),
  { ssr: false })
  const BarChart = dynamic(() => import('@/components/charts/RevenueChart'),
  { ssr: false })

**Animations**
- Always add : @media (prefers-reduced-motion: reduce) {
    transition: none !important; animation: none !important
  }
- Never animate on mobile if it causes layout shift

---

### Consistency checklist — before finishing any page

RESPONSIVE :
[ ] Page tested mentally at 375px (iPhone SE) — nothing overflows
[ ] Page tested mentally at 768px (iPad) — layout adapts correctly
[ ] Page tested mentally at 1280px (desktop) — full layout visible
[ ] Sidebar replaced by bottom tab bar on mobile
[ ] Tables converted to card list on mobile
[ ] Modals converted to bottom sheet on mobile
[ ] All tap targets >= 44x44px on mobile
[ ] Forms single column on mobile
[ ] No horizontal scroll on mobile (except intentional carousels)

PERFORMANCE :
[ ] Page is a Server Component
[ ] loading.tsx exists next to the page
[ ] error.tsx exists next to the page
[ ] Promise.all() used for parallel fetches
[ ] Heavy components (Konva, recharts) use dynamic import
[ ] All images use next/image with width + height

VISUAL CONSISTENCY :
[ ] Same sidebar on all dashboard pages
[ ] Same header structure (title left, actions right)
[ ] Same card style bg-[#1A1D24] border border-white/5
[ ] Same table style (header 11px uppercase, rows border-b white/5)
[ ] Same button style (primary gold, secondary bordered)
[ ] Same color for same status across all pages
[ ] Same spacing rhythm (padding 16px mobile, 24px tablet, 32px desktop)

---

### Mobile-specific components to always create

When a page has a Table, always create TWO versions :
1. Desktop table : hidden on mobile (hidden md:block)
2. Mobile card list : visible on mobile only (block md:hidden)

Mobile card list structure :
<div className="flex flex-col gap-3 md:hidden">
  {items.map(item => (
    <div className="bg-[#1A1D24] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar size="sm" />
          <div>
            <p className="text-sm font-medium text-[#F7F6F3]">{name}</p>
            <p className="text-xs text-[#888]">{subtitle}</p>
          </div>
        </div>
        <Chip size="sm" variant="flat">{status}</Chip>
      </div>
      <div className="flex justify-between text-sm mt-2">
        <span className="text-[#888]">{label}</span>
        <span className="text-[#F7F6F3] font-medium">{value}</span>
      </div>
    </div>
  ))}
</div>

When a page has a Modal, always add mobile bottom sheet behavior :
className="fixed bottom-0 md:relative md:bottom-auto
           w-full md:max-w-lg rounded-t-2xl md:rounded-xl"
