# NightTable

Plateforme SaaS de réservation de tables VIP pour les clubs parisiens.

NightTable connecte 5 rôles dans un même écosystème : **client**, **club**, **promoter**, **female_vip** et **admin**.

## Documentation projet (sauvegardée)

Les documents complets sont stockés dans le repo :

- `CHANGELOG.md`
- `docs/NightTable_BusinessPlan_V3.docx`
- `docs/NightTable_DevGuide.docx`
- `docs/NightTable_BusinessPlan_V3.txt` (extraction texte)
- `docs/NightTable_DevGuide.txt` (extraction texte)
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`

## Stack actuelle

- **Frontend / App** : Next.js 16 (App Router), React 19, TypeScript
- **Styling** : Tailwind CSS 4
- **Auth / BDD** : Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Paiement** : Stripe
- **IA** : OpenAI
- **Notifications** : Twilio (SMS), Resend (email)
- **UI plan de salle** : Konva / react-konva

## Démarrage rapide

### 1) Installer les dépendances

```bash
npm install
```

### 2) Configurer l'environnement

Copier `.env.example` vers `.env.local` puis renseigner les clés.

Variables attendues :

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

OPENAI_API_KEY=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

### 3) Lancer l'app

```bash
npm run dev
```

Application : `http://localhost:3000`

## Scripts

- `npm run dev` : serveur de développement
- `npm run build` : build production
- `npm run start` : exécution en mode production
- `npm run lint` : lint ESLint

## Structure du projet

```text
src/
	app/
		(auth)/
			login/page.tsx
			register/page.tsx
			verify/page.tsx
		(dashboard)/
			dashboard/
				layout.tsx
				page.tsx
				admin/page.tsx
				client/page.tsx
				club/page.tsx
				promoter/page.tsx
				vip/page.tsx
		(public)/
			clubs/[slug]/
			reserve/page.tsx
		api/
			auth/callback/route.ts
			bot/route.ts
			reservations/route.ts
			webhooks/stripe/route.ts
		demo/page.tsx
		layout.tsx
		page.tsx
	components/
	lib/
		auth.actions.ts
		auth.ts
		club.actions.ts
		openai.ts
		promoter.actions.ts
		resend.ts
		stripe.ts
		twilio.ts
		supabase/
			client.ts
			server.ts
	proxy.ts
	types/index.ts

supabase/
	migrations/
		001_auth_schema.sql
		002_clubs_events.sql
		004_promoters_guestlist.sql
```

## Auth & rôles

- Rôles supportés : `client`, `club`, `promoter`, `female_vip`, `admin`
- Mapping des dashboards :
	- `client` -> `/dashboard/client`
	- `club` -> `/dashboard/club`
	- `promoter` -> `/dashboard/promoter`
	- `female_vip` -> `/dashboard/vip`
	- `admin` -> `/dashboard/admin`
- Contrôle d'accès centralisé dans `src/proxy.ts`

## API (état actuel)

- `GET /api/auth/callback` : callback Supabase OAuth/email verification + redirection rôle
- `POST /api/bot` : endpoint assistant IA NightTable (OpenAI `gpt-4o`)
- `POST /api/reservations` : endpoint initial (placeholder)
- `POST /api/webhooks/stripe` : vérification signature + switch d'événements Stripe (base prête)

## Base de données (Supabase)

Migrations actuellement présentes :

1. `001_auth_schema.sql` : profils, rôles, trigger `handle_new_user`, policies de base
2. `002_clubs_events.sql` : événements et tables
3. `004_promoters_guestlist.sql` : clics promoteur + guest list

> Note : les migrations `003`/`005` décrites dans le guide produit ne sont pas encore présentes dans ce repo.

## Fonctionnalités implémentées (MVP en cours)

- Auth inscription/connexion/déconnexion avec redirection par rôle
- Création de profil par rôle à l'inscription
- Pages dashboard par rôle (squelette)
- Actions club : création d'événement, création de table
- Action promoteur : ajout d'invité en guest list
- Endpoint bot IA opérationnel
- Intégration Stripe webhook (structure prête)

## Priorités recommandées (prochaine itération)

1. Finaliser le flux réservation (`/api/reservations` + Server Actions)
2. Compléter le webhook Stripe (mise à jour DB + notifications)
3. Ajouter migrations réservation/paiement (équivalent `003`) et policies RLS associées
4. Mettre en place observabilité minimale (logs métier + gestion d'erreurs API)
5. Ajouter tests sur actions critiques (auth, rôle, réservations)

## Sécurité

- Ne jamais exposer les secrets (`STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) côté client
- Vérifier systématiquement le rôle côté serveur pour toutes les actions sensibles
- Maintenir RLS activé sur les tables métier Supabase

## Déploiement

- Cible recommandée : Vercel
- Variables d'environnement à répliquer dans l'environnement cible
- Configurer le webhook Stripe vers : `/api/webhooks/stripe`

---

Pour la vision produit complète (business model, roadmap, GTM), se référer à `docs/NightTable_BusinessPlan_V3.docx`.
Pour le guide d'implémentation détaillé (architecture, flows, SQL), se référer à `docs/NightTable_DevGuide.docx`.
