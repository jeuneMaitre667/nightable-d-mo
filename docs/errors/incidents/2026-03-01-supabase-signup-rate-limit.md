# ERR-2026-002 — Supabase sign-up rate limit

## Metadata

- Date: 2026-03-01
- Zone: Supabase Auth
- Severity: medium
- Status: monitoring
- Reporter: local QA session

## Symptômes

- Les inscriptions échouent par intermittence.
- UI: "Inscription impossible pour le moment.".

## Impact

- Impossible de valider certaines étapes d’onboarding.
- Fausse impression de bug applicatif local.

## Cause racine

- Limite d’envoi email Supabase atteinte.
- Erreur brute observée: `429 over_email_send_rate_limit`.

## Diagnostic (preuves)

- Appel direct `supabase.auth.signUp()` retourne:
  - status: 429
  - code: `over_email_send_rate_limit`

## Correctif appliqué

- Aucun correctif code obligatoire.
- Mitigation: ajuster paramètres Auth/rate limits dans Supabase (environnement dev).

## Validation

- [x] Erreur reproductible identifiée.
- [ ] Monitoring après ajustement quotas.

## Prévention

- Définir des quotas dev adaptés.
- Ajouter un message d’erreur explicite côté serveur si status 429.

## Références

- Observation console: session de diagnostic du 2026-03-01
