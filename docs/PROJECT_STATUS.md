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

- Date: 2026-03-01
- Auteur: GitHub Copilot

## Vue synthèse

- Progression MVP (estimation): 62%
- Axe prioritaire actuel: valider clé Stripe locale puis exécuter runbook E2E complet

## Fait

- Refonte UI cohérente (Dashboard/Public/Auth + FloorPlan): headers composants, palette NightTable, états interactifs et a11y harmonisés sur le périmètre TSX prioritaire.
- Ajout des règles “Token Optimization Rules — MANDATORY” dans `.github/copilot-instructions.md` (sélection modèle, discipline prompt, #file, hygiène de contexte, templates).
- Intégration Stripe Elements finalisée dans le checkout public (`PaymentElement` + `confirmPayment`) avec retour d’état paiement côté client.
- Stabilisation du run local: script `npm run dev` fiabilisé avec pré-nettoyage lock/ports (`dev:clean`).
- Idempotence webhook Stripe implémentée via journal d’événements persisté (`stripe_webhook_events`).
- Script de diagnostic environnement ajouté: `npm run healthcheck:env`.

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

- Formalisation du runbook E2E local (ordre des commandes et critères de succès).

## À faire (priorité)

### P0 — Critique MVP

- Exécuter un runbook E2E local complet (checkout Stripe Elements + webhook + statut réservation).

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
