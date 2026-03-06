---
**2026-03-06 — Migration thème "midnight neon" + refonte visuelle landing/public + lint**
- File(s) affected: `src/app/globals.css`, `tailwind.config.ts`, `src/app/providers.tsx`, `src/components/ui/*`, `src/app/page.tsx`, `src/components/floor-plan/FloorPlan.tsx`, `src/lib/resend.ts`, `src/lib/promoter.actions.ts`, `public/`, `docs/PROJECT_STATUS.md`, `CHANGELOG.md`
- Error: Palette legacy NightTable (gold/dark) persistante, incohérences visuelles, effets glow/gradient absents, erreurs lint bloquantes
- Root cause: Couleurs legacy non migrées partout, landing/public non refondues, erreurs JSX/TS persistantes
- Fix applied: Migration complète vers tokens "midnight neon" (noir/violet/bleu/rose), refonte visuelle landing/public (glow, gradient, shadow), remplacement global des couleurs, correction exhaustive des erreurs lint, QA visuelle
- Status: ✅ Resolved
---
---
**2026-03-05 — Header NightTable restauré sur /login**
- File(s) affected: `src/app/(auth)/login/page.tsx`
- Changement UI : retour du header NightTable (texte, lien accueil) au-dessus du formulaire
- Status: ✅ Resolved
---
---
**2026-03-05 — Bloc NT NightTable supprimé au-dessus du formulaire /login**
- File(s) affected: `src/app/(auth)/login/page.tsx`
- Changement UI : suppression du header NT NightTable (plus de logo ni texte au-dessus du formulaire)
- Status: ✅ Resolved
---
---
**2026-03-05 — Header /login : logo remplacé par texte NightTable**
- File(s) affected: `src/app/(auth)/login/page.tsx`
- Changement UI : logo remplacé par texte NightTable (style landing page)
- Status: ✅ Resolved
---
---
**2026-03-05 — Correction propriétés SVG (clipRule/fillRule) sur /login**
- File(s) affected: `src/app/(auth)/login/page.tsx`
- Error: Invalid DOM property `clip-rule`/`fill-rule` (console warning)
- Root cause: Syntaxe SVG non camelCase (React/Next.js)
- Fix applied: Utilisation de clipRule/fillRule
- Status: ✅ Resolved
---
---
**2026-03-05 — Ajout header logo sur /login**
- File(s) affected: `src/app/(auth)/login/page.tsx`
- Error: Aucun — header logo ajouté, texte supprimé
- Root cause: N/A
- Fix applied: Ajout header logo, suppression texte NightTable
- Status: ✅ Resolved
---
---
**2026-03-05 — Ajout menu Femmes VIP (club) et création page**
- File(s) affected: `src/app/(dashboard)/club/04-femmes-vip/page.tsx`, `src/components/ui/sidebar.tsx`
- Error: Aucun — création propre, pas d’erreur
- Root cause: N/A
- Fix applied: Ajout du menu Femmes VIP et de la page, loading, error
- Status: ✅ Resolved
---
---
**2026-03-05 — Suppression complète de la route Femmes VIP (club)**
- File(s) affected: `src/app/(dashboard)/club/03-femmes-vip`, `src/components/ui/sidebar.tsx`, `src/app/(dashboard)/club/clients/page.tsx`
- Error: La route /dashboard/club/03-femmes-vip persistait malgré la suppression des fichiers.
- Root cause: Résidus de liens et de logique dans le sidebar et la page clients.
- Fix applied: Suppression du dossier, des liens sidebar, et de toute logique de redirection Femmes VIP.
- Status: ✅ Resolved
---
---
**2026-06-04 — Correction modules non valides (export défaut)**
- File(s) affected: `src/app/(dashboard)/club/07-events/*`, `src/app/(dashboard)/promoter/02-commissions/*`, `src/app/(dashboard)/vip/02-invitations/*`
- Error: Erreurs Next.js/TypeScript : "File ... is not a module" (absence d'export default dans plusieurs fichiers de page ou composant)
- Root cause: Fichiers placeholder créés sans export de composant React par défaut
- Fix applied: Réécriture de tous les fichiers concernés pour exporter un composant React par défaut (stub minimal)
- Status: ✅ Resolved
---
**2026-03-05 — Déplacement page Femmes VIP (route indépendante)**
- File(s) affected: `src/app/(dashboard)/club/femmes-vip/page.tsx`, `loading.tsx`, `error.tsx`, `ClubFemmesVipPanel.tsx`
- Error: La page Femmes VIP était imbriquée dans clients, donc non accessible comme route indépendante
- Root cause: Mauvais placement du dossier femmes-vip
- Fix applied: Déplacement du dossier femmes-vip au même niveau que clients, correction des routes
- Status: ✅ Resolved
---
**2026-03-05 — Suppression section Femmes VIP sidebar club**
- File(s) affected: `src/components/ui/sidebar.tsx`
- Error: La section Femmes VIP apparaissait toujours dans la navigation club malgré la demande de suppression complète
- Root cause: Lien et section non retirés du composant sidebar
- Fix applied: Suppression totale du lien Femmes VIP dans la sidebar club (aucune trace visuelle ou code)
- Status: ✅ Resolved
**2026-03-05 — Correction imports et typage Badge Femmes VIP**
- File(s) affected: `src/app/(dashboard)/club/clients/femmes-vip/page.tsx`, `src/components/ui/badge.tsx`
- Error: Erreurs TypeScript (import dans fonction, double export default, typage Badge)
- Root cause: Mauvais placement des imports, non-export du type BadgeProps, cast incorrect
- Fix applied: Imports déplacés en haut, export du type BadgeProps, cast explicite, un seul export default
- Status: ✅ Resolved
---
---
**2026-03-05 — Suppression page Femmes VIP pour reset**
- File(s) affected: `src/app/(dashboard)/club/clients/femmes-vip/page.tsx`, `src/app/(dashboard)/club/clients/page.tsx`
- Error: Le rendu Femmes VIP ne correspondait toujours pas à la maquette, suppression complète pour repartir de zéro
- Root cause: Problème persistant de rendu, besoin de repartir sur une base propre
- Fix applied: Suppression de la page Femmes VIP et de la logique associée dans page.tsx
- Status: ✅ Resolved
---
**2026-03-05 — Femmes VIP non affiché sur ?tab=femmes-vip**
- File(s) affected: `src/app/(dashboard)/club/clients/page.tsx`
- Error: L'URL /dashboard/club/clients?tab=femmes-vip affichait toujours la page clients classique (ClubClientsPanel)
- Root cause: Le code ne testait pas le paramètre tab, donc ne rendait jamais la grille Femmes VIP
- Fix applied: Ajout d'un rendu conditionnel dans page.tsx pour afficher ClubFemmesVipPanel si tab=femmes-vip
- Status: ✅ Resolved
**[2026-03-01] — Refonte UI Femmes VIP club**
- File(s) affected: `src/app/(dashboard)/club/clients/femmes-vip/ClubFemmesVipPanel.tsx`
- Error: N/A (refactor UI pour conformité maquette)
- Root cause: Besoin d'aligner la page sur la maquette fournie (grille, badges, filtres, actions, responsive)
- Fix applied: Refonte complète du composant ClubFemmesVipPanel.tsx
- Status: ✅ Resolved
---
---
**2026-03-05 — Création page Femmes VIP club**
- File(s) affected: `src/app/(dashboard)/club/clients/femmes-vip/ClubFemmesVipPanel.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`
- Error: Aucun (nouvelle page, design validé)
- Root cause: Besoin d'une vue CRM Femmes VIP dédiée pour les clubs
- Fix applied: Page, loading, error, empty state, UI NightTable, mock data
- Status: ✅ Resolved
---
---
**2026-03-05 — ReferenceError: Button is not defined (ClubHomePanels)**
- File(s) affected: `src/app/(dashboard)/club/ClubHomePanels.tsx`
- Error: ReferenceError: Button is not defined
- Root cause: Oubli d'import du composant Button après migration shadcn/ui
- Fix applied: Ajout de l'import { Button } depuis '@/components/ui/button'
- Status: ✅ Resolved
---
---
**2026-03-05 — Uniformisation boutons d'action dashboard club**
- File(s) affected: `src/app/(dashboard)/club/ClubHomePanels.tsx`, `src/app/(dashboard)/club/clients/ClubClientsPanel.tsx`, `src/app/(dashboard)/club/reservations/ClubReservationsPanel.tsx`, `src/app/(dashboard)/club/vip/ClubVipPanels.tsx`, `src/app/(dashboard)/club/reservations/error.tsx`
- Error: Incohérence visuelle entre les boutons d'action (couleur, forme, hover)
- Root cause: Migration partielle, variantes multiples, héritage HeroUI
- Fix applied: Tous les boutons d'action harmonisés (Button shadcn/ui, NightTable palette, radius, taille, hover/focus)
- Status: ✅ Resolved
---
---
**2026-03-05 — Bouton "Nouvelle réservation" déplacé à droite (header réservations)**
- File(s) affected: `src/app/(dashboard)/club/reservations/ClubReservationsPanel.tsx`
- Error: Mauvais alignement du bouton action
- Root cause: Layout hérité, besoin d’alignement à droite
- Fix applied: Bouton déplacé à droite, style cohérent
- Status: ✅ Resolved
---
---
**2026-03-05 — Suppression bouton "Ajouter un contact" page clients**
- File(s) affected: `src/app/(dashboard)/club/clients/ClubClientsPanel.tsx`
- Error: Bouton non souhaité sur la page clients
- Root cause: UI trop chargée, demande utilisateur
- Fix applied: Bouton supprimé du header
- Status: ✅ Resolved
---
---
**2026-03-05 — Header réservations ré-aligné, bouton Exporter supprimé**
- File(s) affected: `src/app/(dashboard)/club/reservations/ClubReservationsPanel.tsx`
- Error: Mauvais alignement du header, bouton Exporter non souhaité
- Root cause: Layout hérité de la version précédente
- Fix applied: Titre et bouton à gauche, suppression Exporter
- Status: ✅ Resolved
---
---
**2026-03-05 — Boutons Exporter ajoutés (clients, réservations)**
- File(s) affected: `src/app/(dashboard)/club/clients/ClubClientsPanel.tsx`, `src/app/(dashboard)/club/reservations/ClubReservationsPanel.tsx`
- Error: Absence de bouton d’export sur ces pages
- Root cause: Oubli lors de la migration UI
- Fix applied: Boutons "Exporter" ajoutés, style cohérent dashboard
- Status: ✅ Resolved
---
---
**2026-03-05 — Icône dorée Femmes VIP sidebar retirée**
- File(s) affected: `src/components/ui/sidebar.tsx`
- Error: Incohérence visuelle, icône dorée sur Femmes VIP non voulue
- Root cause: Reste d’un style différencié après refonte navigation
- Fix applied: Icône harmonisée avec les autres menus (text-[#F7F6F3])
- Status: ✅ Resolved
---
---
**2026-03-05 — Couleur dorée Femmes VIP sidebar retirée**
- File(s) affected: `src/components/ui/sidebar.tsx`
- Error: Incohérence visuelle, couleur dorée sur Femmes VIP non voulue
- Root cause: Reste d’un style différencié après refonte navigation
- Fix applied: Couleur harmonisée avec les autres menus (text-[#F7F6F3])
- Status: ✅ Resolved
---
---
---
**[2026-03-05] — Fix await in non-async club dashboard page**
- File(s) affected: `src/app/(dashboard)/club/page.tsx`, `src/app/(dashboard)/club/ClubHomePanels.tsx`
- Error: Build failed with "await isn't allowed in non-async function" because server component was non-async and used React hooks
- Root cause: Mixed server logic and client state in same component
- Fix applied: Converted page to `async` server component, created `ClubDashboardHomeClient.tsx` for state, cleaned duplicate exports
- Status: ✅ Resolved

---
- Root cause: Utilisation de DashboardSidebarNav/DashboardMobileNav au lieu d’un composant unique, moderne et personnalisable.
- Fix applied: Migration vers SidebarProvider + AppSidebar (shadcn/ui radix-nova), branding NightTable, collapsible, responsive, suppression anciens composants.
- Status: ✅ Resolved
---
---
**[2024-06-04] — Refonte UI dashboard club (ClubHomePanels.tsx)**
- File(s) affected: `src/app/(dashboard)/club/ClubHomePanels.tsx`
- Error: L’UI du dashboard club ne correspondait pas à la maquette (fond, cards, graphique, barres, table, badges, responsive, branding NightTable).
- Root cause: Utilisation de HeroUI et structure non conforme à la maquette.
- Fix applied: Refonte complète en Tailwind, layout fidèle à la maquette, branding NightTable, responsive, suppression HeroUI.
- Status: ✅ Resolved
---
---
**[2024-06-04] — Migration complète des selects natifs sur /reserve**
- File(s) affected: `src/app/(public)/reserve/page.tsx`, `src/components/ui/Select.tsx`
- Error: Les <select> natifs sur la page de réservation publique ne respectaient pas la charte NightTable (popover, focus ring gold, accessibilité, animation, UX unifiée).
- Root cause: Utilisation de <select> natif au lieu du composant Select Radix UI NightTable.
- Fix applied: Remplacement de tous les <select> natifs par le composant Select Radix UI NightTable, gestion d'état via hooks React, expérience visuelle et UX alignées sur le reste du site.
- Status: ✅ Resolved
---
---
**[2026-03-05] — Sélecteur période natif remplacé par Radix UI Select NightTable**
- File(s) affected: `src/components/ui/Select.tsx`, `src/app/(dashboard)/club/ClubHomePanels.tsx`
- Error: Le <select> natif stylé ne permettait pas d'obtenir l'expérience visuelle et UX attendue (popover, animation, accessibilité, focus, aria, etc.)
- Fix applied: Création d'un composant Select basé sur Radix UI (shadcn/ui), stylé NightTable (gold, dark, focus ring, animation fadeIn), remplacement dans le dashboard club et prêt à l'emploi pour tout le site.
- Status: ✅ Resolved
---
---
**[2026-03-05] — Sélecteur période remplacé par bouton natif stylé**
- File(s) affected: `src/app/(dashboard)/club/ClubHomePanels.tsx`
- Error: Le composant Select HeroUI ne correspondait pas à l'attendu visuel (shadcn/radix native select bouton gold).
- Fix applied: Remplacement par un <select> natif stylé type shadcn/radix, bouton gold, accessibilité et responsive conservés.
- Status: ✅ Resolved
---
---
**[2026-03-05] — Rendu visuel du graphique revenus insatisfaisant**
- File(s) affected: `src/app/(dashboard)/club/ClubHomePanels.tsx`
- Error: Le rendu visuel du graphique et du menu déroulant n'était pas aligné avec la charte NightTable (fond, alignement, label, focus, responsive, séparation, hover gold).
- Fix applied: Refonte UI section graphique : alignement horizontal, label intégré, fond surélevé, séparation claire, responsive mobile, effet hover gold, focus visible, espacement harmonisé.
- Status: ✅ Resolved
---
---
**[2026-03-05] — ReferenceError period undefined on dashboard club**
- File(s) affected: `src/app/(dashboard)/club/page.tsx`, `src/app/(dashboard)/club/ClubDashboardHomeClient.tsx`
- Error: Runtime crash on club dashboard page "ReferenceError: period is not defined" because server component referenced client state.
- Root cause: revenueSeries calculation (using `period`) remained in server component after splitting state; server code executed without a `period` variable.
- Fix applied: Removed period-dependent logic from server component and relocated calculation to new client wrapper (`ClubDashboardHomeClient.tsx`); added `period` state handler and passed computed series to `ClubHomePanels`.
- Status: ✅ Resolved
---

**[2026-03-05] — Graphique revenus non réactif à la période**
- File(s) affected: `src/app/(dashboard)/club/page.tsx`, `src/app/(dashboard)/club/ClubHomePanels.tsx`
- Error: Le graphique d'évolution des revenus ne changeait pas selon la période sélectionnée.
- Root cause: Le calcul de revenueSeries était statique, non lié à la sélection de période.
- Fix applied: Lifting state period au parent, calcul dynamique de revenueSeries selon la période, passage des props period/setPeriod.
- Status: ✅ Resolved
---
---
**[2024-06-04] — Menu déroulant période non visible dans le dashboard club**
- File(s) affected: `src/app/(dashboard)/club/ClubHomePanels.tsx`
- Error: Le menu déroulant pour la période de l'évolution des revenus n'était pas visible dans l'UI.
- Root cause: Mauvais emplacement de l'injection du composant et absence d'intégration visuelle adaptée.
- Fix applied: Déplacement et intégration correcte du menu déroulant avec optimisation visuelle (placement, label, espacement, focus ring).
- Status: ✅ Resolved
---
---
**[2026-03-05] — Menu déroulant période revenus**
- File(s) affected: `src/app/(dashboard)/club/ClubHomePanels.tsx`
- Error: N/A (feature addition)
- Root cause: Besoin UX de trier l'évolution des revenus par période
- Fix applied: Ajout d'un menu déroulant (Select) avec choix journalier/hebdomadaire/mensuel
- Status: ✅ Resolved
---
---
**[2026-03-04] — Barre de recherche clubs trop chargée**
- File(s) affected: src/app/(public)/clubs/ClubsPageClient.tsx
- Error: La barre de recherche sur /clubs était visuellement trop chargée, peu alignée avec la charte NightTable (fond trop sombre, icône peu lisible, placeholder non centré, arrondi faible).
- Root cause: Style hérité du composant Input par défaut, non adapté à la charte premium NightTable.
- Fix applied: Refonte UI épurée : icône gold SVG, placeholder centré, bordure gold, fond secondaire, focus gold, arrondi XL, suppression du surplus visuel.
- Status: ✅ Resolved
# Error Log

Journal opérationnel court des incidents actifs et récents.
Historique complet archivé dans docs/errors/ERROR_LOG_ARCHIVE.md.

## Incidents actifs

| Date | ID | Zone | Severity | Status | Résumé |
|---|---|---|---|---|---|
| 2026-03-01 | ERR-2026-002 | Supabase Auth | Medium | monitoring | signUp parfois limité par 429 over_email_send_rate_limit |

## Incidents récents résolus

---
**[2026-03-04] — Liens partenaires landing perçus comme non redirigés**
- File(s) affected: src/app/page.tsx
- Error: Certaines cartes de la home semblaient "ne rediriger vers rien" selon les environnements.
- Root cause: Liens dépendants de slugs club (`/clubs/[slug]`) potentiellement non disponibles selon les données seedées.
- Fix applied: Bascule des liens des cartes partenaires vers la route stable `/clubs`.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Déploiement Vercel `404` malgré build local vert**
- File(s) affected: vercel.json
- Error: Les URLs production renvoyaient `404` alors que `npm run build` passait localement.
- Root cause: Projet Vercel configuré en `Framework Preset: Other`, provoquant un déploiement statique sans build Next.
- Fix applied: Ajout de `vercel.json` pour imposer `framework: nextjs`, puis relance du déploiement production.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Publication Vercel manuelle fragile et répétitive**
- File(s) affected: scripts/vercel-deploy.ps1, package.json
- Error: Le process de publication (branche/push/déploiement) était manuel et sujet aux erreurs de séquence.
- Root cause: Absence d’un script unique de runbook de déploiement.
- Fix applied: Création d’un script PowerShell d’automatisation + commande npm dédiée (`deploy:vercel`).
- Status: ✅ Resolved
---

---
**[2026-03-04] — Deux premières images de la page démo non chargées**
- File(s) affected: src/app/demo/page.tsx
- Error: Les deux premiers visuels visibles sur `/demo` ne s’affichaient pas correctement chez l’utilisateur.
- Root cause: Dépendance à des URLs distantes Unsplash, dont au moins une retournait `404`.
- Fix applied: Remplacement des 2 sources concernées par des images locales WebP déjà présentes dans `/public/demo`.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Dépendance temporaire `sharp` laissée après optimisation**
- File(s) affected: package.json
- Error: `sharp` était encore présent en devDependency alors que la conversion d’images était terminée.
- Root cause: Outil d’optimisation installé pour une tâche ponctuelle.
- Fix applied: Désinstallation de `sharp` pour garder une base dépendances minimale.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Doublons d’assets démo après migration WebP**
- File(s) affected: public/demo/*
- Error: Les versions JPEG obsolètes restaient présentes après la migration vers WebP.
- Root cause: Étape de conversion réalisée avant suppression des sources legacy.
- Fix applied: Suppression des 4 fichiers `.jpeg` non utilisés pour ne conserver que les `.webp` référencés.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Poids trop élevé des visuels compacts de la page démo**
- File(s) affected: src/app/demo/page.tsx, public/demo/*.webp
- Error: Les visuels étaient servis en JPEG lourds, augmentant le temps de chargement de la section compacte.
- Root cause: Assets non optimisés en format nouvelle génération.
- Fix applied: Conversion des 4 visuels en WebP et mise à jour des chemins utilisés par la page.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Visuels externes restants sur 2 cartes compactes démo**
- File(s) affected: src/app/demo/page.tsx, public/demo/vip-profiles.jpeg, public/demo/revenue-analytics.jpeg
- Error: Deux cartes compactes utilisaient encore des images externes, créant une cohérence partielle avec la stratégie assets locaux.
- Root cause: Migration en deux étapes des visuels de la section compacte.
- Fix applied: Copie de 2 captures internes supplémentaires et bascule des 2 dernières cartes vers `/public/demo`.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Dépendance externe sur les 2 premiers visuels de cartes démo**
- File(s) affected: src/app/demo/page.tsx, public/demo/club-plan.jpeg, public/demo/promoter-dashboard.jpeg
- Error: Les 2 premières cartes utilisaient des URLs externes pouvant être instables ou lentes au chargement.
- Root cause: Sources images distantes non maîtrisées pour une section critique de la démo.
- Fix applied: Copie de captures internes dans `/public/demo` et migration des 2 cartes vers ces assets locaux.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Header démo trop chargé + 2 visuels non chargés**
- File(s) affected: src/app/demo/page.tsx
- Error: Les boutons `Connexion` et `Créer un compte` restaient visibles en haut de `/demo`, et les 2 premiers visuels des cartes compactes ne s’affichaient pas.
- Root cause: Header conservé de l’itération précédente et URLs image initiales non fiables.
- Fix applied: Suppression des 2 boutons du header top et remplacement des 2 premières URLs d’images par des sources valides.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Cartes démo sans visuels dans la section compacte**
- File(s) affected: src/app/demo/page.tsx
- Error: Plusieurs cartes de la section “Une solution complète, sans compromis” étaient textuelles sans image de démonstration.
- Root cause: Les `platformCards` ne contenaient que titre/description, sans média associé.
- Fix applied: Ajout d’URLs d’images par carte et rendu d’un thumbnail `next/image` compact avec overlay léger.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Oubli du module promoteurs sur la page démo**
- File(s) affected: src/app/demo/page.tsx
- Error: La section fonctionnalités ne mentionnait pas la gestion des promoteurs.
- Root cause: Sélection initiale de cartes recentrée sur tables/VIP/analytics uniquement.
- Fix applied: Ajout d’un bloc compact `Gestion des promoteurs` avec suivi des codes promo et commissions.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Densité visuelle insuffisante sur les blocs infos de la page démo**
- File(s) affected: src/app/demo/page.tsx
- Error: Le badge “maj plan interactif 3D” et les grosses cartes infos alourdissaient le rendu visuel.
- Root cause: Structure hero + cartes conservée trop verbeuse après la refonte initiale.
- Fix applied: Suppression du badge et conversion des 3 cartes en version compacte avec contenu condensé.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Page démo non alignée avec les maquettes de référence**
- File(s) affected: src/app/demo/page.tsx
- Error: Le design de `/demo` n’était pas suffisamment fidèle aux deux visuels cibles partagés.
- Root cause: Première version trop simplifiée avec structure partielle.
- Fix applied: Refonte complète de la page avec structure mixte conforme (hero + dashboard, sections alternées, bloc solution, CTA final) et palette NightTable.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Bouton footer `Clubs` renvoyant vers auth utilisateur**
- File(s) affected: src/app/page.tsx, src/app/(public)/clubs-acces/page.tsx, src/app/(public)/clubs-acces/ClubAuthClient.tsx
- Error: Le lien `Produit > Clubs` ouvrait un parcours d’auth généraliste au lieu d’un espace réservé clubs.
- Root cause: Absence de route dédiée à l’authentification club.
- Fix applied: Création d’une page `/clubs-acces` (connexion + inscription club uniquement) et redirection du lien footer vers cette route.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Footer incomplet (liens ressources/entreprise/tarifs non dédiés)**
- File(s) affected: src/app/page.tsx, src/app/(public)/tarifs/page.tsx, src/app/(public)/centre-aide/page.tsx, src/app/(public)/blog/page.tsx, src/app/(public)/tutoriels-video/page.tsx, src/app/(public)/api-integrations/page.tsx, src/app/(public)/a-propos/page.tsx, src/app/(public)/contact/page.tsx, src/app/(public)/mentions-legales/page.tsx, src/app/(public)/confidentialite/page.tsx
- Error: Le footer contenait des entrées produit non désirées et plusieurs liens pointaient vers des pages inexistantes.
- Root cause: Navigation footer partiellement placeholder après itérations UI.
- Fix applied: Nettoyage de la section `Produit` + création des pages dédiées `Ressources`, `Entreprise` et `Tarifs` manquantes.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Contenu B2B trop visible sur la landing client**
- File(s) affected: src/app/page.tsx
- Error: Les sections intermédiaires “Tout ce dont vous avez besoin” et CTA démo exposaient trop de contenu club dans le parcours client de réservation.
- Root cause: Intégration trop large du mock B2B directement sur la page d’accueil grand public.
- Fix applied: Suppression de ces sections et déplacement des entrées B2B dans le footer via `Produit > Démo` et `Produit > Clubs`.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Bas de landing non conforme au rendu de référence**
- File(s) affected: src/app/page.tsx
- Error: Le bas de page ajouté précédemment ne correspondait pas assez précisément à la structure et au contenu attendus depuis le mock fourni.
- Root cause: Première itération orientée adaptation produit, sans reprise fidèle du découpage visuel cible.
- Fix applied: Refonte du bas de landing avec structure alignée au mock (bloc “Tout ce dont vous avez besoin”, cartes contenu, grand CTA intermédiaire, footer colonnes).
- Status: ✅ Resolved
---

---
**[2026-03-04] — Landing sans section de conversion dédiée aux clubs**
- File(s) affected: src/app/page.tsx
- Error: La page d’accueil n’exposait pas suffisamment le parcours club attendu (voir démo puis inscription) selon la référence fournie.
- Root cause: Structure landing centrée côté client avec peu de blocs orientés acquisition clubs.
- Fix applied: Ajout d’un bloc fonctionnalités clubs (3 cartes) et d’un bandeau CTA final avec liens `/demo` et `/register?role=club`.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Liens header landing non conformes à la navigation souhaitée**
- File(s) affected: src/app/page.tsx
- Error: La landing exposait encore les boutons `Clubs` et `Démo` en haut alors que seule l’entrée `Connexion` devait rester visible.
- Root cause: Configuration de navigation header non alignée avec la nouvelle consigne UX.
- Fix applied: Suppression des liens `Clubs` et `Démo` du header de `/`.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Exposition non souhaitée des inscriptions club/promoteur sur auth public**
- File(s) affected: src/app/(auth)/AuthSplitPage.tsx, src/app/page.tsx
- Error: La page d’auth publique proposait l’auto-inscription `club` et `promoter`, non alignée avec le nouveau parcours métier.
- Root cause: Les cartes de rôle d’inscription incluaient tous les profils dans le flux standard.
- Fix applied: Retrait des cartes `club` et `promoter` du sélecteur public; ajout d’un CTA dédié en bas de landing pour l’inscription club; maintien du mode promoteur uniquement par lien direct.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Échec E2E CTA landing (`/demo` manquant)**
- File(s) affected: src/app/page.tsx
- Error: Le test E2E `CTA fonctionne (liens register/login/demo presents)` échouait car `/demo` n’était pas présent dans le HTML landing.
- Root cause: Header landing incomplet (liens `clubs` et `login` seulement).
- Fix applied: Ajout d’un lien `Démo` vers `/demo` dans la navigation header.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Erreur runtime au décochement assurance checkout**
- File(s) affected: src/app/(public)/reserve/checkout/checkoutClient.tsx
- Error: `Cannot read properties of null (reading 'checked')` lors du décochement de l’option assurance.
- Root cause: Lecture de `event.currentTarget.checked` à l’intérieur d’un updater `setState`, avec événement devenu invalide.
- Fix applied: Capture immédiate de `checked` dans une variable locale, puis usage de cette valeur dans `setOptions`.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Artefact visuel persistant sur la case assurance checkout**
- File(s) affected: src/app/(public)/reserve/checkout/checkoutClient.tsx
- Error: Malgré les ajustements précédents, la case assurance affichait encore un rendu cassé (carré/check superposé).
- Root cause: Incompatibilité locale persistante du rendu interne du contrôle checkbox utilisé.
- Fix applied: Remplacement complet par une case custom Tailwind pilotée par l’état React (`checked`), avec styles explicites coché/décoché.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Rendu dégradé de la case assurance sur checkout**
- File(s) affected: src/app/(public)/reserve/checkout/checkoutClient.tsx
- Error: La case d’assurance affichait un rendu déformé (icône/check superposés au texte) sur la page checkout.
- Root cause: Override `classNames.wrapper` du composant HeroUI `Checkbox` qui cassait sa géométrie native.
- Fix applied: Suppression de l’override wrapper problématique et normalisation des classes (`base`/`label` + `size="sm"`).
- Status: ✅ Resolved
---

---
**[2026-03-04] — Overlap persistant du texte + erreur au décochement assurance**
- File(s) affected: src/app/(public)/reserve/checkout/checkoutClient.tsx
- Error: Le texte continuait à se superposer dans les champs du checkout, et la désactivation de l’assurance provoquait un comportement erratique côté UI.
- Root cause: Combinaison de rendu label/field trop fragile sur les inputs HeroUI et contrôle assurance non homogène avec le design system.
- Fix applied: Labels externalisés pour tous les champs + remplacement du contrôle assurance par `Checkbox` HeroUI avec état booléen explicite.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Mauvais rendu du bouton cocher/valider assurance**
- File(s) affected: src/app/(public)/reserve/checkout/checkoutClient.tsx
- Error: Le contrôle de validation de l’option assurance avait un rendu visuel incohérent sur la page checkout.
- Root cause: Rendu du composant `Switch` non optimal dans ce bloc dense mobile-first.
- Fix applied: Remplacement par une checkbox native stylée, stable et alignée au design NightTable.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Superposition visuelle du texte dans les champs checkout**
- File(s) affected: src/app/(public)/reserve/checkout/checkoutClient.tsx
- Error: Le texte saisi se superposait au label sur certains champs du formulaire.
- Root cause: Placement de label non adapté à la densité visuelle actuelle sur mobile.
- Fix applied: Passage des champs en `labelPlacement="outside"` pour séparer strictement libellé et valeur.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Chevauchement visuel dans la section assurance checkout**
- File(s) affected: src/app/(public)/reserve/checkout/checkoutClient.tsx
- Error: Le texte “Assurance annulation” se superposait au contrôle de sélection sur certains widths.
- Root cause: Utilisation du libellé long directement à l’intérieur du composant `Switch` sans séparation structurelle du contenu.
- Fix applied: Refactor du bloc en layout `flex` avec colonne texte dédiée + `Switch` isolé (`shrink-0`) et `aria-label` explicite.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Checkout visuellement décalé par rapport aux pages publiques**
- File(s) affected: src/app/(public)/reserve/checkout/checkoutClient.tsx
- Error: Le tunnel `/reserve/checkout` ne reprenait pas entièrement les surfaces, contrastes et rythmes visuels des pages publiques récemment refondues.
- Root cause: Mélange de styles intermédiaires (`#12172B`/`#1A1D24`) et hiérarchie UI encore partiellement technique.
- Fix applied: Harmonisation des styles checkout sur les tokens et patterns publics (fond #050508, cards premium, steps pill, champs unifiés, récap enrichi), sans changement de logique métier.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Tunnel checkout insuffisamment premium et rassurant**
- File(s) affected: src/app/(public)/reserve/checkout/checkoutClient.tsx
- Error: Le tunnel de réservation manquait de hiérarchie visuelle premium, d’un découpage clair en étapes et d’un récapitulatif confiance-first.
- Root cause: UI checkout héritée d’une structure technique (étapes/barres/formulaires) sans pattern éditorial hospitality premium.
- Fix applied: Refonte complète Soho House (étapes 1/2/3, formulaire HeroUI, sécurité paiement, confirmation premium, récap sticky desktop, accordéon + CTA fixe mobile) en gardant Stripe/Server Actions intacts.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Finition hero incomplète (alignement/contraste)**
- File(s) affected: src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx
- Error: Le hero gardait une légère instabilité visuelle (badge/titre) et un contraste perfectible sur certaines images.
- Root cause: Paramètres d’overlay et de positionnement encore génériques après la passe globale.
- Fix applied: Ajustement pixel-perfect final du gradient, du placement des éléments et du contraste du titre.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Cohérence visuelle incomplète sur l’ensemble de la page événement**
- File(s) affected: src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx
- Error: Plusieurs zones (hero, infos, panel sticky, mobile bar) restaient visuellement hétérogènes malgré les passes précédentes.
- Root cause: Ajustements itératifs partiels non harmonisés globalement.
- Fix applied: Ajustement global final avec normalisation des densités, hiérarchie, états et proportions mobile/desktop.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Densité visuelle mobile insuffisamment premium sur page événement**
- File(s) affected: src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx
- Error: Le rendu mobile paraissait trop aéré et moins éditorial que la direction Soho House.
- Root cause: Espacements et échelle typographique mobile conservés trop proches de la version desktop.
- Fix applied: Passe micro-UI mobile (padding/gaps/heading scale + safe-area sticky bar) sans impact logique.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Incohérence visuelle CTA desktop/mobile sur page événement**
- File(s) affected: src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx
- Error: Les CTA utilisaient des rendus hétérogènes (`Link` custom vs `Button`), créant une perception de design non unifiée.
- Root cause: Implémentation mixte de composants d’action après refonte.
- Fix applied: Uniformisation des actions sur HeroUI `Button` (primary, radius none, hauteur 48px mobile) sans modifier la logique de réservation.
- Status: ✅ Resolved
---

---
**[2026-03-04] — 404 page événement causé par dérive de schéma `events.notoriety`**
- File(s) affected: src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx
- Error: Requête Supabase en échec sur `column events.notoriety does not exist`, menant à un 404 côté page.
- Root cause: La colonne `notoriety` n’existe pas sur le schéma actuellement déployé.
- Fix applied: Retrait de `notoriety` de la sélection SQL et fallback métier `eventNotoriety = 1`.
- Status: ✅ Resolved
---

---
**[2026-03-04] — 404 page événement causé par dérive de schéma `events`**
- File(s) affected: src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx
- Error: Requête Supabase en échec sur `column events.cover_url does not exist`, menant à un 404 côté page.
- Root cause: La colonne `cover_url` n’existe pas sur le schéma actuellement déployé.
- Fix applied: Retrait de `cover_url` de la sélection SQL et maintien d’une image fallback côté client.
- Status: ✅ Resolved
---

---
**[2026-03-04] — 404 indésirable sur page événement publique**
- File(s) affected: src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx
- Error: La page `/clubs/[slug]/events/[eventId]` renvoyait 404 alors que l’événement existait.
- Root cause: Garde `notFound()` déclenchée quand la normalisation des tables retournait une liste vide.
- Fix applied: Suppression du garde bloquant pour conserver l’accessibilité de la page événement, même sans tables exploitables.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Page publique événement peu orientée conversion table booking**
- File(s) affected: src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx, src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx
- Error: L’écran critique de réservation manquait d’un hero premium, d’une hiérarchie éditoriale claire et d’un CTA mobile sticky.
- Root cause: Layout initial orienté bloc technique (plan + sélection) sans structure event-first inspirée hospitality premium.
- Fix applied: Refonte Soho House (hero photo 50vh + badge statut, infos événement détaillées, card sticky "Choisissez votre table" avec FloorPlan dynamique, sticky bar mobile).
- Status: ✅ Resolved
---

---
**[2026-03-04] — Erreur Next.js d’écriture cookie hors Server Action/Route Handler**
- File(s) affected: src/lib/supabase/server.ts
- Error: `Cookies can only be modified in a Server Action or Route Handler` déclenchée par `cookieStore.set(...)` dans le client Supabase serveur.
- Root cause: Tentative d’écriture cookie depuis des contextes Server Component où les cookies sont read-only.
- Fix applied: Encapsulation des écritures cookies (`set/remove`) dans un helper sécurisé qui no-op en contexte read-only.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Page publique `/clubs/[slug]` insuffisamment premium pour convertir**
- File(s) affected: src/app/(public)/clubs/[slug]/page.tsx, src/app/(public)/clubs/[slug]/ClubSlugPageClient.tsx
- Error: La page club n’exprimait pas assez le positionnement désir (hero, programmation, CTA mobile).
- Root cause: Structure précédente orientée fiche simple, sans hiérarchie visuelle type vitrine établissement.
- Fix applied: Refonte Soho House (hero 65vh + overlays, programmation verticale, chips, section ambiance asymétrique, sticky CTA mobile).
- Status: ✅ Resolved
---

---
**[2026-03-04] — Page publique `/clubs` insuffisamment attractive en entrée funnel**
- File(s) affected: src/app/(public)/clubs/page.tsx, src/app/(public)/clubs/ClubsPageClient.tsx
- Error: La page clubs n’exploitait pas un rendu image-first premium ni de recherche interactive pour guider la découverte.
- Root cause: Implémentation initiale orientée listing statique avec hiérarchie visuelle limitée.
- Fix applied: Refonte Soho House (header centré, input HeroUI, grille 1/2/3 colonnes, overlay hover + reveal CTA, chips tags, empty state avec reset).
- Status: ✅ Resolved
---

---
**[2026-03-04] — Warning ESLint résiduel sur navigation dashboard**
- File(s) affected: src/app/(dashboard)/DashboardSidebarNav.tsx
- Error: `@typescript-eslint/no-unused-vars` signalé sur le paramètre `href` de `itemClassName`.
- Root cause: Paramètre hérité d’une ancienne variante de style, non utilisé dans l’implémentation actuelle.
- Fix applied: Suppression du paramètre `href` et mise à jour des appels de `itemClassName`, puis relance lint.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Section v0.3 du changelog trop volumineuse**
- File(s) affected: CHANGELOG.md, docs/CHANGELOG_V03_ARCHIVE.md
- Error: La release `v0.3-mvp-complete` était noyée dans un bloc trop long et répétitif, peu exploitable en lecture rapide.
- Root cause: Empilement des notes de session détaillées directement dans le changelog principal.
- Fix applied: Compaction de la section v0.3 dans `CHANGELOG.md` + création d’une archive dédiée `docs/CHANGELOG_V03_ARCHIVE.md`.
- Status: ✅ Resolved
---

---
**[2026-03-04] — PROJECT_STATUS trop volumineux pour le pilotage quotidien**
- File(s) affected: docs/PROJECT_STATUS.md, docs/PROJECT_STATUS_ARCHIVE.md, CHANGELOG.md
- Error: Le document de suivi vivant restait trop long (journal très granulaire), ce qui ralentissait la lecture opérationnelle.
- Root cause: Empilement de logs de sessions détaillés sans mécanisme d’archivage dédié.
- Fix applied: Allègement de PROJECT_STATUS (focus état/priorités/risques/journal récent) et création d’une archive dédiée.
- Status: ✅ Resolved
---

---
**[2026-03-04] — ERROR_LOG trop dense pour un usage quotidien**
- File(s) affected: docs/errors/ERROR_LOG.md, docs/errors/ERROR_LOG_ARCHIVE.md
- Error: Le log actif contenait une accumulation massive d’incidents historiques, rendant le suivi courant peu lisible.
- Root cause: Absence d’archive séparée pour isoler l’historique détaillé.
- Fix applied: Archivage intégral de l’historique dans ERROR_LOG_ARCHIVE.md puis réduction du log vivant aux incidents actifs + récents.
- Status: ✅ Resolved
---

---
**[2026-03-04] — Flux public club → event stabilisé data-driven**
- File(s) affected: src/app/(public)/clubs/[slug]/page.tsx, src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx, supabase/migrations/013_public_club_profiles_read.sql, supabase/migrations/014_public_read_grants.sql, supabase/migrations/015_public_read_policies_refresh.sql
- Error: Navigation publique instable vers les événements réels selon visibilité runtime des données.
- Root cause: Couplage temporaire fallback applicatif + politiques publiques insuffisamment explicites.
- Fix applied: Suppression fallback/admin, alignement RLS/grants publics, correction requêtes/normalisation relationnelle; validation URL événement en 200.
- Status: ✅ Resolved
---

---
**[2026-03-05] — Crash natif Next.js résolu par Node.js 20 + .nvmrc**
- File(s) affected: `.nvmrc`, `package.json`, Next.js runtime
- Error: Crash serveur silencieux après 'Ready' sans stack trace
- Root cause: Node.js 24.x non supporté par Next.js 16.x (incompatibilité native)
- Fix applied: Installation Node.js 20.x LTS + ajout .nvmrc pour forcer la bonne version
- Status: ✅ Resolved
---

## Archive

- Historique complet: docs/errors/ERROR_LOG_ARCHIVE.md
- Incidents détaillés datés: docs/errors/incidents/
