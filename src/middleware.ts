import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAllowedDashboardPrefixes, getDashboardPathByRole, normalizeRole } from "@/lib/auth";

function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;
  const env = getSupabaseEnv();

  if (!env) {
    if (path.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL("/login?error=Configuration+Supabase+requise+en+local", request.url)
      );
    }

    return response;
  }

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        response.cookies.set(name, value, options);
      },
      remove(name: string, options: Record<string, unknown>) {
        response.cookies.set(name, "", { ...options, maxAge: 0 });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && (path === "/login" || path === "/register")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const redirectTo = getDashboardPathByRole(normalizeRole(profile?.role));
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if (user && path.startsWith("/dashboard")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = normalizeRole(profile?.role);
    const allowedPrefixes = getAllowedDashboardPrefixes(role);
    const isAllowed = allowedPrefixes.some((prefix) => path.startsWith(prefix));

    if (path === "/dashboard" || !isAllowed) {
      return NextResponse.redirect(new URL(getDashboardPathByRole(role), request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/login", "/register"],
};
