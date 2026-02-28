## NightTable — UI/UX Design System

### Positioning
NightTable is a premium VIP nightclub table reservation platform for Paris.
The UI must feel like a luxury concierge service, NOT a mass ticketing app.
Every design decision should communicate: exclusivity, trust, desirability.

### Color Palette
- Background primary: #050508 (near black)
- Background secondary: #0A0F2E (deep navy)
- Background cards: #12172B (elevated dark)
- Gold accent (primary CTA, headings, borders): #C9973A
- Gold light (hover states): #E8C96A
- Rose accent (female VIP module only): #C4567A
- Blue accent (info, promoter module): #3A6BC9
- Green accent (success, confirmed): #3A9C6B
- Text primary: #F7F6F3 (warm white)
- Text muted: #888888
- Never use pure white #FFFFFF or pure black #000000

### Typography
- Headings (H1, H2, club names, event titles): Cormorant Garamond — serif, elegant, editorial
- Body, UI labels, buttons, navigation: DM Sans — clean, modern, readable
- Monospace (prices, codes, data): use font-variant-numeric: tabular-nums on DM Sans
- Heading sizes: H1 48px / H2 32px / H3 24px / H4 18px
- Body: 16px, line-height 1.6

### Core Design Principles
1. Dark first — every screen is dark. Light mode does not exist.
2. Gold is sacred — use it only for: primary CTAs, active states, prices, key highlights. Never decorative.
3. Generous spacing — padding and margins should feel luxurious. min padding-x: 24px on mobile, 48px on desktop.
4. No generic components — no Bootstrap, no default Tailwind colors. Everything is custom with the palette above.
5. Subtle depth — use box shadows and subtle gradients to create card elevation. Example: box-shadow: 0 4px 24px rgba(201, 151, 58, 0.08)
6. Micro-animations — smooth transitions (200-300ms ease) on hover, focus, and state changes. Nothing jarring.

### Component Styles

**Buttons**
- Primary: bg #C9973A, text #050508 (dark), font-weight 600, border-radius 6px, px-6 py-3
- Secondary: border 1px solid #C9973A, text #C9973A, transparent bg
- Danger: border 1px solid #C4567A, text #C4567A (female VIP / cancel actions)
- Hover: brightness increase + subtle glow shadow in gold

**Cards**
- bg: #12172B, border: 1px solid rgba(201, 151, 58, 0.15)
- border-radius: 12px, padding: 24px
- Hover: border-color rgba(201, 151, 58, 0.4), subtle gold shadow

**Inputs & Forms**
- bg: #0A0F2E, border: 1px solid #2A2F4A
- Focus: border-color #C9973A, ring: 0 0 0 3px rgba(201,151,58,0.15)
- Label: text-muted uppercase tracking-widest font-size 11px
- Error: border-color #C4567A

**Navigation / Sidebar**
- bg: #0A0F2E, border-right: 1px solid rgba(201,151,58,0.1)
- Active item: gold left border 3px + text gold + bg rgba(201,151,58,0.08)
- Inactive: text muted, hover text warm white

**Badges & Status**
- Available: #3A9C6B background with low opacity
- Reserved: #C9973A background with low opacity
- VIP Promo: #C4567A background with low opacity
- Sold out: #888888

**Price display**
- Always large, gold colored, Cormorant Garamond
- Show "À partir de" in muted small text above
- Dynamic price urgency indicator: small red dot + "Plus que X tables à ce prix"

### Page-Specific Guidelines

**Landing page**
- Full viewport hero with dark overlay on club photo
- Large Cormorant Garamond headline, gold CTA button
- Inspired by: Soho House website aesthetic

**Event / Club page**
- Event cover photo full width with gradient overlay bottom to top
- DJ lineup displayed as tags/chips in gold
- Table selection directly below — no extra clicks
- Inspired by: Tablelist USA event page structure

**Floor plan (table selection)**
- Dark canvas background (#0A0F2E)
- Tables as rounded rectangles: available (gold border), reserved (muted), selected (gold fill)
- Selected table shows price and capacity in a floating tooltip
- Inspired by: Resy floor plan UX

**Reservation tunnel**
- Step indicator at top (3 steps max: Table → Details → Payment)
- Minimal form fields — only what is strictly necessary
- Stripe payment element styled to match dark theme
- Inspired by: Doctolib booking flow clarity

**Club dashboard**
- Dense but readable — data-heavy screens need clear hierarchy
- Sidebar navigation (role-aware), main content area, optional right panel for details
- Use data tables with alternating row shading (#12172B / #0A0F2E)
- Inspired by: Linear / Notion dashboard structure

**Promoter dashboard**
- Hero metric cards at top: CA ce mois / Clients amenés / Commissions à venir
- Card style with large gold numbers (Cormorant Garamond 48px)
- Leaderboard table below with rank badges

**Female VIP module**
- Rose (#C4567A) replaces gold as the accent color throughout
- Softer, more editorial feel — larger photos, more whitespace
- Validation status badge prominent on profile

### Responsive Behavior
- Mobile first — most clients will reserve from their phone at night
- Sidebar collapses to bottom tab bar on mobile (max 5 items)
- Floor plan: pinch to zoom on mobile, fixed toolbar top
- All tap targets minimum 44x44px

### What to avoid
- No bright whites or light backgrounds anywhere
- No colorful gradients (no purple-to-pink, no rainbow)
- No rounded pill buttons (use border-radius 6px max)
- No stock photo illustrations or generic icons
- No default Tailwind blue (#3B82F6) anywhere — use #3A6BC9 instead
- No animations over 300ms
- Never show empty states without a clear CTA
