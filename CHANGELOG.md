# Changelog

Toutes les évolutions notables du projet NightTable sont documentées dans ce fichier.

## Unreleased

- Aucun changement non publié depuis `v0.3-mvp-complete`.

## v0.3-mvp-complete - 2026-03-01

### Added

- Module promoteur complété: guest list dédiée, arrivée optimiste, compteurs live.
- Module club promoteurs: création promoteur (code promo/taux commission/email), validation commissions, top 5 mensuel.
- Dashboard client complet: home score/réservation, pages réservations et waitlist.
- Seed démo exécutable: `npm run seed:demo` via `scripts/seed-demo-data.mjs`.
- Note de release MVP: `docs/v0.3-mvp-complete.md`.

### Changed

- Landing publique finalisée (`src/app/page.tsx`) avec metadata SEO et intégration `next/image`.
- Configuration images Next.js enrichie (`next.config.ts` + `images.remotePatterns`).
- Actions serveur étendues (`src/lib/promoter.actions.ts`, `src/lib/reservation.actions.ts`) avec validations Zod et contrôles ownership/rôle.
- Alias routes dashboard ajoutées pour cohérence `/dashboard/*`.

### Fixed

- Compatibilité build Next sur `form action` server actions (wrappers `Promise<void>`).
- Correctifs TypeScript (`result.data` narrowing, OpenGraph `images`, typage `SupabaseClient` admin).
- Compatibilité seed avec schéma Supabase réellement déployé (colonnes absentes/contraintes non disponibles).

### Validation

- `npm run seed:demo` ✅
- `npm run lint` ✅
- `npm run build` ✅

### Git

- Commit de release: `8a04f9d`
- Tag annoté: `v0.3-mvp-complete`

### Added

- Script de seed démo complet: `scripts/seed-demo-data.mjs` (users/profiles/events/tables/event_tables/reservations/waitlist/commissions/guest_lists).
- Commande npm `seed:demo` dans `package.json`.
- Note de release prête pour tag MVP: `docs/v0.3-mvp-complete.md`.

- Page guest list promoteur: `src/app/(dashboard)/promoter/guestlist/page.tsx` + `src/app/(dashboard)/promoter/guestlist/GuestListClient.tsx` avec événements futurs, compteurs live et arrivée optimiste.
- Page gestion promoteurs club: `src/app/(dashboard)/club/promoters/page.tsx` + modal `src/app/(dashboard)/club/promoters/AddPromoterModal.tsx` avec création promoteur et slider de commission.
- Pages dashboard client complètes: `src/app/(dashboard)/client/page.tsx`, `src/app/(dashboard)/client/reservations/page.tsx`, `src/app/(dashboard)/client/waitlist/page.tsx`.
- Alias routes dashboard ajoutées: `src/app/(dashboard)/dashboard/promoter/guestlist/page.tsx`, `src/app/(dashboard)/dashboard/club/promoters/page.tsx`, `src/app/(dashboard)/dashboard/client/reservations/page.tsx`, `src/app/(dashboard)/dashboard/client/waitlist/page.tsx`.

- UI component headers ajoutés sur l’ensemble du scope TSX demandé (`src/components/floor-plan`, `src/app/(dashboard)`, `src/app/(public)`, `src/app/(auth)`) pour alignement avec les règles Component Development.

- Section "Repository" dans `README.md` avec liens GitHub directs (repo, issues, releases, tags).
- Liens directs des tags docs dans la section "Releases" du `README.md`.
- Index de documentation `docs/README.md`.
- Section "Contribution" dans `README.md`.
- Document de suivi vivant `docs/PROJECT_STATUS.md` (fait / en cours / à faire + journal de sessions).
- Processus de mise à jour continue de `docs/PROJECT_STATUS.md` formalisé (mise à jour à chaque session).
- Démo produit enrichie visuellement (`src/app/demo/page.tsx`) avec plus de couleurs et des cartes image.
- Home publique refondue visuellement (`src/app/page.tsx`).
- Nouvelle page club publique dynamique (`src/app/(public)/clubs/[slug]/page.tsx`).
- Nouvelle page de cartographie finale des routes: `src/app/final-pages/page.tsx`.
- Nouvelle roadmap interactive de build: `src/app/build-plan/page.tsx`.
- `build-plan` converti en vue Kanban avec filtres par rôle.
- Refonte visuelle des pages `login` et `register`.
- Nouvelle page publique `clubs` (`src/app/(public)/clubs/page.tsx`).
- Page `reserve` rendue opérationnelle côté UI (sélections + résumé dynamique via query params).
- Correctif runtime `src/proxy.ts` pour éviter les erreurs 500 sur `/login` et `/register` quand les variables d’environnement Supabase sont absentes en local (fallback non bloquant hors `/dashboard`).
- Base de connaissance des erreurs projet:
  - `docs/errors/README.md`
  - `docs/errors/ERROR_LOG.md`
  - `docs/errors/templates/incident-template.md`
  - `docs/errors/incidents/2026-03-01-next-middleware-proxy-conflict.md`
  - `docs/errors/incidents/2026-03-01-supabase-signup-rate-limit.md`
  - `docs/errors/incidents/2026-03-01-auth-signup-rls.md`
- Dashboard Club — module événements:
  - `src/app/(dashboard)/club/events/page.tsx`
  - `src/app/(dashboard)/club/events/loading.tsx`
  - `src/app/(dashboard)/club/events/error.tsx`
  - `src/app/(dashboard)/club/events/new/page.tsx`
- Dashboard Club — gestion des tables:
  - `src/app/(dashboard)/club/tables/page.tsx`
  - `src/app/(dashboard)/club/tables/tablesClient.tsx`
- Dashboard Club — home "soirée du jour":
  - `src/app/(dashboard)/club/page.tsx`
  - `src/app/(dashboard)/club/refreshButton.tsx`
- Composant plan de salle Konva:
  - `src/components/floor-plan/FloorPlan.tsx`
- Migration DB ajout de flags événements/tables:
  - `supabase/migrations/007_club_event_table_flags.sql`
- Parcours public de réservation événement:
  - `src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx`
  - `src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx`
- Checkout public 3 étapes:
  - `src/app/(public)/reserve/checkout/page.tsx`
  - `src/app/(public)/reserve/checkout/checkoutClient.tsx`
- Server Action réservation/paiement:
  - `src/lib/reservation.actions.ts`
- Migration checkout réservation:
  - `supabase/migrations/008_reservations_checkout_fields.sql`
- Wrappers notifications transactionnelles:
  - `src/lib/twilio.ts` (`sendSMS`)
  - `src/lib/resend.ts` (`sendReservationConfirmation`)
- Scripts de test/maintenance locale:
  - `scripts/e2e-seed-reservation.mjs`
  - `scripts/e2e-webhook-test.mjs`
  - `scripts/e2e-cleanup.mjs`
- Nouveaux incidents documentés dans la base d’erreurs:
  - `docs/errors/incidents/2026-03-01-events-schema-drift-notoriety.md`
  - `docs/errors/incidents/2026-03-01-stripe-invalid-secret-key-local.md`
  - `docs/errors/incidents/2026-03-01-dashboard-events-jsx-namespace-build.md`
- Checklist “Session close (obligatoire)” ajoutée au template incident:
  - `docs/errors/templates/incident-template.md`
- Migration reporting commissions promoteur:
  - `supabase/migrations/009_commissions_amount_rate.sql`
- Alias route promoteur:
  - `src/app/(dashboard)/promoter/page.tsx`
- Actions client promoteur (copy/share lien):
  - `src/app/(dashboard)/dashboard/promoter/promoterShareActions.tsx`
- Script de healthcheck environnement:
  - `scripts/healthcheck-env.mjs`
- Migration idempotence webhook Stripe:
  - `supabase/migrations/010_stripe_webhook_events.sql`

### Changed

- Landing publique finalisée dans `src/app/page.tsx` avec metadata SEO, design NightTable et intégration `next/image`.
- `next.config.ts`: ajout de `images.remotePatterns` pour `images.unsplash.com`.
- `scripts/seed-demo-data.mjs`: adaptation au schéma Supabase déployé (fallback sans `ON CONFLICT`, suppression colonnes non disponibles, messages d’erreur explicites).
- `src/lib/promoter.actions.ts`: correction du typage du client Supabase admin (`SupabaseClient`) pour éviter l’inférence `never` au build.

- `src/lib/promoter.actions.ts`: extension complète des actions promoteur/club (`addGuestListEntryAction`, `markGuestArrivedAction`, `createPromoterAction`, `validateCommissionAction`) avec validation Zod, contrôle rôle et revalidation ciblée.
- `src/lib/reservation.actions.ts`: ajout des actions client `cancelReservationAction` et `leaveWaitlistAction` avec vérification ownership et règles métier d’éligibilité.
- `src/app/(dashboard)/dashboard/client/page.tsx`: conversion en alias vers la nouvelle home client.

- Refonte visuelle cohérente Dashboard/Public/Auth: remplacement des styles Tailwind par défaut par la palette NightTable et harmonisation des classes d’interaction/focus.
- Composants réutilisables (`FloorPlan`, `RefreshButton`, `CheckoutClient`, `EventBookingClient`, `TablesClient`) durcis avec props typées strictes, `className?: string` et documentation JSDoc.
- `FloorPlan` : alignement design system component.gallery (couleurs, états, accessibilité, animations).
- `DashboardGroupLayout` : alignement design system component.gallery (couleurs, états, accessibilité, animations).
- `DashboardLayout` : alignement design system component.gallery (header composant + typage).
- `DashboardRootPage` : alignement design system component.gallery (header composant).
- `ClubEventsError` : alignement design system component.gallery (couleurs, états, accessibilité, animations).
- `ClubEventsLoading` : alignement design system component.gallery (header composant + loading UI).
- `NewClubEventPage` : alignement design system component.gallery (états interactifs, focus ring, aria toggles).
- `ClubEventsPage` : alignement design system component.gallery (cards, CTA, focus/transition).
- `ClubDashboardHomePage` : alignement design system component.gallery (actions, focus/transition).
- `RefreshButton` : alignement design system component.gallery (props, accessibilité, animations).
- `ClubTablesPage` : alignement design system component.gallery (header composant).
- `TablesClient` : alignement design system component.gallery (props, modal role/aria, états boutons).
- `AdminDashboardPage` : alignement design system component.gallery (card NightTable).
- `ClientDashboardPage` : alignement design system component.gallery (card NightTable).
- `ClubDashboardPage` : alignement design system component.gallery (palette NightTable, états interactifs).
- `PromoterDashboardPage` : alignement design system component.gallery (palette NightTable, états interactifs).
- `VipDashboardPage` : alignement design system component.gallery (card NightTable).
- `LoginPage` : alignement design system component.gallery (focus, transition, cibles min 44px).
- `RegisterPage` : alignement design system component.gallery (focus, transition, cibles min 44px).
- `VerifyPage` : alignement design system component.gallery (palette NightTable + structure card).
- `ClubsPage` : alignement design system component.gallery (palette NightTable, CTA interactifs).
- `ClubSlugPage` : alignement design system component.gallery (palette NightTable, CTA interactifs).
- `PublicEventPage` : alignement design system component.gallery (header composant + structure).
- `EventBookingClient` : alignement design system component.gallery (props, CTA/focus, transitions).
- `ReservePage` : alignement design system component.gallery (CTA/focus, transitions).
- `CheckoutPage` : alignement design system component.gallery (header composant + structure).
- `CheckoutClient` : alignement design system component.gallery (props, états boutons, transitions/focus).

- Refonte des actions club dans `src/lib/club.actions.ts`:
  - validation Zod,
  - retour normalisé `{ success, data, error }`,
  - `createEventAction`, `createTableAction`, `updateTablePositionAction`.
- Webhook Stripe enrichi dans `src/app/api/webhooks/stripe/route.ts`:
  - traitement `payment_intent.succeeded` / `payment_intent.payment_failed`,
  - sync abonnements clubs (`customer.subscription.*`),
  - fallback de résolution réservation via `payment_intent.metadata.reservation_id`.
- Synchronisation des docs de pilotage:
  - `docs/PROJECT_STATUS.md` mis à jour (avancement, sessions, priorités),
  - `docs/errors/ERROR_LOG.md` enrichi.
- Processus de documentation renforcé:
  - alignement explicite avec la règle auto-documentation de `.github/copilot-instructions.md`,
  - rappel opérationnel intégré directement dans le template incident.
- Réorganisation de l’index documentaire `docs/README.md`:
  - classification par catégories (pilotage, incidents, sources métier),
  - conventions de rangement explicites.
- Pages auth stabilisées sans `useSearchParams`:
  - `src/app/(auth)/login/page.tsx`
  - `src/app/(auth)/register/page.tsx`
- Gouvernance UI renforcée dans `.github/copilot-instructions.md`:
  - ajout du bloc “Component Development Rules — MANDATORY” (références design, a11y, tokens, checklist).
- Gouvernance prompts/tokens renforcée dans `.github/copilot-instructions.md`:
  - ajout du bloc “Token Optimization Rules — MANDATORY” (sélection modèle, discipline de prompt, usage `#file:*`, hygiène de contexte, templates).
- Références `#file:*` corrigées dans `.github/copilot-instructions.md`:
  - chemins ajustés vers des fichiers existants pour supprimer les diagnostics “File not found” dans l’éditeur.
- Réduction des faux positifs markdown dans `.github/copilot-instructions.md`:
  - remplacement du pattern `#file:` par `# file:` pour neutraliser les 7 diagnostics restants.
- Nettoyage post-correctif:
  - suppression des fichiers alias temporaires `.github/BUSINESS_RULES.md`, `.github/DESIGN_SYSTEM.md`, `.github/ARCHITECTURE.md`.
- Tracking promo public renforcé dans `src/app/(public)/reserve/page.tsx`:
  - validation `promo_code` + persistance cookie `nighttable_promo` (48h).
- Attribution promoteur post-réservation dans `src/lib/reservation.actions.ts`:
  - conversion `promoter_clicks` + mise à jour `promoter_id` / `promo_code_used` sans blocage du flux principal.
- Dashboard promoteur connecté données réelles dans `src/app/(dashboard)/dashboard/promoter/page.tsx`:
  - KPI mensuels, historique commissions, lien promo + conversion, copy/share mobile.
- Checkout public enrichi dans `src/app/(public)/reserve/checkout/checkoutClient.tsx`:
  - intégration Stripe Elements (`PaymentElement`) + confirmation réelle via `stripe.confirmPayment`.
- Scripts npm mis à jour dans `package.json`:
  - ajout `dev:clean` et exécution automatique avant `next dev` pour éviter les locks `.next/dev/lock`.
- Webhook Stripe renforcé dans `src/app/api/webhooks/stripe/route.ts`:
  - garde d’idempotence via `stripe_webhook_events` et statut de traitement `processing/processed/failed`.
- NPM scripts enrichis dans `package.json`:
  - ajout de `healthcheck:env` pour diagnostic standardisé Supabase/Stripe.
- Environnement local Stripe aligné:
  - resynchronisation des clés test (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) dans `.env.local` et validation healthcheck.
- Webhook Stripe fiabilisé sur concurrence:
  - gestion du conflit unique `event_id` (`23505`) en réponse idempotente `200` au lieu de `500`.

### Fixed

- Compatibilité build Next des formulaires server actions sur pages dashboard:
  - `src/app/(dashboard)/club/promoters/page.tsx`
  - `src/app/(dashboard)/client/reservations/page.tsx`
  - `src/app/(dashboard)/client/waitlist/page.tsx`
  via wrappers `Promise<void>` pour `form action`.
- Correction TypeScript dans `src/app/(dashboard)/promoter/guestlist/GuestListClient.tsx` sur le narrowing de `result.data`.
- Correction metadata OpenGraph dans `src/app/page.tsx` (`images` au lieu de `image`).

- `src/app/(dashboard)/client/reservations/page.tsx`: correction lint `react-hooks/purity` en supprimant l’usage direct de `Date.now` pendant le rendu.

- Incohérences d’accessibilité et d’ergonomie interactive (focus ring, disabled states, cibles minimales) corrigées sur les actions critiques du scope UI.

- Auth signup stabilisé pour création des profils secondaires:
  - migration RLS/trigger/backfill `supabase/migrations/006_auth_profile_policies_fix.sql`,
  - durcissement `src/lib/auth.actions.ts` (session explicite, logs serveur détaillés, enrichissement non bloquant),
  - redirections post-inscription validées (`client` vers `/dashboard/client`, `club` vers `/dashboard/club`).
- Alignement schéma distant/public booking:
  - retrait de la dépendance à la colonne inexistante `events.notoriety` sur la page événement publique,
  - fallback notoriété côté front pour éviter les crashes runtime.
- Validation E2E webhook locale:
  - scénario succès: réservation `confirmed` + table `reserved`,
  - scénario échec: réservation `cancelled` + table `available`.
- Correctif build TypeScript:
  - correction globale des composants/pages utilisant `JSX.Element` pour éviter `Cannot find namespace 'JSX'`.
- Correctif build/lint auth:
  - suppression de la dépendance `useSearchParams` responsable du prerender error `/register`,
  - suppression du `setState` synchrone en `useEffect` sur `/login`.
- Correctif pipeline promoteur/commission:
  - création commission au webhook `payment_intent.succeeded` avec fallback non bloquant,
  - synchronisation `promoter_profiles.total_earned`,
  - compatibilité reporting via colonnes `commissions.amount` et `commissions.rate`.

## v0.1-docs - 2026-02-28

### Added

- Documentation projet complète dans le README.
- Documents d’architecture et de roadmap:
  - `docs/ARCHITECTURE.md`
  - `docs/ROADMAP.md`
- Sauvegarde des documents sources:
  - `docs/NightTable_BusinessPlan_V3.docx`
  - `docs/NightTable_DevGuide.docx`
  - `docs/NightTable_BusinessPlan_V3.txt`
  - `docs/NightTable_DevGuide.txt`

### Git

- Commit de référence: `ef434cf`
- Tag annoté: `v0.1-docs`
