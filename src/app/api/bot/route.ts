import { getOpenAI } from "@/lib/openai";

const SYSTEM_PROMPT = `Tu es l'assistant de réservation NightTable.
Tu aides à trouver un club, vérifier les disponibilités et préparer une réservation.`;

export async function POST(req: Request) {
  const openai = getOpenAI();
  const { messages, context } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `Contexte: ${JSON.stringify(context ?? {})}` },
      ...(messages ?? []),
    ],
    max_tokens: 500,
  });

  return Response.json({
    message: completion.choices[0]?.message?.content ?? "",
  });
}
