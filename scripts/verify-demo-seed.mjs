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

async function run() {
  loadDotEnvLocal();

  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: club } = await supabase
    .from("club_profiles")
    .select("id, club_name")
    .eq("slug", "nighttable-demo-club")
    .maybeSingle();

  if (!club) {
    throw new Error("Club de démo introuvable");
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data: events } = await supabase
    .from("events")
    .select("id, title, date")
    .eq("club_id", club.id)
    .gte("date", today)
    .like("title", "DEMO ·%")
    .order("date", { ascending: true });

  const { data: tables } = await supabase
    .from("tables")
    .select("id, name")
    .eq("club_id", club.id)
    .in("name", ["DEMO-T1", "DEMO-T2", "DEMO-T3", "DEMO-T4", "DEMO-T5"]);

  const { data: tablesWithPosition, error: tablesPositionError } = await supabase
    .from("tables")
    .select("id, name, x_position, y_position")
    .eq("club_id", club.id)
    .in("name", ["DEMO-T1", "DEMO-T2", "DEMO-T3", "DEMO-T4", "DEMO-T5"]);

  const { data: promoters } = await supabase
    .from("promoter_profiles")
    .select("id, promo_code")
    .eq("club_id", club.id)
    .eq("is_active", true)
    .in("promo_code", ["DEMO01", "DEMO02"]);

  const eventIds = (events ?? []).map((eventItem) => eventItem.id);

  const { data: reservations } = await supabase
    .from("reservations")
    .select("id, status")
    .in(
      "event_id",
      eventIds.length > 0 ? eventIds : ["00000000-0000-0000-0000-000000000000"]
    );

  const { data: floorPlan, error: floorPlanError } = await supabase
    .from("floor_plans")
    .select("id, layout_json")
    .eq("club_id", club.id)
    .eq("name", "DEMO-FLOORPLAN")
    .maybeSingle();

  const tablePositionCount = (tablesWithPosition ?? []).filter(
    (tableItem) => tableItem.x_position !== null && tableItem.y_position !== null
  ).length;

  const floorPlanPositionCount = Array.isArray(floorPlan?.layout_json?.tables)
    ? floorPlan.layout_json.tables.length
    : 0;

  const positionCount = floorPlanPositionCount > 0 ? floorPlanPositionCount : tablePositionCount;

  const report = {
    club: {
      id: club.id,
      name: club.club_name,
    },
    checks: {
      oneClubConfigured: true,
      futureEventsCount: (events ?? []).length,
      demoTablesCount: (tables ?? []).length,
      promoterCount: (promoters ?? []).length,
      reservationsCount: (reservations ?? []).length,
      floorPlanPositionCount: positionCount,
      positionSource: floorPlanPositionCount > 0 ? "floor_plans.layout_json" : "tables.x_position/y_position",
      positionErrors: {
        floorPlan: floorPlanError?.message ?? null,
        tableColumns: tablesPositionError?.message ?? null,
      },
    },
    events: events ?? [],
    promoters: promoters ?? [],
  };

  console.log(JSON.stringify(report, null, 2));
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
