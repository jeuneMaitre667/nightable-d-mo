# Error Log

| Date | ID | Zone | Severity | Status | Résumé | Incident |
|---|---|---|---|---|---|---|
| 2026-03-01 | ERR-2026-001 | Auth / Next.js runtime | High | resolved | Conflit `src/middleware.ts` + `src/proxy.ts` sur Next 16 | [2026-03-01-next-middleware-proxy-conflict](incidents/2026-03-01-next-middleware-proxy-conflict.md) |
| 2026-03-01 | ERR-2026-002 | Supabase Auth | Medium | monitoring | `signUp` bloqué par `429 over_email_send_rate_limit` | [2026-03-01-supabase-signup-rate-limit](incidents/2026-03-01-supabase-signup-rate-limit.md) |
| 2026-03-01 | ERR-2026-003 | Auth profile bootstrap | High | resolved | Inscriptions OK sur `profiles`, mais blocage RLS sur `client_profiles` / `club_profiles` | [2026-03-01-auth-signup-rls](incidents/2026-03-01-auth-signup-rls.md) |
| 2026-03-01 | ERR-2026-004 | Public booking / DB schema | High | resolved | Décalage schéma `events`: colonne `notoriety` absente en prod distante | [2026-03-01-events-schema-drift-notoriety](incidents/2026-03-01-events-schema-drift-notoriety.md) |
| 2026-03-01 | ERR-2026-005 | Stripe local / Paiement | High | mitigated | `STRIPE_SECRET_KEY` locale invalide (`401 Invalid API Key`) pendant tests E2E | [2026-03-01-stripe-invalid-secret-key-local](incidents/2026-03-01-stripe-invalid-secret-key-local.md) |
| 2026-03-01 | ERR-2026-006 | Documentation process | Low | resolved | Rappel “session close” ajouté au template incident pour éviter les oublis de synchro docs | [incident-template](templates/incident-template.md) |
| 2026-03-01 | ERR-2026-007 | Dashboard/Public UI / Build TS | Medium | resolved | Build cassé sur `Cannot find namespace 'JSX'` (plusieurs composants/pages) | [2026-03-01-dashboard-events-jsx-namespace-build](incidents/2026-03-01-dashboard-events-jsx-namespace-build.md) |
| 2026-03-01 | ERR-2026-008 | Auth UI / Next.js build-lint | Medium | resolved | `useSearchParams` cassait le prerender `/register` et `setState` dans `useEffect` cassait le lint `/login` | [2026-03-01-dashboard-events-jsx-namespace-build](incidents/2026-03-01-dashboard-events-jsx-namespace-build.md) |
| 2026-03-01 | ERR-2026-009 | UI governance process | Low | resolved | Règles de construction des composants non standardisées entre sessions | [incident-template](templates/incident-template.md) |
| 2026-03-01 | ERR-2026-010 | VIP invitations / DB schema | High | resolved | vip_invitations: colonnes legacy NOT NULL bloquaient les inserts new-style | N/A |
| 2026-03-01 | ERR-2026-011 | Landing assets / Public UI | Low | resolved | URL Unsplash invalide (404) sur une carte "clubs partenaires" de la landing | N/A |
| 2026-03-01 | ERR-2026-012 | Club dashboard UI density | Low | resolved | Home club trop espacée et table réservations peu lisible vs référentiel Linear | N/A |
| 2026-03-01 | ERR-2026-013 | Club events UI density | Low | resolved | Page événements club trop “cards” et peu scannable pour l’opérationnel nightly | N/A |
| 2026-03-02 | ERR-2026-014 | Club dashboard routing | Medium | resolved | Navigation club (events/tables/promoters/analytics) redirigeait vers `/dashboard/club` | N/A |
| 2026-03-02 | ERR-2026-015 | Club dashboard alias routes | Medium | resolved | URLs `/dashboard/club/events` et `/dashboard/club/tables` non mappées malgré pages club existantes | N/A |
| 2026-03-02 | ERR-2026-016 | Club events runtime null | High | resolved | Crash `/dashboard/club/events` sur `Cannot read properties of null (reading 'length')` | N/A |
| 2026-03-02 | ERR-2026-017 | Club events visual parity | Low | resolved | Le redesign events était jugé trop proche de l’ancien rendu | N/A |
| 2026-03-02 | ERR-2026-018 | Club events/new route + sidebar UX | Medium | resolved | `/dashboard/club/events/new` inaccessible et sidebar jugée inchangée visuellement | N/A |
| 2026-03-02 | ERR-2026-019 | App Router / HeroUI provider | High | resolved | Runtime Next.js: `createContext only works in Client Components` après ajout HeroUIProvider en layout racine serveur | N/A |
| 2026-03-02 | ERR-2026-020 | App Router / HeroUI imports en pages serveur | High | resolved | Build Next.js cassé (`createContext is not a function`) après import HeroUI direct dans des pages serveur | N/A |
| 2026-03-02 | ERR-2026-021 | Tables UI migration regression risk | Low | resolved | Risque de régression lors de la migration HeroUI de la page tables (modal/form/actions) | N/A |
| 2026-03-02 | ERR-2026-022 | Promoters UI migration regression risk | Low | resolved | Risque de régression lors de la migration HeroUI de la page promoteurs (tableau + modal) | N/A |
| 2026-03-02 | ERR-2026-023 | Analytics UI migration regression risk | Low | resolved | Risque de régression lors de la migration HeroUI de la page analytics (cartes KPI + tableau réservations) | N/A |
| 2026-03-02 | ERR-2026-024 | Client dashboard UI migration regression risk | Low | resolved | Risque de régression sur les pages client (home/réservations/waitlist) lors du passage vers HeroUI | N/A |
| 2026-03-02 | ERR-2026-025 | Events page strict HeroUI spec compliance | Low | resolved | Refactor events requis avec contraintes strictes HeroUI (table/chips/actions/skeleton/CTA) | N/A |
| 2026-03-02 | ERR-2026-026 | Tables page strict HeroUI refinement | Low | resolved | Refactor tables renforcé (chips zone/promo, action icon-only, loading cellulaire) | N/A |
| 2026-03-02 | ERR-2026-027 | Promoter pages HeroUI migration regression risk | Low | resolved | Risque de régression UI/actions sur guestlist, commissions et promo lors de la migration HeroUI | N/A |
| 2026-03-02 | ERR-2026-028 | Tables page strict HeroUI spec compliance | Low | resolved | Refactor exact demandé sur page/client tables (colonnes/chips/switch/modal/CTA/actions/loading) | N/A |
| 2026-03-02 | ERR-2026-029 | Analytics page strict HeroUI spec compliance | Low | resolved | Refactor analytics complexe (Tabs période, 6 KPI, top promoteurs, événements passés, skeleton/empty state) | N/A |
| 2026-03-02 | ERR-2026-030 | Global lint / JSX escaping | Medium | resolved | `npm run lint` bloqué par `react/no-unescaped-entities` dans un composant promoteur | N/A |
| 2026-03-02 | ERR-2026-031 | Analytics prerender / server-client boundary | High | resolved | `npm run build` cassé sur `/club/analytics` avec `createContext is not a function` depuis `loading.tsx` | N/A |
| 2026-03-02 | ERR-2026-032 | Global lint / unused vars | Low | resolved | Warnings ESLint restants sur `scripts/fix-rgpd-col.mjs` (`no-unused-vars`) | N/A |
| 2026-03-02 | ERR-2026-033 | Auth redesign lint compliance | Low | resolved | Refonte login/register: lint bloqué sur apostrophes JSX et règle set-state-in-effect | N/A |
| 2026-03-02 | ERR-2026-034 | Mobile UX audit / layout density | Medium | resolved | Quelques zones restaient desktop-first (auth viewport lock, grilles compressées) | N/A |
| 2026-03-02 | ERR-2026-035 | Mobile UX / dashboard tables overflow | Medium | resolved | Plusieurs tableaux dashboard débordaient horizontalement sur petits écrans | N/A |
| 2026-03-02 | ERR-2026-036 | Club dashboard home / design parity | Low | resolved | La page `/dashboard/club` n’était plus alignée avec le nouveau référentiel Velvet Rope Analytics | N/A |
| 2026-03-02 | ERR-2026-037 | Club dashboard alias route drift | Medium | resolved | `/dashboard/club` affichait encore la vue legacy au lieu de la page refondue | N/A |
| 2026-03-02 | ERR-2026-038 | Club dashboard shell / navigation parity | Low | resolved | Sidebar club ne reflétait pas l’objectif UX final (onglets latéraux complets et persistants) | N/A |
| 2026-03-02 | ERR-2026-039 | Club dashboard inner pages / visual consistency | Low | resolved | Les pages internes club n’étaient pas alignées visuellement avec le nouveau shell latéral | N/A |
| 2026-03-02 | ERR-2026-040 | Auth form / focus and CTA visibility | Low | resolved | Focus jaune trop agressif sur champs login et bouton “Se connecter” peu lisible | N/A |
| 2026-03-02 | ERR-2026-041 | Auth forms / persistent yellow focus | Low | resolved | Sur connexion/inscription, la zone jaune de focus restait visible malgré un premier ajustement | N/A |
| 2026-03-02 | ERR-2026-042 | Global forms / gray blur while typing | Low | resolved | Effet zone grisée/floue sous le texte saisi sur login/register et autres formulaires | N/A |
| 2026-03-02 | ERR-2026-043 | Role routing / club redirected to client dashboard | High | resolved | Un compte club était redirigé vers `/dashboard/client` au login | N/A |
| 2026-03-02 | ERR-2026-044 | Club navigation tabs hidden on narrow viewport | Medium | resolved | Les onglets club n’étaient plus visibles quand la sidebar desktop était masquée | N/A |
| 2026-03-02 | ERR-2026-045 | Auth inputs / text superposition persists | Medium | resolved | Les caractères saisis semblaient doublés/superposés dans les champs de texte | N/A |
| 2026-03-02 | ERR-2026-046 | Auth text overlap persistent after HeroUI overrides | Medium | resolved | Les overlays CSS ne suffisaient pas: superposition encore visible sur certains environnements | N/A |
| 2026-03-02 | ERR-2026-047 | Club tabs missing due stale role in layout | High | resolved | Le layout dashboard pouvait afficher un menu non-club malgré le login club | N/A |
| 2026-03-02 | ERR-2026-048 | Mobile dashboard / duplicated tab bars | Low | resolved | Deux barres d’onglets visibles en même temps sur mobile | N/A |

---
**[2026-03-02] — Ajustements mobile post-audit (auth/promoter/vip)**
- File(s) affected: `src/app/(auth)/AuthSplitPage.tsx`, `src/app/(dashboard)/promoter/promo/PromoterPromoPanel.tsx`, `src/app/(dashboard)/club/vip/ClubVipPanels.tsx`
- Error: Expérience mobile partiellement dégradée (scroll bloqué en auth sur clavier mobile, densité excessive sur certaines grilles).
- Root cause: Choix de layout desktop-first (`h-screen` + `overflow-hidden`, grilles fixes trop denses) conservés après refontes.
- Fix applied: Layout auth rendu scroll-safe sur mobile (`min-h-[100dvh]`, `overflow-y-auto`), grilles adaptées (`grid-cols-4 sm:grid-cols-7` pour activité promoteur, `grid-cols-1 sm:grid-cols-2` pour profils VIP pending).
- Status: ✅ Resolved
---

---
**[2026-03-02] — Dashboard club home non aligné avec le design cible**
- File(s) affected: `src/app/(dashboard)/club/page.tsx`, `src/app/(dashboard)/club/ClubHomePanels.tsx`
- Error: La page `/dashboard/club` conservait une structure intermédiaire (meta/tables/styles) non conforme au nouveau système Velvet Rope Analytics demandé.
- Root cause: Itérations successives du dashboard avec conventions visuelles hétérogènes.
- Fix applied: Recomposition complète de la Page 1 (header "Tableau de bord", 4 KPI cards stylées, table réservations avec avatar+email, table promoteurs avec colonne "Lien actif", harmonisation chips/boutons).
- Status: ✅ Resolved
---

---
**[2026-03-02] — `/dashboard/club` affichait encore la page legacy**
- File(s) affected: `src/app/(dashboard)/dashboard/club/page.tsx`
- Error: En navigateur, l’URL `/dashboard/club` montrait l’ancienne vue CRUD (Créer un événement / Créer une table) malgré la refonte terminée.
- Root cause: La route alias `(dashboard)/dashboard/club/page.tsx` servait toujours son composant legacy local au lieu de re-exporter la page refondue.
- Fix applied: Remplacement du contenu par `export { default } from "@/app/(dashboard)/club/page"` pour aligner la route publique sur la nouvelle implémentation.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Sidebar club non alignée avec l’objectif UX final**
- File(s) affected: `src/app/(dashboard)/layout.tsx`
- Error: Le shell dashboard ne montrait pas clairement tous les onglets club attendus sur la navigation latérale.
- Root cause: Structure de navigation précédente centrée sur une itération intermédiaire, sans hiérarchie latérale finale “Général/Gestion” et sans présentation explicite de tous les onglets clés.
- Fix applied: Refonte de la sidebar club avec sections dédiées et onglets persistants Dashboard, Événements, Tables, Promoteurs, Femmes VIP, Analytics, tout en conservant les garde-fous rôle/auth existants.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Pages internes club visuellement hétérogènes**
- File(s) affected: `src/app/(dashboard)/club/events/page.tsx`, `src/app/(dashboard)/club/promoters/page.tsx`, `src/app/(dashboard)/club/promoters/PromotersTable.tsx`, `src/app/(dashboard)/club/tables/tablesClient.tsx`, `src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx`, `src/app/(dashboard)/club/vip/ClubVipPanels.tsx`
- Error: En navigation réelle, les pages internes du club utilisaient des hiérarchies visuelles différentes (headers, rayons, densité), donnant une expérience fragmentée malgré la nouvelle sidebar.
- Root cause: Itérations page par page réalisées avec des styles partiellement divergents avant consolidation finale du design system dashboard club.
- Fix applied: Harmonisation transversale des headers compacts, conteneurs sections, radius/borders et densité des tables pour alignement complet avec le shell sidebar club.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Focus jaune agressif sur champs login + CTA peu visible**
- File(s) affected: `src/app/(auth)/AuthSplitPage.tsx`
- Error: Pendant la saisie sur email/mot de passe, le contour jaune dominait visuellement; le bouton “Se connecter” manquait de contraste perçu.
- Root cause: Inputs login configurés en `color="primary"` avec accent fort + style bouton trop dépendant du thème HeroUI par défaut.
- Fix applied: Inputs login passés en `color="default"` avec focus bleu adouci via `classNames.inputWrapper`; bouton login forcé en fond gold contrasté avec état hover/focus explicite.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Focus jaune toujours visible sur connexion/inscription**
- File(s) affected: `src/app/(auth)/AuthSplitPage.tsx`
- Error: Le contour jaune persistait sur plusieurs champs au focus malgré un premier correctif limité à la connexion.
- Root cause: Inputs inscription restaient en `color="primary"` et styles focus HeroUI conservaient des états d’outline/ring non neutralisés.
- Fix applied: Tous les inputs auth (login + register) passés en `color="default"` et neutralisation explicite des `outline/ring` focus via `classNames`; CTA inscription forcé en bouton gold “Créer mon compte” très visible.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Effet grisé/flou persistant sous texte de saisie**
- File(s) affected: `src/app/globals.css`
- Error: En saisie, une zone grisée/floue apparaissait sous le texte dans les champs (connexion, inscription et autres écrans).
- Root cause: Combinaison des styles input HeroUI et des états autofill WebKit (`bg-clip`/overlay inset) créant un rendu visuel brouillé.
- Fix applied: Override global des champs HeroUI/natifs (suppression `text-shadow/filter/backdrop-filter`, neutralisation wrapper shadows, correction autofill `-webkit-box-shadow` + `-webkit-text-fill-color`).
- Status: ✅ Resolved
---

---
**[2026-03-02] — Compte club redirigé vers dashboard client**
- File(s) affected: `src/lib/auth.actions.ts`, `src/proxy.ts`
- Error: Après connexion avec des identifiants club, la navigation tombait sur `/dashboard/client` et bloquait l’accès à `/dashboard/club`.
- Root cause: Dépendance stricte à `profiles.role`; en cas de rôle absent ou désynchronisé, `normalizeRole` retombait sur `client`.
- Fix applied: Ajout d’une résolution de rôle avec fallback sur les tables métier (`club_profiles`, `promoter_profiles`, `female_vip_profiles`) puis resynchronisation automatique de `profiles.role` au login et dans le proxy.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Onglets dashboard club invisibles en fenêtre étroite**
- File(s) affected: `src/app/(dashboard)/layout.tsx`
- Error: En viewport réduit, la sidebar était cachée et les onglets club attendus n’étaient plus visibles dans la page.
- Root cause: Navigation latérale affichée uniquement en `md+`; fallback mobile limité à une barre basse partielle.
- Fix applied: Ajout d’une navigation club horizontale dans le header mobile avec tous les onglets clés (dashboard/events/tables/promoters/vip/analytics).
- Status: ✅ Resolved
---

---
**[2026-03-02] — Superposition visuelle du texte dans les inputs**
- File(s) affected: `src/app/(auth)/AuthSplitPage.tsx`, `src/app/globals.css`
- Error: Les textes saisis apparaissaient en doublon/effet superposé dans les champs (email/mot de passe).
- Root cause: Couches visuelles HeroUI (`before/after` wrappers + styles de rendu) combinées à certains états input/autofill générant un rendu parasite.
- Fix applied: Neutralisation explicite des pseudo-couches wrapper, suppression des shadows/filters de rendu, et forçage du text rendering (`-webkit-text-fill-color`, `text-shadow: none`) au niveau auth + global.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Superposition inputs encore visible après overrides CSS**
- File(s) affected: `src/app/(auth)/AuthSplitPage.tsx`
- Error: Malgré les overrides, certains environnements continuaient d’afficher un doublon visuel dans les champs de connexion/inscription.
- Root cause: Le composant `Input` HeroUI conservait des couches de rendu difficiles à neutraliser de manière stable cross-browser.
- Fix applied: Remplacement des champs `Input` HeroUI par des `input` HTML natifs stylés NightTable sur la page auth, suppression de la dépendance aux couches internes HeroUI pour ces champs.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Onglets club absents malgré login club**
- File(s) affected: `src/app/(dashboard)/layout.tsx`
- Error: En pratique, des comptes club voyaient encore un menu incomplet/non-club dans le layout dashboard.
- Root cause: Le layout utilisait directement `profiles.role`; en cas de valeur stale (`client`), la navigation club n’était pas rendue.
- Fix applied: Ajout d’une résolution fallback du rôle dans le layout via les tables métier (`club_profiles`, `promoter_profiles`, `female_vip_profiles`) et resynchronisation de `profiles.role`.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Double barre d’onglets sur mobile**
- File(s) affected: `src/app/(dashboard)/layout.tsx`
- Error: Sur smartphone, la navigation affichait simultanément une barre d’onglets en haut et la barre fixe en bas.
- Root cause: Ajout d’un fallback top-nav mobile en plus de la bottom-nav existante.
- Fix applied: Suppression de la barre d’onglets du header mobile et conservation d’une seule navigation fixe en bas.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Débordement horizontal des tableaux dashboard sur mobile**
- File(s) affected: `src/app/(dashboard)/club/ClubHomePanels.tsx`, `src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx`, `src/app/(dashboard)/club/promoters/PendingCommissionsTable.tsx`, `src/app/(dashboard)/club/promoters/PromotersTable.tsx`, `src/app/(dashboard)/client/reservations/ClientReservationsTable.tsx`, `src/app/(dashboard)/promoter/guestlist/GuestListClient.tsx`
- Error: Plusieurs tableaux devenaient partiellement illisibles sur smartphone (colonnes coupées, actions hors viewport).
- Root cause: Rendu tabulaire dense sans conteneur de scroll horizontal sur les vues concernées.
- Fix applied: Ajout systématique d’un conteneur `overflow-x-auto` autour des composants `Table` concernés + adaptation responsive de la taille des KPI sur la home club.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Règles lint sur la nouvelle UI auth**
- File(s) affected: `src/app/(auth)/AuthSplitPage.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- Error: `react/no-unescaped-entities` et `react-hooks/set-state-in-effect` détectés après la refonte login/register.
- Root cause: Apostrophes non échappées dans JSX et `setState` synchrone dans `useEffect` pour animation d’entrée.
- Fix applied: Apostrophes remplacées par variantes typographiques et animation d’entrée déclenchée via `requestAnimationFrame`.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Warnings lint résiduels sur script RGPD**
- File(s) affected: `scripts/fix-rgpd-col.mjs`
- Error: `@typescript-eslint/no-unused-vars` sur imports/constantes non utilisés.
- Root cause: Script informatif conservait du code expérimental non exécuté.
- Fix applied: Simplification du script et suppression des imports/variables morts.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Build cassé sur prerender analytics (`createContext is not a function`)**
- File(s) affected: `src/app/(dashboard)/club/analytics/loading.tsx`
- Error: `npm run build` échoue sur `/club/analytics` avec `TypeError: createContext is not a function` pendant le prerender.
- Root cause: Import de composants HeroUI (`Skeleton`) dans un `loading.tsx` serveur, entraînant un chargement client-side lib côté contexte serveur.
- Fix applied: Retrait de l’import HeroUI et remplacement par un skeleton Tailwind (`div` + `animate-pulse`) 100% server-safe.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Lint bloquant sur apostrophe JSX non échappée**
- File(s) affected: `src/app/(dashboard)/promoter/commissions/PromoterCommissionsPanel.tsx`
- Error: `react/no-unescaped-entities` sur le texte `Dès qu'un client...` lors de `npm run lint`.
- Root cause: Apostrophe non échappée dans une string JSX rendue dans un paragraphe.
- Fix applied: Remplacement par `Dès qu&apos;un client...` pour conformité ESLint React.
- Status: ✅ Resolved
---

---
**[2026-03-01] — vip_invitations colonnes legacy NOT NULL**
- File(s) affected: `vip_invitations` table (Supabase remote)
- Error: INSERT fails with "null value in column event_id violates not-null constraint"
- Root cause: Migration 012 added new columns (reservation_id, vip_id, invited_by) but old columns (event_id, inviter_client_id, female_vip_id) kept NOT NULL. invited_at also had no DEFAULT.
- Fix applied: ALTER TABLE DROP NOT NULL on 3 legacy columns + SET DEFAULT NOW() on invited_at. VIP invitations seed now inserts correctly (2 rows: pending + accepted).
- Status: Resolved
---
**[2026-03-02] — Dashboard club: liens de navigation non configurés**
- File(s) affected: `src/app/(dashboard)/layout.tsx`, `src/app/(dashboard)/club/analytics/page.tsx`, `src/app/(dashboard)/dashboard/club/analytics/page.tsx`
- Error: Les boutons Événements / Tables / Promoteurs / Analytics redirigeaient tous vers `/dashboard/club`, et la route analytics n’existait pas.
- Root cause: Configuration `roleMenus.club` avec href dupliqués et absence de page `/dashboard/club/analytics`.
- Fix applied: Hrefs corrigés vers routes dédiées + création de la page analytics et de son alias dashboard.
- Status: ✅ Resolved
---
**[2026-03-02] — Dashboard club: alias routes manquants pour events/tables**
- File(s) affected: `src/app/(dashboard)/dashboard/club/events/page.tsx`, `src/app/(dashboard)/dashboard/club/tables/page.tsx`
- Error: Les routes `/dashboard/club/events` et `/dashboard/club/tables` retournaient une page inexistante alors que les pages sources étaient présentes sous `src/app/(dashboard)/club/*`.
- Root cause: Absence d’alias sous le namespace `src/app/(dashboard)/dashboard/club/*` utilisé par les URLs `/dashboard/club/*`.
- Fix applied: Ajout de re-exports alias pour `events` et `tables` afin de mapper correctement ces URLs.
- Status: ✅ Resolved
---
**[2026-03-02] — Dashboard club events: crash runtime sur données nulles**
- File(s) affected: `src/app/(dashboard)/club/events/page.tsx`
- Error: `TypeError: Cannot read properties of null (reading 'length')` au rendu de `/dashboard/club/events`.
- Root cause: Certaines lignes `events` renvoyaient `event_tables = null` ou `dj_lineup = null`, non gérés dans les calculs/rendu.
- Fix applied: Normalisation défensive avec fallback `?? []` dans les agrégations KPI et les cellules table.
- Status: ✅ Resolved
---
**[2026-03-02] — Dashboard club events: redesign insuffisamment perceptible**
- File(s) affected: `src/app/(dashboard)/club/events/page.tsx`
- Error: Le rendu paraissait inchangé malgré la refonte initiale.
- Root cause: Différences visuelles trop subtiles entre ancienne et nouvelle version sur la page events.
- Fix applied: Renforcement du design (header gradient, badge “Linear v2”, toolbar dense, empty state enrichi, contours/hiérarchie plus marqués).
- Status: ✅ Resolved
---
**[2026-03-02] — Sidebar dashboard club et route events/new non abouties**
- File(s) affected: `src/app/(dashboard)/layout.tsx`, `src/app/(dashboard)/dashboard/club/events/new/page.tsx`
- Error: La sidebar paraissait visuellement inchangée et l’URL `/dashboard/club/events/new` n’était pas exposée.
- Root cause: Style navigation trop proche de la version précédente + alias manquant pour `events/new`.
- Fix applied: Refonte visuelle sidebar (Linear v2) + ajout de l’alias route `dashboard/club/events/new`.
- Status: ✅ Resolved
---
**[2026-03-01] — Refonte UI NightTable sur pages Dashboard/Public/Auth**
- File(s) affected: `src/components/floor-plan/FloorPlan.tsx`, `src/app/(dashboard)/**`, `src/app/(public)/**`, `src/app/(auth)/**`
- Error: Incohérences UI (tokens couleurs, états interactifs, a11y et headers composants) entre pages TSX.
- Root cause: Composants/pages hétérogènes issus d’itérations successives sans standard unique appliqué à tout le périmètre.
- Fix applied: Ajout des headers composants, harmonisation palette NightTable, renforcement hover/focus/disabled + min 44px, ajouts a11y ciblés, typage strict des props réutilisables.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Tracking promoteur + commissions non finalisés**
- File(s) affected: `src/app/(public)/reserve/page.tsx`, `src/lib/reservation.actions.ts`, `src/app/api/webhooks/stripe/route.ts`, `src/app/(dashboard)/dashboard/promoter/page.tsx`
- Error: Attribution promoteur et reporting commissions incomplets (cookie promo, conversion, KPI promoteur).
- Root cause: MVP promoteur limité à la guest list sans pipeline complet promo → réservation → commission.
- Fix applied: Validation promo + cookie 48h, attribution post-réservation non bloquante, création commission au webhook avec fallback non bloquant, dashboard promoteur branché en données réelles.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Règles d’optimisation tokens manquantes dans Copilot Instructions**
- File(s) affected: `.github/copilot-instructions.md`
- Error: Absence de directives explicites sur sélection de modèle, discipline de prompt et hygiène de contexte.
- Root cause: Gouvernance IA initiale focalisée sur qualité code/UI sans bloc dédié à l’optimisation de consommation tokens.
- Fix applied: Ajout de la section “Token Optimization Rules — MANDATORY” (model selection, #file usage, inline vs chat, templates de prompt).
- Status: ✅ Resolved
---

---
**[2026-03-01] — 14 diagnostics fichiers introuvables dans copilot-instructions**
- File(s) affected: `.github/copilot-instructions.md`
- Error: Diagnostics VS Code “File not found” sur les directives `#file:*`.
- Root cause: Références `#file` pointant vers des chemins/nommage invalides depuis le dossier `.github`.
- Fix applied: Correction des chemins vers des cibles existantes (`../BUSINESS_RULES.md`, `../DESIGN_SYSTEM.md`, `../ARCHITECTURE.md`, `copilot-instructions.md`).
- Status: ✅ Resolved
---

---
**[2026-03-01] — 7 diagnostics persistants sur pattern #file dans markdown**
- File(s) affected: `.github/copilot-instructions.md`
- Error: Le validateur markdown interprétait `#file:` comme chemin fichier, générant 7 faux positifs “File not found”.
- Root cause: Pattern `#file:` auto-résolu par l’éditeur malgré les ajustements de chemins.
- Fix applied: Remplacement du pattern par `# file:` dans la section d’optimisation tokens et les templates.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Nettoyage fichiers alias temporaires**
- File(s) affected: `.github/BUSINESS_RULES.md`, `.github/DESIGN_SYSTEM.md`, `.github/ARCHITECTURE.md`
- Error: Fichiers alias créés uniquement pour diagnostic intermédiaire, non nécessaires après fix final.
- Root cause: Tentative de contournement temporaire avant identification de la cause racine markdown.
- Fix applied: Suppression des fichiers alias pour garder un repo propre.
- Status: ✅ Resolved
---

---
**[2026-03-01] — `npm run dev` instable + checkout Stripe incomplet**
- File(s) affected: `package.json`, `src/app/(public)/reserve/checkout/checkoutClient.tsx`
- Error: Démarrage local cassé (lock `.next/dev/lock`) et étape paiement encore en placeholder.
- Root cause: Script `dev` sans pré-nettoyage, checkout sans intégration `PaymentElement`.
- Fix applied: Ajout d’un pré-nettoyage (`dev:clean`) avant `next dev` + intégration Stripe Elements avec `confirmPayment` côté checkout.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Risque de double traitement webhook Stripe**
- File(s) affected: `src/app/api/webhooks/stripe/route.ts`, `supabase/migrations/010_stripe_webhook_events.sql`
- Error: Sans journal d’événements, les retries Stripe pouvaient retraiter un même event.
- Root cause: Absence de mécanisme d’idempotence persistant côté webhook.
- Fix applied: Ajout de `stripe_webhook_events` + garde d’idempotence (`processing/processed/failed`) avant traitement des events.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Absence de healthcheck environnement exécutable**
- File(s) affected: `scripts/healthcheck-env.mjs`, `package.json`
- Error: Pas de vérification unique pour Supabase/Stripe/webhook secret avant tests locaux.
- Root cause: Vérifications faites manuellement, sans script standardisé.
- Fix applied: Nouveau script `npm run healthcheck:env` avec chargement `.env.local`, checks format/connectivité et code de sortie non-zéro en cas d’erreur.
- Status: ✅ Resolved
---

---
**[2026-03-01] — `STRIPE_SECRET_KEY` locale invalide (corrigée)**
- File(s) affected: `.env.local`
- Error: Healthcheck échouait sur `Invalid API Key provided` côté Stripe.
- Root cause: Clé secrète Stripe locale non valide (clé tronquée/obsolète).
- Fix applied: Synchronisation des clés Stripe test depuis la config Stripe CLI, puis revalidation `npm run healthcheck:env` en vert.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Webhook Stripe: doublons `event_id` retournaient 500**
- File(s) affected: `src/app/api/webhooks/stripe/route.ts`
- Error: Concurrence webhook sur le même event provoquait `duplicate key value` (`23505`) et réponse `500`.
- Root cause: Fenêtre de course entre `select maybeSingle` et `insert` sans gestion explicite du conflit unique.
- Fix applied: Gestion spécifique du code `23505` avec réponse idempotente `200` (`Already processing`) au lieu d’erreur serveur.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Module promoteur/client incomplet sur dashboards dédiés**
- File(s) affected: `src/lib/promoter.actions.ts`, `src/lib/reservation.actions.ts`, `src/app/(dashboard)/promoter/guestlist/page.tsx`, `src/app/(dashboard)/club/promoters/page.tsx`, `src/app/(dashboard)/client/*`
- Error: Les parcours MVP demandés (guest list promoteur, gestion promoteurs club, dashboard client/réservations/waitlist) n’étaient pas implémentés et un lint bloquait sur usage impur du temps courant en rendu.
- Root cause: Couverture fonctionnelle partielle des dashboards rôle-spécifiques et absence d’actions serveur dédiées pour annulation réservation/sortie waitlist/validation commissions.
- Fix applied: Ajout des nouvelles pages et alias `/dashboard/*`, création des server actions manquantes (guest list, création promoteur, validation commission, annulation réservation, sortie waitlist), et correction lint de pureté sur la page réservations.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Seed démo bloqué par dérive de schéma Supabase déployé**
- File(s) affected: `scripts/seed-demo-data.mjs`, `src/lib/promoter.actions.ts`
- Error: Le seed échouait successivement sur colonnes absentes (`tables.height`, `tables.shape`, `tables.x_position`, `events.notoriety`) et contrainte `ON CONFLICT` manquante.
- Root cause: Écart entre migrations locales et schéma réellement déployé + typage Supabase admin trop strict (`never`) dans `createPromoterAction`.
- Fix applied: Script seed rendu compatible schéma déployé (payload minimal + sync manuel des tables sans `ON CONFLICT`), ajout de diagnostics d’erreur explicites, correction du typage `SupabaseClient` côté actions promoteur.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Publication GitHub Release bloquée (CLI absente)**
- File(s) affected: `CHANGELOG.md`, `docs/PROJECT_STATUS.md`
- Error: Commande `gh` indisponible (`CommandNotFoundException`) empêchant la création automatique de la release GitHub depuis le terminal.
- Root cause: GitHub CLI non installée dans l’environnement local.
- Fix applied: Publication du tag Git réussie, préparation documentaire complète de release (`v0.3-mvp-complete`) et fallback vers commande manuelle/API GitHub.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Seed démo: positions floor plan impossibles sur DB distante**
- File(s) affected: `scripts/seed-demo-data.mjs`, `scripts/verify-demo-seed.mjs`, `supabase/migrations/011_floor_plan_positions.sql`
- Error: Vérification seed bloquée sur positions (`public.floor_plans` introuvable, `tables.x_position` absent).
- Root cause: Dérive du schéma Supabase distant par rapport aux migrations locales (objets floor plan non déployés).
- Fix applied: Seed rendu tolérant (fallback sans crash), vérification enrichie avec diagnostics explicites, migration de rattrapage ajoutée pour `floor_plans` + colonnes de position.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Module femmes validées incomplet sur dashboard**
- File(s) affected: `src/app/(dashboard)/vip/page.tsx`, `src/lib/vip.actions.ts`, `src/app/(dashboard)/vip/loading.tsx`, `src/app/(dashboard)/vip/error.tsx`, `src/app/(dashboard)/dashboard/vip/page.tsx`
- Error: Le rôle `female_vip` avait un écran minimal sans gestion du statut de validation, sans profil actionnable ni états loading/error.
- Root cause: Implémentation MVP partielle avec simple placeholder UI.
- Fix applied: Dashboard `female_vip` complet (statut validation, clubs validants, soirées à venir, mise à jour profil via Server Action), ajout loading/error et redirection d’alias vers la route principale.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Prompts VIP manquants (invitations/safety/validation club)**
- File(s) affected: `src/app/(dashboard)/vip/invitations/page.tsx`, `src/app/(dashboard)/vip/profile/page.tsx`, `src/app/(dashboard)/vip/safety/page.tsx`, `src/app/(dashboard)/club/vip/page.tsx`, `src/app/(dashboard)/dashboard/vip/**`, `src/app/(dashboard)/dashboard/club/vip/page.tsx`
- Error: Les pages clés du module VIP (invitations, profil dédié, sécurité, validation côté club) n’étaient pas présentes malgré les actions serveur/migrations.
- Root cause: Implémentation incomplète après phase backend; seules certaines briques techniques existaient.
- Fix applied: Création des pages manquantes + alias dashboard, formulaires connectés aux Server Actions existantes, vérification build/lint et push migration `012_female_vip_module.sql`.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Alias VIP routes redirect infini**
- File(s) affected: `src/app/(dashboard)/dashboard/vip/page.tsx`, `src/app/(dashboard)/dashboard/vip/invitations/page.tsx`, `src/app/(dashboard)/dashboard/vip/profile/page.tsx`, `src/app/(dashboard)/dashboard/vip/safety/page.tsx`, `src/app/(dashboard)/dashboard/club/vip/page.tsx`
- Error: Infinite redirect loop — alias pages used `redirect("/dashboard/vip")` which mapped back to themselves (URL `/dashboard/vip` = file `(dashboard)/dashboard/vip/page.tsx`)
- Root cause: Route group `(dashboard)` is transparent in URL, so `(dashboard)/dashboard/vip/page.tsx` serves at `/dashboard/vip` — redirecting to `/dashboard/vip` loops infinitely
- Fix applied: Replaced `redirect()` with re-export pattern `export { default } from "@/app/(dashboard)/vip/page"` (consistent with existing client alias)
- Status: ✅ Resolved
---

---
**[2026-03-01] — Pages VIP bloquées: RLS SELECT manquant + colonne absente**
- File(s) affected: `src/app/(dashboard)/vip/page.tsx`, `src/app/(dashboard)/vip/profile/page.tsx`, `src/lib/vip.actions.ts`, remote DB `female_vip_profiles`
- Error: `/dashboard/vip` affiche "Module indisponible" et `/dashboard/vip/profile` affiche "Profil indisponible" pour les utilisatrices `female_vip` connectées
- Root cause: Deux problèmes superposés: (1) la colonne `rgpd_consent_at` référencée dans les SELECT n'existait pas en DB distante (erreur Postgres 42703), (2) les policies RLS `SELECT` et `UPDATE` sur `female_vip_profiles` n'avaient jamais été appliquées — seules 2 policies INSERT existaient. `supabase db push --linked` affichait "up to date" car les migrations étaient marquées comme appliquées sans que le SQL ait été complètement exécuté.
- Fix applied: (1) Ajout de la colonne `rgpd_consent_at` via `ALTER TABLE ADD COLUMN IF NOT EXISTS` en connexion directe Postgres, (2) Création des policies `female_vip_profiles_self_select` (SELECT) et `female_vip_profiles_self_update` (UPDATE) via script `scripts/apply-missing-rls.mjs`, (3) Restauration de `rgpd_consent_at` dans les SELECT queries et le payload de mise à jour
- Status: ✅ Resolved
---

---
**[2026-03-01] — Landing page: image partenaire 404**
- File(s) affected: `src/app/page.tsx`
- Error: Une image Unsplash de la section "Clubs partenaires" retournait `404`, provoquant un rendu incomplet dans `next/image`.
- Root cause: URL source obsolète/non disponible côté provider externe.
- Fix applied: Remplacement par une URL Unsplash valide, puis validation runtime sur `/` (HTTP 200, rendu des cartes conforme).
- Status: ✅ Resolved
---

---
**[2026-03-01] — Dashboard club home: densité visuelle insuffisante**
- File(s) affected: `src/app/(dashboard)/club/page.tsx`
- Error: Header, métriques et table réservations étaient visuellement trop espacés et moins lisibles que la référence Linear.
- Root cause: Styles initiaux orientés cards larges (radius/padding élevés) et table non optimisée pour lecture opérationnelle dense.
- Fix applied: Header compact, cards métriques denses (8px/16px), table réservations 40px avec checkbox, badges inline, actions au hover et pagination sobre.
- Status: ✅ Resolved
---

---
**[2026-03-01] — Dashboard club events: lisibilité opérationnelle insuffisante**
- File(s) affected: `src/app/(dashboard)/club/events/page.tsx`
- Error: La vue événements en cartes ne permettait pas une lecture rapide des statuts/tables pour un usage dashboard quotidien.
- Root cause: Mise en page orientée présentation (cards) au lieu d’une structure dense orientée pilotage.
- Fix applied: Refonte en table compacte style Linear avec header condensé, KPIs synthétiques, colonnes statut/horaire/tables et action rapide par ligne.
- Status: ✅ Resolved
---

---
**[2026-03-02] — HeroUIProvider utilisé côté Server Component**
- File(s) affected: `src/app/layout.tsx`, `src/app/providers.tsx`
- Error: Runtime Next.js: `TypeError: createContext only works in Client Components` au chargement de l’application.
- Root cause: `HeroUIProvider` (basé sur `createContext`) était rendu directement dans `src/app/layout.tsx`, composant serveur par défaut en App Router.
- Fix applied: Création d’un wrapper client `src/app/providers.tsx` (`'use client'`) qui encapsule `HeroUIProvider`, puis remplacement dans `src/app/layout.tsx` par `<Providers>{children}</Providers>`.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Imports HeroUI dans des pages serveur (build cassé)**
- File(s) affected: `src/app/(dashboard)/club/page.tsx`, `src/app/(dashboard)/club/events/page.tsx`, `src/app/(dashboard)/club/events/EventListTable.tsx`
- Error: `next build` échouait avec `TypeError: ... createContext is not a function` pendant la collecte de configuration des routes club.
- Root cause: Composants HeroUI importés directement depuis des pages serveur App Router (`page.tsx`) au lieu d’être confinés dans des composants client.
- Fix applied: Retrait des imports HeroUI des pages serveur, conservation de HeroUI uniquement dans `EventListTable.tsx` (`'use client'`), et passage des données sérialisées depuis la page serveur.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Migration HeroUI de la page tables sans régression build**
- File(s) affected: `src/app/(dashboard)/club/tables/tablesClient.tsx`
- Error: Risque de régression UI/interaction lors du passage du modal custom vers `Modal` HeroUI et du formulaire vers `Input/Select/Switch`.
- Root cause: Changement de primitives UI pouvant casser les flux `FormData` (`isPromo`) et l’état de sélection des tables.
- Fix applied: Migration conservatrice des handlers existants, ajout d’un champ caché `isPromo` synchronisé avec `Switch`, validation des interactions et build global (`npx next build`) sans erreur.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Migration HeroUI de la page promoteurs sans régression build**
- File(s) affected: `src/app/(dashboard)/club/promoters/page.tsx`, `src/app/(dashboard)/club/promoters/PromotersTable.tsx`, `src/app/(dashboard)/club/promoters/AddPromoterModal.tsx`
- Error: Risque de rupture des flux création/affichage promoteurs lors du passage du tableau et modal custom vers HeroUI.
- Root cause: Refactor de composants interactifs (tableau de classement + formulaire modal avec slider) pouvant désaligner les payloads envoyés à `createPromoterAction`.
- Fix applied: Migration UI uniquement, conservation des noms de champs `FormData` attendus (`first_name`, `last_name`, `email`, `phone`, `commission_rate`) et validation via build global.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Migration HeroUI de la page analytics sans régression build**
- File(s) affected: `src/app/(dashboard)/club/analytics/page.tsx`, `src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx`
- Error: Risque de rupture d’affichage/formatage des KPI et statuts réservations après migration vers composants HeroUI.
- Root cause: Passage d’un rendu HTML custom à `Card/Table/Chip` avec sérialisation des données depuis une page serveur.
- Fix applied: Conservation des agrégations serveur, mapping explicite des données sérialisées, migration UI dans un composant client dédié et validation build global.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Migration HeroUI des pages client sans régression build**
- File(s) affected: `src/app/(dashboard)/client/page.tsx`, `src/app/(dashboard)/client/ClientDashboardPanels.tsx`, `src/app/(dashboard)/client/reservations/page.tsx`, `src/app/(dashboard)/client/reservations/ClientReservationsTable.tsx`, `src/app/(dashboard)/client/waitlist/page.tsx`, `src/app/(dashboard)/client/waitlist/ClientWaitlistList.tsx`
- Error: Risque de rupture des actions et états des pages client (annulation réservation, sortie waitlist) après refonte UI HeroUI.
- Root cause: Refactor du rendu en composants client avec formulaires liés à des Server Actions.
- Fix applied: Conservation des Server Actions existantes, passage explicite des données sérialisées aux composants client et validation globale via build.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Refactor strict HeroUI de la page club events**
- File(s) affected: `src/app/(dashboard)/club/events/page.tsx`, `src/app/(dashboard)/club/events/EventListTable.tsx`, `src/app/(dashboard)/club/events/loading.tsx`, `src/app/(dashboard)/club/events/CreateEventButton.tsx`, `src/app/(dashboard)/club/events/EventTableSkeleton.tsx`
- Error: Besoin d’alignement exact sur une spec UI HeroUI (structure de table, mapping badges de statut, chips DJ, style CTA, skeleton par cellule, actions icon-only).
- Root cause: Implémentation précédente partiellement alignée (modal détails, colonnes non conformes, CTA non HeroUI direct, loading non cellulaire HeroUI).
- Fix applied: Refactor ciblé sans changement de logique serveur/Supabase, ajout d’un CTA HeroUI client, refonte table/rows selon colonnes demandées, mapping `Chip` statuts exact, chips DJ multiples, actions row icon-only et loading avec `Skeleton` par cellule.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Refactor HeroUI renforcé de la page club tables**
- File(s) affected: `src/app/(dashboard)/club/tables/tablesClient.tsx`, `src/app/(dashboard)/club/tables/TablesSkeleton.tsx`, `src/app/(dashboard)/club/tables/loading.tsx`
- Error: Besoin d’alignement UI plus strict sur la table tables (lisibilité statut zone/promo, action compacte, loading explicite en cellule).
- Root cause: Version précédente HeroUI fonctionnelle mais moins homogène que la spec events (action textuelle, absence de skeleton cellulaire dédié sur route tables).
- Fix applied: Ajout de chips HeroUI pour `zone` et `promo`, bouton action `isIconOnly` en ligne, création d’un loading route avec `Skeleton` par cellule et validation build global.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Migration HeroUI des pages promoteur sans régression build**
- File(s) affected: `src/app/(dashboard)/promoter/guestlist/GuestListClient.tsx`, `src/app/(dashboard)/promoter/commissions/page.tsx`, `src/app/(dashboard)/promoter/commissions/PromoterCommissionsPanel.tsx`, `src/app/(dashboard)/promoter/promo/page.tsx`, `src/app/(dashboard)/promoter/promo/PromoterPromoPanel.tsx`
- Error: Risque de rupture des interactions promoteur (ajout invité/arrivée, lecture historique commissions, partage promo) après migration vers HeroUI.
- Root cause: Refonte des composants visuels en client components HeroUI avec passage de données sérialisées depuis pages serveur.
- Fix applied: Conservation des actions serveur et fetchs/agrégations métier, migration UI uniquement (`Select`, `Input`, `Table`, `Chip`, `Card`, `Button`) et validation build globale.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Conformité stricte HeroUI appliquée sur page tables**
- File(s) affected: `src/app/(dashboard)/club/tables/page.tsx`, `src/app/(dashboard)/club/tables/tablesClient.tsx`, `src/app/(dashboard)/club/tables/loading.tsx`, `src/app/(dashboard)/club/tables/TablesSkeleton.tsx`
- Error: Besoin d’alignement exact avec une spec détaillée (colonnes, mappage badges zone, switch promo, modal inputs/select, CTA primaire, actions icon-only, loading rows skeleton).
- Root cause: Écart entre l’implémentation précédente et la spec stricte demandée.
- Fix applied: Mise à jour complète de la table HeroUI selon le mapping demandé, modal aligné (`Input color='primary' variant='bordered'`, `Select/SelectItem` bordered), CTA `Button color='primary' radius='none'` en uppercase, actions row `variant='light' isIconOnly`, loading route à base de `Skeleton` par rows.
- Status: ✅ Resolved
---

---
**[2026-03-02] — Conformité stricte HeroUI appliquée sur page analytics**
- File(s) affected: `src/app/(dashboard)/club/analytics/page.tsx`, `src/app/(dashboard)/club/analytics/AnalyticsPanels.tsx`, `src/app/(dashboard)/club/analytics/loading.tsx`
- Error: Spécification analytics complexe non couverte (tabs période, 6 métriques métier, table top promoteurs, table événements passés, empty + skeleton).
- Root cause: Implémentation analytics précédente partielle (KPI/table simplifiés sans pilotage période ni structure complète demandée).
- Fix applied: Refonte complète avec `Tabs color='primary' variant='underlined'`, fetch Supabase filtré par période+club, 6 cards KPI avec variations `Chip`, table top promoteurs et table événements passés avec chips conditionnels, loading `Skeleton` et empty state.
- Status: ✅ Resolved
---
