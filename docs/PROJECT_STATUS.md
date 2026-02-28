# NightTable — Suivi d’avancement (vivant)

Ce document sert à suivre, au fil de l’eau, ce qui a été fait, ce qui est en cours, et ce qui reste à faire.

## Mode d’utilisation

- À chaque session de travail, ajouter une entrée dans la section "Journal de sessions".
- Déplacer les items entre "Fait", "En cours" et "À faire".
- Garder les tâches formulées de manière actionnable (verbe + livrable).
- Mettre à jour les dates et le statut avant chaque commit majeur.

## Processus de mise à jour continue

- Ce document est mis à jour à chaque tâche réalisée sur le projet.
- Le minimum attendu par session:
  - 1 ligne dans "Journal de sessions".
  - Mise à jour de "En cours" et/ou "À faire" si le périmètre change.
  - Déplacement en "Fait" des éléments terminés.
- En fin de session, synchroniser avec `CHANGELOG.md` si des docs/process changent.

## Dernière mise à jour

- Date: 2026-02-28
- Auteur: GitHub Copilot

## Vue synthèse

- Progression MVP (estimation): 35%
- Axe prioritaire actuel: finaliser le flux Réservation + Paiement Stripe

## Fait

### Documentation

- Documentation complète du projet dans `README.md`.
- Architecture technique dans `docs/ARCHITECTURE.md`.
- Roadmap produit/technique dans `docs/ROADMAP.md`.
- Index docs dans `docs/README.md`.
- Changelog initialisé dans `CHANGELOG.md`.
- Documents sources business/dev sauvegardés dans `docs/`.

### Base applicative

- Auth multi-rôles en place (`client`, `club`, `promoter`, `female_vip`, `admin`).
- Redirections dashboard par rôle implémentées.
- Protection d’accès dashboard via `src/proxy.ts`.
- Actions club de base (création événement/table) implémentées.
- Action promoteur de base (guest list) implémentée.
- Endpoint bot IA opérationnel.
- Endpoint webhook Stripe présent (base de traitement).

## En cours

- Structuration du pilotage produit via ce document vivant.
- Clarification du périmètre MVP prioritaire (réservation/paiement/webhook).

## À faire (priorité)

### P0 — Critique MVP

- Implémenter `POST /api/reservations` (validation + création réservation).
- Ajouter migration `003_reservations.sql` (tables réservations + waitlist minimal).
- Ajouter policies RLS associées aux réservations.
- Finaliser le webhook Stripe:
  - `payment_intent.succeeded` → confirmation réservation.
  - `payment_intent.payment_failed` → annulation réservation.
- Ajouter idempotence et logs sur le webhook.

### P1 — Important après P0

- Lier les réservations aux promoteurs via `promo_code`.
- Démarrer le calcul et suivi des commissions promoteurs.
- Ajouter notifications transactionnelles (email + SMS).
- Renforcer la validation serveur (inputs/API) sur endpoints critiques.

### P2 — Itérations suivantes

- Pricing dynamique côté backend + affichage côté UI.
- Enrichissement du bot IA avec contexte réel clubs/events.
- Fonction waitlist automatisée.
- Revente sécurisée.

## Risques ouverts

- Risque cohérence paiement/réservation sans idempotence webhook.
- Risque sécurité si validations API incomplètes.
- Risque dérive de scope si P1/P2 démarrés avant clôture P0.

## Journal de sessions

### 2026-02-28

- Sauvegarde des docs sources (.docx + .txt) dans le repo.
- Création docs `ARCHITECTURE.md`, `ROADMAP.md`, `CHANGELOG.md`, index docs.
- Ajout liens GitHub/release/tags dans le README.
- Création de ce fichier de suivi vivant.

### 2026-02-28 (suivi continu activé)

- Activation du processus de mise à jour continue de `PROJECT_STATUS.md` à chaque session.
- Ajout de la règle dans `README.md` et traçage dans `CHANGELOG.md`.

### 2026-02-28 (aperçu final produit)

- Mise à jour de `src/app/demo/page.tsx` avec un aperçu final plus complet du produit.
- Ajout des modules clés (Client, Club, Promoteur, VIP, Paiements, IA) dans la démo.
- Préparation d’une visualisation inspirée de l’UX event discovery de Shotgun (sans copie).

### 2026-02-28 (itération visuelle avancée)

- Renforcement du style visuel de la démo: gradients colorés, ambiance plus immersive.
- Ajout de cartes visuelles avec images pour les sections collections et événements.
- Alignement UX sur une logique marketplace événementielle premium (inspiration Shotgun, identité NightTable).

### 2026-02-28 (home + club publique refondues)

- Refonte visuelle de la home `src/app/page.tsx` en version plus production-ready.
- Création de la page club publique dynamique `src/app/(public)/clubs/[slug]/page.tsx`.
- Ajout d’un rendu riche en images/couleurs pour mieux projeter le produit final.

### 2026-02-28 (cartographie finale des pages)

- Création de `src/app/final-pages/page.tsx` avec la vision complète des pages finales.
- Statut `live/planned` ajouté par section (Public, Auth, Client, Club, Promoteur, VIP, Admin).
- Lien ajouté depuis la home pour accéder au plan global produit.

### 2026-02-28 (roadmap interactive)

- Création de `src/app/build-plan/page.tsx` avec ordre de build page par page.
- Ajout des priorités (P0/P1/P2), estimations et dépendances par étape.
- Intégration de l’accès à cette roadmap depuis `final-pages`.

### 2026-02-28 (kanban + filtres rôles)

- Transformation de `build-plan` en vue Kanban (Now / Next / Later).
- Ajout de filtres par rôle: Public, Auth, Client, Club, Promoteur, VIP, Admin, Transverse.
- Visualisation dynamique des items selon filtre actif.

## Template d’entrée de session

Copier-coller ce bloc pour chaque nouvelle session:

```markdown
### YYYY-MM-DD
- Objectif session:
- Fait:
- Blocages:
- Décisions:
- Prochaine étape:
```
