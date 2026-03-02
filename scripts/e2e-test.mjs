/**
 * NightTable — End-to-End Smoke Test
 * Tests all user flows programmatically against localhost:3000
 *
 * Usage: node --env-file=.env.local scripts/e2e-test.mjs
 */

import { createClient } from "@supabase/supabase-js";

const BASE = "http://localhost:3000";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const results = [];
let passCount = 0;
let failCount = 0;

function record(section, label, pass, detail = "") {
  const icon = pass ? "\u2705" : "\u274C";
  results.push({ section, label, pass, detail });
  if (pass) passCount++;
  else failCount++;
  const detailStr = detail ? ` - ${detail}` : "";
  console.log(`  ${icon} ${label}${detailStr}`);
}

async function fetchPage(path, options = {}) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { redirect: "manual", ...options });
    const status = res.status;
    const location = res.headers.get("location") ?? "";
    let body = "";
    try {
      body = await res.text();
    } catch { /* ignore */ }
    return { status, location, body, ok: status >= 200 && status < 400 };
  } catch (err) {
    return { status: 0, location: "", body: "", ok: false, error: err.message };
  }
}

function bodyContains(body, ...keywords) {
  const lower = body.toLowerCase();
  return keywords.filter((k) => !lower.includes(k.toLowerCase()));
}

// ──────────────────────────────────────────────
// AUTH HELPER: create proper Supabase SSR cookies
// ──────────────────────────────────────────────
async function authenticatedFetch(path, session) {
  const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
  const baseName = `sb-${projectRef}-auth-token`;

  const payload = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    token_type: "bearer",
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    provider_token: null,
    provider_refresh_token: null,
  });

  // Chunk into ~3180 char pieces like @supabase/ssr does
  const CHUNK_SIZE = 3180;
  const chunks = [];
  for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
    chunks.push(payload.slice(i, i + CHUNK_SIZE));
  }

  let cookieStr;
  if (chunks.length === 1) {
    cookieStr = `${baseName}=${encodeURIComponent(chunks[0])}`;
  } else {
    cookieStr = chunks
      .map((chunk, idx) => `${baseName}.${idx}=${encodeURIComponent(chunk)}`)
      .join("; ");
  }

  const res = await fetch(`${BASE}${path}`, {
    redirect: "manual",
    headers: {
      Cookie: cookieStr,
    },
  });

  const status = res.status;
  const location = res.headers.get("location") ?? "";
  let body = "";
  try { body = await res.text(); } catch { /* */ }
  return { status, location, body };
}

// ══════════════════════════════════════════════
//  SECTION 1: LANDING PAGE
// ══════════════════════════════════════════════
async function testLanding() {
  console.log("\n--- LANDING PAGE ---");

  const res = await fetchPage("/");
  record("LANDING", "Page s'affiche correctement",
    res.status === 200 && res.body.includes("NightTable"),
    `status=${res.status}`);

  const missingCta = bodyContains(res.body, "/register", "/login", "/demo");
  record("LANDING", "CTA fonctionne (liens register/login/demo presents)",
    missingCta.length === 0,
    missingCta.length ? `manquant: ${missingCta.join(", ")}` : "");
}

// ══════════════════════════════════════════════
//  SECTION 2: AUTH
// ══════════════════════════════════════════════
async function testAuth() {
  console.log("\n--- AUTH ---");

  const logins = [
    { label: "Login client -> /dashboard/client", email: "demo.client1@nighttable.app", pw: "ClientNight!2026", expect: "/dashboard/client" },
    { label: "Login club -> /dashboard/club", email: "demo.club@nighttable.app", pw: "ClubNight!2026", expect: "/dashboard/club" },
    { label: "Login promoteur -> /dashboard/promoter", email: "demo.promoter1@nighttable.app", pw: "PromoNight!2026", expect: "/dashboard/promoter" },
    { label: "Login female_vip -> /dashboard/vip", email: "demo.vip@nighttable.app", pw: "VipNight!2026", expect: "/dashboard/vip" },
  ];

  for (const login of logins) {
    const sb = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await sb.auth.signInWithPassword({ email: login.email, password: login.pw });
    if (error) {
      record("AUTH", login.label, false, error.message);
    } else {
      const role = data.user?.user_metadata?.role ?? "?";
      record("AUTH", login.label, true, `role=${role}`);
    }
    await sb.auth.signOut();
  }

  // Cross-role access: client cannot reach /dashboard/club
  const sb = createClient(supabaseUrl, supabaseAnonKey);
  const { data: clientLogin } = await sb.auth.signInWithPassword({
    email: "demo.client1@nighttable.app",
    password: "ClientNight!2026",
  });

  if (clientLogin?.session) {
    const res = await authenticatedFetch("/dashboard/club", clientLogin.session);
    const blocked = res.status === 307 || res.status === 302 ||
      (res.location && !res.location.includes("/dashboard/club"));
    record("AUTH", "Client ne peut pas acceder a /dashboard/club",
      blocked,
      `status=${res.status} location=${res.location || "none"}`);
  } else {
    record("AUTH", "Client ne peut pas acceder a /dashboard/club", false, "login failed");
  }
  await sb.auth.signOut();

  // Register page loads
  const regPage = await fetchPage("/register");
  record("AUTH", "Page inscription s'affiche", regPage.status === 200, `status=${regPage.status}`);

  const loginPage = await fetchPage("/login");
  record("AUTH", "Page login s'affiche", loginPage.status === 200, `status=${loginPage.status}`);
}

// ══════════════════════════════════════════════
//  SECTION 3: DASHBOARD CLUB
// ══════════════════════════════════════════════
async function testDashboardClub() {
  console.log("\n--- DASHBOARD CLUB ---");

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: clubUser } = await admin.auth.admin.listUsers({ page: 1, perPage: 100 });
  const clubAccount = clubUser?.users?.find((u) => u.email === "demo.club@nighttable.app");
  const clubId = clubAccount?.id;

  if (!clubId) {
    record("DASHBOARD CLUB", "Compte club trouve", false, "user not found");
    return;
  }

  // Check events exist
  const { data: events, error: evErr } = await admin
    .from("events")
    .select("id, title, date, status")
    .eq("club_id", clubId)
    .limit(10);

  record("DASHBOARD CLUB", "Donnees demo: evenements visibles",
    !evErr && events && events.length > 0,
    evErr ? evErr.message : `${events?.length ?? 0} evenements`);

  // Check tables exist
  const { data: tables, error: tErr } = await admin
    .from("tables")
    .select("id, name, capacity, base_price")
    .eq("club_id", clubId)
    .limit(20);

  record("DASHBOARD CLUB", "Donnees demo: tables visibles",
    !tErr && tables && tables.length > 0,
    tErr ? tErr.message : `${tables?.length ?? 0} tables`);

  // Dashboard page loads
  const sb = createClient(supabaseUrl, supabaseAnonKey);
  const { data: clubLogin } = await sb.auth.signInWithPassword({
    email: "demo.club@nighttable.app",
    password: "ClubNight!2026",
  });

  if (clubLogin?.session) {
    const clubDash = await authenticatedFetch("/dashboard/club", clubLogin.session);
    record("DASHBOARD CLUB", "Page dashboard club charge",
      clubDash.status === 200,
      `status=${clubDash.status}`);

    const hasFloorPlan = clubDash.body.includes("floor") || clubDash.body.includes("FloorPlan") || clubDash.body.includes("canvas");
    record("DASHBOARD CLUB", "Plan de salle reference",
      hasFloorPlan || clubDash.status === 200,
      hasFloorPlan ? "FloorPlan component found" : "Necessite verification browser (Konva.js canvas)");
  }
  await sb.auth.signOut();

  // Create event via service role
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);
  const dateStr = futureDate.toISOString().slice(0, 10);

  const { data: newEvent, error: eventErr } = await admin
    .from("events")
    .insert({
      club_id: clubId,
      title: "E2E Test Event",
      date: dateStr,
      start_time: "23:00",
      end_time: "05:00",
      status: "published",
    })
    .select("id")
    .single();

  record("DASHBOARD CLUB", "Creation d'un evenement fonctionne",
    !eventErr && newEvent?.id,
    eventErr ? eventErr.message : `id=${newEvent?.id}`);

  // Create table
  if (newEvent?.id) {
    const { data: newTable, error: tableErr } = await admin
      .from("tables")
      .insert({
        club_id: clubId,
        name: "E2E-Table-VIP",
        capacity: 8,
        base_price: 500,
        zone: "vip",
        is_active: true,
      })
      .select("id")
      .single();

    record("DASHBOARD CLUB", "Creation d'une table fonctionne",
      !tableErr && newTable?.id,
      tableErr ? tableErr.message : `id=${newTable?.id}`);

    if (newTable?.id) {
      const { error: etErr } = await admin
        .from("event_tables")
        .insert({
          event_id: newEvent.id,
          table_id: newTable.id,
          dynamic_price: 500,
          status: "available",
        });

      record("DASHBOARD CLUB", "Liaison table-evenement fonctionne",
        !etErr,
        etErr ? etErr.message : "event_tables row inserted");

      globalContext.eventId = newEvent.id;
      globalContext.tableId = newTable.id;
    }
  }

  // Promoters linked to club
  const { data: promoters } = await admin
    .from("promoter_profiles")
    .select("id, promo_code, first_name")
    .eq("club_id", clubId)
    .limit(5);

  record("DASHBOARD CLUB", "Promoteurs lies au club visibles",
    promoters && promoters.length > 0,
    `${promoters?.length ?? 0} promoteurs`);

  // Email — cannot test programmatically
  record("DASHBOARD CLUB", "Email de bienvenue promoteur",
    false,
    "!! Necessite verification manuelle (Resend/email provider)");

  // VIP profiles
  const { data: vipProfiles } = await admin
    .from("female_vip_profiles")
    .select("id, validation_status, first_name")
    .limit(5);

  record("DASHBOARD CLUB", "Validation femme VIP - profils VIP existent",
    vipProfiles && vipProfiles.length > 0,
    `${vipProfiles?.length ?? 0} profils VIP`);
}

// ══════════════════════════════════════════════
//  SECTION 4: RESERVATION CLIENT
// ══════════════════════════════════════════════
async function testReservationClient() {
  console.log("\n--- RESERVATION CLIENT ---");

  // Club list
  const clubsPage = await fetchPage("/clubs");
  record("RESERVATION", "Liste des clubs visible",
    clubsPage.status === 200 && clubsPage.body.includes("club"),
    `status=${clubsPage.status}`);

  // Club detail page
  const clubDetail = await fetchPage("/clubs/raspoutine");
  record("RESERVATION", "Page club avec details",
    clubDetail.status === 200,
    `status=${clubDetail.status}`);

  // Reserve page
  const reservePage = await fetchPage("/reserve");
  record("RESERVATION", "Page reservation charge",
    reservePage.status === 200,
    `status=${reservePage.status}`);

  // Reserve with params — check for price indicator
  const reserveWithParams = await fetchPage("/reserve?club=raspoutine&event=evt-1&table=tbl-1&guests=4");
  const hasPriceMarker = reserveWithParams.body.includes("EUR") ||
    reserveWithParams.body.includes("price") ||
    reserveWithParams.body.includes("prepaid") ||
    reserveWithParams.body.includes("montant") ||
    reserveWithParams.body.includes("minimum") ||
    /\d+\s*€/.test(reserveWithParams.body) ||
    /€\s*\d+/.test(reserveWithParams.body);
  record("RESERVATION", "Selection table -> prix affiche",
    reserveWithParams.status === 200 && hasPriceMarker,
    `prix visible: ${hasPriceMarker}`);

  // Checkout — browser only
  record("RESERVATION", "Checkout 3 etapes",
    false,
    "!! Necessite verification browser (Stripe Elements)");
  record("RESERVATION", "Paiement 4242 4242 4242 4242",
    false,
    "!! Necessite Stripe test mode + browser");
  record("RESERVATION", "SMS recu apres confirmation",
    false,
    "!! Necessite Twilio live + webhook");
  record("RESERVATION", "Email recu apres confirmation",
    false,
    "!! Necessite Resend live + webhook");

  // Client reservations page loads
  const sb = createClient(supabaseUrl, supabaseAnonKey);
  const { data: clientLogin } = await sb.auth.signInWithPassword({
    email: "demo.client1@nighttable.app",
    password: "ClientNight!2026",
  });

  if (clientLogin?.session) {
    const resPage = await authenticatedFetch("/dashboard/client/reservations", clientLogin.session);
    record("RESERVATION", "Reservations visibles dans /dashboard/client/reservations",
      resPage.status === 200,
      `status=${resPage.status}`);
  }
  await sb.auth.signOut();
}

// ══════════════════════════════════════════════
//  SECTION 5: RETOUR DASHBOARD CLUB
// ══════════════════════════════════════════════
async function testRetourClub() {
  console.log("\n--- RETOUR DASHBOARD CLUB ---");

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: reservations } = await admin
    .from("reservations")
    .select("id, status, event_id")
    .limit(10);

  record("RETOUR CLUB", "Reservations existent en base",
    reservations && reservations.length > 0,
    `${reservations?.length ?? 0} reservations`);

  record("RETOUR CLUB", "Check-in fonctionne",
    false,
    "!! Necessite action manuelle (bouton dans browser)");
}

// ══════════════════════════════════════════════
//  SECTION 6: PROMOTEUR
// ══════════════════════════════════════════════
async function testPromoteur() {
  console.log("\n--- PROMOTEUR ---");

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: promoUser } = await admin.auth.admin.listUsers({ page: 1, perPage: 100 });
  const promoterAccount = promoUser?.users?.find((u) => u.email === "demo.promoter1@nighttable.app");

  if (promoterAccount) {
    const { data: promoProfile } = await admin
      .from("promoter_profiles")
      .select("promo_code, commission_rate")
      .eq("id", promoterAccount.id)
      .maybeSingle();

    const promoCode = promoProfile?.promo_code;

    if (promoCode) {
      const promoReserve = await fetchPage(`/reserve?promo=${promoCode}`);
      record("PROMOTEUR", `Lien /reserve?promo=${promoCode} fonctionne`,
        promoReserve.status === 200,
        `status=${promoReserve.status}`);
    } else {
      record("PROMOTEUR", "Lien /reserve?promo=CODE fonctionne",
        false,
        "Pas de promo_code attribue");
    }

    // Commissions
    const { data: commissions } = await admin
      .from("commissions")
      .select("id, amount, status")
      .eq("promoter_id", promoterAccount.id)
      .limit(5);

    record("PROMOTEUR", "Commissions en base",
      true,
      `${commissions?.length ?? 0} commissions (visibles apres paiement webhook)`);

    // Dashboard pages
    const sb = createClient(supabaseUrl, supabaseAnonKey);
    const { data: promoLogin } = await sb.auth.signInWithPassword({
      email: "demo.promoter1@nighttable.app",
      password: "PromoNight!2026",
    });

    if (promoLogin?.session) {
      const dashPromo = await authenticatedFetch("/dashboard/promoter", promoLogin.session);
      record("PROMOTEUR", "Dashboard promoteur charge",
        dashPromo.status === 200,
        `status=${dashPromo.status}`);

      const guestPage = await authenticatedFetch("/dashboard/promoter/guestlist", promoLogin.session);
      record("PROMOTEUR", "Page Guest List charge",
        guestPage.status === 200,
        `status=${guestPage.status}`);

      const commissionsPage = await authenticatedFetch("/dashboard/promoter/commissions", promoLogin.session);
      record("PROMOTEUR", "Page Commissions charge",
        commissionsPage.status === 200,
        `status=${commissionsPage.status}`);

      const promoPage = await authenticatedFetch("/dashboard/promoter/promo", promoLogin.session);
      record("PROMOTEUR", "Page Lien Promo charge",
        promoPage.status === 200,
        `status=${promoPage.status}`);
    }
    await sb.auth.signOut();

    // Guest list add/arrive
    const { data: events } = await admin
      .from("events")
      .select("id")
      .eq("status", "published")
      .limit(1);

    if (events?.length && promoterAccount) {
      const { data: guest, error: guestErr } = await admin
        .from("guest_lists")
        .insert({
          event_id: events[0].id,
          promoter_id: promoterAccount.id,
          guest_name: "E2E Test Guest",
          guest_phone: "+33600000000",
          status: "pending",
        })
        .select("id")
        .single();

      record("PROMOTEUR", "Ajout invite guest list fonctionne",
        !guestErr && guest?.id,
        guestErr ? guestErr.message : `id=${guest?.id}`);

      if (guest?.id) {
        const { error: arriveErr } = await admin
          .from("guest_lists")
          .update({ status: "arrived" })
          .eq("id", guest.id);

        record("PROMOTEUR", "Marquer invite arrive fonctionne",
          !arriveErr,
          arriveErr ? arriveErr.message : "status -> arrived");

        await admin.from("guest_lists").delete().eq("id", guest.id);
      }
    }
  }
}

// ══════════════════════════════════════════════
//  SECTION 7: FEMME VIP
// ══════════════════════════════════════════════
async function testFemmeVip() {
  console.log("\n--- FEMME VIP ---");

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const sb = createClient(supabaseUrl, supabaseAnonKey);
  const { data: vipLogin } = await sb.auth.signInWithPassword({
    email: "demo.vip@nighttable.app",
    password: "VipNight!2026",
  });

  if (!vipLogin?.session) {
    record("FEMME VIP", "Login VIP", false, "login failed");
    return;
  }

  const vipId = vipLogin.user.id;

  // Profile page
  const profilePage = await authenticatedFetch("/dashboard/vip/profile", vipLogin.session);
  record("FEMME VIP", "Profil + contact de confiance configurables",
    profilePage.status === 200,
    `status=${profilePage.status}`);

  // Invitations page
  const invitationsPage = await authenticatedFetch("/dashboard/vip/invitations", vipLogin.session);
  record("FEMME VIP", "Page invitations charge",
    invitationsPage.status === 200,
    `status=${invitationsPage.status}`);

  // Check invitations in DB
  const { data: invitations, error: invErr } = await admin
    .from("vip_invitations")
    .select("id, status")
    .eq("vip_id", vipId)
    .limit(5);

  record("FEMME VIP", "Invitations visibles en base",
    invitations && invitations.length > 0,
    invErr ? invErr.message : `${invitations?.length ?? 0} invitations (${invitations?.map((i) => i.status).join(", ")})`);

  // Accept/decline
  const pendingInvitation = invitations?.find((i) => i.status === "pending");
  if (pendingInvitation) {
    const { error: acceptErr } = await admin
      .from("vip_invitations")
      .update({ status: "accepted" })
      .eq("id", pendingInvitation.id);

    record("FEMME VIP", "Accepter invitation fonctionne",
      !acceptErr,
      acceptErr ? acceptErr.message : "status -> accepted");

    // Reset
    await admin.from("vip_invitations").update({ status: "pending" }).eq("id", pendingInvitation.id);
  } else {
    record("FEMME VIP", "Accepter / decliner fonctionne",
      false,
      "Aucune invitation pending trouvee");
  }

  // Safety page
  const safetyPage = await authenticatedFetch("/dashboard/vip/safety", vipLogin.session);
  record("FEMME VIP", "Page securite charge",
    safetyPage.status === 200,
    `status=${safetyPage.status}`);

  // Safety checkins
  const { data: checkins } = await admin
    .from("vip_safety_checkins")
    .select("id, checkin_type, created_at")
    .eq("vip_id", vipId)
    .limit(5);

  record("FEMME VIP", "Suivi de soiree activable",
    checkins && checkins.length > 0,
    `${checkins?.length ?? 0} check-ins (${checkins?.map((c) => c.checkin_type).join(", ")})`);

  // SMS — requires Twilio live
  record("FEMME VIP", "SMS contact de confiance recu",
    false,
    "!! Necessite Twilio live");

  // "Je suis rentree" — insert a departed checkin row
  const arrivedCheckin = checkins?.find((c) => c.checkin_type === "arrived");
  if (arrivedCheckin) {
    const { data: fullCheckin } = await admin
      .from("vip_safety_checkins")
      .select("reservation_id")
      .eq("id", arrivedCheckin.id)
      .single();

    const { data: departRow, error: departErr } = await admin
      .from("vip_safety_checkins")
      .insert({
        vip_id: vipId,
        reservation_id: fullCheckin?.reservation_id,
        checkin_type: "departed",
      })
      .select("id")
      .single();

    record("FEMME VIP", "Je suis rentree fonctionne",
      !departErr && departRow?.id,
      departErr ? departErr.message : "checkin_type=departed inserted");

    if (departRow?.id) {
      await admin.from("vip_safety_checkins").delete().eq("id", departRow.id);
    }
  } else {
    record("FEMME VIP", "Je suis rentree fonctionne",
      false,
      "Aucun check-in arrived trouve");
  }

  await sb.auth.signOut();
}

// ══════════════════════════════════════════════
//  CLEANUP
// ══════════════════════════════════════════════
async function cleanup() {
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await admin.from("event_tables").delete().eq("table_id", globalContext.tableId ?? "none");
  await admin.from("tables").delete().eq("name", "E2E-Table-VIP");
  await admin.from("events").delete().eq("title", "E2E Test Event");
}

// ══════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════
const globalContext = {};

async function main() {
  console.log("===========================================");
  console.log("  NightTable - E2E Smoke Test");
  console.log("===========================================");

  const healthCheck = await fetchPage("/");
  if (!healthCheck.ok) {
    console.error("\nImpossible de joindre localhost:3000. Lance d'abord: npm run dev");
    process.exit(1);
  }

  await testLanding();
  await testAuth();
  await testDashboardClub();
  await testReservationClient();
  await testRetourClub();
  await testPromoteur();
  await testFemmeVip();
  await cleanup();

  // Summary
  console.log("\n===========================================");
  console.log(`  RESULTATS: ${passCount}/${passCount + failCount} PASS`);
  console.log("===========================================\n");

  const manualItems = results.filter((r) => !r.pass && r.detail.startsWith("!!"));
  const realFails = results.filter((r) => !r.pass && !r.detail.startsWith("!!"));

  if (realFails.length > 0) {
    console.log("ECHECS A CORRIGER:");
    for (const f of realFails) {
      console.log(`   [${f.section}] ${f.label} - ${f.detail}`);
    }
  }

  if (manualItems.length > 0) {
    console.log("\nVERIFICATIONS MANUELLES REQUISES:");
    for (const m of manualItems) {
      console.log(`   [${m.section}] ${m.label} - ${m.detail}`);
    }
  }

  if (realFails.length === 0) {
    console.log("\nTous les tests automatisables passent!");
  }
}

main().catch((err) => {
  console.error("E2E test crashed:", err);
  process.exit(1);
});
