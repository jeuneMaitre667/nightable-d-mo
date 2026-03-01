# ERR-2026-005 — Clé Stripe secrète locale invalide

## Metadata

- Date: 2026-03-01
- Zone: Stripe local / Intégration paiement
- Severity: high
- Status: mitigated
- Reporter: session QA/E2E

## Symptômes

- Échec des appels Stripe SDK (`paymentIntents.create`) en local.
- Erreur `StripeAuthenticationError: Invalid API Key provided`.

## Impact

- Impossible de valider le flux E2E via création directe de PaymentIntent depuis script.
- Risque de faux positifs/negatifs sur la couche paiement locale.

## Cause racine

- Valeur `STRIPE_SECRET_KEY` invalide dans `.env.local` (clé expirée, tronquée ou d’un autre compte).

## Diagnostic (preuves)

- Retour Stripe HTTP `401` avec message explicite `Invalid API Key provided`.
- Échec reproductible sur script E2E utilisant `stripe.paymentIntents.create`.

## Correctif appliqué

- Mitigation test: bascule sur `stripe trigger` CLI + metadata `reservation_id` pour tester le webhook sans dépendre de la clé SDK locale.
- Renforcement webhook: fallback de lookup réservation via `payment_intent.metadata.reservation_id`.

## Validation

- [x] Test local
- [x] Vérification base de données
- [x] Vérification régression

## Prévention

- Rotation/validation de `STRIPE_SECRET_KEY` au début de chaque session paiement.
- Ajouter un script `healthcheck` qui vérifie Stripe Auth + Supabase avant les tests E2E.

## Références

- Fichier impacté:
  - `src/app/api/webhooks/stripe/route.ts`
