# ERR-2026-003 — RLS bloque la création `client_profiles` / `club_profiles`

## Metadata

- Date: 2026-03-01
- Zone: Auth / RLS / Server Actions
- Severity: high
- Status: resolved
- Reporter: local QA session

## Symptômes

- `profiles` est créée via trigger.
- `client_profiles` et `club_profiles` manquent après inscription.
- UI: "Impossible de créer le profil utilisateur" puis erreurs spécifiques profil.

## Impact

- Inscription partiellement cassée.
- Redirection dashboard client/club impossible dans certains cas.

## Cause racine

- RLS refusait certains upserts secondaires (`42501` policy violation).
- Flux d’inscription trop strict: échec d’enrichissement bloquait tout le register.

## Diagnostic (preuves)

- Logs serveur capturés:
  - `new row violates row-level security policy (USING expression)`
  - tables concernées: `client_profiles`, `club_profiles`

## Correctif appliqué

- Ajout migration `006_auth_profile_policies_fix.sql`:
  - policies INSERT manquantes sur tables de profils.
  - refresh du trigger `handle_new_user`.
  - backfill des profils secondaires manquants.
- Renforcement `src/lib/auth.actions.ts`:
  - récupération de session explicite,
  - vérification bootstrap `profiles`,
  - logs serveur détaillés,
  - enrichissement profil non bloquant pour ne pas casser l’inscription valide.

## Validation

- [x] Inscription client → `/dashboard/client`.
- [x] Inscription club → `/dashboard/club`.
- [x] Accès anonyme dashboard → `/login`.
- [x] Blocage accès croisé client→club.
- [x] Lignes présentes dans `profiles`, `client_profiles`, `club_profiles`.

## Prévention

- Conserver le template RLS INSERT pour toutes tables `*_profiles`.
- Toujours logger l’erreur Supabase brute côté serveur action.

## Références

- Migration: `supabase/migrations/006_auth_profile_policies_fix.sql`
- Commit: `d2186fd`
