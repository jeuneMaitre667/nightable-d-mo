"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { normalizeRole } from "@/lib/auth";
import { getResendClient } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types";

type GuestStatus = "pending" | "arrived" | "no_show";

type PromoterGuardData = {
  userId: string;
  role: "promoter" | "admin";
  clubId: string | null;
};

type AddGuestInput = {
  eventId: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

const addGuestSchema = z.object({
  eventId: z.string().uuid(),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(6).max(30).optional(),
});

const markGuestArrivedSchema = z.object({
  guestId: z.string().uuid(),
});

const createPromoterSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(30).optional(),
  commissionRate: z.coerce.number().min(5).max(15),
});

const validateCommissionSchema = z.object({
  commissionId: z.string().uuid(),
});

function getAdminSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Configuration Supabase admin manquante");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function getPromoterGuard(): Promise<ActionResult<PromoterGuardData>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Non autorisé" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { success: false, error: "Profil introuvable" };
  }

  const role = normalizeRole(profile.role);
  if (role !== "promoter" && role !== "admin") {
    return { success: false, error: "Accès refusé" };
  }

  if (role === "admin") {
    return {
      success: true,
      data: {
        userId: user.id,
        role,
        clubId: null,
      },
    };
  }

  const { data: promoterProfile, error: promoterError } = await supabase
    .from("promoter_profiles")
    .select("club_id")
    .eq("id", user.id)
    .maybeSingle();

  if (promoterError || !promoterProfile) {
    return { success: false, error: "Profil promoteur introuvable" };
  }

  return {
    success: true,
    data: {
      userId: user.id,
      role,
      clubId: promoterProfile.club_id,
    },
  };
}

function buildGuestName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.replace(/\s+/g, " ").trim();
}

function generatePromoCode(): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let output = "";

  for (let index = 0; index < 6; index += 1) {
    output += characters[Math.floor(Math.random() * characters.length)];
  }

  return output;
}

async function generateUniquePromoCode(
  adminSupabase: SupabaseClient
): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const promoCode = generatePromoCode();
    const { data: existingPromoter } = await adminSupabase
      .from("promoter_profiles")
      .select("id")
      .eq("promo_code", promoCode)
      .maybeSingle();

    if (!existingPromoter) {
      return promoCode;
    }
  }

  return `NT${randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase()}`;
}

export async function addGuestListEntryAction(
  input: AddGuestInput
): Promise<ActionResult<{ guestId: string; status: GuestStatus }>> {
  try {
    const parsed = addGuestSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Données invité invalides" };
    }

    const guardResult = await getPromoterGuard();
    if (!guardResult.success || !guardResult.data) {
      return { success: false, error: guardResult.error ?? "Accès refusé" };
    }

    const supabase = await createClient();
    const promoterId = guardResult.data.userId;

    if (guardResult.data.clubId) {
      const { data: eventForPromoter } = await supabase
        .from("events")
        .select("id")
        .eq("id", parsed.data.eventId)
        .eq("club_id", guardResult.data.clubId)
        .gte("date", new Date().toISOString().slice(0, 10))
        .maybeSingle();

      if (!eventForPromoter) {
        return { success: false, error: "Événement non disponible pour ce promoteur" };
      }
    }

    const { data: insertedGuest, error: insertError } = await supabase
      .from("guest_lists")
      .insert({
        event_id: parsed.data.eventId,
        promoter_id: promoterId,
        guest_name: buildGuestName(parsed.data.firstName, parsed.data.lastName),
        guest_phone: parsed.data.phone ?? null,
        status: "pending",
      })
      .select("id, status")
      .single();

    if (insertError || !insertedGuest) {
      return { success: false, error: "Impossible d’ajouter cet invité" };
    }

    revalidatePath("/promoter/guestlist");
    revalidatePath("/dashboard/promoter/guestlist");
    revalidatePath("/dashboard/promoter");

    return {
      success: true,
      data: {
        guestId: insertedGuest.id,
        status: insertedGuest.status as GuestStatus,
      },
    };
  } catch (error) {
    console.error("[addGuestListEntryAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function markGuestArrivedAction(
  input: { guestId: string }
): Promise<ActionResult<{ guestId: string; status: GuestStatus }>> {
  try {
    const parsed = markGuestArrivedSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Invité invalide" };
    }

    const guardResult = await getPromoterGuard();
    if (!guardResult.success || !guardResult.data) {
      return { success: false, error: guardResult.error ?? "Accès refusé" };
    }

    const supabase = await createClient();
    const updatePayload = {
      status: "arrived",
      arrived_at: new Date().toISOString(),
    };

    const { data: updatedGuest, error: updateError } =
      guardResult.data.role === "admin"
        ? await supabase
            .from("guest_lists")
            .update(updatePayload)
            .eq("id", parsed.data.guestId)
            .select("id, status")
            .single()
        : await supabase
            .from("guest_lists")
            .update(updatePayload)
            .eq("id", parsed.data.guestId)
            .eq("promoter_id", guardResult.data.userId)
            .select("id, status")
            .single();

    if (updateError || !updatedGuest) {
      return { success: false, error: "Impossible de marquer l’invité comme arrivé" };
    }

    revalidatePath("/promoter/guestlist");
    revalidatePath("/dashboard/promoter/guestlist");
    revalidatePath("/dashboard/promoter");

    return {
      success: true,
      data: {
        guestId: updatedGuest.id,
        status: updatedGuest.status as GuestStatus,
      },
    };
  } catch (error) {
    console.error("[markGuestArrivedAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function createPromoterAction(
  formData: FormData
): Promise<ActionResult<{ promoterId: string; promoCode: string }>> {
  try {
    const parsed = createPromoterSchema.safeParse({
      firstName: formData.get("first_name"),
      lastName: formData.get("last_name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      commissionRate: formData.get("commission_rate"),
    });

    if (!parsed.success) {
      return { success: false, error: "Données promoteur invalides" };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Non autorisé" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return { success: false, error: "Profil introuvable" };
    }

    const role = normalizeRole(profile.role);
    if (role !== "club" && role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const clubId = user.id;
    const adminSupabase = getAdminSupabaseClient();
    const promoCode = await generateUniquePromoCode(adminSupabase);
    const temporaryPassword = `Nt!${randomUUID().replace(/-/g, "").slice(0, 14)}Aa1`;

    const { data: createdUser, error: createUserError } = await adminSupabase.auth.admin.createUser({
      email: parsed.data.email.toLowerCase(),
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        role: "promoter",
      },
    });

    if (createUserError || !createdUser.user) {
      return { success: false, error: "Impossible de créer le compte promoteur" };
    }

    const promoterId = createdUser.user.id;
    const { error: upsertError } = await adminSupabase.from("promoter_profiles").upsert(
      {
        id: promoterId,
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        phone: parsed.data.phone ?? null,
        club_id: clubId,
        promo_code: promoCode,
        commission_rate: parsed.data.commissionRate,
        is_active: true,
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      return { success: false, error: "Impossible d’enregistrer le profil promoteur" };
    }

    const trackedLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reserve?promo=${promoCode}`;

    try {
      const resend = getResendClient();
      await resend.emails.send({
        from: "NightTable <no-reply@nighttable.app>",
        to: parsed.data.email.toLowerCase(),
        subject: "Bienvenue sur NightTable",
        html: `
          <div style="font-family:Inter,sans-serif;background:#0A0F2E;color:#F7F6F3;padding:24px;border-radius:12px;">
            <h1 style="color:#C9973A;margin:0 0 8px;">Bienvenue ${parsed.data.firstName}</h1>
            <p>Votre compte promoteur est actif.</p>
            <p><strong>Code promo :</strong> ${promoCode}</p>
            <p><strong>Lien tracé :</strong> <a href="${trackedLink}" style="color:#E8C96A">${trackedLink}</a></p>
            <p>Pensez à réinitialiser votre mot de passe lors de votre première connexion.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("[createPromoterAction] welcome email", emailError);
    }

    revalidatePath("/club/promoters");
    revalidatePath("/dashboard/club/promoters");

    return {
      success: true,
      data: {
        promoterId,
        promoCode,
      },
    };
  } catch (error) {
    console.error("[createPromoterAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function validateCommissionAction(
  formData: FormData
): Promise<ActionResult<{ commissionId: string }>> {
  try {
    const parsed = validateCommissionSchema.safeParse({
      commissionId: formData.get("commission_id"),
    });

    if (!parsed.success) {
      return { success: false, error: "Commission invalide" };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Non autorisé" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return { success: false, error: "Profil introuvable" };
    }

    const role = normalizeRole(profile.role);
    if (role !== "club" && role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const { data: updatedCommission, error: updateError } =
      role === "admin"
        ? await supabase
            .from("commissions")
            .update({ status: "validated", validated_at: new Date().toISOString() })
            .eq("id", parsed.data.commissionId)
            .select("id")
            .single()
        : await supabase
            .from("commissions")
            .update({ status: "validated", validated_at: new Date().toISOString() })
            .eq("id", parsed.data.commissionId)
            .eq("club_id", user.id)
            .select("id")
            .single();

    if (updateError || !updatedCommission) {
      return { success: false, error: "Impossible de valider cette commission" };
    }

    revalidatePath("/club/promoters");
    revalidatePath("/dashboard/club/promoters");

    return {
      success: true,
      data: {
        commissionId: updatedCommission.id,
      },
    };
  } catch (error) {
    console.error("[validateCommissionAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function addGuestAction(formData: FormData): Promise<void> {
  const eventId = String(formData.get("event_id") ?? "").trim();
  const guestName = String(formData.get("guest_name") ?? "").trim();
  const guestPhone = String(formData.get("guest_phone") ?? "").trim();

  const [firstName = "", ...lastParts] = guestName.split(" ");
  const lastName = lastParts.join(" ").trim() || "Invité";

  const result = await addGuestListEntryAction({
    eventId,
    firstName: firstName || "Invité",
    lastName,
    phone: guestPhone || undefined,
  });

  if (!result.success) {
    redirect(`/dashboard/promoter?error=${encodeURIComponent(result.error ?? "Erreur")}`);
  }

  revalidatePath("/dashboard/promoter");
}

