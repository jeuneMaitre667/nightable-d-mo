# NightTable — Roadmap Produit & Technique

## 1. Objectif

Livrer un MVP exploitable en club, puis itérer vers une V1 monétisable à l’échelle parisienne.

## 2. Principe de pilotage

- Priorité au flux de revenu principal: réservation + paiement
- Sécurité et contrôle d’accès avant nouvelles features
- Itération courte avec validation terrain (clubs/promoteurs)

## 3. Roadmap proposée (alignée repo actuel)

## Phase A — Compléter le noyau MVP (immédiat)

### A1. Réservation end-to-end

- Implémenter `POST /api/reservations` (validation, création réservation)
- Lier la réservation à `client`, `event`, `table`
- Ajouter états métier de base (`pending`, `confirmed`, `cancelled`)

### A2. Paiement Stripe opérationnel

- Créer Payment Intent sur réservation
- Finaliser webhook Stripe:
  - `payment_intent.succeeded` → confirmation
  - `payment_intent.payment_failed` → annulation
- Tracer les erreurs et idempotence webhook

### A3. Schéma DB manquant

- Ajouter migration `003_reservations.sql` (reservations + waitlist minimal)
- Ajouter policies RLS associées (client/club/admin)

### A4. Qualité minimale

- Tests ciblés sur auth/rôles/réservation
- Logging serveur simple sur endpoints critiques

## Phase B — Modules business prioritaires

### B1. Module promoteur V2

- Attacher réservation via code promo
- Commencer calcul commissions
- Dashboard promoteur enrichi (conversion / CA)

### B2. Notifications transactionnelles

- Email confirmation (Resend)
- SMS confirmation/rappel (Twilio)

### B3. Dashboard club orienté exploitation

- Vues réservations du soir
- Statuts opérationnels (check-in/no-show)

## Phase C — Différenciation produit

### C1. Pricing dynamique

- Fonction de pricing selon remplissage + délai + notoriété
- Affichage prix dynamique côté UI

### C2. Bot IA enrichi

- Contextualisation par clubs/events réels
- Réponses guidant vers action de réservation

### C3. Features avancées

- Waitlist automatisée
- Revente sécurisée
- Packages événements (anniversaire/EVJF)

## 4. Jalons de livraison

- Jalon 1: Réservation + Stripe live en test
- Jalon 2: Flux promoteur traçable (click → resa)
- Jalon 3: Notifications automatiques + dashboard club soir
- Jalon 4: Pricing dynamique + waitlist

## 5. Définition de “Done” pour MVP commercial

- Un club publie un événement et ses tables
- Un client réserve et paie sans intervention manuelle
- Le statut réservation est synchronisé par webhook Stripe
- Le club visualise la réservation en dashboard
- Le contrôle d’accès rôle est validé bout-en-bout

## 6. Backlog non bloquant (post-MVP)

- Rapport automatique du matin
- Enchères tables demandées
- Module femmes validées avancé
- API publique clubs (white-label)

## 7. Risques et mitigations

- Risque: dette sécurité API
  - Mitigation: centraliser validation input + auth server-side
- Risque: webhook non fiable
  - Mitigation: idempotence + retries + journalisation
- Risque: scope trop large
  - Mitigation: geler le périmètre MVP sur Phase A
