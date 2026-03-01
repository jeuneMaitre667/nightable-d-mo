# ERR-2026-001 — Next.js middleware/proxy conflict

## Metadata

- Date: 2026-03-01
- Zone: Runtime / Routing
- Severity: high
- Status: resolved
- Reporter: local QA session

## Symptômes

- `next dev` échoue au démarrage.
- Message: coexistence interdite de `src/middleware.ts` et `src/proxy.ts`.

## Impact

- Application non démarrable localement.
- Aucun test auth possible.

## Cause racine

- Projet en Next.js 16 : convention `proxy.ts` remplace `middleware.ts`.
- Les deux fichiers étaient présents simultanément.

## Diagnostic (preuves)

- Erreur runtime: "Both middleware file and proxy file are detected".

## Correctif appliqué

- Suppression de `src/middleware.ts`.
- Conservation de `src/proxy.ts` comme point unique de garde d’accès.

## Validation

- [x] `next dev` démarre.
- [x] `/login` répond 200.
- [x] Redirections dashboard fonctionnelles.

## Prévention

- Utiliser uniquement `src/proxy.ts` pour les gardes route-level.
- Interdire la recréation de `src/middleware.ts` dans les revues.

## Références

- Commit: `3915926`
