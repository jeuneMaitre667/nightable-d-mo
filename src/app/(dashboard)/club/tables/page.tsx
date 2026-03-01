import { redirect } from "next/navigation";
import TablesClient from "./tablesClient";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole } from "@/lib/auth";

import type { ReactElement } from "react";

type ClubTableRow = {
  id: string;
  name: string;
  capacity: number;
  base_price: number;
  zone: string | null;
  x_position: number | null;
  y_position: number | null;
  is_promo: boolean;
};

export default async function ClubTablesPage(): Promise<ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);
  if (role !== "club" && role !== "admin") {
    redirect("/dashboard");
  }

  const { data: tables, error } = await supabase
    .from("tables")
    .select("id,name,capacity,base_price,zone,x_position,y_position,is_promo")
    .eq("club_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Impossible de charger les tables du club.");
  }

  return <TablesClient initialTables={(tables ?? []) as ClubTableRow[]} />;
}
