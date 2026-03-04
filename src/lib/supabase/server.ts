import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseServerEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Configuration Supabase manquante côté serveur");
  }

  return { url, anonKey };
}

export async function createClient(): Promise<ReturnType<typeof createServerClient>> {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseServerEnv();

  const safeSetCookie = (name: string, value: string, options: Record<string, unknown>): void => {
    try {
      cookieStore.set(name, value, options);
    } catch {
      return;
    }
  };

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          safeSetCookie(name, value, options);
        },
        remove(name: string, options: Record<string, unknown>) {
          safeSetCookie(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
}
