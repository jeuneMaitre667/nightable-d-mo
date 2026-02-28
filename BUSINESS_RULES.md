# NightTable — Business Rules

## Reservations
- Minimum prepayment: 30% of table minimum consumption
- Maximum prepayment: 50% of table minimum consumption
- A reservation can only be created if event_table.status = 'available'
- After payment: status changes to 'reserved', event_table.status to 'reserved'
- No-show: triggered manually by club staff, affects client reliability_score (-0.5)
- Cancellation by client: allowed up to 48h before event. Inside 48h, prepayment is lost
  unless insurance was purchased.
- Cancellation by club: full refund always, regardless of timing

## Insurance
- Optional at checkout: 3€ to 5€ depending on table minimum value
  - minimum < 500€: insurance costs 3€
  - minimum 500€-1000€: insurance costs 4€
  - minimum > 1000€: insurance costs 5€
- Covers: full refund of prepayment if client cancels for any reason
- Risk is pooled across all insured reservations — NightTable absorbs the risk

## Dynamic Pricing
- Base price: set by club per table
- occupancyRate coefficients:
  - < 50% full: x1.0 (no change)
  - 50-70% full: x1.15
  - 70-85% full: x1.35
  - 85-95% full: x1.65
  - > 95% full: x2.0
- Time coefficients (days until event):
  - > 14 days: x0.85 (early bird)
  - 7-14 days: x1.0
  - 3-7 days: x1.15
  - 1-3 days: x1.35
  - Same day: x1.5
- eventNotoriety: float from 1.0 to 2.5, set manually by club per event
- Final price = basePrice × occupancyCoeff × timeCoeff × eventNotoriety
- Always rounded UP to nearest 25€

## Promoters
- Promo code: alphanumeric, 6-8 characters, unique, generated on account creation
- Tracked link format: nighttable.fr/reserve?promo=CODE
- Attribution window: 48 hours after first click
- Commission rate: set by club (default 8%), stored on promoter_profiles
- NightTable micro-commission: 1.5% additional on top of club commission
- Commission status flow: pending → validated (by club, after event) → paid (monthly)
- Payout: monthly, automatic via Stripe Connect or manual bank transfer

## Club Subscriptions (SaaS)
- Starter (199€/month): max 3 active promoters, no dynamic pricing, no female VIP module
- Pro (499€/month): unlimited promoters, dynamic pricing, female VIP, analytics
- Premium (990€/month): everything + public API access + dedicated account manager
- Trial period: 3 months free for founding clubs (first 5 clubs)
- Subscription managed via Stripe Subscriptions

## Resale
- Client can list their reserved table for resale up to 3 hours before event start
- Resale price: cannot exceed original dynamic price at time of reservation
- NightTable commission on resale: 5% of resale price
- Seller receives: resale price minus 5%
- Buyer's original reservation is cancelled, new reservation created automatically

## Waitlist
- Client joins waitlist when event_table.status ≠ 'available'
- Position assigned by created_at (first come first served)
- When a table becomes available (cancellation or resale):
  1. First waitlist entry is notified via SMS + push
  2. They have 30 minutes to confirm
  3. If no response, next in line is notified
- Waitlist entries expire when event starts

## Auctions
- Only available for clubs on Pro or Premium tier
- Activated per event by the club (is_auction = true on event)
- Minimum bid: table base_price
- Bid increments: minimum 25€
- Auction closes: 2 hours before event start
- Winner: highest bid at closing time
- Payment: captured immediately at closing
- If winner cancels: full prepayment lost, no insurance applies to auction wins

## NightTable Score (client reputation)
- Initial score: 50/100
- +5 points: attended reservation (checked_in)
- -10 points: no-show without insurance
- -5 points: late cancellation (inside 48h, without insurance)
- +2 points: positive rating from club (4-5 stars)
- -3 points: negative rating from club (1-2 stars)
- Score visible to clubs on reservation details
- Score < 30: club can auto-reject reservations from this client

## Female VIP Module
- Validation is per-club (a VIP validated at club A is not automatically validated at club B)
- Validation status: pending → validated or rejected (by club admin)
- Promo tables: club activates per event (is_vip_promo_active = true)
- No financial compensation to female VIPs — strictly prohibited
- Opt-in is strictly voluntary, with explicit RGPD consent at registration
- Invitation to client tables: only if both parties opt in
- Post-event mutual rating: 1-5 stars, visible only to NightTable admins
