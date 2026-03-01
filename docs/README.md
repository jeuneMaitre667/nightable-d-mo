# NightTable Docs Index

Index central de la documentation projet.

## 1) Pilotage produit & technique

- `ARCHITECTURE.md` — architecture applicative, modules, flux de données.
- `ROADMAP.md` — plan de livraison et priorités produit.
- `PROJECT_STATUS.md` — avancement vivant (fait / en cours / à faire).
- `../CHANGELOG.md` — historique versionné des changements.

## 2) Gestion des incidents

- `errors/README.md` — process de gestion des erreurs.
- `errors/ERROR_LOG.md` — registre chronologique synthétique.
- `errors/incidents/` — fiches détaillées par incident.
- `errors/templates/incident-template.md` — template officiel.

## 3) Sources métier (référence)

- `NightTable_BusinessPlan_V3.docx`
- `NightTable_BusinessPlan_V3.txt`
- `NightTable_DevGuide.docx`
- `NightTable_DevGuide.txt`

## 4) Conventions de rangement

- Les fichiers `.md` sont la documentation opérationnelle maintenue en continu.
- Les `.docx` restent les sources d'origine métier.
- Les `.txt` servent d’extraction pour recherche/IA.
- Toute session qui modifie du code doit synchroniser:
	- `docs/errors/ERROR_LOG.md`
	- `docs/PROJECT_STATUS.md`
	- `CHANGELOG.md`
