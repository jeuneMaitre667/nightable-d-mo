"use server";

import { z } from "zod";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import type {
  ActionResult,
  RegisterClientForm,
  RegisterClubForm,
  RegisterFemaleVipForm,
  RegisterPromoterForm,
  UserRole,
} from "@/types";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const registerClientSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(6).optional(),
});

const registerClubSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  clubName: z.string().trim().min(2),
  slug: z.string().trim().min(2).optional(),
  phone: z.string().trim().min(6).optional(),
  city: z.string().trim().min(2).optional(),
});

const registerPromoterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(6).optional(),
  instagramHandle: z.string().trim().min(2).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
});

const registerFemaleVipSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(6).optional(),
  instagramHandle: z.string().trim().min(2).optional(),
});

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function toFriendlyError(): string {
  return "Une erreur est survenue. Merci de réessayer.";
}

function buildPromoCode(firstName: string, userId: string): string {
  const base = firstName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4) || "NIGHT";
  const suffix = userId.replace(/-/g, "").slice(0, 4).toUpperCase();
  return `${base}${suffix}`;
}

async function waitForOwnProfileRow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  maxAttempts = 6,
  delayMs = 150
): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (data?.id) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return false;
}

async function upsertRoleProfile(
  userId: string,
  role: UserRole,
  payload: RegisterClientForm | RegisterClubForm | RegisterPromoterForm | RegisterFemaleVipForm,
  clubId?: string,
  accessToken?: string
): Promise<ActionResult<{ profileCreated: boolean }>> {
  const supabase = accessToken
    ? createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      )
    : await createClient();

  if (role === "client") {
    const clientPayload = payload as RegisterClientForm;
    const { error } = await supabase.from("client_profiles").upsert(
      {
        id: userId,
        first_name: clientPayload.firstName ?? null,
        last_name: clientPayload.lastName ?? null,
        phone: clientPayload.phone ?? null,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("[auth] client_profiles upsert failed", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return { success: false, error: "Impossible de créer le profil client." };
    }

    return { success: true, data: { profileCreated: true } };
  }

  if (role === "club") {
    const clubPayload = payload as RegisterClubForm;
    const { error } = await supabase.from("club_profiles").upsert(
      {
        id: userId,
        club_name: clubPayload.clubName,
        slug: clubPayload.slug ?? null,
        phone: clubPayload.phone ?? null,
        city: clubPayload.city ?? "Paris",
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("[auth] club_profiles upsert failed", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return { success: false, error: "Impossible de créer le profil club." };
    }

    return { success: true, data: { profileCreated: true } };
  }

  if (role === "promoter") {
    const promoterPayload = payload as RegisterPromoterForm;
    const { error } = await supabase.from("promoter_profiles").upsert(
      {
        id: userId,
        first_name: promoterPayload.firstName,
        last_name: promoterPayload.lastName ?? null,
        phone: promoterPayload.phone ?? null,
        instagram_handle: promoterPayload.instagramHandle ?? null,
        promo_code: buildPromoCode(promoterPayload.firstName, userId),
        commission_rate: promoterPayload.commissionRate ?? 8,
        club_id: clubId ?? null,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("[auth] promoter_profiles upsert failed", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return { success: false, error: "Impossible de créer le profil promoteur." };
    }

    return { success: true, data: { profileCreated: true } };
  }

  if (role === "female_vip") {
    const vipPayload = payload as RegisterFemaleVipForm;
    const { error } = await supabase.from("female_vip_profiles").upsert(
      {
        id: userId,
        first_name: vipPayload.firstName,
        last_name: vipPayload.lastName ?? null,
        phone: vipPayload.phone ?? null,
        instagram_handle: vipPayload.instagramHandle ?? null,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("[auth] female_vip_profiles upsert failed", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return { success: false, error: "Impossible de créer le profil Female VIP." };
    }

    return { success: true, data: { profileCreated: true } };
  }

  return { success: true, data: { profileCreated: false } };
}

async function registerWithRole<T extends RegisterClientForm | RegisterClubForm | RegisterPromoterForm | RegisterFemaleVipForm>(
  role: UserRole,
  payload: T,
  clubId?: string
): Promise<ActionResult<{ userId: string; role: UserRole; redirectTo: string }>> {
  try {
    const supabase = await createClient();
    const normalizedEmail = payload.email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: payload.password,
      options: {
        emailRedirectTo: `${getAppUrl()}/api/auth/callback`,
        data: { role },
      },
    });

    if (error || !data.user) {
      if (error) {
        console.error("[auth] signUp failed", {
          message: error.message,
          code: error.code,
          status: error.status,
        });
      }
      return { success: false, error: "Inscription impossible pour le moment." };
    }

    const dashboardPath = getDashboardPathByRole(role);

    const { data: sessionData } = await supabase.auth.getSession();
    let activeSession = data.session ?? sessionData.session ?? null;

    if (!activeSession) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: payload.password,
      });

      if (signInError) {
        console.error("[auth] signInWithPassword after signUp failed", {
          message: signInError.message,
          code: signInError.code,
          status: signInError.status,
        });
      }

      activeSession = signInData.session ?? null;
    }

    if (!activeSession) {
      return {
        success: true,
        data: {
          userId: data.user.id,
          role,
          redirectTo: `/verify?email=${encodeURIComponent(normalizedEmail)}`,
        },
      };
    }

    const ownProfileExists = await waitForOwnProfileRow(supabase, data.user.id);
    if (!ownProfileExists) {
      const sessionBoundSupabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        {
          global: {
            headers: {
              Authorization: `Bearer ${activeSession.access_token}`,
            },
          },
        }
      );

      const { error: profileError } = await sessionBoundSupabase.from("profiles").upsert(
        {
          id: data.user.id,
          email: normalizedEmail,
          role,
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.error("[auth] profiles upsert failed", {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
        });
        return { success: false, error: "Impossible de créer le profil utilisateur." };
      }
    }

    const roleProfileResult = await upsertRoleProfile(data.user.id, role, payload, clubId, activeSession.access_token);
    if (!roleProfileResult.success) {
      console.warn("[auth] role profile enrichment skipped", {
        role,
        error: roleProfileResult.error,
      });
    }

    return {
      success: true,
      data: {
        userId: data.user.id,
        role,
        redirectTo: dashboardPath,
      },
    };
  } catch {
    return { success: false, error: toFriendlyError() };
  }
}

export async function loginAction(formData: FormData): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const candidate = {
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      password: String(formData.get("password") ?? "").trim(),
    };

    const parsed = loginSchema.safeParse(candidate);
    if (!parsed.success) {
      return { success: false, error: "Email ou mot de passe invalide." };
    }

    const supabase = await createClient();
    const { data: signInData, error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error || !signInData.user) {
      return { success: false, error: "Identifiants invalides." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", signInData.user.id)
      .maybeSingle();

    const role = normalizeRole(profile?.role);

    return {
      success: true,
      data: {
        redirectTo: getDashboardPathByRole(role),
      },
    };
  } catch {
    return { success: false, error: toFriendlyError() };
  }
}

export async function registerClientAction(
  data: RegisterClientForm
): Promise<ActionResult<{ userId: string; role: UserRole; redirectTo: string }>> {
  const parsed = registerClientSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Formulaire client invalide." };
  }

  return registerWithRole("client", parsed.data);
}

export async function registerClubAction(
  data: RegisterClubForm
): Promise<ActionResult<{ userId: string; role: UserRole; redirectTo: string }>> {
  const parsed = registerClubSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Formulaire club invalide." };
  }

  return registerWithRole("club", parsed.data);
}

export async function registerPromoterAction(
  data: RegisterPromoterForm,
  clubId: string
): Promise<ActionResult<{ userId: string; role: UserRole; redirectTo: string }>> {
  const parsed = registerPromoterSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Formulaire promoteur invalide." };
  }

  if (!clubId) {
    return { success: false, error: "Club associé requis." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Session invalide." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || normalizeRole(profile.role) !== "club" || profile.id !== clubId) {
      return { success: false, error: "Action non autorisée." };
    }

    return registerWithRole("promoter", parsed.data, clubId);
  } catch {
    return { success: false, error: toFriendlyError() };
  }
}

export async function registerFemaleVipAction(
  data: RegisterFemaleVipForm
): Promise<ActionResult<{ userId: string; role: UserRole; redirectTo: string }>> {
  const parsed = registerFemaleVipSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Formulaire Female VIP invalide." };
  }

  return registerWithRole("female_vip", parsed.data);
}

export async function logoutAction(): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: "Déconnexion impossible pour le moment." };
    }

    return {
      success: true,
      data: {
        redirectTo: "/login",
      },
    };
  } catch {
    return { success: false, error: toFriendlyError() };
  }
}

export async function registerAction(formData: FormData): Promise<ActionResult<{ redirectTo: string }>> {
  const role = normalizeRole(String(formData.get("role") ?? "client"));
  const payload = {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? "").trim(),
  };

  let result: ActionResult<{ userId: string; role: UserRole; redirectTo: string }>;

  if (role === "club") {
    result = await registerClubAction({
      ...payload,
      clubName: "Club NightTable",
    });
  } else if (role === "promoter") {
    return { success: false, error: "Inscription promoteur réservée aux clubs." };
  } else if (role === "female_vip") {
    result = await registerFemaleVipAction({
      ...payload,
      firstName: "VIP",
    });
  } else {
    result = await registerClientAction(payload);
  }

  if (!result.success || !result.data) {
    return { success: false, error: result.error ?? "Inscription impossible." };
  }

  return {
    success: true,
    data: {
      redirectTo: result.data.redirectTo,
    },
  };
}

