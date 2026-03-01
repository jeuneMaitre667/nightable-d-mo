import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAllowedDashboardPrefixes, getDashboardPathByRole, normalizeRole } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (path.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL("/login?error=Configuration+Supabase+requise+en+local", request.url)
      );
    }

    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
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
    }
  );

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

    return NextResponse.redirect(
      new URL(getDashboardPathByRole(normalizeRole(profile?.role)), request.url)
    );
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
