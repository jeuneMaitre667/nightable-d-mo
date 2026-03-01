"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole } from "@/lib/auth";

import type { ActionResult } from "@/types";

type CreateEventInput = {
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  djLineup: string[];
  dressCode?: string;
  description?: string;
  coverUrl?: string;
  isVipPromoActive: boolean;
  isAuction: boolean;
  notoriety: number;
};

type CreateTableInput = {
  name: string;
  capacity: number;
  basePrice: number;
  zone: "dancefloor" | "vip" | "loge" | "terrasse";
  isPromo: boolean;
};

type TablePositionInput = {
  id: string;
  positionX: number;
  positionY: number;
};

const createEventSchema = z.object({
  title: z.string().trim().min(2),
  date: z.string().trim().min(1),
  startTime: z.string().trim().min(1),
  endTime: z.string().trim().optional(),
  djLineup: z.array(z.string().trim().min(1)).default([]),
  dressCode: z.string().trim().optional(),
  description: z.string().trim().optional(),
  coverUrl: z.string().trim().url().optional(),
  isVipPromoActive: z.boolean(),
  isAuction: z.boolean(),
  notoriety: z.number().min(1).max(2.5),
});

const createTableSchema = z.object({
  name: z.string().trim().min(1),
  capacity: z.number().int().positive(),
  basePrice: z.number().positive(),
  zone: z.enum(["dancefloor", "vip", "loge", "terrasse"]),
  isPromo: z.boolean(),
});

const tablePositionSchema = z.object({
  id: z.string().uuid(),
  positionX: z.number(),
  positionY: z.number(),
});

async function getClubGuard(): Promise<ActionResult<{ clubId: string }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Session invalide." };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return { success: false, error: "Profil introuvable." };
    }

    const role = normalizeRole(profile.role);
    if (role !== "club" && role !== "admin") {
      return { success: false, error: "Action non autorisée." };
    }

    return { success: true, data: { clubId: user.id } };
  } catch {
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }
}

export async function createEventAction(
  input: CreateEventInput
): Promise<ActionResult<{ eventId: string; redirectTo: string }>> {
  const parsed = createEventSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Formulaire événement invalide." };
  }

  const clubGuard = await getClubGuard();
  if (!clubGuard.success || !clubGuard.data) {
    return { success: false, error: clubGuard.error ?? "Action non autorisée." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .insert({
        club_id: clubGuard.data.clubId,
        title: parsed.data.title,
        date: parsed.data.date,
        start_time: parsed.data.startTime,
        end_time: parsed.data.endTime || null,
        dj_lineup: parsed.data.djLineup,
        dress_code: parsed.data.dressCode || null,
        description: parsed.data.description || null,
        cover_url: parsed.data.coverUrl || null,
        is_vip_promo_active: parsed.data.isVipPromoActive,
        is_auction: parsed.data.isAuction,
        notoriety: parsed.data.notoriety,
        status: "draft",
      })
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: "Impossible de créer l'événement pour le moment." };
    }

    revalidatePath("/dashboard/club/events");
    revalidatePath("/dashboard/club");

    return {
      success: true,
      data: {
        eventId: data.id,
        redirectTo: "/dashboard/club/events",
      },
    };
  } catch {
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }
}

export async function createTableAction(
  input: CreateTableInput
): Promise<ActionResult<{ tableId: string }>> {
  const parsed = createTableSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Formulaire table invalide." };
  }

  const clubGuard = await getClubGuard();
  if (!clubGuard.success || !clubGuard.data) {
    return { success: false, error: clubGuard.error ?? "Action non autorisée." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tables")
      .insert({
        club_id: clubGuard.data.clubId,
        name: parsed.data.name,
        capacity: parsed.data.capacity,
        base_price: parsed.data.basePrice,
        zone: parsed.data.zone,
        is_promo: parsed.data.isPromo,
        is_active: true,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: "Impossible d'ajouter la table pour le moment." };
    }

    revalidatePath("/dashboard/club/tables");

    return {
      success: true,
      data: {
        tableId: data.id,
      },
    };
  } catch {
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }
}

export async function updateTablePositionAction(
  positions: TablePositionInput[]
): Promise<ActionResult<{ updatedCount: number }>> {
  const parsed = z.array(tablePositionSchema).safeParse(positions);
  if (!parsed.success) {
    return { success: false, error: "Positions invalides." };
  }

  const clubGuard = await getClubGuard();
  if (!clubGuard.success || !clubGuard.data) {
    return { success: false, error: clubGuard.error ?? "Action non autorisée." };
  }

  try {
    const supabase = await createClient();

    for (const item of parsed.data) {
      const { error } = await supabase
        .from("tables")
        .update({
          x_position: item.positionX,
          y_position: item.positionY,
        })
        .eq("id", item.id)
        .eq("club_id", clubGuard.data.clubId);

      if (error) {
        return { success: false, error: "Impossible de sauvegarder les positions des tables." };
      }
    }

    revalidatePath("/dashboard/club/tables");

    return {
      success: true,
      data: {
        updatedCount: parsed.data.length,
      },
    };
  } catch {
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }
}
