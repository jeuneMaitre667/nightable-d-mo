import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAllowedDashboardPrefixes, getDashboardPathByRole, normalizeRole } from "@/lib/auth";

async function resolveRoleWithFallback(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  userEmail?: string
): Promise<"client" | "club" | "promoter" | "female_vip" | "admin"> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role,email")
    .eq("id", userId)
    .maybeSingle();

  let role = normalizeRole(profile?.role);

  if (role === "admin") {
    return role;
  }

  if (!profile?.role || role === "client") {
    const [clubResult, promoterResult, vipResult] = await Promise.all([
      supabase.from("club_profiles").select("id").eq("id", userId).maybeSingle(),
      supabase.from("promoter_profiles").select("id").eq("id", userId).maybeSingle(),
      supabase.from("female_vip_profiles").select("id").eq("id", userId).maybeSingle(),
    ]);

    const inferredRole = clubResult.data?.id
      ? "club"
      : promoterResult.data?.id
        ? "promoter"
        : vipResult.data?.id
          ? "female_vip"
          : "client";

    if (inferredRole !== role) {
      role = inferredRole;
      await supabase.from("profiles").upsert(
        {
          id: userId,
          email: profile?.email ?? userEmail ?? null,
          role,
        },
        { onConflict: "id" }
      );
    }
  }

  return role;
}

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
    const role = await resolveRoleWithFallback(supabase, user.id, user.email);

    return NextResponse.redirect(
      new URL(getDashboardPathByRole(role), request.url)
    );
  }

  if (user && path.startsWith("/dashboard")) {
    const role = await resolveRoleWithFallback(supabase, user.id, user.email);
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
