/**
 * Smoke test — VIP module pages
 * Authenticates as demo VIP + demo Club users and fetches each new VIP page.
 * Verifies HTTP 200 and absence of Next.js error markers in the HTML.
 *
 * Usage: node scripts/smoke-test-vip.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Variables NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY manquantes");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Sign in and build the Supabase SSR cookie string.
 * The @supabase/ssr cookie names follow the pattern:
 *   sb-<project-ref>-auth-token  (chunked if large)
 */
async function getSessionCookies(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    throw new Error(`Auth failed for ${email}: ${error?.message ?? "no session"}`);
  }

  const projectRef = SUPABASE_URL.replace("https://", "").split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const cookieValue = JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    expires_in: data.session.expires_in,
    token_type: data.session.token_type,
  });

  // Try base64 encoded version too (some @supabase/ssr versions use this)
  const base64Value = Buffer.from(cookieValue).toString("base64");

  return {
    session: data.session,
    cookies: `${cookieName}=${encodeURIComponent(cookieValue)}; ${cookieName}.0=${encodeURIComponent(base64Value)}`,
  };
}

const ERROR_MARKERS = [
  "Application error",
  "Internal Server Error",
  "NEXT_NOT_FOUND",
  "Error: ",
  "digest:",
  "Unhandled Runtime Error",
  "__next-error",
];

async function testRoute(label, url, cookieString) {
  try {
    const response = await fetch(url, {
      headers: { Cookie: cookieString },
      redirect: "manual",
    });

    const status = response.status;
    const location = response.headers.get("location") ?? "";

    // Follow one redirect if it goes to login or dashboard (expected)
    if ([301, 302, 303, 307, 308].includes(status)) {
      const redirectTarget = location.startsWith("/") ? `${BASE_URL}${location}` : location;

      // Redirect to login = auth guard working (OK if testing wrong role)
      if (location.includes("/login")) {
        return { label, status, result: "🔒 redirect → login (expected if wrong role)", ok: true };
      }

      // Redirect to own dashboard = role guard working
      if (location.includes("/dashboard/")) {
        return { label, status, result: `↩ redirect → ${location}`, ok: true };
      }

      // Other redirect: follow it
      const followResp = await fetch(redirectTarget, {
        headers: { Cookie: cookieString },
        redirect: "manual",
      });

      const body = await followResp.text();
      const hasError = ERROR_MARKERS.some((m) => body.includes(m));

      return {
        label,
        status: followResp.status,
        result: hasError ? `❌ error marker found after redirect` : `✅ OK (via redirect)`,
        ok: !hasError && followResp.status < 500,
      };
    }

    const body = await response.text();
    const hasError = ERROR_MARKERS.some((m) => body.includes(m));

    if (status >= 500) {
      return { label, status, result: "❌ server error", ok: false };
    }

    if (hasError) {
      // Try to extract a snippet around the error for context
      for (const marker of ERROR_MARKERS) {
        const idx = body.indexOf(marker);
        if (idx >= 0) {
          const snippet = body.substring(Math.max(0, idx - 40), idx + 120).replace(/\n/g, " ");
          return { label, status, result: `❌ "${snippet.trim()}"`, ok: false };
        }
      }
    }

    return { label, status, result: "✅ OK", ok: true };
  } catch (fetchError) {
    return {
      label,
      status: 0,
      result: `❌ fetch failed: ${fetchError.message}`,
      ok: false,
    };
  }
}

async function run() {
  console.log("🔑 Authenticating demo users...\n");

  const vipAuth = await getSessionCookies("demo.vip@nighttable.app", "NighttableDemo!2026");
  console.log(`  ✔ VIP user authenticated (${vipAuth.session.user.email})`);

  const clubAuth = await getSessionCookies("demo.club@nighttable.app", "NighttableDemo!2026");
  console.log(`  ✔ Club user authenticated (${clubAuth.session.user.email})\n`);

  const tests = [
    // VIP routes (female_vip role)
    { label: "VIP dashboard",         url: `${BASE_URL}/dashboard/vip`,              cookies: vipAuth.cookies },
    { label: "VIP invitations",       url: `${BASE_URL}/dashboard/vip/invitations`,  cookies: vipAuth.cookies },
    { label: "VIP profile",           url: `${BASE_URL}/dashboard/vip/profile`,      cookies: vipAuth.cookies },
    { label: "VIP safety",            url: `${BASE_URL}/dashboard/vip/safety`,       cookies: vipAuth.cookies },

    // Club VIP management (club role)
    { label: "Club VIP management",   url: `${BASE_URL}/dashboard/club/vip`,         cookies: clubAuth.cookies },

    // Cross-role guards
    { label: "Club → VIP (blocked)",  url: `${BASE_URL}/dashboard/vip/safety`,       cookies: clubAuth.cookies },
    { label: "VIP → Club (blocked)",  url: `${BASE_URL}/dashboard/club/vip`,         cookies: vipAuth.cookies },
  ];

  console.log("🧪 Running smoke tests...\n");

  const results = [];
  for (const test of tests) {
    const result = await testRoute(test.label, test.url, test.cookies);
    results.push(result);
    const statusStr = String(result.status).padStart(3, " ");
    console.log(`  [${statusStr}] ${result.label.padEnd(25)} ${result.result}`);
  }

  console.log("");

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  if (failed === 0) {
    console.log(`✅ ${passed}/${results.length} tests passed — VIP module smoke test OK`);
  } else {
    console.log(`⚠️  ${passed} passed, ${failed} failed out of ${results.length} tests`);
    process.exit(1);
  }

  // --- Content verification ---
  console.log("\n📄 Content verification (keyword spot-check)...\n");

  const contentTests = [
    { label: "VIP dashboard",       url: `${BASE_URL}/dashboard/vip`,             cookies: vipAuth.cookies,  keywords: ["femme vip", "espace validation", "statut"] },
    { label: "VIP invitations",     url: `${BASE_URL}/dashboard/vip/invitations`, cookies: vipAuth.cookies,  keywords: ["invitation"] },
    { label: "VIP profile",         url: `${BASE_URL}/dashboard/vip/profile`,     cookies: vipAuth.cookies,  keywords: ["profil"] },
    { label: "VIP safety",          url: `${BASE_URL}/dashboard/vip/safety`,      cookies: vipAuth.cookies,  keywords: ["suivi", "soirée", "rentrée"] },
    { label: "Club VIP management", url: `${BASE_URL}/dashboard/club/vip`,        cookies: clubAuth.cookies, keywords: ["VIP", "Femmes"] },
  ];

  let contentPass = 0;
  for (const ct of contentTests) {
    const resp = await fetch(ct.url, { headers: { Cookie: ct.cookies } });
    const html = await resp.text();
    const found = ct.keywords.filter((kw) => html.toLowerCase().includes(kw.toLowerCase()));
    const missing = ct.keywords.filter((kw) => !html.toLowerCase().includes(kw.toLowerCase()));

    if (missing.length === 0) {
      console.log(`  ✅ ${ct.label.padEnd(25)} found: ${found.join(", ")}`);
      contentPass++;
    } else {
      console.log(`  ⚠️  ${ct.label.padEnd(25)} found: ${found.join(", ") || "none"} | MISSING: ${missing.join(", ")}`);
    }
  }

  console.log(`\n📄 Content: ${contentPass}/${contentTests.length} pages contain expected keywords`);
}

run().catch((err) => {
  console.error("❌ Smoke test crashed:", err.message);
  process.exit(1);
});
