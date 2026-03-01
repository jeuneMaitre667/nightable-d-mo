# Error Log

| Date | ID | Zone | Severity | Status | Résumé | Incident |
|---|---|---|---|---|---|---|
| 2026-03-01 | ERR-2026-001 | Auth / Next.js runtime | High | resolved | Conflit `src/middleware.ts` + `src/proxy.ts` sur Next 16 | [2026-03-01-next-middleware-proxy-conflict](incidents/2026-03-01-next-middleware-proxy-conflict.md) |
| 2026-03-01 | ERR-2026-002 | Supabase Auth | Medium | monitoring | `signUp` bloqué par `429 over_email_send_rate_limit` | [2026-03-01-supabase-signup-rate-limit](incidents/2026-03-01-supabase-signup-rate-limit.md) |
| 2026-03-01 | ERR-2026-003 | Auth profile bootstrap | High | resolved | Inscriptions OK sur `profiles`, mais blocage RLS sur `client_profiles` / `club_profiles` | [2026-03-01-auth-signup-rls](incidents/2026-03-01-auth-signup-rls.md) |
| 2026-03-01 | ERR-2026-004 | Public booking / DB schema | High | resolved | Décalage schéma `events`: colonne `notoriety` absente en prod distante | [2026-03-01-events-schema-drift-notoriety](incidents/2026-03-01-events-schema-drift-notoriety.md) |
| 2026-03-01 | ERR-2026-005 | Stripe local / Paiement | High | mitigated | `STRIPE_SECRET_KEY` locale invalide (`401 Invalid API Key`) pendant tests E2E | [2026-03-01-stripe-invalid-secret-key-local](incidents/2026-03-01-stripe-invalid-secret-key-local.md) |
| 2026-03-01 | ERR-2026-006 | Documentation process | Low | resolved | Rappel “session close” ajouté au template incident pour éviter les oublis de synchro docs | [incident-template](templates/incident-template.md) |
| 2026-03-01 | ERR-2026-007 | Dashboard/Public UI / Build TS | Medium | resolved | Build cassé sur `Cannot find namespace 'JSX'` (plusieurs composants/pages) | [2026-03-01-dashboard-events-jsx-namespace-build](incidents/2026-03-01-dashboard-events-jsx-namespace-build.md) |
| 2026-03-01 | ERR-2026-008 | Auth UI / Next.js build-lint | Medium | resolved | `useSearchParams` cassait le prerender `/register` et `setState` dans `useEffect` cassait le lint `/login` | [2026-03-01-dashboard-events-jsx-namespace-build](incidents/2026-03-01-dashboard-events-jsx-namespace-build.md) |
