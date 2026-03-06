# NightTable — Règle d’organisation physique des dossiers dashboard

Pour chaque dashboard (club, client, promoter, vip), l’arborescence physique des dossiers/pages doit TOUJOURS respecter l’ordre d’affichage de la navigation (sidebar ou mobile tab bar) :

1. Tableau de bord (page.tsx ou équivalent)
2. Réservations (reservations/)
3. Clients (clients/ ou waitlist/ pour client)
4. Analytics / Rapports (analytics/ ou reports/)
5. Tables (tables/)
6. Promoteurs (promoters/ ou guestlist/ ou promo/)
7. Événements (events/)
8. Paramètres (settings/ ou profile/ ou safety/)

- Les dossiers/fichiers doivent être préfixés numériquement si besoin pour forcer l’ordre (ex : 01-dashboard, 02-reservations, 03-clients, ... 99-settings).
- Cette règle s’applique à tous les dashboards (club, client, promoter, vip) pour garantir la cohérence navigation/code.
- Toute nouvelle page ou refactor doit respecter cet ordre physique.
- Ajouter cette règle dans .github/copilot-instructions.md et la rappeler dans chaque PR ou commit touchant l’arborescence dashboard.

Exemple pour club :
01-dashboard/
02-reservations/
03-clients/
04-analytics/
05-tables/
06-promoters/
07-events/
99-settings/

> Cette règle est MANDATORY pour NightTable.
