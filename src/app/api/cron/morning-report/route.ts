import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const { data: events } = await supabase
    .from('events')
    .select('id, title, club_id')
    .eq('date', yesterdayStr)
    .eq('status', 'completed')

  if (!events || events.length === 0) {
    return NextResponse.json({ message: 'No events yesterday' })
  }

  for (const event of events) {
    const { data: reservations } = await supabase
      .from('reservations')
      .select('*')
      .eq('event_id', event.id)

    if (!reservations) continue

    const total = reservations.length
    const noShow = reservations.filter((r) => r.status === 'no_show').length
    const revenue = reservations
      .filter((r) => ['confirmed', 'checked_in'].includes(r.status))
      .reduce((sum, r) => sum + (r.prepaid_amount || 0), 0)

    const noShowRate = total > 0 ? ((noShow / total) * 100).toFixed(1) : '0'

    const reportHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #050508; color: #fff; padding: 32px; border-radius: 12px;">
        <h1 style="color: #C9973A; font-size: 24px; margin-bottom: 4px;">Rapport du matin — NightTable</h1>
        <p style="color: #888; margin-bottom: 24px;">Événement : <strong>${event.title}</strong> · ${yesterdayStr}</p>
        <div style="margin-bottom: 24px;">
          <div style="background: #0d0d14; border: 1px solid rgba(201,151,58,0.2); border-radius: 8px; padding: 16px; margin-bottom: 8px;">
            <p style="color: #888; font-size: 12px; margin: 0;">Réservations</p>
            <p style="color: #fff; font-size: 28px; margin: 4px 0 0;">${total}</p>
          </div>
          <div style="background: #0d0d14; border: 1px solid rgba(201,151,58,0.2); border-radius: 8px; padding: 16px; margin-bottom: 8px;">
            <p style="color: #888; font-size: 12px; margin: 0;">Chiffre d'affaires</p>
            <p style="color: #C9973A; font-size: 28px; margin: 4px 0 0;">${revenue} €</p>
          </div>
          <div style="background: #0d0d14; border: 1px solid rgba(201,151,58,0.2); border-radius: 8px; padding: 16px;">
            <p style="color: #888; font-size: 12px; margin: 0;">Taux no-show</p>
            <p style="color: ${Number(noShowRate) > 20 ? '#f87171' : '#34d399'}; font-size: 28px; margin: 4px 0 0;">${noShowRate}%</p>
          </div>
        </div>
      </div>
    `

    const { data: clubProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', event.club_id)
      .single()

    if (clubProfile?.email) {
      const resend = getResend()
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'reports@nightable.fr',
        to: clubProfile.email,
        subject: `Rapport NightTable — ${event.title} · ${yesterdayStr}`,
        html: reportHtml,
      })
    }
  }

  return NextResponse.json({ message: `Processed ${events.length} events`, date: yesterdayStr })
}
