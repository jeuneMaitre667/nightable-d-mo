# Changelog — Archive détaillée v0.3

Cette archive conserve le détail étendu de la release `v0.3-mvp-complete` après compaction de `CHANGELOG.md`.

## Référence release

- Version: `v0.3-mvp-complete`
- Date: `2026-03-01`
- Commit: `8a04f9d`
- Tag: `v0.3-mvp-complete`

## Périmètre détaillé (synthèse structurée)

### Produit et parcours

- Module promoteur livré (guest list, commissions, lien promo).
- Module club promoteurs livré (création, validation, top performance).
- Dashboard client livré (home, réservations, waitlist).
- Parcours public réservation + checkout consolidé.

### Plateforme et données

- Seeds démo industrialisés et compatibles schéma distant.
- Migrations SQL clés appliquées (checkout, commissions, webhook idempotent, floor plan, module VIP).
- Corrections RLS/profils et robustesse de lecture publique.

### UI et architecture

- Harmonisation visuelle large dashboard/public/auth.
- Industrialisation composants HeroUI/Tailwind et responsive.
- Alias routes dashboard stabilisés.

### Qualité et stabilité

- Corrections TypeScript/JSX et compatibilité App Router server/client.
- Stabilisation scripts de dev/reset/healthcheck.
- Validations release exécutées (`seed:demo`, `lint`, `build`).

## Source de vérité historique

- Le détail ligne-à-ligne initial de cette release reste consultable via l’historique Git de `CHANGELOG.md` (commits précédant la compaction du 2026-03-04).
