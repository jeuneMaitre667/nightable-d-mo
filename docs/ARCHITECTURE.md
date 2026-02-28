# NightTable — Architecture Technique

## 1. Vue d’ensemble

NightTable est une application web Next.js (App Router) pour la réservation de tables VIP.
Le système est organisé autour de 5 rôles:

- `client`
- `club`
- `promoter`
- `female_vip`
- `admin`

Le contrôle d’accès par rôle est centralisé côté serveur avec Supabase Auth + vérification middleware/proxy.

## 2. Stack actuelle

- Frontend: Next.js 16, React 19, TypeScript
- UI: Tailwind CSS 4
- Auth/DB: Supabase (PostgreSQL + RLS)
- Paiement: Stripe
- IA: OpenAI
- Notifications: Twilio (SMS), Resend (email)
- Floor plan: Konva / react-konva

## 3. Architecture applicative

### 3.1 App Router

- Pages publiques, auth et dashboards par segments de routes dans `src/app`
- Endpoints API dans `src/app/api`

Structure clé:

- `src/app/(auth)` → login/register/verify
- `src/app/(dashboard)/dashboard` → dashboards par rôle
- `src/app/(public)` → pages publiques
- `src/app/api` → callback auth, bot, réservations, webhook Stripe

### 3.2 Couche métier

- `src/lib/auth.ts` → normalisation rôle + mapping vers dashboards
- `src/lib/auth.actions.ts` → inscription/connexion/déconnexion
- `src/lib/club.actions.ts` → création événements/tables
- `src/lib/promoter.actions.ts` → gestion guest list
- `src/lib/openai.ts`, `src/lib/stripe.ts`, `src/lib/twilio.ts`, `src/lib/resend.ts` → intégrations externes

### 3.3 Contrôle d’accès

- `src/proxy.ts`:
  - redirige vers login si accès dashboard sans session
  - redirige vers dashboard du rôle après login/register
  - empêche l’accès aux dashboards hors rôle (sauf admin)

## 4. Données & Supabase

Migrations présentes:

1. `supabase/migrations/001_auth_schema.sql`
   - table `profiles` + tables de profils par rôle
   - trigger `handle_new_user`
   - RLS/policies de base
2. `supabase/migrations/002_clubs_events.sql`
   - tables `events`, `tables`
   - policies club/public
3. `supabase/migrations/004_promoters_guestlist.sql`
   - `promoter_clicks`, `guest_lists`
   - policies promoteur

## 5. Environnement (variables)

Variables attendues dans `.env.local` (voir `.env.example`):

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- App: `NEXT_PUBLIC_APP_URL`
- Stripe: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- OpenAI: `OPENAI_API_KEY`
- Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- Resend: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

## 6. Endpoints API (état réel)

- `GET /api/auth/callback` → échange code Supabase + redirection par rôle
- `POST /api/bot` → réponse IA (OpenAI `gpt-4o`)
- `POST /api/reservations` → placeholder
- `POST /api/webhooks/stripe` → signature vérifiée + base de gestion événements

## 7. État d’avancement

Implémenté:

- Auth multi-rôles + redirections
- Dashboards par rôle (squelettes)
- Actions serveur club/promoter de base
- Base de webhook Stripe
- Endpoint bot IA

À compléter en priorité:

- Flux réservation complet (DB + API + server actions)
- Traitement métier complet webhook Stripe
- Migrations réservation/paiement manquantes
- Tests et observabilité minimale

## 8. Références documentation

- Vision produit: `docs/NightTable_BusinessPlan_V3.docx`
- Guide technique complet: `docs/NightTable_DevGuide.docx`
- Versions texte: `docs/NightTable_BusinessPlan_V3.txt`, `docs/NightTable_DevGuide.txt`
