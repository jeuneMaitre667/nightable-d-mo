import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const reservationId = paymentIntent.metadata?.reservation_id

      if (reservationId) {
        await supabase
          .from('reservations')
          .update({ status: 'confirmed', stripe_payment_intent_id: paymentIntent.id })
          .eq('id', reservationId)

        const { data: reservation } = await supabase
          .from('reservations')
          .select('promoter_id, prepaid_amount')
          .eq('id', reservationId)
          .single()

        if (reservation?.promoter_id) {
          const { data: promoter } = await supabase
            .from('promoter_profiles')
            .select('commission_rate')
            .eq('id', reservation.promoter_id)
            .single()

          if (promoter?.commission_rate) {
            const commissionAmount = (reservation.prepaid_amount * promoter.commission_rate) / 100
            await supabase.from('commissions').insert({
              promoter_id: reservation.promoter_id,
              reservation_id: reservationId,
              amount: commissionAmount,
              rate: promoter.commission_rate,
              status: 'pending',
            })
          }
        }
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const reservationId = paymentIntent.metadata?.reservation_id

      if (reservationId) {
        await supabase
          .from('reservations')
          .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
          .eq('id', reservationId)
      }
      break
    }

    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabase
        .from('club_profiles')
        .update({ subscription_active: true })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabase
        .from('club_profiles')
        .update({ subscription_active: false })
        .eq('stripe_customer_id', customerId)
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
