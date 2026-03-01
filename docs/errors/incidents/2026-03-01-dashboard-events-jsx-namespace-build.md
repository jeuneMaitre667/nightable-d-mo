# ERR-2026-007 — Build TypeScript `Cannot find namespace 'JSX'`

## Metadata

- Date: 2026-03-01
- Zone: Dashboard Club / Build TypeScript
- Severity: medium
- Status: resolved
- Reporter: QA build session

## Symptômes

- `npm run build` échoue sur la page d’erreur événements club.
- Message: `Type error: Cannot find namespace 'JSX'`.

## Impact

- Build de production bloqué.
- Risque de non-déploiement tant que non corrigé.

## Cause racine

- Signature de composant avec type de retour `JSX.Element` non résolu dans ce contexte de compilation.

## Diagnostic (preuves)

- Erreur build sur `src/app/(dashboard)/club/events/error.tsx`.
- Lint OK mais TypeScript du build échoue.

## Correctif appliqué

- Import explicite `ReactElement` depuis `react`.
- Type de retour remplacé par `ReactElement`.

## Validation

- [x] Test local
- [x] Vérification base de données
- [x] Vérification régression

## Prévention

- Standardiser les retours composants sur `ReactElement` dans les zones sensibles build.
- Vérifier `npm run build` après chaque lot de changements UI/route.

## Références

- Fichiers impactés:
  - `src/app/(dashboard)/club/events/error.tsx`
  - `src/app/(dashboard)/club/events/loading.tsx`
  - `src/app/(dashboard)/club/events/new/page.tsx`
  - `src/app/(dashboard)/club/events/page.tsx`
  - `src/app/(dashboard)/club/page.tsx`
  - `src/app/(dashboard)/club/refreshButton.tsx`
  - `src/app/(dashboard)/club/tables/page.tsx`
  - `src/app/(dashboard)/club/tables/tablesClient.tsx`
  - `src/app/(public)/clubs/[slug]/events/[eventId]/eventBookingClient.tsx`
  - `src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx`
  - `src/app/(public)/reserve/checkout/checkoutClient.tsx`
  - `src/app/(public)/reserve/checkout/page.tsx`

## Session close (obligatoire)

- [x] Incident ajouté/mis à jour dans `docs/errors/incidents/`
- [x] Entrée synchronisée dans `docs/errors/ERROR_LOG.md`
- [x] Avancement synchronisé dans `docs/PROJECT_STATUS.md`
- [x] Historique synchronisé dans `CHANGELOG.md`
