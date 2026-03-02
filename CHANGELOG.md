# Changelog

Toutes les évolutions notables du projet NightTable sont documentées dans ce fichier.

## Unreleased

### Added

- Nouveau composant auth partagé [split-screen]: `src/app/(auth)/AuthSplitPage.tsx` (image immersive, overlay gradients, tabs HeroUI Connexion/Inscription, formulaires dynamiques, animations de transition et sélection de rôle 2x2).
- Loading analytics dédié (`src/app/(dashboard)/club/analytics/loading.tsx`): skeleton complet HeroUI pour cards KPI et tables analytics.
- HeroUI bootstrap UI (`tailwind.config.ts`, `src/app/providers.tsx`): ajout du plugin/theme NightTable HeroUI et wrapper provider client dédié pour App Router.
- Table HeroUI événements club (`src/app/(dashboard)/club/events/EventListTable.tsx`): composant client avec `Table`, `Chip` statuts et `Modal` de détails.
- UI HeroUI tables club (`src/app/(dashboard)/club/tables/tablesClient.tsx`): migration de la gestion tables avec `Table`, `Modal`, `Input`, `Select` et `Switch`.
- UI HeroUI promoteurs club (`src/app/(dashboard)/club/promoters/PromotersTable.tsx`): tableau classement promoteurs avec `Table` et badges `Chip`.
- UI HeroUI analytics club (`src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx`): cartes KPI (`Card`) et tableau réservations (`Table` + `Chip`) pour la vue analytics.
- UI HeroUI dashboard client:
  - `src/app/(dashboard)/client/ClientDashboardPanels.tsx`
  - `src/app/(dashboard)/client/reservations/ClientReservationsTable.tsx`
  - `src/app/(dashboard)/client/waitlist/ClientWaitlistList.tsx`
  (cards, progress, tables, badges et actions)
- Composants HeroUI dédiés page events club:
  - `src/app/(dashboard)/club/events/CreateEventButton.tsx`
  - `src/app/(dashboard)/club/events/EventTableSkeleton.tsx`
- Composants HeroUI dédiés page tables club:
  - `src/app/(dashboard)/club/tables/TablesSkeleton.tsx`
  - `src/app/(dashboard)/club/tables/loading.tsx`
- Composants HeroUI dédiés pages promoteur:
  - `src/app/(dashboard)/promoter/commissions/PromoterCommissionsPanel.tsx`
  - `src/app/(dashboard)/promoter/promo/PromoterPromoPanel.tsx`
- Landing page v2 complète (`src/app/page.tsx`): redesign intégral avec 7 sections — Navbar sticky, Hero plein écran gradient gold + typo serif Cormorant, barre de stats (12+ clubs, 150+ soirées, 98% satisfaction, 30s réservation), "Comment ça marche" en 3 étapes, événements featured avec images Unsplash + hover zoom, 4 sections rôle (Clubs, Clients, Promoteurs, Femmes VIP) en alternance avec feature lists et images, CTA final, footer complet avec colonnes liens + socials (Instagram, TikTok, LinkedIn).
- Animations CSS landing page (`src/app/globals.css`): `fade-in-up`, `fade-in`, `shimmer`, `glow-pulse` avec stagger delays, `prefers-reduced-motion` respecté, scrollbar custom gold, selection highlight gold, smooth scrolling.
- Landing page v3 (itération page par page) (`src/app/page.tsx`): refonte visuelle orientée Soho House avec hero plein écran éditorial, headline Cormorant light 72/48, overlay photo renforcé, section "Clubs partenaires" en grille image-first (16/9, hover reveal), CTA final minimal.
- Club dashboard home v1 (`src/app/(dashboard)/club/page.tsx`): refonte visuelle style Linear avec header compact (titre + slash meta), cards métriques denses (radius 8, padding 16, chiffres 32px), table réservations compacte (40px, checkbox, badges inline, actions au hover, pagination sobre).
- Club events page v1 (`src/app/(dashboard)/club/events/page.tsx`): refonte visuelle style Linear dense avec header compact, KPIs opérationnels et table d’événements (statut, horaires, DJ lineup, disponibilité tables, action rapide).
- Club analytics page v1 (`src/app/(dashboard)/club/analytics/page.tsx`): nouvelle vue analytics club (KPIs 30 jours + table réservations récentes) avec alias dashboard `src/app/(dashboard)/dashboard/club/analytics/page.tsx`.
- Alias routes club ajoutés: `src/app/(dashboard)/dashboard/club/events/page.tsx` et `src/app/(dashboard)/dashboard/club/tables/page.tsx` pour exposer correctement `/dashboard/club/events` et `/dashboard/club/tables`.
- Alias route ajoutée: `src/app/(dashboard)/dashboard/club/events/new/page.tsx` pour exposer correctement `/dashboard/club/events/new`.

### Changed

- Harmonisation visuelle des pages club internes avec le nouveau shell sidebar (densité/headers/sections unifiées): `src/app/(dashboard)/club/events/page.tsx`, `src/app/(dashboard)/club/promoters/page.tsx`, `src/app/(dashboard)/club/promoters/PromotersTable.tsx`, `src/app/(dashboard)/club/tables/tablesClient.tsx`, `src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx`, `src/app/(dashboard)/club/vip/ClubVipPanels.tsx`.
- `src/app/(dashboard)/layout.tsx`: shell dashboard club recentré sur le design cible avec sidebar gauche structurée (sections Général/Gestion) et onglets visibles Dashboard, Événements, Tables, Promoteurs, Femmes VIP, Analytics.
- `src/app/(dashboard)/club/page.tsx` et `src/app/(dashboard)/club/ClubHomePanels.tsx`: refonte Page 1 `/dashboard/club` vers le layout Velvet Rope Analytics NightTable (header "Tableau de bord", 4 KPI cards formatées, table réservations enrichie avec avatar+email client, table promoteurs avec colonne "Lien actif", actions harmonisées HeroUI).
- `src/app/(auth)/login/page.tsx` et `src/app/(auth)/register/page.tsx`: refonte complète en wrapper vers le nouveau layout/auth flow partagé avec tabs et formulaires unifiés.
- `src/app/(dashboard)/club/analytics/page.tsx`: refactor complet avec filtre période (`7d|30d|3m|all`) basé sur query param, fetch Supabase filtré par `club_id` et période, calcul des 6 métriques et agrégations top promoteurs/événements passés.
- `src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx`: migration UI HeroUI conforme spec (Tabs underlined, grille 6 cards, variations en `Chip`, table top promoteurs et table événements passés avec chips no-show/note).
- `src/app/layout.tsx`: remplacement du `HeroUIProvider` direct par le wrapper client `Providers` pour respecter la frontière server/client Next.js.
- `src/app/(dashboard)/club/events/page.tsx`: migration UI vers HeroUI côté listing (données sérialisées vers composant client `EventListTable`) tout en conservant le fetch/guards serveur.
- `src/app/(dashboard)/club/tables/tablesClient.tsx`: header actions, listing latéral et formulaire d’ajout refondus en composants HeroUI tout en conservant `createTableAction` et `updateTablePositionAction`.
- `src/app/(dashboard)/club/promoters/page.tsx`: listing promoteurs branché sur le composant client HeroUI `PromotersTable` en conservant les fetchs/agrégations serveur.
- `src/app/(dashboard)/club/promoters/AddPromoterModal.tsx`: modal de création promoteur migré vers HeroUI (`Modal`, `Input`, `Slider`, `Button`) en gardant `createPromoterAction`.
- `src/app/(dashboard)/club/analytics/page.tsx`: migration du rendu analytics vers le composant client HeroUI `AnalyticsPanels` en conservant les guards/récupération/agrégations serveur.
- `src/app/(dashboard)/client/page.tsx`: délégation du rendu UI vers `ClientDashboardPanels` avec conservation des fetchs/guards serveur.
- `src/app/(dashboard)/client/reservations/page.tsx`: rendu des réservations délégué à `ClientReservationsTable` (actions serveur conservées).
- `src/app/(dashboard)/client/waitlist/page.tsx`: rendu des waitlists délégué à `ClientWaitlistList` (action serveur conservée).
- `src/app/(dashboard)/club/events/EventListTable.tsx`: refactor table HeroUI selon spécification (`Table*` colonnes Événement/Date/DJ Lineup/Statut/Tables/Actions, `Chip` statuts, DJ en `Chip` multiples, actions `Button size='sm' variant='light' isIconOnly`).
- `src/app/(dashboard)/club/events/page.tsx`: bouton “Créer un événement” migré en HeroUI (`Button color='primary' variant='solid' radius='none' className='uppercase tracking-widest text-xs`) via wrapper client, logique serveur inchangée.
- `src/app/(dashboard)/club/events/loading.tsx`: loading state aligné avec `Skeleton` cellule par cellule via `EventTableSkeleton`.
- `src/app/(dashboard)/club/tables/tablesClient.tsx`: refactor HeroUI renforcé (chips zone/promo, action row `isIconOnly`, structure table densifiée) sans changement des Server Actions `createTableAction`/`updateTablePositionAction`.
- `src/app/(dashboard)/promoter/guestlist/GuestListClient.tsx`: migration UI vers HeroUI (`Select`, `Input`, `Table`, `Chip`, `Button`) en conservant les actions `addGuestListEntryAction` et `markGuestArrivedAction`.
- `src/app/(dashboard)/promoter/commissions/page.tsx`: rendu délégué à `PromoterCommissionsPanel` (HeroUI) avec logique fetch/agrégation inchangée.
- `src/app/(dashboard)/promoter/promo/page.tsx`: rendu délégué à `PromoterPromoPanel` (HeroUI) avec calculs clicks/conversion inchangés.
- `src/app/(dashboard)/club/tables/page.tsx` et `src/app/(dashboard)/club/tables/tablesClient.tsx`: alignement strict sur spec HeroUI (colonnes `Table | Zone | Capacité | Prix de base | Promo | Actions`, zone en `Chip` mappé par valeur, toggle `is_promo` en `Switch color="secondary" size="sm"`, modal avec `Input color="primary" variant="bordered"` + `Select/SelectItem` bordered, CTA `Button color="primary" radius="none"` en uppercase, actions row `Button size="sm" variant="light" isIconOnly`).
- `src/app/(dashboard)/layout.tsx`: navigation club corrigée — liens Sidebar/Bottombar pointent désormais vers `/dashboard/club/events`, `/dashboard/club/tables`, `/dashboard/club/promoters`, `/dashboard/club/analytics` au lieu de rediriger tous vers `/dashboard/club`.
- `src/app/(dashboard)/club/events/page.tsx`: mise à jour visuelle plus marquée (header gradient, badge “Linear v2”, toolbar de table, empty state enrichi) pour distinguer clairement la nouvelle UI de l’ancienne.
- `src/app/(dashboard)/layout.tsx`: refonte visuelle sidebar/navigation en style Linear v2 (header bloc versionné, items plus contrastés, chrome mobile harmonisé).

### Changed
  - `src/app/(dashboard)/promoter/commissions/page.tsx` (historique commissions, KPI CA/pending/versé)
  - `src/app/(dashboard)/promoter/promo/page.tsx` (lien promo, clics, conversion, mini-graph 7j)
  - Alias: `src/app/(dashboard)/dashboard/promoter/commissions/page.tsx`, `src/app/(dashboard)/dashboard/promoter/promo/page.tsx`
- Migration de rattrapage schéma floor plan: `supabase/migrations/011_floor_plan_positions.sql`.
- Module femmes validées:
  - `src/app/(dashboard)/vip/page.tsx`
  - `src/app/(dashboard)/vip/loading.tsx`
  - `src/app/(dashboard)/vip/error.tsx`
  - `src/lib/vip.actions.ts`
- Pages manquantes du module VIP:
  - `src/app/(dashboard)/vip/invitations/page.tsx`
  - `src/app/(dashboard)/vip/profile/page.tsx`
  - `src/app/(dashboard)/vip/safety/page.tsx`
  - `src/app/(dashboard)/club/vip/page.tsx`
- Alias dashboard supplémentaires:
  - `src/app/(dashboard)/dashboard/vip/invitations/page.tsx`
  - `src/app/(dashboard)/dashboard/vip/profile/page.tsx`
  - `src/app/(dashboard)/dashboard/vip/safety/page.tsx`
  - `src/app/(dashboard)/dashboard/club/vip/page.tsx`

### Changed

- `scripts/seed-demo-data.mjs`: seed démo aligné sur la cible (3 événements, 5 tables, 2 promoteurs, réservations) avec fallback sans crash si `floor_plans` ou colonnes de position sont absents.
- `scripts/verify-demo-seed.mjs`: vérification renforcée avec double source de positions et diagnostics explicites de dérive de schéma.
- `src/app/(dashboard)/dashboard/vip/page.tsx`: alias corrigé — re-export au lieu de redirect infini.
- `src/app/(dashboard)/club/vip/page.tsx`: correction UX/typing (image optimisée `next/image`, formulaires server actions, toggles promos).
- `src/app/(dashboard)/vip/page.tsx` et `src/app/(dashboard)/vip/profile/page.tsx`: compatibilité stricte Next form action (`Promise<void>` wrappers).
- `scripts/seed-demo-data.mjs`: ajout seed VIP invitations (1 pending, 1 accepted) + safety check-in (arrived).

### Fixed

- `src/app/(dashboard)/layout.tsx`: suppression de la barre d’onglets mobile en haut pour éviter le doublon avec la navigation fixe du bas sur smartphone.
- `src/app/(auth)/AuthSplitPage.tsx`: remplacement des champs `Input` HeroUI par des champs HTML natifs stylés NightTable pour supprimer définitivement la superposition des textes en connexion/inscription.
- `src/app/(dashboard)/layout.tsx`: fallback de rôle ajouté directement dans le layout (inférence via `club_profiles`/`promoter_profiles`/`female_vip_profiles`) pour garantir l’affichage des onglets club même si `profiles.role` est désynchronisé.
- `src/app/(auth)/AuthSplitPage.tsx` et `src/app/globals.css`: suppression définitive de la superposition/doublon visuel du texte dans les champs (désactivation des pseudo-couches HeroUI `before/after`, rendu texte forcé net, `-webkit-text-fill-color` unifié).
- `src/app/(dashboard)/layout.tsx`: ajout d’une barre d’onglets club visible en haut sur écrans étroits pour conserver l’accès à tous les onglets (Dashboard, Événements, Tables, Promoteurs, Femmes VIP, Analytics) même quand la sidebar est masquée.
- `src/lib/auth.actions.ts` et `src/proxy.ts`: correction de redirection rôle club → dashboard client. Le rôle est désormais résolu avec fallback sur les tables métier (`club_profiles`, `promoter_profiles`, `female_vip_profiles`) puis resynchronisé dans `profiles.role` si incohérent.
- `src/app/globals.css`: correctif global de lisibilité des champs (connexion/inscription + site entier) — suppression de l’effet flou/zone grisée sur la saisie, neutralisation des overlays autofill WebKit et rendu texte net sur inputs HeroUI/natifs.
- `src/app/(auth)/AuthSplitPage.tsx`: suppression totale des accents jaunes au focus/saisie sur les champs connexion + inscription, et CTA inscription “Créer mon compte” renforcé en bouton gold visible.
- `src/app/(auth)/AuthSplitPage.tsx`: correction du focus saisie sur les champs de connexion (suppression de l’accent jaune agressif) et bouton `Se connecter` rendu nettement visible (fond gold + texte contrasté).
- `src/app/(dashboard)/dashboard/club/page.tsx`: correction de routage alias — `/dashboard/club` pointe désormais vers la nouvelle home club refondue (`@/app/(dashboard)/club/page`) au lieu de l’ancienne vue legacy.
- Mobile hardening complémentaire (tables dashboards):
  - `src/app/(dashboard)/club/ClubHomePanels.tsx`: valeurs KPI rendues responsives + tableaux "Réservations du soir" et "Promoteurs actifs" encapsulés en `overflow-x-auto`.
  - `src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx`: tableaux "Top promoteurs" et "Événements passés" encapsulés en `overflow-x-auto`.
  - `src/app/(dashboard)/club/promoters/PendingCommissionsTable.tsx`, `src/app/(dashboard)/club/promoters/PromotersTable.tsx`, `src/app/(dashboard)/client/reservations/ClientReservationsTable.tsx`, `src/app/(dashboard)/promoter/guestlist/GuestListClient.tsx`: tableaux encapsulés en `overflow-x-auto` pour éviter les débordements sur mobile.
- Mobile hardening ciblé:
  - `src/app/(auth)/AuthSplitPage.tsx`: suppression du verrouillage mobile (`h-screen/overflow-hidden`) au profit d’un comportement scroll-safe avec clavier mobile (`min-h-[100dvh]`, `overflow-y-auto`, fallback desktop conservé).
  - `src/app/(dashboard)/promoter/promo/PromoterPromoPanel.tsx`: grille activité 7 jours passée en `grid-cols-4 sm:grid-cols-7` pour éviter la compression excessive sur petits écrans.
  - `src/app/(dashboard)/club/vip/ClubVipPanels.tsx`: cartes profils en attente passées en `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` pour lisibilité mobile.
- `scripts/fix-rgpd-col.mjs`: suppression des variables/imports morts pour éliminer les warnings ESLint `no-unused-vars`.
- `src/app/(dashboard)/club/analytics/loading.tsx`: suppression de l’import `@heroui/react` côté composant serveur `loading.tsx` pour corriger l’erreur build/prerender `createContext is not a function`.
- `src/app/(dashboard)/promoter/commissions/PromoterCommissionsPanel.tsx`: correction lint `react/no-unescaped-entities` (apostrophe échappée en JSX) pour rétablir `npm run lint` en vert côté erreurs bloquantes.
- `src/app/layout.tsx`: correction runtime Next.js `createContext only works in Client Components` en isolant HeroUI dans `src/app/providers.tsx` avec `'use client'`.
- `src/app/(dashboard)/club/page.tsx` et `src/app/(dashboard)/club/events/page.tsx`: correction build `createContext is not a function` en retirant les imports HeroUI directs des pages serveur.
- `src/app/(dashboard)/club/events/page.tsx`: correction runtime `TypeError: Cannot read properties of null (reading 'length')` en gérant `event_tables` et `dj_lineup` nullables dans les agrégations et le rendu.
- `src/app/page.tsx`: correction d’une image Unsplash invalide (404) sur la section clubs partenaires pour stabiliser le rendu visuel local.
- `vip_invitations`: colonnes legacy (event_id, inviter_client_id, female_vip_id) rendues nullable + default NOW() sur invited_at pour permettre les inserts avec le nouveau schema (reservation_id, vip_id, invited_by). Seed invitations VIP maintenant insérées correctement.
- Blocage seed sur erreurs de schéma distant (`public.floor_plans` introuvable / `tables.x_position` absent) maintenant détecté proprement avec rapport de validation exploitable.
- Module `female_vip` sorti du mode placeholder: gestion complète du statut de validation, édition profil et affichage contextualisé clubs/soirées.
- Prompts VIP restants livrés: invitations accept/refuse, suivi de soirée (arrived/departed/incident), validation club VIP et invitations table.
- Alias VIP routes: correction redirect infini — `redirect("/dashboard/vip")` remplacé par `export { default }` re-export pattern sur 5 fichiers alias.
- Pages VIP bloquées en navigateur: ajout policies RLS `SELECT`/`UPDATE` manquantes + colonne `rgpd_consent_at` sur `female_vip_profiles` via connexion directe Postgres. Restauration des champs dans les queries et le payload de mise à jour.

### Changed

- `src/app/(dashboard)/layout.tsx`: sidebar promoteur — liens Guest list, Commissions et Lien promo pointent désormais vers des routes dédiées au lieu de `/dashboard/promoter`.

### Added (tests)

- `scripts/smoke-test-vip.mjs`: smoke test automatisé des routes VIP module (auth, rôles, contenu).

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
