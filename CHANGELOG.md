# Changelog

Toutes les évolutions notables du projet NightTable sont documentées dans ce fichier.

## Unreleased

### Added

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

### Changed

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

### Fixed

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
