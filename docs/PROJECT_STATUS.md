2026-03-06 — Migration thème "midnight neon" (noir/violet/bleu/rose), refonte visuelle landing/public (glow, gradient, shadow), correction exhaustive des erreurs lint, QA visuelle — aucun bloqueur
2026-03-05 — Header NightTable restauré sur /login (texte, lien accueil) — aucun bloqueur
2026-03-05 — Bloc NT NightTable supprimé au-dessus du formulaire /login — aucun bloqueur
2026-03-05 — Header /login : logo remplacé par texte NightTable (style landing) — aucun bloqueur
2026-03-05 — Correction propriétés SVG (clipRule/fillRule) sur /login — aucun bloqueur
2026-03-05 — Ajout header logo sur /login, suppression texte NightTable — aucun bloqueur
2026-03-05 — Ajout menu Femmes VIP (club), création page et loading/error — aucun bloqueur
# PROJECT STATUS

## Done
- ✅ Suppression complète de la route Femmes VIP (club)
- ✅ Réorganisation physique des dossiers dashboard club
- ✅ Correction des erreurs sidebar club

## In progress
- Rien

## Todo
- QA visuelle finale landing/public (midnight neon)
- QA navigation/UX dashboards (palette, responsive, effets)
- Recréer la page Femmes VIP proprement si besoin
- Continuer la refonte navigation/UX club

## Session log
2026-03-05 — Suppression complète de la route Femmes VIP, nettoyage sidebar, plus d'erreur — aucun bloqueur
2026-03-05 — Ajout du menu Femmes VIP sous Clients dans la sidebar club, création de la page dédiée — aucun blocage
Session log:
2026-03-05 — Ajout du lien Femmes VIP dans la sidebar club (juste après Clients, route /dashboard/club/03-femmes-vip, page créée)
**Done**
2026-03-05 — Ajout du menu Promoteur au-dessus de Plan des tables dans la sidebar club, redirection correcte — aucun blocage
Session log:
2026-03-05 — Ajout du lien Promoteur dans la sidebar club (juste avant Plan des tables, route /dashboard/club/promoters)
**Done**
2026-06-04 — Correction modules non valides (export défaut) sur tous les dashboards (club, promoter, vip) — aucun blocage
Session log:
2026-06-04 — Correction "File is not a module" (export défaut manquant) sur 07-events, 02-commissions, 02-invitations — build Next.js OK, plus d'erreurs
2026-03-05 — Suppression section Femmes VIP sidebar club (src/components/ui/sidebar.tsx) — aucun blocage
Session log:
2026-03-05 — Suppression complète du lien Femmes VIP dans la sidebar club (reset navigation)
2026-03-05 — Correction redirection tab=femmes-vip (searchParams, Next.js App Router) — aucun blocage
2026-03-05 — Correction routes Femmes VIP, suppression doublons, nettoyage des réexportations — aucun blocage
[2026-03-05] — Déplacement page Femmes VIP au même niveau que clients (route indépendante /dashboard/club/femmes-vip) — aucun blocage
[2026-03-05] — Correction imports et typage Badge sur page Femmes VIP (plus d'erreurs TypeScript, build OK) — aucun blocage
[2026-03-01] — Refonte complète page Femmes VIP club (grille, badges, filtres, actions, responsive) — aucun blocage
Session log:
2026-03-05 — Correction : Femmes VIP non affiché sur /dashboard/club/clients?tab=femmes-vip (rendu conditionnel SSR dans page.tsx) — aucun blocage
2026-03-05 — Création page Femmes VIP club (dashboard/club/clients/femmes-vip) — aucun blocage
Session log:
2026-03-05 — Correction ReferenceError: Button is not defined (ClubHomePanels) — aucun blocage
Session log:
2026-03-05 — Uniformisation de tous les boutons d'action du dashboard club (couleur, forme, variant Button shadcn/ui, NightTable) — aucun blocage
Session log:
2026-03-05 — Bouton "Nouvelle réservation" déplacé à droite (header réservations) — aucun blocage
Session log:
2026-03-05 — Suppression bouton "Ajouter un contact" page clients — aucun blocage
Session log:
2026-03-05 — Header réservations : titre et bouton à gauche, suppression bouton Exporter — aucun blocage
Session log:
2026-03-05 — Boutons Exporter ajoutés (clients, réservations) — aucun blocage
Session log:
2026-03-05 — Icône Femmes VIP sidebar harmonisée (blanc, plus de doré) — aucun blocage
Session log:
2026-03-05 — Harmonisation couleur Femmes VIP sidebar (plus de doré, couleur menu standard) — aucun blocage
**Done**
✅ Correction import sidebar (radix-nova/sidebar), refactor composant local, build Next.js OK, sidebar visible sur tous les dashboards
✅ Nouvelle sidebar NightTable (shadcn/ui radix-nova) appliquée à tous les dashboards, branding, collapsible, responsive, suppression anciens composants
✅ Refonte UI complète du dashboard club (ClubHomePanels.tsx) selon la maquette Velvet Rope, full Tailwind, responsive, branding NightTable, sans HeroUI
✅ Sidebar header text replaced with NightTable (was Velvet Rope) to match public landing
✅ Tous les selects natifs remplacés par un composant Select Radix UI NightTable (shadcn/ui, gold, popover, accessibilité, animation fadeIn, focus ring gold)
✅ Résolution erreur `await` non-async sur `src/app/(dashboard)/club/page.tsx` ; extractions client/server et nettoyage de `ClubHomePanels.tsx`
✅ Page /reserve : migration complète, tous les menus déroulants utilisent Select Radix UI NightTable
✅ Fix référence `period` non définie et migration du calcul CA côté client (ClubDashboardHomeClient)

**Session log**
[2026-03-05] — Correction import sidebar (radix-nova/sidebar), refactor composant local, build Next.js OK, sidebar visible sur tous les dashboards — aucun blocage
[2024-06-04] — Migration sidebar NightTable sur tous les dashboards (SidebarProvider + AppSidebar) — aucun blocage
[2024-06-04] — Refonte UI dashboard club (ClubHomePanels.tsx) pour correspondance parfaite à la maquette — aucun blocage
[2024-06-04] — Migration complète des selects natifs vers Select Radix UI NightTable sur la page /reserve (public) — aucun blocage
[2026-03-05] — Migration complète des selects natifs vers Radix UI Select NightTable (dashboard club, composant réutilisable, style gold, animation, accessibilité) — aucun blocage
**In progress**


**Session log**
[2026-03-05] — Amélioration visuelle section graphique revenus (fond, alignement, label, responsive, focus, hover gold) — aucun
[2026-03-05] — Graphique revenus réactif à la période sélectionnée (ClubHomePanels) — aucun
[2026-03-05] — Déplacement du calcul `revenueSeries` côté client et correction ReferenceError period undefined — aucun blocage
[2024-06-04] — Correction visibilité + optimisation visuel menu déroulant période (dashboard club) — aucun
[2026-03-05] — Ajout menu déroulant période revenus on dashboard club — aucun blocage
[2026-03-05] — Correction erreur build "await" non async et refactor page club (server/client split) — aucun blocage
[2026-03-05] — Correction du bug shadcn/ui Button (ref ReferenceError) — Aucun blocage
# NightTable — Suivi d’avancement (vivant)

Document opérationnel court: état actuel, priorités, risques et journal récent.

## Dernière mise à jour

- Date: 2026-03-05
- Auteur: GitHub Copilot

## Vue synthèse

- Progression MVP (estimation): 85%
- Axe prioritaire actuel: QA E2E final des parcours publics et dashboard


- Correction design barre de recherche clubs (UI épurée, icône gold, placeholder centré, bordure gold, fond secondaire, focus gold, arrondi XL) sur la page /clubs.

- Documentation et gouvernance: base documentaire consolidée, incidents tracés, règles de contribution alignées.
- Design & UX: harmonisation cross-rôles (club/promoter/vip/public), responsive mobile-first et états UI homogènes.
- Dashboard club: parcours complet livré (events, tables, promoters, vip, analytics, clients, reservations, settings) avec alias stables.
- Public booking: flow clubs/[slug] → events/[eventId] → checkout stabilisé en data-driven et validé.
- Paiement & notifications: pipeline Stripe (checkout/webhook) consolidé; wrappers email/SMS en place.
- Données & sécurité: migrations RLS/grants publiques appliquées; validation serveur renforcée.
- Qualité technique: lint/build verts, corrections TS/JSX critiques finalisées, scripts de dev/reset/healthcheck fiabilisés.

## En cours

- Vérification visuelle finale en navigateur des parcours critiques (public + dashboards).
- Vérification manuelle des items restants (Stripe checkout, emails Resend, SMS Twilio, check-in browser).

## À faire (priorité)

### P0 — Critique MVP

- Exécuter un runbook E2E local complet (checkout Stripe Elements + webhook + statut réservation).
- Publier la GitHub Release associée au tag v0.3-mvp-complete.

### P1 — Important après P0

- Lier les réservations aux promoteurs via promo_code.
- Démarrer le calcul et suivi des commissions promoteurs.
- Connecter les notifications à des templates métier complets (email/SMS + branding + fallback).
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

## Historique détaillé

- Archive complète: docs/PROJECT_STATUS_ARCHIVE.md

## Journal de sessions (récent)

### 2026-03-04 (stabilisation liens landing)

- `src/app/page.tsx` : redirection des cartes `Clubs partenaires` vers `/clubs` pour garantir une destination valide même si certains slugs club ne sont pas disponibles selon l’environnement.
- Contrôle smoke des liens de la home relancé en production.

### 2026-03-04 (fix 404 Vercel production)

- Détection cause racine dans Vercel: projet configuré en preset `Other` (build `0ms` + output statique vide) malgré un build Next local valide.
- Ajout de `vercel.json` avec `framework: nextjs` pour forcer le bon pipeline de build/déploiement.
- Redéploiement production relancé via `npm run deploy:vercel`.

### 2026-03-04 (automatisation publication Vercel)

- Ajout du script `scripts/vercel-deploy.ps1` pour standardiser la publication (`main` + lint/build + push + deploy Vercel prod).
- Ajout du raccourci npm `deploy:vercel`.

### 2026-03-04 (fix images top démo non chargées)

- `src/app/demo/page.tsx` : remplacement des 2 premières images de la page par des assets locaux (`/public/demo/*.webp`) pour supprimer les échecs de chargement distants.

### 2026-03-04 (cleanup dépendances optimisation images)

- Suppression de `sharp` des devDependencies après conversion terminée des assets démo en WebP.

### 2026-03-04 (cleanup assets démo)

- Suppression des 4 fichiers JPEG obsolètes de `public/demo` après validation du passage complet en WebP.

### 2026-03-04 (optimisation performance images démo)

- Conversion des 4 images de la section compacte en format `.webp`.
- `src/app/demo/page.tsx` mis à jour pour servir les nouveaux assets optimisés.

### 2026-03-04 (finalisation images locales section compacte)

- `src/app/demo/page.tsx` : remplacement des 2 dernières cartes compactes par des assets locaux.
- Ajout de `public/demo/vip-profiles.jpeg` et `public/demo/revenue-analytics.jpeg`.

### 2026-03-04 (assets internes pour la page démo)

- Ajout de captures dans `public/demo` et remplacement des 2 premiers visuels de cartes compactes par des images locales NightTable.

### 2026-03-04 (polish header + images page démo)

- `src/app/demo/page.tsx` : suppression des boutons header `Connexion` et `Créer un compte` sur la section du haut.
- Remplacement des 2 premiers visuels de la grille compacte qui ne se chargeaient pas.

### 2026-03-04 (complément visuel démo: images manquantes)

- `src/app/demo/page.tsx` : ajout de visuels sur les cartes compactes “solution complète” pour enrichir la démonstration et supprimer les blocs sans image.

### 2026-03-04 (complément contenu démo: promoteurs)

- `src/app/demo/page.tsx` : ajout de la fonctionnalité `Gestion des promoteurs` dans les blocs compacts pour compléter le périmètre produit.

### 2026-03-04 (ajustement visuel fin page démo)

- `src/app/demo/page.tsx` : suppression du texte “maj plan interactif 3D” dans le hero.
- Condensation des blocs infos “Plan des tables en direct” à “Analyses et CA” en format compact pour alléger le rendu.

### 2026-03-04 (refonte page démo)

- `src/app/demo/page.tsx` : redesign complet fidèle aux références visuelles (hero, blocs alternés, cartes fonctionnalités, CTA final) en conservant les codes couleur NightTable.

### 2026-03-04 (accès clubs dédié)

- Création de `src/app/(public)/clubs-acces/page.tsx` + `ClubAuthClient.tsx` pour un parcours connexion/inscription uniquement club.
- `src/app/page.tsx` : lien footer `Produit > Clubs` branché vers `/clubs-acces`.

### 2026-03-04 (footer épuré + pages corporate/resources créées)

- `src/app/page.tsx` : suppression des liens `Produit` non souhaités (`Plan des tables`, `Clients & VIPs`, `Analytiques`) et conservation de `Démo`, `Clubs`, `Tarifs`.
- Création des routes publiques manquantes liées au footer: `tarifs`, `centre-aide`, `blog`, `tutoriels-video`, `api-integrations`, `a-propos`, `contact`, `mentions-legales`, `confidentialite`.

### 2026-03-04 (landing recentrée client + liens B2B footer)

- `src/app/page.tsx` : suppression des sections marketing clubs intermédiaires pour éviter de polluer le parcours client réservation.
- Footer `Produit` enrichi avec `Démo` et `Clubs` (accès `/demo` + `/register?role=club`).

### 2026-03-04 (landing bas de page aligné au mock)

- `src/app/page.tsx` : reprise complète du bas de page pour correspondre à la référence visuelle (titre “Tout ce dont vous avez besoin”, 3 cartes, bloc CTA “niveau supérieur”, footer 4 colonnes).

### 2026-03-04 (sections conversion clubs sur landing)

- `src/app/page.tsx` : ajout de sections bas de page inspirées du mock (features clubs en 3 cartes + bandeau CTA) pour pousser vers `/demo` et `/register?role=club`.

### 2026-03-04 (cleanup navigation header landing)

- `src/app/page.tsx` : suppression des liens `Clubs` et `Démo` dans le header de la landing (`/`) pour un header plus minimal.

### 2026-03-04 (durcissement onboarding rôles auth)

- `src/app/(auth)/AuthSplitPage.tsx` : retrait des options visibles `club` et `promoter` dans la sélection d’inscription standard, avec sous-texte explicite pour les accès dédiés.
- `src/app/page.tsx` : ajout d’un CTA bas de page `Inscrire mon club` vers `/register?role=club` pour canaliser l’inscription club depuis la landing.

### 2026-03-04 (fix CTA /demo landing pour E2E)

- Mise à jour de `src/app/page.tsx` : ajout du lien `/demo` dans le header de la landing pour aligner la page avec le runbook E2E.

### 2026-03-04 (fix crash décoche assurance)

- `src/app/(public)/reserve/checkout/checkoutClient.tsx` : correction runtime au toggle assurance en capturant `checked` avant l’updater `setOptions`.

### 2026-03-04 (fix artefact visuel persistant case assurance)

- `src/app/(public)/reserve/checkout/checkoutClient.tsx` : remplacement du contrôle assurance par une case custom Tailwind (sans dépendance au rendu interne du composant) pour supprimer l’artefact visuel encore présent.

### 2026-03-04 (fix design final case assurance)

- Ajustement ciblé de `src/app/(public)/reserve/checkout/checkoutClient.tsx` pour corriger le rendu visuel de la case assurance (classes HeroUI stabilisées, plus de chevauchement du check).

### 2026-03-04 (fix final overlap + toggle assurance checkout)

- `src/app/(public)/reserve/checkout/checkoutClient.tsx` : suppression définitive des superpositions de texte en passant les libellés du formulaire en labels externes.
- Remplacement du contrôle assurance par `Checkbox` HeroUI pour corriger le rendu et le comportement au décochement.

### 2026-03-04 (fix rendu checkbox + overlap champs checkout)

- `src/app/(public)/reserve/checkout/checkoutClient.tsx` : remplacement du contrôle assurance par une checkbox native stylée pour corriger le rendu du bouton cocher/valider.
- Passage des labels des champs checkout en placement externe pour supprimer le chevauchement texte/valeur lors de la saisie.

### 2026-03-04 (fix assurance annulation checkout)

- Correction UI dans `src/app/(public)/reserve/checkout/checkoutClient.tsx` : suppression du chevauchement texte/switch dans la section “Assurance annulation”.
- Ajustements mineurs de densité mobile (titre, steps, barre CTA) pour cohérence avec les pages publiques.

### 2026-03-04 (checkout aligné design system global)

- Ajustement de `src/app/(public)/reserve/checkout/checkoutClient.tsx` pour aligner la page avec le langage visuel global (fond #050508, cards premium, étapes pill, champs harmonisés, récap enrichi).
- Flux métier inchangé: création réservation, initialisation Stripe Elements, confirmation paiement.

### 2026-03-04 (refonte tunnel /reserve/checkout)

- Refonte de `src/app/(public)/reserve/checkout/checkoutClient.tsx` en tunnel premium inspiré Soho House (2 colonnes desktop, étapes visuelles, récap sticky, mobile accordéon + CTA fixe).
- Conservation stricte du wiring Stripe Elements et de la Server Action `createReservationAction`.

### 2026-03-04 (finition hero pixel-perfect)

- Retouche finale du hero dans `src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx` (gradient, alignements, contraste du titre, position badge statut).
- Objectif: finition visuelle premium sans impact fonctionnel.

### 2026-03-04 (ajustement global final event page)

- Passe complète sur `src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx` : hero enrichi, métadonnées événement consolidées, panel sticky optimisé et barre mobile resserrée.
- Maintien strict de la logique métier de réservation et du flow checkout.

### 2026-03-04 (micro-pass mobile densité visuelle event)

- Ajustements ciblés de `src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx` sur mobile: paddings, échelle des titres, gaps de contenu et safe-area de la barre sticky.
- Aucun changement de logique de sélection de table ni de checkout.

### 2026-03-04 (ajustement visuel CTA event page)

- Harmonisation des CTA de `src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx` avec HeroUI `Button` en desktop et mobile.
- Alignement strict des contraintes visuelles (primary gold, radius none, hauteur 48px mobile).

### 2026-03-04 (fix schéma event notoriety)

- Correction de `src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx` pour retirer `notoriety` de la requête `events` (colonne absente sur la base active).
- Valeur métier `eventNotoriety` forcée à `1` pour préserver le calcul de prix dynamique côté client.

### 2026-03-04 (fix schéma event cover_url)

- Correction de `src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx` pour supprimer `cover_url` de la requête `events` (colonne absente sur la base active).
- Élimination du 404 provoqué par l’échec SQL et fallback image conservé côté client.

### 2026-03-04 (fix 404 page événement sans tables)

- Correction de `src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx` pour éviter le `notFound()` quand aucune table normalisée n’est rendable.
- La page événement publique reste maintenant accessible, même si la sélection de table est vide côté données.

### 2026-03-04 (public event booking refonte soho house)

- Refonte de `src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx` pour enrichir les données événement (cover, description, lineup, dress code, notoriety).
- Refonte de `src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx` avec hero 50vh, layout éditorial 65/35, panel sticky desktop et sticky bottom bar mobile.
- Conservation de la logique de sélection de table + pricing dynamique + redirection checkout.

### 2026-03-04 (fix cookies supabase server)

- Correction de `src/lib/supabase/server.ts` pour ignorer proprement les `cookieStore.set` en contexte read-only Next.js.
- Suppression de l’erreur runtime « Cookies can only be modified in a Server Action or Route Handler » sur les pages Server Components.

### 2026-03-04 (public club vitrine soho house)

- Refonte de `src/app/(public)/clubs/[slug]/page.tsx` avec hero cover 65vh, overlays premium et infos superposées.
- Section `Programmation` reconstruite en liste verticale sobre + sticky CTA mobile `Voir les événements`.
- Ajout section `Ambiance` asymétrique via `ClubSlugPageClient`, en gardant le fetch Supabase existant inchangé.

### 2026-03-04 (public clubs refonte soho house)

- Refonte de `src/app/(public)/clubs/page.tsx` avec rendu client dédié `ClubsPageClient` (grille image-first, hover reveal, chips ambiance).
- Ajout recherche centrée HeroUI + état vide actionnable pour améliorer l’entrée du funnel public.
- Validation `npm run lint` exécutée avec succès.

### 2026-03-04 (lint cleanup sidebar)

- Correction du warning ESLint `@typescript-eslint/no-unused-vars` dans `src/app/(dashboard)/DashboardSidebarNav.tsx`.
- Validation `npm run lint` relancée avec succès (0 erreur, 0 warning).

### 2026-03-04 (archive passe changelog v0.3)

- Section `v0.3-mvp-complete` compactée dans `CHANGELOG.md` pour garder une lecture release-first.
- Détails déplacés vers `docs/CHANGELOG_V03_ARCHIVE.md`.

### 2026-03-04 (archive passe error log)

- Archivage intégral de docs/errors/ERROR_LOG.md vers docs/errors/ERROR_LOG_ARCHIVE.md.
- Réduction du log actif aux incidents en cours + incidents récents résolus.

### 2026-03-04 (archive passe documentation)

- docs/PROJECT_STATUS.md réduit en format opérationnel.
- Historique détaillé déplacé vers docs/PROJECT_STATUS_ARCHIVE.md.

### 2026-03-04 (cleanup fallback + RLS public)

- Suppression du fallback temporaire club/event (fallback-* + serverAdmin) pour revenir à un flux public strictement data-driven.
- Ajout des migrations DB publiques puis push distant: 013_public_club_profiles_read.sql, 014_public_read_grants.sql, 015_public_read_policies_refresh.sql.
- Correction query/runtime côté public: retrait de min_spend (colonne absente) et normalisation relationnelle table:tables sur la page event.
- Validation finale: build OK et URL réelle /clubs/nighttable-demo-club/events/86d84d29-e2cd-4766-822e-0b7fb0024099 en 200.

### Done
- ✅ Crash natif Next.js corrigé (Node.js 20.x installé, .nvmrc ajouté)

### In progress
- Vérification du flow réservation complet (login → réservation)

### Todo
- Ajouter tests automatisés de compatibilité Node.js
- Vérifier la CI/CD pour Node 20

### Session log
2026-03-05 — Crash natif Next.js corrigé, .nvmrc ajouté, serveur OK — aucun blocage
