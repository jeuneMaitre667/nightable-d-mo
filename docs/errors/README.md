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

## Session close (obligatoire)

En fin de session, exécuter cette checklist dans l’ordre:

1. **Incidents**
	- Créer/mettre à jour les fiches dans `docs/errors/incidents/`.
	- Vérifier que chaque incident a un ID (`ERR-YYYY-XXX`) et un statut final.

2. **Registre d’erreurs**
	- Ajouter/mettre à jour les lignes correspondantes dans `docs/errors/ERROR_LOG.md`.
	- Vérifier que chaque ligne pointe vers un fichier incident valide.

3. **Avancement projet**
	- Mettre à jour `docs/PROJECT_STATUS.md`:
	  - `Dernière mise à jour`,
	  - progression/synthèse,
	  - entrée dans `Journal de sessions`.

4. **Historique versionné**
	- Synchroniser `CHANGELOG.md` avec les livrables de la session:
	  - `Added`, `Changed`, `Fixed`.

5. **Validation finale**
	- Confirmer explicitement en fin de message:
	  - “Error KB + PROJECT_STATUS + CHANGELOG mis à jour.”

> Règle: une session n’est pas considérée terminée tant que cette checklist n’est pas complétée.

## Convention de nommage des incidents

`YYYY-MM-DD-short-slug.md`

Exemple : `2026-03-01-auth-signup-rls.md`
