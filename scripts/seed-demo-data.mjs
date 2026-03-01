import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";

function loadDotEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = rawValue.replace(/^['\"]|['\"]$/g, "");
    }
  }
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variable ${name} manquante`);
  }

  return value;
}

function isoDateFromNow(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
}

function eventStartsAt(date, startTime) {
  return `${date}T${startTime}`;
}

async function ensureUser(adminSupabase, { email, role, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const userListResult = await adminSupabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (userListResult.error) {
    throw new Error(`Lecture utilisateurs impossible (${normalizedEmail})`);
  }

  const existingUser = userListResult.data.users.find(
    (user) => user.email?.toLowerCase() === normalizedEmail
  );

  if (existingUser) {
    return existingUser;
  }

  const created = await adminSupabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: { role },
  });

  if (created.error || !created.data.user) {
    throw new Error(`Création utilisateur impossible (${normalizedEmail})`);
  }

  return created.data.user;
}

async function run() {
  loadDotEnvLocal();

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const demoUsers = {
    club: await ensureUser(adminSupabase, {
      email: "demo.club@nighttable.app",
      role: "club",
      password: "NighttableDemo!2026",
    }),
    promoter1: await ensureUser(adminSupabase, {
      email: "demo.promoter1@nighttable.app",
      role: "promoter",
      password: "NighttableDemo!2026",
    }),
    promoter2: await ensureUser(adminSupabase, {
      email: "demo.promoter2@nighttable.app",
      role: "promoter",
      password: "NighttableDemo!2026",
    }),
    client1: await ensureUser(adminSupabase, {
      email: "demo.client1@nighttable.app",
      role: "client",
      password: "NighttableDemo!2026",
    }),
    client2: await ensureUser(adminSupabase, {
      email: "demo.client2@nighttable.app",
      role: "client",
      password: "NighttableDemo!2026",
    }),
    vip: await ensureUser(adminSupabase, {
      email: "demo.vip@nighttable.app",
      role: "female_vip",
      password: "NighttableDemo!2026",
    }),
  };

  await adminSupabase.from("profiles").upsert(
    [
      { id: demoUsers.club.id, email: demoUsers.club.email, role: "club" },
      { id: demoUsers.promoter1.id, email: demoUsers.promoter1.email, role: "promoter" },
      { id: demoUsers.promoter2.id, email: demoUsers.promoter2.email, role: "promoter" },
      { id: demoUsers.client1.id, email: demoUsers.client1.email, role: "client" },
      { id: demoUsers.client2.id, email: demoUsers.client2.email, role: "client" },
      { id: demoUsers.vip.id, email: demoUsers.vip.email, role: "female_vip" },
    ],
    { onConflict: "id" }
  );

  await adminSupabase.from("club_profiles").upsert(
    {
      id: demoUsers.club.id,
      club_name: "NightTable Demo Club",
      slug: "nighttable-demo-club",
      description: "Club de démonstration NightTable",
      address: "12 Avenue des Champs-Élysées",
      city: "Paris",
      phone: "+33142000000",
      instagram_handle: "nighttable_demo_club",
      subscription_tier: "premium",
      subscription_active: true,
      is_verified: true,
    },
    { onConflict: "id" }
  );

  await adminSupabase.from("promoter_profiles").upsert(
    [
      {
        id: demoUsers.promoter1.id,
        first_name: "Lina",
        last_name: "Martin",
        club_id: demoUsers.club.id,
        promo_code: "DEMO01",
        commission_rate: 10,
        is_active: true,
      },
      {
        id: demoUsers.promoter2.id,
        first_name: "Noah",
        last_name: "Bernard",
        club_id: demoUsers.club.id,
        promo_code: "DEMO02",
        commission_rate: 8,
        is_active: true,
      },
    ],
    { onConflict: "id" }
  );

  await adminSupabase.from("client_profiles").upsert(
    [
      {
        id: demoUsers.client1.id,
        first_name: "Emma",
        last_name: "Dubois",
        phone: "+33611111111",
        nighttable_score: 82,
      },
      {
        id: demoUsers.client2.id,
        first_name: "Lucas",
        last_name: "Petit",
        phone: "+33622222222",
        nighttable_score: 64,
      },
    ],
    { onConflict: "id" }
  );

  await adminSupabase.from("female_vip_profiles").upsert(
    {
      id: demoUsers.vip.id,
      first_name: "Sofia",
      last_name: "Laurent",
      phone: "+33633333333",
      validation_status: "validated",
      validated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  const { data: existingDemoEvents } = await adminSupabase
    .from("events")
    .select("id")
    .eq("club_id", demoUsers.club.id)
    .like("title", "DEMO ·%");

  const demoEventIds = (existingDemoEvents ?? []).map((eventItem) => eventItem.id);

  if (demoEventIds.length > 0) {
    await adminSupabase.from("events").delete().in("id", demoEventIds);
  }

  const tableDefinitions = [
    {
      club_id: demoUsers.club.id,
      name: "DEMO-T1",
      zone: "Main Room",
      capacity: 6,
      base_price: 900,
      is_promo: false,
      is_active: true,
    },
    {
      club_id: demoUsers.club.id,
      name: "DEMO-T2",
      zone: "Main Room",
      capacity: 8,
      base_price: 1200,
      is_promo: false,
      is_active: true,
    },
    {
      club_id: demoUsers.club.id,
      name: "DEMO-T3",
      zone: "Balcony",
      capacity: 4,
      base_price: 650,
      is_promo: true,
      is_active: true,
    },
  ];

  for (const tableDefinition of tableDefinitions) {
    const { data: existingTable } = await adminSupabase
      .from("tables")
      .select("id")
      .eq("club_id", demoUsers.club.id)
      .eq("name", tableDefinition.name)
      .maybeSingle();

    if (existingTable) {
      const { error: updateTableError } = await adminSupabase
        .from("tables")
        .update(tableDefinition)
        .eq("id", existingTable.id)
        .eq("club_id", demoUsers.club.id);

      if (updateTableError) {
        throw new Error(`Impossible de mettre à jour ${tableDefinition.name}: ${updateTableError.message}`);
      }
    } else {
      const { error: insertTableError } = await adminSupabase
        .from("tables")
        .insert(tableDefinition);

      if (insertTableError) {
        throw new Error(`Impossible de créer ${tableDefinition.name}: ${insertTableError.message}`);
      }
    }
  }

  const { data: tableRows, error: tableError } = await adminSupabase
    .from("tables")
    .select("id, name, base_price")
    .eq("club_id", demoUsers.club.id)
    .in("name", ["DEMO-T1", "DEMO-T2", "DEMO-T3"]);

  if (tableError || !tableRows || tableRows.length < 3) {
    throw new Error(
      `Impossible de récupérer les tables démo${tableError ? `: ${tableError.message}` : ""}`
    );
  }

  const tableByName = new Map(tableRows.map((tableItem) => [tableItem.name, tableItem]));
  const t1 = tableByName.get("DEMO-T1");
  const t2 = tableByName.get("DEMO-T2");
  const t3 = tableByName.get("DEMO-T3");

  if (!t1 || !t2 || !t3) {
    throw new Error("Tables démo introuvables après création");
  }

  const eventDefinitions = [
    {
      title: "DEMO · Gold Friday",
      description: "Soirée premium de démonstration NightTable.",
      date: isoDateFromNow(7),
      start_time: "23:30",
      end_time: "05:00",
    },
    {
      title: "DEMO · Velvet Saturday",
      description: "Parcours client et waitlist en situation réelle.",
      date: isoDateFromNow(8),
      start_time: "23:45",
      end_time: "05:30",
    },
  ];

  const { data: createdEvents, error: eventsError } = await adminSupabase
    .from("events")
    .insert(
      eventDefinitions.map((eventItem) => ({
        club_id: demoUsers.club.id,
        title: eventItem.title,
        description: eventItem.description,
        date: eventItem.date,
        start_time: eventItem.start_time,
        end_time: eventItem.end_time,
        dress_code: "Elegant",
        status: "published",
        is_auction: false,
      }))
    )
    .select("id, title, date, start_time");

  if (eventsError || !createdEvents || createdEvents.length === 0) {
    throw new Error(
      `Impossible de créer les événements démo${eventsError ? `: ${eventsError.message}` : ""}`
    );
  }

  const eventTablePayload = [];
  for (const eventItem of createdEvents) {
    eventTablePayload.push(
      {
        event_id: eventItem.id,
        table_id: t1.id,
        status: "available",
        dynamic_price: 950,
      },
      {
        event_id: eventItem.id,
        table_id: t2.id,
        status: "available",
        dynamic_price: 1250,
      },
      {
        event_id: eventItem.id,
        table_id: t3.id,
        status: "available",
        dynamic_price: 700,
      }
    );
  }

  const { data: eventTables, error: eventTablesError } = await adminSupabase
    .from("event_tables")
    .insert(eventTablePayload)
    .select("id, event_id, table_id");

  if (eventTablesError || !eventTables || eventTables.length === 0) {
    throw new Error("Impossible de lier les tables aux événements démo");
  }

  const firstEvent = createdEvents[0];
  const secondEvent = createdEvents[1] ?? createdEvents[0];

  const firstEventMainTable = eventTables.find(
    (row) => row.event_id === firstEvent.id && row.table_id === t1.id
  );
  const secondEventMainTable = eventTables.find(
    (row) => row.event_id === secondEvent.id && row.table_id === t2.id
  );

  if (!firstEventMainTable || !secondEventMainTable) {
    throw new Error("Event tables principales introuvables");
  }

  const reservationPayload = [
    {
      client_id: demoUsers.client1.id,
      event_id: firstEvent.id,
      event_table_id: firstEventMainTable.id,
      promoter_id: demoUsers.promoter1.id,
      promo_code_used: "DEMO01",
      status: "confirmed",
      minimum_consumption: 950,
      dynamic_price_at_booking: 950,
      prepayment_percent: 40,
      prepayment_amount: 380,
      insurance_purchased: true,
      insurance_price: 4,
      event_starts_at: eventStartsAt(firstEvent.date, firstEvent.start_time),
      qr_code: `NT-DEMO-${firstEvent.id.slice(0, 8)}`,
      guests_count: 4,
      contact_phone: "+33611111111",
      client_first_name: "Emma",
      client_last_name: "Dubois",
      stripe_payment_intent_id: `pi_demo_${firstEvent.id.slice(0, 12)}`,
      paid_at: new Date().toISOString(),
    },
    {
      client_id: demoUsers.client2.id,
      event_id: secondEvent.id,
      event_table_id: secondEventMainTable.id,
      promoter_id: null,
      promo_code_used: null,
      status: "reserved",
      minimum_consumption: 1250,
      dynamic_price_at_booking: 1250,
      prepayment_percent: 40,
      prepayment_amount: 500,
      insurance_purchased: false,
      insurance_price: 0,
      event_starts_at: eventStartsAt(secondEvent.date, secondEvent.start_time),
      qr_code: `NT-DEMO-${secondEvent.id.slice(0, 8)}`,
      guests_count: 6,
      contact_phone: "+33622222222",
      client_first_name: "Lucas",
      client_last_name: "Petit",
      stripe_payment_intent_id: `pi_demo_${secondEvent.id.slice(0, 12)}`,
      paid_at: new Date().toISOString(),
    },
  ];

  const { data: reservations, error: reservationsError } = await adminSupabase
    .from("reservations")
    .insert(reservationPayload)
    .select("id, event_id, promoter_id, prepayment_amount");

  if (reservationsError || !reservations || reservations.length === 0) {
    throw new Error("Impossible de créer les réservations démo");
  }

  const promoterReservation = reservations.find((reservation) => reservation.promoter_id);

  if (promoterReservation?.promoter_id) {
    await adminSupabase.from("commissions").upsert(
      {
        promoter_id: promoterReservation.promoter_id,
        reservation_id: promoterReservation.id,
        club_id: demoUsers.club.id,
        commission_rate: 10,
        nighttable_micro_rate: 1.5,
        base_amount: promoterReservation.prepayment_amount,
        club_commission_amount: 38,
        nighttable_commission_amount: 5.7,
        total_commission_amount: 43.7,
        amount: 43.7,
        rate: 10,
        status: "pending",
      },
      { onConflict: "reservation_id" }
    );

    await adminSupabase.from("promoter_clicks").insert({
      promoter_id: promoterReservation.promoter_id,
      promo_code: "DEMO01",
      converted: true,
      reservation_id: promoterReservation.id,
      source_url: "https://nighttable.app/reserve?promo=DEMO01",
    });
  }

  await adminSupabase.from("guest_lists").insert([
    {
      event_id: firstEvent.id,
      promoter_id: demoUsers.promoter1.id,
      guest_name: "Nina Robert",
      guest_phone: "+33644444444",
      status: "arrived",
      arrived_at: new Date().toISOString(),
    },
    {
      event_id: firstEvent.id,
      promoter_id: demoUsers.promoter1.id,
      guest_name: "Tom Leroy",
      guest_phone: "+33655555555",
      status: "pending",
    },
    {
      event_id: secondEvent.id,
      promoter_id: demoUsers.promoter2.id,
      guest_name: "Ines Fournier",
      guest_phone: "+33666666666",
      status: "pending",
    },
  ]);

  await adminSupabase.from("waitlist").insert([
    {
      client_id: demoUsers.client2.id,
      event_id: firstEvent.id,
      event_table_id: null,
      status: "pending",
    },
    {
      client_id: demoUsers.vip.id,
      event_id: secondEvent.id,
      event_table_id: null,
      status: "notified",
      notified_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  ]);

  console.log("✅ Seed démo terminé");
  console.log("Comptes créés/confirmés:");
  console.log("- demo.club@nighttable.app / NighttableDemo!2026");
  console.log("- demo.promoter1@nighttable.app / NighttableDemo!2026");
  console.log("- demo.promoter2@nighttable.app / NighttableDemo!2026");
  console.log("- demo.client1@nighttable.app / NighttableDemo!2026");
  console.log("- demo.client2@nighttable.app / NighttableDemo!2026");
  console.log("- demo.vip@nighttable.app / NighttableDemo!2026");
}

run().catch((error) => {
  console.error("❌ Seed démo échoué", error instanceof Error ? error.message : error);
  process.exit(1);
});
