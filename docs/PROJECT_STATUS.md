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

- Date: 2026-03-02
- Auteur: GitHub Copilot

## Vue synthèse

- Progression MVP (estimation): 85%
- Axe prioritaire actuel: design polish des pages publiques + landing marketing

## Fait

- Dernière mini passe de cohérence exécutée sur `promoter` (commissions/promo/guestlist): CTA principaux alignés avec repères iconographiques du dashboard; validation `npm run lint` + `npm run build` ✅.
- Cohérence CTA cross-dashboard finalisée: page `Réservations` alignée avec repères iconographiques (`＋` et `↺`) pour les actions principales; validation `npm run lint` + `npm run build` ✅.
- Micro-passe UX terminée sur `Clients & VIPs`: différenciation visuelle des CTA de ligne via icônes (`Voir fiche` / `Appeler` / `Email`) sur desktop et mobile; validation `npm run lint` + `npm run build` ✅.
- Actions contact direct ajoutées sur `Clients & VIPs` (boutons conditionnels `Appeler` et `Email` par ligne desktop/mobile) avec données `phone/email` séparées côté serveur; validation `npm run lint` + `npm run build` ✅.
- Configuration des boutons par ligne finalisée sur `Clients & VIPs`: action `Voir fiche` ajoutée (desktop + mobile) avec ouverture de `/dashboard/club/reservations` préfiltré par client (`?q=`); validation `npm run lint` + `npm run build` ✅.
- Configuration complète des boutons de la page `Clients & VIPs` finalisée (filtres avancés avec scroll+focus, CTA d’état vide actionnables) avec validation `npm run lint` + `npm run build` ✅.
- Micro-passe sidebar terminée: état actif `Clients & VIPs` passé en violet sur navigation desktop et mobile pour coller à la maquette; validation `npm run lint` + `npm run build` ✅.
- Passe pixel-perfect finale sur `Clients & VIPs` appliquée: hiérarchie typo ajustée, barre recherche+tabs densifiée, indicateur dynamique “+X nouveaux ce mois” ajouté; validation `npm run lint` + `npm run build` ✅.
- Nouvelle page dashboard club `Clients & VIPs` livrée (`/dashboard/club/clients`) avec overview KPI, segments clés, recherche/filtres et liste clients (desktop table + cards mobile), plus alias route et entrée sidebar; validation `npm run lint` + `npm run build` ✅.
- Micro-passe de finition dashboard VIP appliquée: CTA rapides d’en-tête ajoutés sur `invitations/profile/safety` + grilles formulaires alignées mobile-first (`md:grid-cols-2`), validation `npm run lint` + `npm run build` ✅.
- Harmonisation finale des dashboards `promoter` et `vip` appliquée (headers gradient, quick actions, densité visuelle alignée au référentiel `club`) avec validation `npm run lint` + `npm run build` ✅.
- Extension de la passe “boutons configurés” aux autres dashboards: `client/reservations` connecté à une vraie action de revente (`createResaleListingAction`) + `PendingCommissionsTable` corrigé en `submit`; validation `npm run lint` + `npm run build` ✅.
- Sweep configuration boutons dashboard club terminé: actions câblées sur `events` (dupliquer), `promoters` (copier code promo), `reservations` (CTA création), avec validation `npm run lint` + `npm run build` ✅.
- Micro-passe finale appliquée sur `/dashboard/club/reservations` (typographie, poids des labels, densité en-têtes/lignes desktop, contraste chips/pills) pour rapprochement visuel maximal au mock; validation `npm run lint` + `npm run build` ✅.
- Passe visuelle “pixel-closer” appliquée sur `/dashboard/club/reservations` pour alignement mock (header horizontal actions, toolbar filtres pills, shell table “Liste des réservations”, densité lignes desktop + cards mobile); validation `npm run lint` + `npm run build` ✅.
- Correctif runtime `/dashboard/club/reservations` appliqué: suppression du filtre invalide `reservations.club_id` et passage à un filtrage par `event_id` des événements du club; validation `npm run lint` + `npm run build` ✅.
- Nouvelle page `/dashboard/club/reservations` livrée (desktop table + cards mobile, filtres/tabs/recherche, KPI, état vide, loading/error, alias dashboard) + item navigation ajouté dans le shell club; validation `npm run lint` + `npm run build` ✅.
- Correctif diagnostic VS Code sur analytics: import `AnalyticsPanels` fiabilisé via alias absolu dans `src/app/(dashboard)/club/analytics/page.tsx` (TS2307 résolu, `npm run lint` ✅).
- Page 7 `/dashboard/club/settings` livrée: page serveur + panel client + server action de mise à jour + états `loading/error` + alias `/dashboard/club/settings`, avec validation `npm run lint` + `npm run build` ✅.
- Passe finale de cohérence exécutée sur le dashboard club (pages 1→6 + settings): hiérarchie visuelle/espacement/CTA alignés avec le shell club redesign.
- Page 6 `/dashboard/club/analytics` livrée avec rupture visuelle desktop/mobile: header gradient, tabs mobiles scrollables, KPI cards modernisées, cards mobiles pour tableaux, loading/error dédiés.
- Page 5 `/dashboard/club/vip` livrée avec rupture visuelle desktop/mobile: header gradient, KPI cards, sections VIP modernisées, cards mobile pour VIP validées, modal invitation bottom-sheet mobile.
- Page 4 `/dashboard/club/promoters` livrée avec rupture visuelle desktop/mobile: header gradient, KPI cards, cards mobiles pour le ranking, table desktop restylée, modal bottom-sheet mobile.
- Page 3 `/dashboard/club/tables` livrée avec rupture visuelle nette (desktop/mobile): header gradient, KPI cards, listing mobile en cards, table desktop restylée et modal bottom-sheet mobile.
- Refonte visuelle renforcée de `/dashboard/club/events` (desktop + mobile) appliquée pour sortir définitivement de l’ancien rendu perçu.
- Stabilisation du démarrage local: script `dev` basculé en `--webpack` + reset renforcé des locks/artefacts `.next/dev` pour supprimer les erreurs runtime de factory module en boucle.
- Page 2 `/dashboard/club/events` alignée web/mobile: cards mobiles dédiées + table desktop/tablette, colonnes secondaires masquées sur tablette, CTA tactile renforcé.
- Gouvernance Copilot renforcée: section “Responsive & Visual Consistency Rules — MANDATORY” ajoutée dans `.github/copilot-instructions.md`.
- Warnings runtime dashboard club corrigés: `ResponsiveContainer` stabilisé + `aria-label` ajouté sur les `Progress` de `ClubHomePanels`.
- Alignement mobile shell dashboard club: header mobile refondu + navigation basse active pour cohérence visuelle avec la sidebar desktop.
- Correctif Page 1 `/dashboard/club` en état vide: suppression du fallback legacy pour afficher systématiquement le nouveau dashboard (même sans soirée du soir).
- Page 1 `/dashboard/club` terminée: 4 KPI, bloc revenus (BarChart), bloc espaces les plus prisés (Progress), table réservations récentes alignés sur la nouvelle direction visuelle.
- Refonte de la base layout dashboard club livrée (`src/app/(dashboard)/layout.tsx` + `DashboardSidebarNav.tsx`): sidebar 200px, sections GÉNÉRAL/GESTION, actif gold, item Paramètres ajouté.
- Correctif UX mobile dashboard club: suppression de la barre d’onglets du haut pour conserver une seule navigation (barre fixe du bas) et éviter le doublon.
- Correctif définitif auth inputs: champs de connexion/inscription migrés en inputs natifs stylés (sans couche HeroUI Input) pour éliminer la superposition persistante du texte.
- Correctif visibilité onglets club: fallback rôle embarqué dans le layout dashboard pour afficher les onglets club même si `profiles.role` est temporairement erroné.
- Correctif final zones de texte: suppression de la superposition des caractères sur les champs HeroUI (auth + global) en neutralisant les pseudo-couches input et en forçant le text fill net.
- Navigation dashboard club corrigée en viewport étroit: barre d’onglets mobile ajoutée dans le header avec tous les accès (dashboard/events/tables/promoters/vip/analytics) lorsque la sidebar desktop est masquée.
- Fix critique auth routing: un compte club ne retombe plus sur `/dashboard/client` quand `profiles.role` est vide/désynchronisé; fallback dynamique sur les tables rôle + resync du rôle profil.
- Correctif global formulaires: suppression de la zone grisée/floue lors de la saisie sur tout le site (inputs HeroUI + natifs, états autofill inclus) via `src/app/globals.css`.
- Auth polish complémentaire: suppression totale du highlight jaune au focus sur les champs de connexion/inscription + bouton inscription “Créer mon compte” rendu fortement visible.
- Correction UX auth: focus des champs de connexion adouci (plus de rendu jaune agressif en saisie) + bouton “Se connecter” renforcé visuellement pour un CTA immédiatement lisible.
- Harmonisation UI des pages club internes (`events`, `tables`, `promoters`, `vip`, `analytics`) pour reprendre le même langage visuel que la home club et la sidebar (headers compacts, blocs homogènes, densité tableau alignée).
- Recentrage du shell dashboard club sur l’objectif UX validé: sidebar gauche unifiée avec tous les onglets attendus (Dashboard, Événements, Tables, Promoteurs, Femmes VIP, Analytics) dans `src/app/(dashboard)/layout.tsx`.
- Correction de mapping route club: `/dashboard/club` sert désormais la page refondue via re-export alias (`src/app/(dashboard)/dashboard/club/page.tsx`), suppression de l’ancienne vue legacy visible en browser.
- Refonte Page 1 `/dashboard/club` livrée (style Velvet Rope Analytics NightTable): header cible, 4 KPI cards harmonisées, table réservations avec avatar+email, table promoteurs avec indicateur lien actif.
- Passe mobile étendue finalisée sur les vues tableaux dashboard (club home/analytics/promoters, client reservations, promoter guestlist) avec wrappers `overflow-x-auto` + KPI home club responsive; validation globale `npm run lint` + `npm run build` ✅.
- Audit mobile ciblé exécuté + correctifs critiques appliqués (auth split-screen scroll-safe, grille activité promoteur, cartes VIP pending) avec validation lint/build ✅.
- Refonte complète auth UI (`/login`, `/register`) en split-screen inspiré Velvet Rope avec composant partagé `src/app/(auth)/AuthSplitPage.tsx` (tabs HeroUI, formulaire connexion, formulaire inscription à rôles, animations et responsive mobile full-form).
- Lint warnings résiduels nettoyés dans `scripts/fix-rgpd-col.mjs` (suppression imports/constantes non utilisées).
- Build global stabilisé: correction du `loading.tsx` analytics pour éviter l’import HeroUI en composant serveur (fix `createContext is not a function` au prerender).
- Correction globale lint: erreur bloquante `react/no-unescaped-entities` résolue dans `src/app/(dashboard)/promoter/commissions/PromoterCommissionsPanel.tsx`.
- `/dashboard/club/analytics` finalisée selon le prompt complexe: Tabs période (`7 jours`, `30 jours`, `3 mois`, `Tout`), 6 metric cards HeroUI avec variation `Chip`, table top promoteurs, table événements passés, empty state et loading skeleton.
- Validation browser effectuée sur `/dashboard/club/analytics` après refactor.
- `src/app/(dashboard)/club/tables/page.tsx` et `src/app/(dashboard)/club/tables/tablesClient.tsx` alignés sur la spec HeroUI détaillée (colonnes, chips zone, switch promo, modal inputs/select, CTA primaire uppercase, actions icon-only, loading rows Skeleton).
- Pages promoteur migrées vers HeroUI (`guestlist`, `commissions`, `promo`) avec composants dédiés pour les panneaux commissions et promo.
- Refactor HeroUI renforcé de `src/app/(dashboard)/club/tables/tablesClient.tsx` terminé: chips zone/promo, action de sélection icon-only, et loading dédié avec `Skeleton` par cellule.
- Refactor ciblé HeroUI de `src/app/(dashboard)/club/events/page.tsx` terminé selon cahier précis: table `Table*`, statuts en `Chip`, DJ lineup en chips, actions row `Button isIconOnly`, CTA création en `Button` HeroUI et loading en `Skeleton` cellule par cellule.
- Dashboard client migré vers HeroUI (`src/app/(dashboard)/client/page.tsx`, `src/app/(dashboard)/client/reservations/page.tsx`, `src/app/(dashboard)/client/waitlist/page.tsx`) avec composants dédiés home/réservations/waitlist.
- Dashboard club analytics migré vers HeroUI (`src/app/(dashboard)/club/analytics/page.tsx`, `src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx`) avec cartes KPI et tableau réservations.
- Dashboard club promoteurs migré vers HeroUI (`src/app/(dashboard)/club/promoters/page.tsx`, `src/app/(dashboard)/club/promoters/PromotersTable.tsx`, `src/app/(dashboard)/club/promoters/AddPromoterModal.tsx`).
- Dashboard club tables migré vers HeroUI (`src/app/(dashboard)/club/tables/tablesClient.tsx`) avec table de sélection, modal d’ajout et switch promo.
- Dashboard club events migré vers HeroUI (`src/app/(dashboard)/club/events/page.tsx`, `src/app/(dashboard)/club/events/EventListTable.tsx`) avec tableau, badges de statut et modal détails.
- Intégration HeroUI de base complétée: dépendances installées (`@heroui/react`, `framer-motion`), `tailwind.config.ts` créé (plugin + thème NightTable), provider client ajouté via `src/app/providers.tsx` et branché dans `src/app/layout.tsx`.
- Sidebar dashboard refondue en style Linear v2 dans `src/app/(dashboard)/layout.tsx` (bloc brand/version, liens plus lisibles, navigation mobile harmonisée).
- Route `/dashboard/club/events/new` rendue accessible via alias `src/app/(dashboard)/dashboard/club/events/new/page.tsx`.
- Dashboard club events (itération visuelle v2) renforcé sur `src/app/(dashboard)/club/events/page.tsx` : header gradient, badge version, toolbar table et empty state plus distincts.
- Page club events stabilisée (`src/app/(dashboard)/club/events/page.tsx`) : gestion défensive des valeurs nulles (`event_tables`, `dj_lineup`) pour éviter le crash runtime.
- Alias dashboard club manquants créés pour `/dashboard/club/events` et `/dashboard/club/tables` (`src/app/(dashboard)/dashboard/club/events/page.tsx`, `src/app/(dashboard)/dashboard/club/tables/page.tsx`).
- Navigation dashboard club corrigée (`src/app/(dashboard)/layout.tsx`) : boutons Événements, Tables, Promoteurs, Analytics redirigent vers leurs routes dédiées.
- Page `/dashboard/club/analytics` créée (`src/app/(dashboard)/club/analytics/page.tsx`) + alias dashboard (`src/app/(dashboard)/dashboard/club/analytics/page.tsx`).
- Dashboard club events (itération page 3) refondu en style Linear sur `src/app/(dashboard)/club/events/page.tsx` : header compact, KPIs de suivi, table dense avec statut/tables/actions.
- Dashboard club home (itération page 2) refondu en style Linear sur `src/app/(dashboard)/club/page.tsx` : header compact, métriques denses, table réservations compacte avec actions au hover.
- Landing page itération 1 (mode page par page) finalisée en style Soho House: hero plein écran éditorial, section clubs partenaires image-first, CTA final minimal, validation visuelle locale sur `/`.
- Landing page v2 complète (Navbar, Hero, Stats, 3 étapes, Events featured, 4 sections rôle, CTA final, Footer) + animations CSS (fade-in-up, glow-pulse, stagger) + a11y + responsive.
- Refonte UI cohérente (Dashboard/Public/Auth + FloorPlan): headers composants, palette NightTable, états interactifs et a11y harmonisés sur le périmètre TSX prioritaire.
- Ajout des règles “Token Optimization Rules — MANDATORY” dans `.github/copilot-instructions.md` (sélection modèle, discipline prompt, #file, hygiène de contexte, templates).
- Intégration Stripe Elements finalisée dans le checkout public (`PaymentElement` + `confirmPayment`) avec retour d’état paiement côté client.
- Stabilisation du run local: script `npm run dev` fiabilisé avec pré-nettoyage lock/ports (`dev:clean`).
- Idempotence webhook Stripe implémentée via journal d’événements persisté (`stripe_webhook_events`).
- Script de diagnostic environnement ajouté: `npm run healthcheck:env`.
- Module promoteur complété côté guest list:
  - page `src/app/(dashboard)/promoter/guestlist/page.tsx` (sélecteur événements à venir, liste statuts, ajout invité, compteur live, arrivée optimiste),
  - alias dashboard `src/app/(dashboard)/dashboard/promoter/guestlist/page.tsx`,
  - server actions dédiées dans `src/lib/promoter.actions.ts`.
- Gestion promoteurs club ajoutée:
  - page `src/app/(dashboard)/club/promoters/page.tsx`,
  - modal d’ajout `src/app/(dashboard)/club/promoters/AddPromoterModal.tsx` (commission 5–15%),
  - actions `createPromoterAction` et `validateCommissionAction` (création compte, promo code unique, email de bienvenue, validation commissions),
  - alias dashboard `src/app/(dashboard)/dashboard/club/promoters/page.tsx`.
- Dashboard client complété:
  - home `src/app/(dashboard)/client/page.tsx` (score, prochaine réservation, raccourcis),
  - réservations `src/app/(dashboard)/client/reservations/page.tsx` (revendre/annuler conditionnel),
  - waitlist `src/app/(dashboard)/client/waitlist/page.tsx` (liste active + quitter),
  - alias dashboard `src/app/(dashboard)/dashboard/client/*`.
- Actions client ajoutées dans `src/lib/reservation.actions.ts`:
  - `cancelReservationAction` (règle >48h + ownership),
  - `leaveWaitlistAction` (ownership + statut),
  - revalidation des routes client/dashboard.
- Landing page publique finalisée:
  - refonte `src/app/page.tsx` (design dark luxury NightTable, metadata SEO, `next/image`),
  - support images externes Unsplash dans `next.config.ts`.
- Seed Supabase démo implémenté et exécuté:
  - script `scripts/seed-demo-data.mjs` + commande `npm run seed:demo`,
  - provisioning comptes démo (club/promoteurs/clients/vip), événements/tables, réservations, waitlist, commissions, guest list.
- Module femmes validées complété:
  - page principale `src/app/(dashboard)/vip/page.tsx` (statut, clubs validants, soirées, profil),
  - action serveur `src/lib/vip.actions.ts` pour mise à jour sécurisée du profil,
  - états `loading.tsx` / `error.tsx` et alias `/dashboard/dashboard/vip` redirigé vers `/dashboard/vip`.
- Module femmes validées finalisé end-to-end:
  - pages dédiées `invitations`, `profile`, `safety`,
  - page club `vip` avec validation/refus + invitations + toggles promo,
  - alias de cohérence `/dashboard/dashboard/vip/*` et `/dashboard/dashboard/club/vip`.
- Note de release prête pour tag:
  - `docs/v0.3-mvp-complete.md`.

### Documentation

- Documentation complète du projet dans `README.md`.
- Architecture technique dans `docs/ARCHITECTURE.md`.
- Roadmap produit/technique dans `docs/ROADMAP.md`.
- Index docs dans `docs/README.md`.
- Changelog initialisé dans `CHANGELOG.md`.
- Documents sources business/dev sauvegardés dans `docs/`.

### Base applicative

- Auth multi-rôles en place (`client`, `club`, `promoter`, `female_vip`, `admin`).
- Redirections dashboard par rôle implémentées.
- Protection d’accès dashboard via `src/proxy.ts`.
- Actions club de base (création événement/table) implémentées.
- Action promoteur de base (guest list) implémentée.
- Endpoint bot IA opérationnel.
- Endpoint webhook Stripe présent (base de traitement).
- Dashboard Club — événements/tables opérationnels (création, listing, floor plan).
- Parcours public réservation événement en place:
  - page événement publique avec sélection table via floor plan,
  - tunnel checkout 3 étapes,
  - création réservation server action + PaymentIntent.
- Webhook Stripe étendu:
  - `payment_intent.succeeded` (confirmation réservation + verrouillage table),
  - `payment_intent.payment_failed` (annulation + libération table),
  - `customer.subscription.created/updated/deleted` (sync abonnement club).
- Wrappers notifications transactionnelles ajoutés:
  - `src/lib/twilio.ts` (`sendSMS`),
  - `src/lib/resend.ts` (`sendReservationConfirmation`).
- Migration checkout appliquée:
  - `supabase/migrations/008_reservations_checkout_fields.sql`.
- Tests E2E webhook exécutés et validés (succès + échec paiement), puis fixtures nettoyées.

## En cours

- Audit final de cohérence visuelle cross-dashboard (micro-ajustements restants si besoin).
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

## Risques ouverts

- Risque cohérence paiement/réservation sans idempotence webhook.
- Risque sécurité si validations API incomplètes.
- Risque dérive de scope si P1/P2 démarrés avant clôture P0.

## Journal de sessions

### 2026-03-02 (stabilisation lint globale après livraison analytics)

- Dernier polish demandé: harmonisation iconographique des CTA sur les écrans promoteur (`commissions`, `promo`, `guestlist`) sans changement métier.
- Passe cohérence boutons: harmonisation visuelle des CTA sur `/dashboard/club/reservations` avec icônes d’action pour rester aligné avec la page clients.
- Finition lisibilité CTA ligne clients: ajout d’icônes distinctes pour séparer rapidement action fiche vs contact téléphone vs email.
- Extension des boutons opérationnels `Clients & VIPs`: ajout des CTA `Appeler` (`tel:`) et `Email` (`mailto:`) par client, visibles uniquement quand l’information est disponible.
- Finalisation “configure tous les boutons”: ajout de CTA ligne `Voir fiche` sur le tableau clients + support `searchParams.q` dans `/dashboard/club/reservations` pour préremplir la recherche et ouvrir la vue client directement; validation `npm run lint` + `npm run build` ✅.
- Configuration UX des boutons `Clients & VIPs`: action “Filtres avancés” reliée au bloc filtres + focus recherche, état vide enrichi avec CTA “Réinitialiser les filtres” et “Voir les réservations”; validation `npm run lint` + `npm run build` ✅.
- Ajustement final navigation: item actif `/dashboard/club/clients` rendu en violet (desktop + mobile) sans impacter les autres onglets actifs gold; validation `npm run lint` + `npm run build` ✅.
- Raffinement visuel “pixel-closer” de la page `Clients & VIPs`: alignement des proportions sur la maquette (titres/toolbar/table), ajout du KPI “nouveaux ce mois” calculé depuis les réservations des 30 derniers jours; validation `npm run lint` + `npm run build` ✅.
- Ajout de la page demandée “Clients & VIPs”: création de `src/app/(dashboard)/club/clients/*` (page serveur, panel client, loading/error), alias `src/app/(dashboard)/dashboard/club/clients/page.tsx`, et navigation `Clients & VIPs` dans `src/app/(dashboard)/layout.tsx`; validation `npm run lint` + `npm run build` ✅.
- Finition ciblée dashboard VIP: ajout de navigation d’actions rapides entre `invitations`, `profile` et `safety`, plus correction mobile-first des grilles formulaire (`sm:grid-cols-2` → `md:grid-cols-2`) sur la page profil; validation `npm run lint` + `npm run build` ✅.
- Passe d’harmonisation visuelle `promoter/vip` finalisée: `PromoterCommissionsPanel`, `PromoterPromoPanel`, `GuestListClient`, `vip/page.tsx`, `vip/invitations/page.tsx`, `vip/profile/page.tsx`, `vip/safety/page.tsx` alignés avec le langage visuel club (headers gradients + quick actions) ; validation `npm run lint` + `npm run build` ✅.
- Passe complémentaire demandée “autres dashboards”: ajout d’une action serveur réelle pour `Revendre` côté client (`src/lib/reservation.actions.ts`) et branchement formulaire dans `ClientReservationsTable`; `PendingCommissionsTable` sécurisé avec bouton `type="submit"`; validation `npm run lint` + `npm run build` ✅.
- Passe transversale “configure bien tous les boutons” appliquée sur pages club principales: `EventListTable` (CTA duplication), `PromotersTable` (copie promo code), `ClubReservationsPanel` (CTA principal relié au flux création événement); validation `npm run lint` + `npm run build` ✅.
- Micro-passe finale UI sur `src/app/(dashboard)/club/reservations/ClubReservationsPanel.tsx`: ajustements fins de typographie/espacements/table density/chips pour finition pixel-closer; validation `npm run lint` + `npm run build` ✅.
- Passe de finition UI suite validation user sur `/dashboard/club/reservations`: structure rapprochée du screenshot cible (actions topbar, toolbar filtres, tabs compactes, bloc table), sans changement métier; validation `npm run lint` + `npm run build` ✅.
- Fix immédiat suite retour user: runtime error sur `src/app/(dashboard)/club/reservations/page.tsx` corrigé en remplaçant le filtre `club_id` inexistant par un chargement des réservations via `event_id` des événements du club; validation `npm run lint` + `npm run build` ✅.
- Ajout de la page demandée `src/app/(dashboard)/club/reservations/page.tsx` + `ClubReservationsPanel.tsx` avec filtres (tabs Toutes/À venir/En cours/Passées/Annulées), recherche client/table, tableau desktop et cards mobile; `loading.tsx` / `error.tsx` + alias `src/app/(dashboard)/dashboard/club/reservations/page.tsx` + entrée de menu dans `src/app/(dashboard)/layout.tsx`; validation `npm run lint` + `npm run build` ✅.
- Correction ciblée du problème IDE signalé utilisateur: `src/app/(dashboard)/club/analytics/page.tsx` import `AnalyticsPanels` basculé en alias absolu pour supprimer l’erreur TS2307 (`Cannot find module './AnalyticsPanels'`); validation `npm run lint` ✅.
- Page 7 settings livrée: création de `src/app/(dashboard)/club/settings/page.tsx`, `ClubSettingsPanel.tsx`, `loading.tsx`, `error.tsx`, alias `src/app/(dashboard)/dashboard/club/settings/page.tsx` et ajout de `updateClubSettingsAction` dans `src/lib/club.actions.ts`; validation `npm run lint` + `npm run build` ✅.
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
