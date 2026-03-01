# Error Knowledge Base

Ce dossier centralise les erreurs rencontrées sur le projet NightTable, leurs causes racines, les actions correctives, et les vérifications associées.

## Objectif

- Garder une mémoire technique durable des incidents.
- Éviter de re-diagnostiquer les mêmes problèmes.
- Standardiser la façon de documenter et résoudre les bugs.

## Structure

- `ERROR_LOG.md` : registre chronologique synthétique.
- `incidents/` : fiche détaillée par incident.
- `templates/incident-template.md` : modèle à réutiliser.

## Règles de mise à jour

1. Dès qu’une erreur apparaît, créer une fiche dans `incidents/`.
2. Ajouter une ligne de synthèse dans `ERROR_LOG.md`.
3. Marquer l’état (`open`, `mitigated`, `resolved`, `monitoring`).
4. Joindre le lien vers commit/migration quand disponible.

## Convention de nommage des incidents

`YYYY-MM-DD-short-slug.md`

Exemple : `2026-03-01-auth-signup-rls.md`
