# NightTable — Suivi d’avancement (vivant)

Ce document sert à suivre, au fil de l’eau, ce qui a été fait, ce qui est en cours, et ce qui reste à faire.

## Mode d’utilisation

- À chaque session de travail, ajouter une entrée dans la section "Journal de sessions".
- Déplacer les items entre "Fait", "En cours" et "À faire".
- Garder les tâches formulées de manière actionnable (verbe + livrable).
- Mettre à jour les dates et le statut avant chaque commit majeur.

## Processus de mise à jour continue

- Ce document est mis à jour à chaque tâche réalisée sur le projet.
- Le minimum attendu par session:
  - 1 ligne dans "Journal de sessions".
  - Mise à jour de "En cours" et/ou "À faire" si le périmètre change.
  - Déplacement en "Fait" des éléments terminés.
- En fin de session, synchroniser avec `CHANGELOG.md` si des docs/process changent.

## Dernière mise à jour

- Date: 2026-03-04
- Auteur: GitHub Copilot

## Vue synthèse

- Progression MVP (estimation): 85%
- Axe prioritaire actuel: QA E2E final des parcours publics et dashboard

## Fait

- Documentation et gouvernance: README, architecture/roadmap, base incidents et règles Copilot alignées sur le mode opératoire NightTable.
- Design & UX: uniformisation cross-rôles (club/promoter/vip/public), responsive mobile-first, CTA et états vides/erreurs harmonisés.
- Dashboard club: parcours complet livré (`events`, `tables`, `promoters`, `vip`, `analytics`, `clients`, `reservations`, `settings`) avec alias stables.
- Public booking: flow `clubs/[slug] → events/[eventId] → checkout` opérationnel et validé en HTTP sur données publiées.
- Paiement & notifications: Stripe checkout/webhook consolidés (idempotence, scénarios succès/échec), wrappers email/SMS en place.
- Données & sécurité: migrations RLS/grants appliquées, seeds robustes, fallbacks de schéma et validations Zod renforcées.
- Qualité technique: lint/build verts, corrections TS/JSX majeures, boundary server/client stabilisée, scripts de dev/reset/healthcheck fiabilisés.

## En cours

- Vérification visuelle finale en navigateur sur parcours critiques (landing → club → event → réservation ; dashboards mobile/desktop).
- Verification manuelle des 7 items restants (Stripe checkout, emails Resend, SMS Twilio, check-in browser).

## Fait (session E2E)

- Test E2E complet execute (39/46 pass - 7 items manuels restants).
- Fix schema `vip_invitations`: colonnes legacy rendues nullable + default invited_at.
- Seed VIP invitations corrige (2 invitations inserees: 1 pending, 1 accepted).
- Script `scripts/e2e-test.mjs` cree couvrant 7 sections (Landing, Auth, Dashboard Club, Reservation, Retour Club, Promoteur, VIP).
- Pages promoteur (4 routes distinctes) et VIP (4 pages) toutes verifiees HTTP 200 avec auth.
- Cross-role access verifie (client bloque sur /dashboard/club -> redirect /dashboard/client).

## À faire (priorité)

### P0 — Critique MVP

- Exécuter un runbook E2E local complet (checkout Stripe Elements + webhook + statut réservation).
- Publier la GitHub Release associée au tag `v0.3-mvp-complete`.

### P1 — Important après P0

- Étendre l’uniformisation design aux pages publiques (`/`, `/clubs`, `/clubs/[slug]`, `/clubs/[slug]/events/[eventId]`) en conservant la hiérarchie dark luxury.
- Lier les réservations aux promoteurs via `promo_code`.
- Démarrer le calcul et suivi des commissions promoteurs.
- Ajouter notifications transactionnelles (email + SMS).
- Connecter les notifications à des templates métier complets (contenu + branding + fallback).
- Renforcer la validation serveur (inputs/API) sur endpoints critiques.

### P2 — Itérations suivantes

- Pricing dynamique côté backend + affichage côté UI.
- Enrichissement du bot IA avec contexte réel clubs/events.
- Fonction waitlist automatisée.
- Revente sécurisée.
- Risque sécurité si validations API incomplètes.
- Risque dérive de scope si P1/P2 démarrés avant clôture P0.

### 2026-03-04 (cleanup changelog — version max compacte)

- Réécriture synthétique de `Unreleased` dans `CHANGELOG.md` pour regrouper les changements par domaines (DB publique, dashboards, public flow, runtime/build, mobile/auth) et réduire fortement la redondance.
### 2026-03-04 (cleanup changelog — passe stricte)

- Déduplication structurelle complémentaire de `Unreleased` dans `CHANGELOG.md` (fusion des blocs `Changed` répétitifs et simplification de la section basse).

- Consolidation de `CHANGELOG.md` en retirant les entrées intermédiaires obsolètes liées au fallback temporaire, tout en conservant l’historique final du correctif data-driven.

- Suppression du fallback temporaire club/event (`fallback-*` + `serverAdmin`) pour revenir à un flux public strictement data-driven.
- Ajout des migrations DB publiques puis push distant: `013_public_club_profiles_read.sql`, `014_public_read_grants.sql`, `015_public_read_policies_refresh.sql`.
- Correction query/runtime côté public: retrait de `min_spend` (colonne absente) et normalisation relationnelle `table:tables` sur la page event.
- Validation HTTP effectuée: club `200`, lien event détecté, page event `200`, titre et bloc réservation présents.

### 2026-03-04 (QA follow-up — câblage club vers événements)
- Ajout d’un fallback explicite vers `/reserve` quand aucun événement publié n’est disponible pour éviter une impasse UX.
- Validation technique ciblée effectuée sur la page publique club sans erreur.

### 2026-03-04 (uniformisation design — passe finale pixel parity)

- Validation technique ciblée terminée sans erreur sur tous les fichiers retouchés.

### 2026-03-04 (uniformisation design — lot 3 pages publiques)

- Harmonisation visuelle promoteur appliquée (`commissions`, `promo`, `guestlist`) via matrice de surfaces partagées (bordures/containers) sans impact métier.
- Réalignement du module VIP sur accent rose de bout en bout (`vip/page`, `invitations`, `profile`, `safety`) pour supprimer les résidus gold sur bordures/focus/inputs.
- Uniformisation démarrée à l’échelle du site selon stratégie “par rôle”, lot rapide MVP: shell dashboard (`layout`, sidebar, bottom nav) harmonisé sur palette NightTable et états actifs unifiés.
- Recalage visuel des pages club `Clients & VIPs` et `Réservations` (cards/bordures/CTA/tabs) pour cohérence avec le design system dark luxury.
- Correctif technique dans la même session: suppression d’une balise `<section>` dupliquée dans `ClubReservationsPanel` (compilation OK).
- Dernier polish demandé: harmonisation iconographique des CTA sur les écrans promoteur (`commissions`, `promo`, `guestlist`) sans changement métier.
- Passe cohérence boutons: harmonisation visuelle des CTA sur `/dashboard/club/reservations` avec icônes d’action pour rester aligné avec la page clients.
- Finition lisibilité CTA ligne clients: ajout d’icônes distinctes pour séparer rapidement action fiche vs contact téléphone vs email.
- Extension des boutons opérationnels `Clients & VIPs`: ajout des CTA `Appeler` (`tel:`) et `Email` (`mailto:`) par client, visibles uniquement quand l’information est disponible.
- Finalisation “configure tous les boutons”: ajout de CTA ligne `Voir fiche` sur le tableau clients + support `searchParams.q` dans `/dashboard/club/reservations` pour préremplir la recherche et ouvrir la vue client directement; validation `npm run lint` + `npm run build` ✅.
- Raffinement visuel “pixel-closer” de la page `Clients & VIPs`: alignement des proportions sur la maquette (titres/toolbar/table), ajout du KPI “nouveaux ce mois” calculé depuis les réservations des 30 derniers jours; validation `npm run lint` + `npm run build` ✅.
- Ajout de la page demandée “Clients & VIPs”: création de `src/app/(dashboard)/club/clients/*` (page serveur, panel client, loading/error), alias `src/app/(dashboard)/dashboard/club/clients/page.tsx`, et navigation `Clients & VIPs` dans `src/app/(dashboard)/layout.tsx`; validation `npm run lint` + `npm run build` ✅.
- Finition ciblée dashboard VIP: ajout de navigation d’actions rapides entre `invitations`, `profile` et `safety`, plus correction mobile-first des grilles formulaire (`sm:grid-cols-2` → `md:grid-cols-2`) sur la page profil; validation `npm run lint` + `npm run build` ✅.
- Passe de finition UI suite validation user sur `/dashboard/club/reservations`: structure rapprochée du screenshot cible (actions topbar, toolbar filtres, tabs compactes, bloc table), sans changement métier; validation `npm run lint` + `npm run build` ✅.
- Fix immédiat suite retour user: runtime error sur `src/app/(dashboard)/club/reservations/page.tsx` corrigé en remplaçant le filtre `club_id` inexistant par un chargement des réservations via `event_id` des événements du club; validation `npm run lint` + `npm run build` ✅.
- Ajout de la page demandée `src/app/(dashboard)/club/reservations/page.tsx` + `ClubReservationsPanel.tsx` avec filtres (tabs Toutes/À venir/En cours/Passées/Annulées), recherche client/table, tableau desktop et cards mobile; `loading.tsx` / `error.tsx` + alias `src/app/(dashboard)/dashboard/club/reservations/page.tsx` + entrée de menu dans `src/app/(dashboard)/layout.tsx`; validation `npm run lint` + `npm run build` ✅.
- Redesign Page 6 livré: `/dashboard/club/analytics` refondu (`AnalyticsPanels.tsx`) + `loading.tsx` aligné + `error.tsx` ajouté pour conformité App Router; validation `npm run lint` + `npm run build` ✅.
- Redesign Page 5 livré: `/dashboard/club/vip` refondu (`vip/page.tsx` + `ClubVipPanels.tsx`) avec parité responsive complète (cards mobile/table desktop/modal mobile) et styles harmonisés; validation `npm run lint` + `npm run build` ✅.
- Redesign Page 4 livré: `/dashboard/club/promoters` refondu (header gradient, KPI cards, `PromotersTable` mobile cards + desktop table, `AddPromoterModal` mobile bottom-sheet); validation `npm run lint` + `npm run build` ✅.
- Redesign Page 3 livré: `/dashboard/club/tables` refondu (header gradient, KPI cards, floor plan + listing responsive, modal mobile bottom-sheet, loading aligné) avec conservation des Server Actions existantes; validation `npm run lint` + `npm run build` ✅.
- Ajustement visuel majeur demandé utilisateur: `/dashboard/club/events` retouchée (header gradient, KPI cards, CTA principal plus lisible, table desktop restylée) pour lever l’effet “ancien modèle”; validation `npm run lint` + `npm run build` ✅.
- Correctif runtime local: `package.json` (`next dev --webpack`) + `scripts/dev-reset.ps1` (ports 3000/3001/3002 + purge `.next/dev`) pour éviter la réapparition de l’erreur `module factory is not available`; validation `npm run lint` + `npm run build` + route `/dashboard/club` HTTP 200 ✅.
- Redesign Page 2 livré: `/dashboard/club/events` avec double rendu responsive (`EventListTable` en cards mobile + table `md+`), typographie responsive et CTA `Créer un événement` en `min-h-12`; validation `npm run lint` + `npm run build` ✅.
- Correctif warnings runtime `/dashboard/club`: stabilisation du chart Recharts (`minWidth/minHeight`) + labels a11y des barres de progression dans `ClubHomePanels`; validation `npm run lint` + `npm run build` ✅.
- Mise à jour des consignes projet: ajout du bloc complet “Responsive & Visual Consistency Rules — MANDATORY” dans `.github/copilot-instructions.md`.
- Parité mobile appliquée au dashboard club: création de `DashboardMobileNav` (état actif par route) + refonte du header mobile dans `src/app/(dashboard)/layout.tsx`; validation `npm run lint` ✅.
- Correctif post-validation visuelle `/dashboard/club`: suppression de la branche legacy “Aucune soirée ce soir / Test HeroUI” dans `src/app/(dashboard)/club/page.tsx` pour rendre la nouvelle Page 1 même sans événement; validation `npm run lint` ✅.
- Redesign dashboard club — Page 1 livrée (`src/app/(dashboard)/club/page.tsx`, `ClubHomePanels.tsx`) avec `recharts` et nouveau mapping KPI/réservations/espaces; validation `npm run lint` ✅.
- Nouveau cycle redesign dashboard club démarré: layout + sidebar refondus en priorité selon référentiel Velvet Rope/NightTable (item actif gold, sections nav, largeur 200px, entrée Paramètres), validation `npm run lint` ✅.
- Ajustement mobile final (`src/app/(dashboard)/layout.tsx`): retrait de la nav top pour supprimer le doublon d’onglets sur smartphone, conservation de la nav fixe basse; validation `npm run lint` ✅.
- Passage final auth vers inputs natifs (`src/app/(auth)/AuthSplitPage.tsx`) pour supprimer définitivement la superposition de texte observée côté utilisateur; validation `npm run lint` ✅.
- Renforcement layout dashboard (`src/app/(dashboard)/layout.tsx`) avec inférence de rôle fallback pour garantir l’affichage des onglets club dans tous les cas de désynchronisation profil; validation `npm run lint` ✅.
- Fix ciblé superposition texte inputs (`src/app/(auth)/AuthSplitPage.tsx`, `src/app/globals.css`): suppression des layers visuels HeroUI parasites (`before/after`) + text rendering unifié (`-webkit-text-fill-color`) pour éliminer le doublon visuel; validation `npm run lint` ✅.
- Correctif UX navigation (`src/app/(dashboard)/layout.tsx`): ajout d’une nav club horizontale en mobile/viewport réduit pour garder les onglets visibles même sans sidebar; validation `npm run lint` ✅.
- Correction du flux login club (`src/lib/auth.actions.ts`, `src/proxy.ts`): résolution de rôle avec fallback métier (`club_profiles`/`promoter_profiles`/`female_vip_profiles`) + resynchronisation `profiles.role` pour éviter la redirection erronée vers `/dashboard/client`; validation `npm run lint` ✅.
- Fix global rendu texte formulaires (`src/app/globals.css`): neutralisation des effets blur/backdrop et de l’overlay autofill WebKit pour éliminer l’effet grisé sous le texte en saisie sur login/register et le reste de l’app; validation `npm run lint` ✅.
- Correctif final auth (`src/app/(auth)/AuthSplitPage.tsx`): neutralisation complète du focus jaune sur tous les champs (login/register) + CTA inscription gold explicite “Créer mon compte”; validation `npm run lint` ✅.
- Ajustement UI de la connexion (`src/app/(auth)/AuthSplitPage.tsx`): focus fields recalibré et CTA “Se connecter” en style gold contrasté; validation `npm run lint` ✅.
- Harmonisation visuelle des pages internes club (`events`, `promoters`, `tables`, `analytics`, `vip`) avec headers/sections/tables alignés sur le nouveau design sidebar; validation `npm run lint` ✅.
- Recentrage layout dashboard club (`src/app/(dashboard)/layout.tsx`) pour garantir la présence permanente des onglets latéraux cibles: Dashboard, Événements, Tables, Promoteurs, Femmes VIP, Analytics.
- Fix de vérification visuelle: route alias `/dashboard/club` (namespace `(dashboard)/dashboard`) redirigée vers la nouvelle page home club refondue pour éviter l’affichage de l’ancienne version.
- Refonte Page 1 dashboard club (`src/app/(dashboard)/club/page.tsx`, `src/app/(dashboard)/club/ClubHomePanels.tsx`) selon le nouveau système cible (header, KPI cards, sections Réservations/Promoteurs).
- Validation technique post-page 1: `npm run lint` ✅.
- Passe mobile élargie: sécurisation du rendu sur petit écran des tableaux dashboard (`ClubHomePanels`, `AnalyticsPanels`, `PendingCommissionsTable`, `PromotersTable`, `ClientReservationsTable`, `GuestListClient`) via `overflow-x-auto`, et KPI home club rendues responsives.
- Validation post-correctifs: `npm run lint` ✅, `npm run build` ✅.
- Exécution `npm run lint` sur la workspace et correction de l’erreur bloquante `react/no-unescaped-entities` dans `PromoterCommissionsPanel`.
- Synchronisation documentaire post-fix sur `CHANGELOG.md`, `docs/PROJECT_STATUS.md` et `docs/errors/ERROR_LOG.md`.
- Correction build/prerender analytics: remplacement des `Skeleton` HeroUI par un skeleton Tailwind natif dans `src/app/(dashboard)/club/analytics/loading.tsx`.
- Nettoyage des warnings ESLint restants dans `scripts/fix-rgpd-col.mjs`.
- Refonte auth login/register livrée selon spec split-screen (layout 60/40, tabs underlined, cards rôles, champs conditionnels) sans toucher `auth.actions.ts`.
- Passe mobile ciblée post-refonte: `AuthSplitPage` ajusté pour claviers mobiles, densité de grille améliorée sur `PromoterPromoPanel` et `ClubVipPanels`.

### 2026-03-02 (alignement strict spec HeroUI sur page tables)

- Refactor des fichiers `src/app/(dashboard)/club/tables/page.tsx` et `src/app/(dashboard)/club/tables/tablesClient.tsx` selon la spec fournie (ordre de colonnes, mapping zone chips, switch promo, style CTA/actions).
- Maintien explicite du composant `FloorPlan` Konva et des Server Actions existantes, sans modification métier.
- Validation technique: diagnostics OK + `npx next build` ✅.

### 2026-03-02 (finalisation analytics HeroUI + validation browser)

- `src/app/(dashboard)/club/analytics/page.tsx`: filtre période par query param (`7d|30d|3m|all`) et fetch Supabase filtré par période pour le club connecté.
- `src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx`: Tabs underlined HeroUI, 6 KPI cards, table top promoteurs et table événements passés avec chips conditionnels.
- `src/app/(dashboard)/club/analytics/loading.tsx` créé pour skeleton complet cards/tables.
- Validation browser exécutée sur `/dashboard/club/analytics` + diagnostics ciblés sans erreur ✅.

### 2026-03-02 (migration HeroUI pages promoteur)

- `src/app/(dashboard)/promoter/guestlist/GuestListClient.tsx`: refonte HeroUI des contrôles/form/tableau en conservant les actions serveur existantes.
- `src/app/(dashboard)/promoter/commissions/PromoterCommissionsPanel.tsx` créé et branché depuis la page serveur commissions.
- `src/app/(dashboard)/promoter/promo/PromoterPromoPanel.tsx` créé et branché depuis la page serveur promo.
- Validation technique: diagnostics OK + `npx next build` ✅.

### 2026-03-02 (refactor HeroUI renforcé page club tables)

- `src/app/(dashboard)/club/tables/tablesClient.tsx`: densification du tableau HeroUI, ajout chips `zone`/`promo`, action row convertie en `Button isIconOnly`.
- Ajout d’un loading state dédié route tables avec `TablesSkeleton` (`Skeleton` cellule par cellule) dans `src/app/(dashboard)/club/tables/loading.tsx`.
- Validation technique: diagnostics OK + `npx next build` ✅.

### 2026-03-02 (refactor HeroUI ciblé page club events)

- `src/app/(dashboard)/club/events/EventListTable.tsx` aligné strictement sur la spec: colonnes demandées, badges statut HeroUI par mapping exact, DJ lineup en chips multiples, bouton action par row en `isIconOnly`.
- `src/app/(dashboard)/club/events/page.tsx`: CTA “Créer un événement” migré vers `Button color='primary' variant='solid' radius='none'` via composant client `CreateEventButton`.
- `src/app/(dashboard)/club/events/loading.tsx`: ajout d’un loading table avec `Skeleton` sur chaque cellule via `EventTableSkeleton`.
- Validation technique: diagnostics OK + `npx next build` ✅.

### 2026-03-02 (migration HeroUI pages dashboard client)

- Création des composants client HeroUI:
  - `src/app/(dashboard)/client/ClientDashboardPanels.tsx`
  - `src/app/(dashboard)/client/reservations/ClientReservationsTable.tsx`
  - `src/app/(dashboard)/client/waitlist/ClientWaitlistList.tsx`
- Pages serveur client conservées pour auth/role/fetch/agrégations et branchées sur ces composants.
- Actions serveur inchangées (`cancelReservationAction`, `leaveWaitlistAction`) avec formulaires toujours actifs.
- Validation technique: diagnostics OK + `npx next build` ✅.

### 2026-03-02 (migration HeroUI page analytics)

- Création de `src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx` avec composants HeroUI (`Card`, `Table`, `Chip`).
- `src/app/(dashboard)/club/analytics/page.tsx` converti en orchestration serveur (guards + fetch + agrégations) puis rendu délégué au composant client.
- Validation technique: diagnostics OK + `npx next build` ✅.

### 2026-03-02 (migration HeroUI page promoteurs)

- Création de `src/app/(dashboard)/club/promoters/PromotersTable.tsx` pour le tableau classements/statuts en HeroUI (`Table`, `Chip`).
- Migration de `src/app/(dashboard)/club/promoters/AddPromoterModal.tsx` vers HeroUI (`Modal`, `Input`, `Slider`, `Button`) avec conservation de `createPromoterAction`.
- `src/app/(dashboard)/club/promoters/page.tsx` branché sur le nouveau composant client sans modification des agrégations serveur.
- Validation technique: diagnostics OK + `npx next build` ✅.

### 2026-03-02 (migration HeroUI page tables)

- Refonte de `src/app/(dashboard)/club/tables/tablesClient.tsx` avec composants HeroUI (`Button`, `Table`, `Modal`, `Input`, `Select`, `Switch`).
- Conservation de la logique métier existante (`createTableAction`, `updateTablePositionAction`) et du floor plan en mode édition.
- Validation technique: diagnostics fichier OK + `npx next build` ✅.

### 2026-03-02 (migration HeroUI page events)

- Création de `src/app/(dashboard)/club/events/EventListTable.tsx` en composant client HeroUI (`Table`, `Chip`, `Modal`).
- Adaptation de `src/app/(dashboard)/club/events/page.tsx` pour garder les guards/fetch serveur et déléguer uniquement le rendu interactif à HeroUI.
- Fix build après migration: suppression des imports HeroUI directs des pages serveur (`src/app/(dashboard)/club/page.tsx`, `src/app/(dashboard)/club/events/page.tsx`).
- Validation: `npx next build` ✅.

### 2026-03-02 (intégration HeroUI + fix server/client provider)

- Installation de `@heroui/react` et `framer-motion`, puis création de `tailwind.config.ts` avec plugin HeroUI et tokens NightTable.
- Ajout du provider client `src/app/providers.tsx` et branchement dans `src/app/layout.tsx`.
- Correction runtime Next.js (`createContext only works in Client Components`) en retirant `HeroUIProvider` direct du layout serveur.
- Test de présence HeroUI lancé sur `/dashboard/club` via un bouton `Button color="primary"`.

### 2026-03-02 (sidebar v2 + activation route events/new)

- Refonte visuelle de la sidebar dashboard (`src/app/(dashboard)/layout.tsx`) pour alignement avec le style Linear v2 des pages club.
- Ajout de l’alias `src/app/(dashboard)/dashboard/club/events/new/page.tsx` pour activer l’URL `/dashboard/club/events/new`.
- Validation technique: aucun diagnostic sur les fichiers modifiés.

### 2026-03-02 (ajustement design visible page club events)

- Refonte visuelle accentuée sur `src/app/(dashboard)/club/events/page.tsx` pour rendre le changement immédiatement perceptible côté utilisateur.
- Ajout d’un header gradient avec badge version, d’une toolbar dense au-dessus du tableau et d’un empty state enrichi.

### 2026-03-02 (fix runtime page club events)

- Diagnostic runtime sur `/dashboard/club/events`: `TypeError` causé par des tableaux Supabase potentiellement `null`.
- Correctif appliqué dans `src/app/(dashboard)/club/events/page.tsx` avec fallback `?? []` pour `event_tables` et `dj_lineup`.
- Résultat: la page ne crash plus quand un événement n’a pas encore de tables liées ou de DJ lineup.

### 2026-03-02 (fix alias routes dashboard club)

- Création des alias manquants sous `src/app/(dashboard)/dashboard/club/` pour `events` et `tables`.
- Les URLs testées par l’utilisateur (`/dashboard/club/events`, `/dashboard/club/tables`) sont maintenant mappées vers les pages existantes côté club.
- Vérification diagnostics: aucun problème TypeScript sur les nouveaux fichiers.

### 2026-03-02 (fix chemins dashboard club + ajout analytics)

- Correction du menu rôle `club` dans `src/app/(dashboard)/layout.tsx` : les 5 entrées ne pointent plus toutes sur `/dashboard/club`.
- Mise en place des routes dédiées dans la navigation: `/dashboard/club/events`, `/dashboard/club/tables`, `/dashboard/club/promoters`, `/dashboard/club/analytics`.
- Création de la page analytics club (KPIs + réservations récentes) et alias `/dashboard/dashboard/club/analytics`.
- Validation technique: diagnostics sans erreur sur les fichiers modifiés.

### 2026-03-01 (refonte dashboard club events — itération Linear)

- Refonte UI de `src/app/(dashboard)/club/events/page.tsx` en style dense (sans changement de logique Supabase).
- Passage d’une grille de cartes vers une table opérationnelle compacte (événement, date, horaire, DJ, tables disponibles, statut, action).
- Ajout d’un bandeau KPI minimal (soirées publiées, tables disponibles, capacité totale) pour lecture rapide.
- Validation technique: diagnostics TypeScript/ESLint OK sur le fichier modifié.

### 2026-03-01 (refonte dashboard club home — itération Linear)

- Refonte UI de `src/app/(dashboard)/club/page.tsx` sans toucher la logique métier ni les fetch Supabase.
- Header densifié (20px semibold + sous-meta slash), actions alignées à droite.
- Cards métriques passées au format dense (radius 8, padding 16, valeurs Cormorant 32px, micro-variations).
- Table réservations alignée sur style Linear (rows 40px, checkbox colonne gauche, badges inline, actions visibles au hover, pagination sobre en pied).
- Validation locale: serveur dev relancé proprement et ouverture browser sur `/dashboard/club` (redirection login attendue hors session).

### 2026-03-01 (refonte landing page — itération Soho House)

- Refonte ciblée de `src/app/page.tsx` en approche page-par-page, sans changement de logique métier.
- Hero reconstruit en plein écran avec overlay premium, typo Cormorant light 72/48 et CTA carré gold.
- Section "Clubs partenaires" créée en grille 3/1 avec hover reveal (nom, ville, lien), ratios 16/9 et transitions 400ms.
- Correction d’une URL image Unsplash invalide (404) sur la première carte club.
- Validation effectuée dans le navigateur intégré sur `http://localhost:3000`.

### 2026-03-01 (smoke test VIP module + fix alias redirect)

- Fix: alias VIP redirect infini corrigé (re-export pattern à la place de `redirect()`)
- Seed enrichi: 2 VIP invitations + 1 safety check-in ajoutés à `seed-demo-data.mjs`
- Smoke test: `scripts/smoke-test-vip.mjs` — 7/7 routes OK (5×200, 2× role guard redirect)
- Build + lint verts après correction aliases

### 2026-03-01 (fix RLS + colonne manquante female_vip_profiles)

- Diagnostic: pages VIP affichaient "Module indisponible" / "Profil indisponible" en navigateur
- Cause racine 1: colonne `rgpd_consent_at` absente en DB distante → Postgres error 42703 sur tous les SELECT
- Cause racine 2: policies RLS SELECT et UPDATE jamais appliquées sur `female_vip_profiles` (seules 2 INSERT existaient)
- Fix DB: script `scripts/apply-missing-rls.mjs` connecté en direct Postgres, ajout colonne + 2 policies (SELECT/UPDATE)

### 2026-03-01 (dashboard promoteur — pages dédiées)

- Correction sidebar promoteur: liens Guest list, Commissions et Lien promo pointent vers des routes distinctes
- Création page commissions `/dashboard/promoter/commissions` (KPIs CA/pending/versé + table historique)
- Création page lien promo `/dashboard/promoter/promo` (lien, copier/partager, clics, conversion, mini-graph 7j)
- Alias routes créées sous `(dashboard)/dashboard/promoter/`
- Build vert, 4 routes promoteur actives
- Fix code: restauration `rgpd_consent_at` dans types, SELECT queries et update payload
- État final: 4 policies (2 INSERT + 1 SELECT + 1 UPDATE), colonne présente, code aligné

### 2026-03-01 (seed démo aligné + diagnostic dérive schéma)

- Seed démo enrichi pour 3 événements futurs, 5 tables, 2 promoteurs, 3 réservations, avec fallback tolérant si objets floor plan absents.
- Script de vérification seed ajouté/renforcé (`scripts/verify-demo-seed.mjs`) avec diagnostics explicites des erreurs de schéma.
- Migration de rattrapage créée (`supabase/migrations/011_floor_plan_positions.sql`) pour ajouter `floor_plans` et colonnes positions.
- Vérification actuelle: club/events/tables/promoters/réservations ✅ ; positions floor plan ❌ (objets absents en DB distante tant que migration non appliquée).

### 2026-03-01 (module femmes validées + validation tag)

- Vérification tag MVP confirmée: `v0.3-mvp-complete` existe et pointe sur `8a04f9d`.
- Implémentation du module `female_vip` terminée: dashboard complet avec statut de validation, clubs validants, événements à venir et formulaire de profil.
- Ajout d’une Server Action dédiée `updateVipProfileAction` avec validation Zod, contrôle rôle/auth et revalidation cache.
- Ajout des états `loading`/`error` pour la route VIP et redirection de l’alias `dashboard/dashboard/vip`.
- Validation exécutée: `npm run lint` ✅.

### 2026-03-01 (prompts VIP restants implémentés)

- Prompt migration: `supabase/migrations/012_female_vip_module.sql` appliquée sur la base distante (`vip_invitations`, `vip_safety_checkins`, colonnes contact d’urgence + RLS).
- Prompt pages VIP: création de `src/app/(dashboard)/vip/invitations/page.tsx`, `src/app/(dashboard)/vip/profile/page.tsx`, `src/app/(dashboard)/vip/safety/page.tsx`.
- Prompt validation club: création de `src/app/(dashboard)/club/vip/page.tsx` (pending/validated/invitations/tables promos).
- Prompt navigation/alias: ajout des routes alias `src/app/(dashboard)/dashboard/vip/invitations/page.tsx`, `src/app/(dashboard)/dashboard/vip/profile/page.tsx`, `src/app/(dashboard)/dashboard/vip/safety/page.tsx`, `src/app/(dashboard)/dashboard/club/vip/page.tsx`.
- Validations techniques exécutées: `npm run lint` ✅, `npm run build` ✅, contrôle schéma Supabase VIP ✅.

### 2026-03-01 (publication tag v0.3)

- Commit de release créé: `8a04f9d`.
- Tag annoté publié: `v0.3-mvp-complete` (push branche + tag effectués).
- Changelog enrichi avec la section release `v0.3-mvp-complete` et statut `Unreleased` réinitialisé.

### 2026-03-01 (landing finale + seed démo + release prep)

- Landing publique finalisée (`src/app/page.tsx`) avec styles NightTable, CTA propres, metadata SEO et cartes événements via `next/image`.
- Configuration Next mise à jour pour images externes (`next.config.ts` → `images.remotePatterns` Unsplash).
- Script `npm run seed:demo` créé et validé en exécution réelle (comptes démo + données métier complètes pour dashboard/promoteur/client).
- Correction de compatibilité schéma déployé dans le seed (colonnes absentes + contrainte `ON CONFLICT` non disponible) et correction typage Supabase admin dans `src/lib/promoter.actions.ts`.
- Note de version préparée pour `v0.3-mvp-complete` (`docs/v0.3-mvp-complete.md`).
- Validations exécutées: `npm run seed:demo` ✅, `npm run lint` ✅, `npm run build` ✅.

### 2026-03-01 (module promoteur + dashboard client)

- Prompt 1 implémenté: page Guest List promoteur avec événements futurs, ajout invité (prénom/nom/téléphone), statuts et arrivée optimiste + compteurs live.
- Prompt 2 implémenté: page gestion promoteurs club avec classement, top 5 mensuel, commissions en attente et modal de création promoteur (commission slider 5–15%).
- Prompt 3 implémenté: dashboard client complet (home score + prochaine réservation, page réservations avec conditions revendre/annuler, page waitlist avec action quitter).
- Ajout des server actions associées (`promoter.actions.ts`, `reservation.actions.ts`) avec validations Zod, contrôles auth/ownership et revalidatePath.
- Validation exécutée: `npm run lint` ✅.

### 2026-03-01 (booking/checkout/webhook)

- Implémentation du parcours public événement avec sélection de table interactive (`FloorPlan` mode booking).
- Mise en place du checkout 3 étapes (`infos client`, `options`, `paiement`) et raccordement Server Action.
- Création de `src/lib/reservation.actions.ts` (validation Zod, disponibilité table, prépaiement, PaymentIntent, persist réservation).
- Extension majeure du webhook Stripe (`succeeded`, `payment_failed`, subscriptions) + hooks notifications SMS/email.
- Ajout migration `008_reservations_checkout_fields.sql`, push Supabase effectué.
- Exécution tests E2E webhook (scénarios succès/échec), validation des statuts DB, puis nettoyage des fixtures.

### 2026-03-01 (incidents & mitigation)

- Diagnostic d’un décalage schéma (`events.notoriety` absent en DB distante), correctif code appliqué.
- Constat `STRIPE_SECRET_KEY` locale invalide (`401`), mitigation via `stripe trigger` + metadata `reservation_id`.
- Mise à jour de la base de connaissance erreurs (`docs/errors/*`) avec nouveaux incidents.

### 2026-03-01 (process doc renforcé)

- Ajout d’une checklist “Session close (obligatoire)” dans le template incident (`docs/errors/templates/incident-template.md`).
- Alignement avec la règle auto-documentation ajoutée dans `.github/copilot-instructions.md`.
- Synchronisation immédiate `ERROR_LOG` + `PROJECT_STATUS` + `CHANGELOG` pour verrouiller le process.

### 2026-03-01 (audit complet dossier)

- Audit global exécuté (`lint` + `build`) pour vérifier erreurs réelles du repo.
- Correctif build appliqué globalement sur les composants/pages en erreur (`ReactElement` explicite au lieu de `JSX.Element`).
- Classement documentaire renforcé via refonte de `docs/README.md` (pilotage, incidents, sources métier, conventions).
- Incident build documenté dans `docs/errors/incidents/2026-03-01-dashboard-events-jsx-namespace-build.md`.

### 2026-03-01 (audit final auth + validation verte)

- Correctif `login/register` pour supprimer la dépendance `useSearchParams` au build/prerender et éviter le warning lint sur `setState` dans `useEffect`.
- Validation finale exécutée: `npm run lint` ✅ et `npm run build` ✅.
- Clôture de l’audit avec synchro documentaire obligatoire (`ERROR_LOG`, `PROJECT_STATUS`, `CHANGELOG`).

### 2026-03-01 (durcissement règles composants Copilot)

- Ajout d’un bloc complet “Component Development Rules — MANDATORY” dans `.github/copilot-instructions.md`.
- Standardisation explicite du process UI (références component.gallery, accessibilité, tokens, checklist de sortie).

### 2026-03-01 (refonte UI full scope dashboard/public/auth)

- Audit et mise à jour de tous les fichiers TSX ciblés (`src/components`, `src/app/(dashboard)`, `src/app/(public)`, `src/app/(auth)`) selon les Component Development Rules.
- Ajout systématique des headers composants, suppression des styles Tailwind par défaut dans le scope demandé, et homogénéisation des états hover/focus/disabled.
- Renforcement a11y (aria-label/aria-pressed, focus ring gold, cibles min-h 44px sur actions critiques) sans impact métier.
- Validation post-refonte exécutée et réussie: `npm run lint` ✅, `npm run build` ✅.

### 2026-03-01 (promoteur tracking + commissions)

- Implémentation complète du tracking promo: validation `?promo`, cookie `nighttable_promo` 48h, attribution post-réservation non bloquante (`promoter_id`, `promo_code_used`, `promoter_clicks`).
- Webhook Stripe enrichi pour création commission promoteur à `payment_intent.succeeded` avec calcul sur `prepayment_amount` et mise à jour `promoter_profiles.total_earned` (sans bloquer confirmation réservation).
- Dashboard promoteur branché sur données réelles (CA mois, clients confirmés, pending commissions, total versé, historique commissions, lien promo copy/share + conversion).
- Migration `supabase/migrations/009_commissions_amount_rate.sql` ajoutée pour champs `amount`/`rate` compatibles reporting.
- Validation finale exécutée: `npm run lint` ✅, `npm run build` ✅.

### 2026-03-01 (gouvernance prompts & optimisation tokens)

- Mise à jour de `.github/copilot-instructions.md` avec un bloc dédié à l’optimisation tokens et à la discipline de prompting.
- Ajout des règles de sélection de modèles, chargement ciblé `#file:*`, et templates standardisés par type de tâche.

### 2026-03-01 (correction diagnostics copilot-instructions)

- Correction de 14 diagnostics VS Code dans `.github/copilot-instructions.md` liés aux références `#file:*`.
- Alignement des chemins vers des fichiers existants du repo et validation finale sans erreur.

### 2026-03-01 (correction finale 7 diagnostics markdown)

- Résolution de 7 faux positifs restants dans `.github/copilot-instructions.md`.
- Ajustement du pattern de référence `#file:` vers `# file:` pour éviter l’auto-résolution en chemins cassés.
- Nettoyage des alias temporaires `.github/BUSINESS_RULES.md`, `.github/DESIGN_SYSTEM.md`, `.github/ARCHITECTURE.md`.

### 2026-03-01 (stabilisation dev + Stripe Elements)

- Correction du démarrage local: `npm run dev` exécute désormais un pré-nettoyage lock/ports (`dev:clean`) avant `next dev`.
- Intégration du formulaire Stripe Elements dans le checkout (`PaymentElement` + `stripe.confirmPayment`).
- Validation post-correctifs exécutée: `npm run lint` ✅, `npm run build` ✅.

### 2026-03-01 (idempotence webhook + healthcheck env)

- Ajout d’un journal d’events `stripe_webhook_events` pour garantir l’idempotence des webhooks Stripe.
- Route webhook durcie: statut `processing/processed/failed` + court-circuit des events déjà traités.
- Nouveau script `npm run healthcheck:env` (chargement `.env.local`, checks Supabase/Stripe).
- Exécution healthcheck: échec attendu sur `STRIPE_SECRET_KEY` locale invalide, le reste des checks est vert.

### 2026-03-01 (synchronisation clés Stripe test)

- Clés Stripe test locales resynchronisées depuis Stripe CLI dans `.env.local` (`sk_test` + `pk_test`).
- Validation post-fix exécutée: `npm run healthcheck:env` ✅ (checks Stripe/Supabase tous verts).

### 2026-03-01 (durcissement idempotence webhook concurrence)

- Correction d’un cas de concurrence sur `stripe_webhook_events`: les doublons `event_id` renvoyaient `500`.
- Route webhook patchée pour traiter `23505` en réponse idempotente `200` (`Already processing`).
- Validation post-correctif exécutée: `npm run lint` ✅, `npm run build` ✅.

### 2026-02-28

- Sauvegarde des docs sources (.docx + .txt) dans le repo.
- Création docs `ARCHITECTURE.md`, `ROADMAP.md`, `CHANGELOG.md`, index docs.
- Ajout liens GitHub/release/tags dans le README.
- Création de ce fichier de suivi vivant.

### 2026-02-28 (suivi continu activé)

- Activation du processus de mise à jour continue de `PROJECT_STATUS.md` à chaque session.
- Ajout de la règle dans `README.md` et traçage dans `CHANGELOG.md`.

### 2026-02-28 (aperçu final produit)

- Mise à jour de `src/app/demo/page.tsx` avec un aperçu final plus complet du produit.
- Ajout des modules clés (Client, Club, Promoteur, VIP, Paiements, IA) dans la démo.
- Préparation d’une visualisation inspirée de l’UX event discovery de Shotgun (sans copie).

### 2026-02-28 (itération visuelle avancée)

- Renforcement du style visuel de la démo: gradients colorés, ambiance plus immersive.
- Ajout de cartes visuelles avec images pour les sections collections et événements.
- Alignement UX sur une logique marketplace événementielle premium (inspiration Shotgun, identité NightTable).

### 2026-02-28 (home + club publique refondues)

- Refonte visuelle de la home `src/app/page.tsx` en version plus production-ready.
- Création de la page club publique dynamique `src/app/(public)/clubs/[slug]/page.tsx`.
- Ajout d’un rendu riche en images/couleurs pour mieux projeter le produit final.

### 2026-02-28 (cartographie finale des pages)

- Création de `src/app/final-pages/page.tsx` avec la vision complète des pages finales.
- Statut `live/planned` ajouté par section (Public, Auth, Client, Club, Promoteur, VIP, Admin).
- Lien ajouté depuis la home pour accéder au plan global produit.

### 2026-02-28 (roadmap interactive)

- Création de `src/app/build-plan/page.tsx` avec ordre de build page par page.
- Ajout des priorités (P0/P1/P2), estimations et dépendances par étape.
- Intégration de l’accès à cette roadmap depuis `final-pages`.

### 2026-02-28 (kanban + filtres rôles)

- Transformation de `build-plan` en vue Kanban (Now / Next / Later).
- Ajout de filtres par rôle: Public, Auth, Client, Club, Promoteur, VIP, Admin, Transverse.
- Visualisation dynamique des items selon filtre actif.

### 2026-02-28 (priorité 1 funnel public/auth)

- Refonte visuelle de `login` et `register` avec expérience premium cohérente.
- Création de la page index clubs `src/app/(public)/clubs/page.tsx`.
- Upgrade de `reserve` avec formulaire sélection + récapitulatif estimé + gestion promo code.
- Ouverture des pages de validation: `/login`, `/register`, `/clubs`, `/reserve?promo=NIGHTPARIS`.

### 2026-02-28 (correctif runtime auth local)

- Diagnostic des routes `/login` et `/register` en erreur HTTP 500 en local.
- Identification de la cause dans `src/proxy.ts`: initialisation Supabase sans variables d’environnement requises.
- Ajout d’un fallback: si config Supabase absente, laisser passer les routes publiques/auth et rediriger uniquement `/dashboard*` vers `/login` avec message explicite.
- Validation post-correctif: `/login` et `/register` répondent de nouveau en `200`.

## Template d’entrée de session

Copier-coller ce bloc pour chaque nouvelle session:

```markdown
### YYYY-MM-DD
- Objectif session:
- Fait:
- Blocages:
- Décisions:
- Prochaine étape:
```
