# ERR-2026-004 — Schema drift `events.notoriety` absent

## Metadata

- Date: 2026-03-01
- Zone: Public booking / Supabase schema
- Severity: high
- Status: resolved
- Reporter: session QA/E2E

## Symptômes

- La page publique événement échoue sur la requête `events`.
- Les scripts E2E échouent à l’insert d’événement avec `Could not find the 'notoriety' column`.

## Impact

- Blocage du parcours réservation public sur certains environnements.
- Échec des tests d’intégration webhook dépendants de fixtures événement.

## Cause racine

- Incohérence entre le code applicatif (qui lisait `events.notoriety`) et le schéma réellement déployé (sans cette colonne).

## Diagnostic (preuves)

- Logs SQL/SDK: `column events.notoriety does not exist`.
- Probing direct des colonnes `events` via Supabase service role.
- Reproduction locale en exécutant le script E2E de seed.

## Correctif appliqué

- Retrait de la sélection `notoriety` dans la page publique événement.
- Fallback métier `eventNotoriety = 1` côté rendu public.
- Alignement du script de seed E2E pour ne plus insérer `notoriety`.

## Validation

- [x] Test local
- [x] Vérification base de données
- [x] Vérification régression

## Prévention

- Vérifier systématiquement le schéma distant avant d’introduire une nouvelle colonne dans les requêtes critiques.
- Ajouter un check de compatibilité schéma pour les scripts E2E.

## Références

- Fichiers impactés:
  - `src/app/(public)/clubs/[slug]/events/[eventId]/page.tsx`
  - `scripts/e2e-webhook-test.mjs`
