"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { normalizeRole } from "@/lib/auth";
import { getResendClient } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import { sendSMS } from "@/lib/twilio";

import type { ActionResult } from "@/types";

const updateVipProfileSchema = z.object({
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(30).optional(),
  instagramHandle: z.string().trim().max(80).optional(),
  avatarUrl: z.string().trim().url().optional(),
  emergencyContactName: z.string().trim().max(120).optional(),
  emergencyContactPhone: z.string().trim().max(40).optional(),
  rgpdConsent: z.boolean(),
});

const invitationActionSchema = z.object({
  invitationId: z.string().uuid(),
});

const validateVipSchema = z.object({
  vipId: z.string().uuid(),
  status: z.enum(["validated", "rejected"]),
});

const createInvitationSchema = z.object({
  vipId: z.string().uuid(),
  reservationId: z.string().uuid(),
});

const reportIncidentSchema = z.object({
  message: z.string().trim().min(5).max(1000),
});

const toggleVipPromoSchema = z.object({
  eventId: z.string().uuid(),
  enabled: z.boolean(),
});

function sanitizeText(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/[<>]/g, "").trim();
}

type GuardResult = {
  userId: string;
  role: ReturnType<typeof normalizeRole>;
};

async function getAuthGuard(): Promise<ActionResult<GuardResult>> {
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

  return {
    success: true,
    data: {
      userId: user.id,
      role: normalizeRole(profile.role),
    },
  };
}

async function getVipProfileData(vipId: string): Promise<{
  firstName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("female_vip_profiles")
    .select("first_name, emergency_contact_name, emergency_contact_phone")
    .eq("id", vipId)
    .maybeSingle();

  return {
    firstName: data?.first_name ?? "Une VIP",
    emergencyContactName: data?.emergency_contact_name ?? "Contact de confiance",
    emergencyContactPhone: data?.emergency_contact_phone ?? "",
  };
}

export async function updateVipProfileAction(
  formData: FormData
): Promise<ActionResult<{ profileId: string }>> {
  try {
    const parsed = updateVipProfileSchema.safeParse({
      firstName: sanitizeText(formData.get("first_name")) || undefined,
      lastName: sanitizeText(formData.get("last_name")) || undefined,
      phone: sanitizeText(formData.get("phone")) || undefined,
      instagramHandle: sanitizeText(formData.get("instagram_handle")) || undefined,
      avatarUrl: sanitizeText(formData.get("avatar_url")) || undefined,
      emergencyContactName: sanitizeText(formData.get("emergency_contact_name")) || undefined,
      emergencyContactPhone: sanitizeText(formData.get("emergency_contact_phone")) || undefined,
      rgpdConsent: String(formData.get("rgpd_consent") ?? "") === "on",
    });

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
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
    if (role !== "female_vip" && role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const payload = {
      first_name: parsed.data.firstName ?? null,
      last_name: parsed.data.lastName ?? null,
      phone: parsed.data.phone ?? null,
      instagram_handle: parsed.data.instagramHandle ?? null,
      avatar_url: parsed.data.avatarUrl ?? null,
      emergency_contact_name: parsed.data.emergencyContactName ?? null,
      emergency_contact_phone: parsed.data.emergencyContactPhone ?? null,
      rgpd_consent_at: parsed.data.rgpdConsent ? new Date().toISOString() : null,
    };

    const { data: updatedProfile, error: updateError } = await supabase
      .from("female_vip_profiles")
      .update(payload)
      .eq("id", user.id)
      .select("id")
      .single();

    if (updateError || !updatedProfile) {
      console.error("[updateVipProfileAction]", updateError);
      return { success: false, error: "Impossible de mettre à jour le profil" };
    }

    revalidatePath("/dashboard/vip");
    revalidatePath("/dashboard/vip/profile");

    return {
      success: true,
      data: {
        profileId: updatedProfile.id,
      },
    };
  } catch (error) {
    console.error("[updateVipProfileAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function acceptInvitationAction(
  invitationId: string
): Promise<ActionResult<{ invitationId: string }>> {
  try {
    const parsed = invitationActionSchema.safeParse({ invitationId });
    if (!parsed.success) {
      return { success: false, error: "Invitation invalide" };
    }

    const guard = await getAuthGuard();
    if (!guard.success || !guard.data) {
      return { success: false, error: guard.error ?? "Non autorisé" };
    }

    if (guard.data.role !== "female_vip" && guard.data.role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vip_invitations")
      .update({
        status: "accepted",
        responded_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.invitationId)
      .eq("vip_id", guard.data.userId)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return { success: false, error: "Impossible d'accepter cette invitation" };
    }

    revalidatePath("/dashboard/vip");
    revalidatePath("/dashboard/vip/invitations");

    return { success: true, data: { invitationId: data.id } };
  } catch (error) {
    console.error("[acceptInvitationAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function declineInvitationAction(
  invitationId: string
): Promise<ActionResult<{ invitationId: string }>> {
  try {
    const parsed = invitationActionSchema.safeParse({ invitationId });
    if (!parsed.success) {
      return { success: false, error: "Invitation invalide" };
    }

    const guard = await getAuthGuard();
    if (!guard.success || !guard.data) {
      return { success: false, error: guard.error ?? "Non autorisé" };
    }

    if (guard.data.role !== "female_vip" && guard.data.role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vip_invitations")
      .update({
        status: "declined",
        responded_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.invitationId)
      .eq("vip_id", guard.data.userId)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return { success: false, error: "Impossible de décliner cette invitation" };
    }

    revalidatePath("/dashboard/vip");
    revalidatePath("/dashboard/vip/invitations");

    return { success: true, data: { invitationId: data.id } };
  } catch (error) {
    console.error("[declineInvitationAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function activateSafetyAction(): Promise<ActionResult<{ checkinId: string }>> {
  try {
    const guard = await getAuthGuard();
    if (!guard.success || !guard.data) {
      return { success: false, error: guard.error ?? "Non autorisé" };
    }

    if (guard.data.role !== "female_vip" && guard.data.role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const supabase = await createClient();
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);

    const { data: checkins } = await supabase
      .from("vip_safety_checkins")
      .select("checkin_type, created_at")
      .eq("vip_id", guard.data.userId)
      .gte("created_at", dayStart.toISOString())
      .order("created_at", { ascending: true });

    let isActive = false;
    for (const checkin of checkins ?? []) {
      if (checkin.checkin_type === "arrived") {
        isActive = true;
      }

      if (checkin.checkin_type === "departed") {
        isActive = false;
      }
    }

    if (isActive) {
      return { success: false, error: "Le suivi est déjà actif" };
    }

    const { data: insertedCheckin, error: insertError } = await supabase
      .from("vip_safety_checkins")
      .insert({
        vip_id: guard.data.userId,
        reservation_id: null,
        checkin_type: "arrived",
      })
      .select("id")
      .single();

    if (insertError || !insertedCheckin) {
      return { success: false, error: "Impossible d'activer le suivi" };
    }

    const vipProfile = await getVipProfileData(guard.data.userId);
    if (vipProfile.emergencyContactPhone) {
      await sendSMS({
        to: vipProfile.emergencyContactPhone,
        body: `${vipProfile.firstName} a activé son suivi NightTable ce soir. Elle vous préviendra à son retour.`,
      });
    }

    revalidatePath("/dashboard/vip/safety");

    return {
      success: true,
      data: { checkinId: insertedCheckin.id },
    };
  } catch (error) {
    console.error("[activateSafetyAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function confirmDepartureAction(): Promise<ActionResult<{ checkinId: string }>> {
  try {
    const guard = await getAuthGuard();
    if (!guard.success || !guard.data) {
      return { success: false, error: guard.error ?? "Non autorisé" };
    }

    if (guard.data.role !== "female_vip" && guard.data.role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const supabase = await createClient();
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);

    const { data: checkins } = await supabase
      .from("vip_safety_checkins")
      .select("checkin_type, created_at")
      .eq("vip_id", guard.data.userId)
      .gte("created_at", dayStart.toISOString())
      .order("created_at", { ascending: true });

    let isActive = false;
    for (const checkin of checkins ?? []) {
      if (checkin.checkin_type === "arrived") {
        isActive = true;
      }

      if (checkin.checkin_type === "departed") {
        isActive = false;
      }
    }

    if (!isActive) {
      return { success: false, error: "Aucun suivi actif pour ce soir" };
    }

    const { data: insertedCheckin, error: insertError } = await supabase
      .from("vip_safety_checkins")
      .insert({
        vip_id: guard.data.userId,
        reservation_id: null,
        checkin_type: "departed",
      })
      .select("id, created_at")
      .single();

    if (insertError || !insertedCheckin) {
      return { success: false, error: "Impossible de confirmer votre retour" };
    }

    const vipProfile = await getVipProfileData(guard.data.userId);
    if (vipProfile.emergencyContactPhone) {
      const departureHour = new Date(insertedCheckin.created_at).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      await sendSMS({
        to: vipProfile.emergencyContactPhone,
        body: `${vipProfile.firstName} est bien rentrée à ${departureHour}. Bonne nuit !`,
      });
    }

    revalidatePath("/dashboard/vip/safety");

    return {
      success: true,
      data: { checkinId: insertedCheckin.id },
    };
  } catch (error) {
    console.error("[confirmDepartureAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function reportIncidentAction(message: string): Promise<ActionResult<{ sent: true }>> {
  try {
    const parsed = reportIncidentSchema.safeParse({ message: message.replace(/[<>]/g, "").trim() });
    if (!parsed.success) {
      return { success: false, error: "Message invalide" };
    }

    const guard = await getAuthGuard();
    if (!guard.success || !guard.data) {
      return { success: false, error: guard.error ?? "Non autorisé" };
    }

    if (guard.data.role !== "female_vip" && guard.data.role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const vipProfile = await getVipProfileData(guard.data.userId);

    if (vipProfile.emergencyContactPhone) {
      await sendSMS({
        to: vipProfile.emergencyContactPhone,
        body: `Alerte NightTable de ${vipProfile.firstName}: ${parsed.data.message}`,
      });
    }

    try {
      const resend = getResendClient();
      await resend.emails.send({
        from: "NightTable <no-reply@nighttable.app>",
        to: "contact@nighttable.fr",
        subject: "Incident sécurité VIP",
        html: `
          <div style="font-family:Inter,sans-serif;background:#0A0F2E;color:#F7F6F3;padding:24px;border-radius:12px;">
            <h1 style="color:#C4567A;margin:0 0 10px;">Signalement incident VIP</h1>
            <p><strong>VIP:</strong> ${vipProfile.firstName}</p>
            <p><strong>Contact de confiance:</strong> ${vipProfile.emergencyContactName}</p>
            <p><strong>Téléphone contact:</strong> ${vipProfile.emergencyContactPhone || "Non renseigné"}</p>
            <p><strong>Message:</strong> ${parsed.data.message}</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("[reportIncidentAction] email", emailError);
      return { success: false, error: "Impossible d'envoyer le signalement" };
    }

    revalidatePath("/dashboard/vip/safety");

    return { success: true, data: { sent: true } };
  } catch (error) {
    console.error("[reportIncidentAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function validateVipProfileAction(
  vipId: string,
  status: "validated" | "rejected"
): Promise<ActionResult<{ vipId: string }>> {
  try {
    const parsed = validateVipSchema.safeParse({ vipId, status });
    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const guard = await getAuthGuard();
    if (!guard.success || !guard.data) {
      return { success: false, error: guard.error ?? "Non autorisé" };
    }

    if (guard.data.role !== "club" && guard.data.role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const supabase = await createClient();
    const { data: vipProfile, error: vipProfileError } = await supabase
      .from("female_vip_profiles")
      .select("id, validated_clubs")
      .eq("id", parsed.data.vipId)
      .maybeSingle();

    if (vipProfileError || !vipProfile) {
      return { success: false, error: "Profil VIP introuvable" };
    }

    const validatedClubs = Array.isArray(vipProfile.validated_clubs)
      ? (vipProfile.validated_clubs as string[])
      : [];

    const nextValidatedClubs =
      guard.data.role === "club" && parsed.data.status === "validated"
        ? Array.from(new Set([...validatedClubs, guard.data.userId]))
        : validatedClubs;

    const { data: updatedProfile, error: updateError } = await supabase
      .from("female_vip_profiles")
      .update({
        validation_status: parsed.data.status,
        validated_at: parsed.data.status === "validated" ? new Date().toISOString() : null,
        validated_clubs: nextValidatedClubs,
      })
      .eq("id", parsed.data.vipId)
      .select("id")
      .single();

    if (updateError || !updatedProfile) {
      return { success: false, error: "Impossible de mettre à jour ce profil" };
    }

    const { data: vipUser } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", parsed.data.vipId)
      .maybeSingle();

    if (vipUser?.email && guard.data.role === "club") {
      const { data: clubProfile } = await supabase
        .from("club_profiles")
        .select("club_name")
        .eq("id", guard.data.userId)
        .maybeSingle();

      try {
        const resend = getResendClient();
        await resend.emails.send({
          from: "NightTable <no-reply@nighttable.app>",
          to: vipUser.email,
          subject: "Mise à jour de votre profil VIP",
          html: `
            <div style="font-family:Inter,sans-serif;background:#0A0F2E;color:#F7F6F3;padding:24px;border-radius:12px;">
              <h1 style="color:#C4567A;margin:0 0 10px;">Profil VIP ${parsed.data.status === "validated" ? "validé" : "refusé"}</h1>
              <p>Votre profil a été ${parsed.data.status === "validated" ? "validé" : "refusé"} par ${clubProfile?.club_name ?? "un club partenaire"}.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("[validateVipProfileAction] email", emailError);
      }
    }

    revalidatePath("/dashboard/club/vip");
    revalidatePath("/dashboard/vip");

    return { success: true, data: { vipId: updatedProfile.id } };
  } catch (error) {
    console.error("[validateVipProfileAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function createVipInvitationAction(
  vipId: string,
  reservationId: string
): Promise<ActionResult<{ invitationId: string }>> {
  try {
    const parsed = createInvitationSchema.safeParse({ vipId, reservationId });
    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const guard = await getAuthGuard();
    if (!guard.success || !guard.data) {
      return { success: false, error: guard.error ?? "Non autorisé" };
    }

    if (guard.data.role !== "club" && guard.data.role !== "promoter" && guard.data.role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const supabase = await createClient();
    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .select("id, event_id, promoter_id")
      .eq("id", parsed.data.reservationId)
      .maybeSingle();

    if (reservationError || !reservation) {
      return { success: false, error: "Réservation introuvable" };
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, club_id")
      .eq("id", reservation.event_id)
      .maybeSingle();

    if (eventError || !event) {
      return { success: false, error: "Événement introuvable" };
    }

    if (guard.data.role === "club" && event.club_id !== guard.data.userId) {
      return { success: false, error: "Réservation hors périmètre club" };
    }

    if (guard.data.role === "promoter" && reservation.promoter_id !== guard.data.userId) {
      return { success: false, error: "Réservation hors périmètre promoteur" };
    }

    const { data: invitation, error: invitationError } = await supabase
      .from("vip_invitations")
      .insert({
        reservation_id: parsed.data.reservationId,
        vip_id: parsed.data.vipId,
        invited_by: guard.data.userId,
        status: "pending",
      })
      .select("id")
      .single();

    if (invitationError || !invitation) {
      return { success: false, error: "Impossible de créer cette invitation" };
    }

    revalidatePath("/dashboard/club/vip");
    revalidatePath("/dashboard/vip/invitations");

    return { success: true, data: { invitationId: invitation.id } };
  } catch (error) {
    console.error("[createVipInvitationAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

export async function toggleVipPromoForEventAction(
  eventId: string,
  enabled: boolean
): Promise<ActionResult<{ eventId: string }>> {
  try {
    const parsed = toggleVipPromoSchema.safeParse({ eventId, enabled });
    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const guard = await getAuthGuard();
    if (!guard.success || !guard.data) {
      return { success: false, error: guard.error ?? "Non autorisé" };
    }

    if (guard.data.role !== "club" && guard.data.role !== "admin") {
      return { success: false, error: "Accès refusé" };
    }

    const supabase = await createClient();
    const query = supabase
      .from("events")
      .update({ is_vip_promo_active: parsed.data.enabled })
      .eq("id", parsed.data.eventId);

    const { error } =
      guard.data.role === "club"
        ? await query.eq("club_id", guard.data.userId)
        : await query;

    if (error) {
      return { success: false, error: "Impossible de modifier la promo VIP" };
    }

    revalidatePath("/dashboard/club/vip");

    return { success: true, data: { eventId: parsed.data.eventId } };
  } catch (error) {
    console.error("[toggleVipPromoForEventAction]", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}
