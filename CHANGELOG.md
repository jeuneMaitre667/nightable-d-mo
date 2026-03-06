## Unreleased

### Changed
- Migration complète du thème NightTable vers "midnight neon" (noir/violet/bleu/rose) :
  - `globals.css`, `tailwind.config.ts`, `providers.tsx` : nouveaux tokens, polices, breakpoints
  - Tous les composants UI (`src/components/ui/*`) migrés sur la nouvelle palette
  - FloorPlan, emails transactionnels, landing, public, dashboard : remplacement global des couleurs legacy
  - Effets visuels glow/gradient/shadow appliqués sur landing et sections publiques
  - QA visuelle et responsive sur tous les parcours

### Fixed
- Correction exhaustive des erreurs lint (JSX/TS) sur tout le projet, build Next.js OK

### Added
- Documentation mise à jour : ERROR_LOG.md, PROJECT_STATUS.md, CHANGELOG.md

### Fixed
- /login : restauration du header NightTable (texte, lien accueil) au-dessus du formulaire
### Changed
- /login : suppression du bloc NT NightTable au-dessus du formulaire de connexion (plus de header)
### Changed
- /login : le header logo est remplacé par le texte "NightTable" (style landing page)
### Fixed
- /login : correction des propriétés SVG (clipRule, fillRule) pour éviter les warnings React/Next.js
### Changed
- /login : ajout d’un header avec logo cliquable, suppression du texte NightTable (alignement page d’accueil)
### Added
- src/app/(dashboard)/club/04-femmes-vip/page.tsx : nouvelle page Femmes VIP (club)
- Sidebar club : menu Femmes VIP ajouté au-dessus de Promoteurs
## Unreleased

### Fixed
- Route Femmes VIP (club): suppression totale du dossier, des liens sidebar, et de la logique de redirection (plus de 404 ni de résidu)
- Sidebar club: correction structure JSX après suppression du lien Femmes VIP
### Added
- sidebar.tsx : Ajout du menu Femmes VIP juste sous Clients (route /dashboard/club/03-femmes-vip, icône Users, page créée)
### Added
- sidebar.tsx : Ajout du menu Promoteur juste au-dessus de Plan des tables (route /dashboard/club/promoters, icône Users)
### Fixed
- 07-events, 02-commissions, 02-invitations : Correction "File is not a module" (ajout export default sur tous les fichiers de page/composant concernés, Next.js build OK)
- src/app/(dashboard)/club/femmes-vip/page.tsx, loading.tsx, error.tsx, ClubFemmesVipPanel.tsx : déplacement de la page Femmes VIP au même niveau que clients (route indépendante /dashboard/club/femmes-vip)
- ClubFemmesVipPanel.tsx, page.tsx, loading.tsx, error.tsx : nouvelle page Femmes VIP du club (dashboard/club/clients/femmes-vip), UI NightTable, mock data, responsive, empty/error states.
- src/app/(dashboard)/club/clients/femmes-vip/page.tsx : corrections imports (top-level), suppression double export default, typage Badge (plus d'erreurs TypeScript, build OK)
- ClubHomePanels.tsx: ReferenceError Button is not defined (import manquant corrigé)
### Changed
 - ClubFemmesVipPanel.tsx: refonte complète de la page Femmes VIP club en grille de cartes, badges, filtres, header, actions, responsive, selon la maquette.
- Tous les boutons d'action du dashboard club (ClubHomePanels, ClubClientsPanel, ClubReservationsPanel, ClubVipPanels, ClubReservationsError) sont maintenant uniformisés : couleur, forme, variant Button shadcn/ui, palette NightTable, radius, taille, hover/focus cohérents.
### Changed
- ClubReservationsPanel.tsx: Bouton "Nouvelle réservation" déplacé à droite dans le header.
### Changed
- ClubClientsPanel.tsx: Suppression du bouton "Ajouter un contact" dans le header de la page clients.
### Changed
- ClubReservationsPanel.tsx: Titre et bouton "Nouvelle réservation" alignés à gauche, bouton "Exporter" supprimé du header.
### Added
- ClubClientsPanel.tsx: Bouton "Exporter" ajouté à la page clients (aligné avec le style du dashboard).
- ClubReservationsPanel.tsx: Bouton "Exporter" ajouté à la page réservations (aligné avec le style du dashboard).
### Changed
- sidebar.tsx: Icône à côté de "Femmes VIP" passée du doré au blanc pour cohérence visuelle.
### Changed
- sidebar.tsx: Couleur dorée retirée du lien "Femmes VIP" dans la sidebar, harmonisée avec les autres menus.
### Changed

src/components/ui/sidebar.tsx : Femmes VIP déplacé sous Clients, suppression section dédiée en bas

src/components/ui/sidebar.tsx : Refonte sidebar club (Clients & VIPs → Clients, ajout section Femmes VIP, structure radix-nova)

src/app/(dashboard)/club/clients/ClubClientsPanel.tsx : Suppression de tout ce qui concerne les clients VIP (onglet, stats, segments, filtrage, labels)

src/app/(dashboard)/club/clients/ClubClientsPanel.tsx : Suppression du bouton "Filtres avancés" (simplification UI)
- Nouvelle sidebar NightTable (shadcn/ui radix-nova) appliquée à tous les dashboards (SidebarProvider + AppSidebar), branding, collapsible, responsive, suppression DashboardSidebarNav/DashboardMobileNav.
### Changed
- src/app/(dashboard)/club/ClubHomePanels.tsx : refonte UI complète du dashboard club pour correspondre à la maquette Velvet Rope (fond, cards, graphique, barres, table, badges, responsive, branding NightTable, full Tailwind, sans HeroUI).
### Changed
- Tous les menus déroulants natifs remplacés par un composant Select Radix UI NightTable (shadcn/ui, gold, popover, accessibilité, animation fadeIn, focus ring gold).
- Page /reserve : tous les <select> remplacés par Select Radix UI NightTable, gestion d'état via hooks, UX unifiée.
### Changed
- ClubHomePanels.tsx: Sélecteur période remplacé par un bouton natif stylé (shadcn/radix, gold, accessible, responsive).
### Changed
- ClubHomePanels.tsx: Amélioration visuelle de la section graphique revenus et du menu déroulant (fond, alignement, label, responsive, focus, hover gold).
### Changed
- ClubHomePanels.tsx, page.tsx: Le graphique d'évolution des revenus est désormais réactif à la période sélectionnée (journalier, hebdomadaire, mensuel).
### Fixed
- ClubHomePanels.tsx: Correction de la visibilité et optimisation du rendu du menu déroulant période pour l'évolution des revenus (dashboard club).
### Added
- ClubHomePanels.tsx: ajout d'un menu déroulant pour trier l'évolution des revenus par période (journalier, hebdomadaire, mensuel)
# Changelog

Toutes les évolutions notables du projet NightTable sont documentées dans ce fichier.

## Unreleased

### Fixed
- src/app/(dashboard)/club/clients/page.tsx : Correction de la redirection Femmes VIP (tab=femmes-vip) via searchParams Next.js App Router, plus d’erreur cookies().get, UX propre.

### Fixed
- src/app/(dashboard)/club/femmes-vip/* : Suppression de toutes les réexportations vers l'ancien dossier clients/femmes-vip (dossier supprimé)
- src/app/(dashboard)/club/femmes-vip/page.tsx, ClubFemmesVipPanel.tsx, error.tsx, loading.tsx : Correction des routes en doublon, plus aucune référence à clients/femmes-vip, tout est local.
- Vérification complète de toutes les routes dashboard club : plus de doublon, plus de conflit, navigation saine.

### Added
 src/app/(dashboard)/club/clients/ClubClientsPanel.tsx : Migration HeroUI → shadcn/ui sur la page clients (boutons, input, tabs)

### Fixed
- src/app/(dashboard)/club/page.tsx : correction de l'erreur "await isn't allowed in non-async function" et refactor serveur/client
- src/app/(dashboard)/club/page.tsx: removed server-side `period` reference causing ReferenceError; migrated revenueSeries computation to `ClubDashboardHomeClient.tsx` reacting to period state.
- src/components/ui/sidebar.tsx : suppression de l'import inexistant 'radix-nova/sidebar', refactor complet en composant local, correction structure, build OK, sidebar visible sur tous les dashboards.

- `vercel.json`: configuration explicite Vercel pour forcer le preset `nextjs` et éviter les déploiements statiques vides (`404`).
- `scripts/vercel-deploy.ps1`: script d’automatisation publication (`main`, checks lint/build, push, déploiement Vercel prod) avec options `-DryRun`, `-SkipChecks`, `-SkipDeploy`, `-ForceMain`.
- Nouvelle route publique dédiée clubs: `/clubs-acces` avec onglets connexion/inscription réservés aux comptes club.
- Routes publiques créées: `/tarifs`, `/centre-aide`, `/blog`, `/tutoriels-video`, `/api-integrations`, `/a-propos`, `/contact`, `/mentions-legales`, `/confidentialite`.
- Landing `/`: nouvelles sections orientées clubs (bloc fonctionnalités x3 + bandeau CTA) avec accès direct à `/demo` et `/register?role=club`.
- Dashboard club enrichi: nouvelles pages `clients`, `reservations`, `settings`, états `loading/error` dédiés et alias routes `/dashboard/club/*`.
- Parcours publics enrichis: pages `clubs/[slug]` et `clubs/[slug]/events/[eventId]` fiabilisées, plus alignement visuel landing/public.
- UI publique `/clubs` refondue en grille image-first Soho House avec recherche centrée, tags ambiance et empty state dédié.
- UI publique `/clubs/[slug]` refondue en vitrine établissement (hero 65vh, programmation verticale, section ambiance, sticky CTA mobile).
- Infrastructure DB publique renforcée: migrations `013`, `014`, `015` pour RLS/grants lecture anonymes sur `club_profiles/events/tables/event_tables`.
- Industrialisation UI: base HeroUI consolidée (`providers`, `tailwind`, composants table/modal/chips/skeleton) sur dashboards club/client/promoter.
- Composants UX majeurs ajoutés: `DashboardMobileNav`, `AuthSplitPage`, panneaux promoteur (`PromoterCommissionsPanel`, `PromoterPromoPanel`), tables client (`ClientReservationsTable`, `ClientWaitlistList`).
- Gouvernance projet renforcée: règles responsive/consistency ajoutées dans `.github/copilot-instructions.md`.
- Documentation: création de `docs/PROJECT_STATUS_ARCHIVE.md` pour externaliser l’historique détaillé.
- Documentation incidents: création de `docs/errors/ERROR_LOG_ARCHIVE.md` pour préserver l’historique complet du log d’erreurs.
- `.nvmrc`: fichier de version Node.js (20) ajouté pour garantir la compatibilité sur tous les environnements


### Fixed
- `src/app/(public)/clubs/ClubsPageClient.tsx`: Correction et refonte du design de la barre de recherche clubs (UI épurée, icône gold, placeholder centré, bordure gold, fond secondaire, focus gold, arrondi XL) pour correspondre à la charte NightTable.

- `src/app/page.tsx`: sécurisation des liens des cartes `Clubs partenaires` vers `/clubs` (route stable) pour éviter les impasses liées à des slugs non présents selon l’environnement de données.
- `package.json`: ajout de la commande `deploy:vercel` pour exécuter le script de publication Vercel.
- `/demo`: correction des 2 premières images de page (hero + premier visuel section fonctionnalités) en remplaçant les URLs distantes par des assets locaux WebP.
- `package.json`: suppression de la devDependency temporaire `sharp` après finalisation de l’optimisation des images démo.
- `public/demo`: suppression des anciens fichiers `.jpeg` après migration complète vers `.webp` pour éviter les doublons d’assets.
- `/demo`: conversion des 4 visuels compacts en `.webp` et mise à jour des chemins image pour réduire fortement le poids réseau.
- `/demo`: migration complète des 4 cartes compactes vers des visuels internes locaux (`/public/demo`) pour une section sans dépendance image externe.
- `/demo`: remplacement des 2 premiers visuels de cartes compactes par des captures internes NightTable servies depuis `/public/demo` (plus de dépendance externe).
- `/demo`: suppression des boutons `Connexion` et `Créer un compte` dans la section header tout en haut, et remplacement des 2 premiers visuels de cartes compactes qui ne se chargeaient pas.
- `/demo`: ajout d’images de démonstration dans les cartes compactes de la section “Une solution complète, sans compromis” pour supprimer les zones sans visuel.
- `/demo`: ajout explicite du bloc compact `Gestion des promoteurs` dans la section fonctionnalités.
- `/demo`: suppression du badge “Nouvelle mise à jour · Plan interactif 3D” dans le hero.
- `/demo`: section de cartes “Plan des tables en direct” à “Analyses et CA” condensée en blocs compacts (moins de texte, plus dense visuellement).
- `/demo`: refonte complète mixant les deux maquettes fournies (hero SaaS, dashboard preview, sections alternées visuel/texte, bloc “solution complète”, CTA final) avec palette NightTable dark + gold.
- Footer landing (`Produit > Clubs`) redirige désormais vers `/clubs-acces` au lieu du flux utilisateur générique.
- Footer landing (`Produit`): suppression des liens `Plan des tables`, `Clients & VIPs` et `Analytiques`; conservation d’entrées simplifiées `Démo`, `Clubs`, `Tarifs`.
- Footer landing: liens `Ressources` et `Entreprise` raccordés à leurs pages dédiées au lieu de redirections génériques vers `/demo`.
- Landing `/`: suppression des blocs intermédiaires orientés B2B (de “Tout ce dont vous avez besoin” jusqu’au CTA “Voir la démo”) pour garder un parcours client centré réservation.
- Footer landing (section Produit): ajout des entrées `Démo` et `Clubs` pour orienter les établissements vers la démo et l’inscription club.
- Landing `/`: refonte complète du bas de page pour correspondre au mock cible (section “Tout ce dont vous avez besoin”, 3 cartes produit, grand bandeau CTA et footer multi-colonnes).
- Landing `/`: ajout d’un parcours de conversion clubs sous la page d’accueil, inspiré du mock fourni (message produit, cartes bénéfices, CTA démo + inscription).
- Landing `/`: simplification du header public en retirant les liens `Clubs` et `Démo` pour ne conserver que l’accès `Connexion`.
- Auth public `/login` + `/register`: retrait des cartes de sélection `club` et `promoter` du parcours standard, avec message explicite pour les accès via liens dédiés.
- Landing `/`: ajout d’un CTA bas de page `Inscrire mon club` pointant vers `/register?role=club` pour canaliser l’onboarding clubs depuis l’accueil.
- Public `/reserve/checkout`: harmonisation visuelle avec le reste du site (surfaces premium, steps en pills, champs et récap alignés tokens NightTable) sans changer la logique Stripe/Server Action.
- Public `/reserve/checkout`: refonte complète tunnel premium (layout 60/40 desktop, étapes 1/2/3, formulaire HeroUI, PaymentElement conservé, récap sticky, accordéon mobile, CTA fixe mobile).
- Public `/clubs/[slug]/events/[eventId]`: passe pixel-perfect finale du hero (overlay, positionnement titre/badge, lisibilité) pour finition visuelle premium.
- Public `/clubs/[slug]/events/[eventId]`: ajustement global final (hero, métadonnées, densité DJ cards, panel sticky, hauteur plan mobile, sticky bar mobile) pour un rendu premium unifié.
- Public `/clubs/[slug]/events/[eventId]`: passe mobile ultra-ciblée sur la densité visuelle (padding, tailles titres, gaps, safe-area sticky bar) sans changement de logique.
- Public `/clubs/[slug]/events/[eventId]`: harmonisation fine des CTA desktop/mobile sur HeroUI `Button` (`primary`, `radius=none`, `h-12`) pour cohérence visuelle.
- Public `/clubs/[slug]/events/[eventId]`: refonte complète style Soho House (hero 50vh, infos éditoriales 65/35, panel sticky desktop, barre sticky mobile) en conservant la logique de sélection/réservation des tables.
- Public: parcours `club → event` stabilisé en data-driven (lecture `slug` + events publiés), correction de la requête events et normalisation relationnelle `table:tables`.
- Public `/clubs`: rendu déplacé vers un composant client dédié (`ClubsPageClient`) pour supporter la recherche HeroUI en temps réel.
- Public `/clubs/[slug]`: rendu déplacé vers `ClubSlugPageClient` pour gérer hero visuel, layout programmation Soho House et CTA mobile sticky.
- Design system: harmonisation visuelle globale dashboard/public (tokens NightTable, focus rings, états actifs nav, densité responsive).
- Club dashboards: refontes successives de `events`, `tables`, `promoters`, `vip`, `analytics`, `clients`, `reservations`, `settings` avec mobile cards + desktop tables.
- Dashboard navigation: `DashboardSidebarNav` simplifié en retirant le paramètre inutilisé `href` de `itemClassName`.
- Client/Promoter/VIP: panels alignés (CTA, headers, grilles mobile-first, formulaires/actions server-side).
- Runtime/dev tooling: stabilisation scripts (`dev --webpack`, `dev-reset`), maintenance seeds (`seed-demo-data`, `verify-demo-seed`) et alias routes dashboard.
- `docs/PROJECT_STATUS.md`: section `Fait` compressée en synthèse par domaines pour réduire la redondance et améliorer la lisibilité opérationnelle.
- `docs/PROJECT_STATUS.md`: journal allégé pour conserver uniquement les entrées récentes et actives.
- `docs/errors/ERROR_LOG.md`: allégé en format opérationnel (incidents actifs + récents) avec renvoi vers archive.

### Fixed

- Landing `/`: correction des liens partenaires pouvant sembler "sans redirection" en pointant vers une destination garantie (`/clubs`) dans tous les environnements.
- Vercel production: correction de la cause racine des `404` globaux (`Framework Preset: Other`) en imposant `framework: nextjs` via `vercel.json`.
- Auth clubs: blocage des connexions non-club sur `/clubs-acces` avec message explicite et déconnexion immédiate pour éviter l’usage de la page club par des comptes utilisateurs.
- Auth onboarding: suppression de l’accès auto-inscription `club/promoter` depuis la sélection publique afin d’imposer les canaux prévus (CTA landing pour clubs, lien d’invitation pour promoteurs).
- Landing `/`: ajout du lien CTA `/demo` dans le header pour satisfaire le contrôle E2E des CTA publics.
- Public `/reserve/checkout`: correction du crash au décochement assurance (`Cannot read properties of null (reading 'checked')`) en capturant la valeur booléenne avant `setState`.
- Public `/reserve/checkout`: remplacement final par une case custom Tailwind (état coché/décoché explicite) pour éliminer l’artefact visuel persistant du contrôle assurance.
- Public `/reserve/checkout`: correction du rendu visuel de la case assurance en supprimant l’override CSS qui déformait le contrôle HeroUI.
- Public `/reserve/checkout`: correction finale du chevauchement de texte dans le formulaire via labels externes explicites (plus de superposition pendant la saisie/autofill).
- Public `/reserve/checkout`: correction du comportement à la désactivation de l’assurance avec un composant `Checkbox` HeroUI stable (rendu + interaction cohérents).
- Public `/reserve/checkout`: remplacement du switch assurance par une checkbox native stylée pour corriger le rendu visuel du contrôle de validation.
- Public `/reserve/checkout`: correction du chevauchement texte/champ via `labelPlacement="outside"` sur les inputs/textarea du formulaire.
- Public `/reserve/checkout`: correction du chevauchement texte/contrôle dans le bloc “Assurance annulation” via séparation label/switch et alignement responsive stable.
- Public `/clubs/[slug]/events/[eventId]`: correction de dérive de schéma Supabase (`events.notoriety` absent) en retirant la colonne et en appliquant la valeur métier par défaut `1`.
- Public `/clubs/[slug]/events/[eventId]`: correction de dérive de schéma Supabase (`events.cover_url` absent) en retirant la colonne de la requête.
- Public `/clubs/[slug]/events/[eventId]`: suppression du `404` forcé quand aucune table normalisée n’est disponible, la page événement reste accessible.
- Supabase server client: neutralisation des écritures cookies en contexte read-only (Server Component) pour éviter l’erreur Next.js « Cookies can only be modified in a Server Action or Route Handler ».
- Parcours public `club → event` fiabilisé sans fallback applicatif: URL event réelle servie en `200` après alignement RLS/grants et correction requêtes publiques.
- Lint warning supprimé sur `DashboardSidebarNav` (`@typescript-eslint/no-unused-vars`).
- `src/lib/supabase/serverAdmin.ts`: suppression du contournement temporaire admin au profit d’un accès public sécurisé via RLS/grants.
- `src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx`: correction build TypeScript sur la forme de `table` (array Supabase) pour correspondre au contrat attendu par `EventBookingClient`.
- Corrections critiques runtime/build: `createContext` server/client boundary, JSX/TS build breaks, null safety (`event_tables`, `dj_lineup`), OpenGraph et lint bloquants.
- Corrections fonctionnelles dashboard: filtres réservations club, routage alias club/promoter/vip, actions server-side (`resale`, `validate`, `duplicate`, `copy`).
- Corrections UX mobile/auth: suppression doublons nav, focus/champs auth stabilisés, overlay/autofill nettoyés, tables dashboards harden (`overflow-x-auto`).
- Corrections DB/seed: compatibilité schéma distant (VIP invitations, floor plans/tables positions), robustesse scripts de seed/check et policies RLS manquantes.

### Added (tests)

- `scripts/smoke-test-vip.mjs`: smoke test automatisé des routes VIP module (auth, rôles, contenu).

## v0.3-mvp-complete - 2026-03-01

### Added

- Module promoteur: guest list dédiée, suivi commissions, lien promo.
- Module club promoteurs: création, tracking et validation des commissions.
- Dashboard client: home, réservations et waitlist.
- Seed démo exécutable et note de release MVP.

### Changed

- Landing publique finalisée (SEO + images optimisées).
- Actions serveur étendues (promoteur/réservation) avec validation Zod et contrôles rôle/ownership.
- Alias routes dashboard harmonisées sur `/dashboard/*`.

### Fixed

- Compatibilité build Next sur Server Actions (wrappers `Promise<void>`).
- Correctifs TypeScript majeurs (narrowing, OpenGraph, typage Supabase admin).
- Compatibilité seed avec le schéma Supabase effectivement déployé.

### Validation

- `npm run seed:demo` ✅
- `npm run lint` ✅
- `npm run build` ✅

### Git

- Commit de release: `8a04f9d`
- Tag annoté: `v0.3-mvp-complete`

### Archive

- Détails complets de la release: `docs/CHANGELOG_V03_ARCHIVE.md`

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
- `.nvmrc`: fichier de version Node.js (20) ajouté pour garantir la compatibilité sur tous les environnements

### Git

- Commit de référence: `ef434cf`
- Tag annoté: `v0.1-docs`

### Fixed
- src/components/ui/sidebar.tsx : Suppression complète du lien/section Femmes VIP dans la sidebar club (reset navigation)
