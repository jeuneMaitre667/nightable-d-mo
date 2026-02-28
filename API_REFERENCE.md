# NightTable — API Reference

## Internal Server Actions (not REST — called directly from components)

### auth.actions.ts
- loginAction(email, password) → redirect by role
- registerClientAction(data: RegisterClientForm) → creates profile + client_profile
- registerClubAction(data: RegisterClubForm) → creates profile + club_profile
- registerPromoterAction(data, clubId) → creates profile + promoter_profile (club only)
- registerFemaleVipAction(data) → creates profile + female_vip_profile
- logoutAction() → signOut + redirect /login

### reservation.actions.ts
- createReservationAction(eventId, tableId, options) → creates reservation + Stripe Payment Intent
- cancelReservationAction(reservationId) → cancel + refund if eligible
- checkInAction(reservationId) → update status to checked_in
- listTableForResaleAction(reservationId, price) → create resale entry
- joinWaitlistAction(eventId, tableId?) → add to waitlist

### club.actions.ts
- createEventAction(data) → create event
- updateEventTablePriceAction(eventTableId) → recalculate dynamic price
- validateFemaleVipAction(vipId, status) → update validation_status
- createPromoterAction(data) → create promoter account + generate promo_code
- validateCommissionAction(commissionId) → mark commission as validated

## Public API (for clubs with Premium tier and api_key)
Base URL: /api/v1
Authentication: Header X-NightTable-Key: {api_key}

GET    /api/v1/events              → List club's published events
GET    /api/v1/events/:id          → Event details with available tables
GET    /api/v1/events/:id/tables   → Tables with real-time availability
POST   /api/v1/reservations        → Create reservation (returns Stripe payment URL)
GET    /api/v1/reservations/:id    → Reservation status
DELETE /api/v1/reservations/:id    → Cancel reservation

## Internal API Routes

POST   /api/webhooks/stripe        → Stripe webhook handler
POST   /api/bot                    → OpenAI chatbot (streaming)
GET    /api/cron/morning-report    → Daily club report (Vercel cron, 6AM)
GET    /api/auth/callback          → Supabase OAuth callback

## Response format (all Server Actions)
{
  success: boolean,
  data?: T,
  error?: string       // User-friendly message, never raw DB error
}

## Error codes to handle
- RESERVATION_CONFLICT: table already reserved for this event
- PAYMENT_FAILED: Stripe payment declined
- INSUFFICIENT_TIER: feature not available on club's subscription
- PROMO_CODE_INVALID: promo code not found or inactive
- WAITLIST_FULL: waitlist limit reached (max 20 per table)
- SCORE_TOO_LOW: client NightTable Score below club threshold
