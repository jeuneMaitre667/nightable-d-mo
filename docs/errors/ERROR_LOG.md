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
