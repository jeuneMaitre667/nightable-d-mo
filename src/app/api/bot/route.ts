import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

function getOpenAI(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

interface BotContext {
  clubs?: Array<{ name: string; address: string }>
  events?: Array<{ title: string; date: string; club: string }>
  preferences?: {
    budget?: number
    date?: string
    partySize?: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAI()
    const { messages, context } = (await request.json()) as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
      context?: BotContext
    }

    const systemPrompt = `Tu es le concierge numérique de NightTable, la plateforme premium de réservation de tables dans les clubs parisiens les plus exclusifs. 
    
Tu incarnes l'élégance et le raffinement parisien. Tu t'exprimes avec sophistication et courtoisie, toujours en français, avec une touche de luxe discret.

Ton rôle est d'aider les clients à :
- Trouver la table parfaite selon leurs préférences (budget, ambiance, date, taille du groupe)
- Comprendre les tarifs dynamiques et les avantages de réserver à l'avance
- Découvrir les événements et DJs à venir
- Naviguer dans le processus de réservation

${
  context
    ? `
Contexte actuel :
${context.clubs ? `Clubs disponibles : ${context.clubs.map((c) => `${c.name} (${c.address})`).join(', ')}` : ''}
${context.events ? `Événements à venir : ${context.events.map((e) => `${e.title} le ${e.date} à ${e.club}`).join(', ')}` : ''}
${context.preferences?.budget ? `Budget du client : ${context.preferences.budget}€` : ''}
${context.preferences?.partySize ? `Taille du groupe : ${context.preferences.partySize} personnes` : ''}
`
    : ''
}

Réponds toujours de manière concise et élégante. Propose des recommandations personnalisées. Si tu ne peux pas aider, redirige poliment vers le service client.`

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ''
          if (text) {
            controller.enqueue(encoder.encode(text))
          }
        }
        controller.close()
      },
    })

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Bot error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
