"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import { useMemo, useState, useTransition } from "react";
import { loginAction, logoutAction, registerClubAction } from "@/lib/auth.actions";

import type { FormEvent, ReactElement } from "react";

type AuthTab = "login" | "register";

export function ClubAuthClient(): ReactElement {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const title = useMemo(() => {
    return activeTab === "login" ? "Connexion club" : "Inscription club";
  }, [activeTab]);

  function onLoginSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrorMessage(null);

    startTransition(async () => {
      const result = await loginAction(formData);
      const redirectTo = result.data?.redirectTo ?? "";

      if (!result.success || !redirectTo) {
        setErrorMessage(result.error ?? "Connexion impossible pour le moment.");
        return;
      }

      if (!redirectTo.startsWith("/dashboard/club")) {
        await logoutAction();
        setErrorMessage("Cet espace est réservé aux comptes club.");
        return;
      }

      router.push(redirectTo);
    });
  }

  function onRegisterSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "").trim();
    const clubName = String(formData.get("clubName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    startTransition(async () => {
      const result = await registerClubAction({
        email,
        password,
        clubName,
        phone: phone || undefined,
      });

      if (!result.success || !result.data?.redirectTo) {
        setErrorMessage(result.error ?? "Inscription club impossible.");
        return;
      }

      router.push(result.data.redirectTo);
    });
  }

  return (
    <main className="min-h-screen bg-[#050508] px-6 py-12 text-[#F7F6F3] md:py-16">
      <div className="mx-auto w-full max-w-md rounded-xl border border-[#C9973A]/15 bg-[#0A0F2E] p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Espace dédié</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#888888]">
          Cette page est réservée aux clubs partenaires NightTable.
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-[6px] border border-[#C9973A]/20 bg-[#050508] p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setErrorMessage(null);
            }}
            className={[
              "min-h-11 rounded-[4px] text-sm font-semibold transition-all duration-150",
              activeTab === "login" ? "bg-[#C9973A] text-[#050508]" : "text-[#F7F6F3]",
            ].join(" ")}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setErrorMessage(null);
            }}
            className={[
              "min-h-11 rounded-[4px] text-sm font-semibold transition-all duration-150",
              activeTab === "register" ? "bg-[#C9973A] text-[#050508]" : "text-[#F7F6F3]",
            ].join(" ")}
          >
            Inscription
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-[8px] border border-[#C4567A]/45 bg-[#C4567A]/12 px-3 py-2 text-sm text-[#F7F6F3]">
            {errorMessage}
          </p>
        ) : null}

        {activeTab === "login" ? (
          <form onSubmit={onLoginSubmit} className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Email</span>
              <input
                type="email"
                name="email"
                required
                disabled={isPending}
                className="h-12 w-full rounded-[6px] border border-[#2A2F4A] bg-[#050508] px-3 text-[15px] text-[#F7F6F3] outline-none transition-all duration-150 placeholder:text-[#888888]"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Mot de passe</span>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  name="password"
                  required
                  disabled={isPending}
                  className="h-12 w-full rounded-[6px] border border-[#2A2F4A] bg-[#050508] px-3 pr-12 text-[15px] text-[#F7F6F3] outline-none transition-all duration-150 placeholder:text-[#888888]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#888888] transition-all duration-150 hover:text-[#F7F6F3]"
                  aria-label={showLoginPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showLoginPassword ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            <Button
              type="submit"
              fullWidth
              isLoading={isPending}
              className="h-12 rounded-[2px] bg-[#C9973A] text-sm font-semibold uppercase tracking-[0.08em] text-[#050508]"
            >
              Se connecter
            </Button>
          </form>
        ) : (
          <form onSubmit={onRegisterSubmit} className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Nom du club</span>
              <input
                type="text"
                name="clubName"
                required
                disabled={isPending}
                className="h-12 w-full rounded-[6px] border border-[#2A2F4A] bg-[#050508] px-3 text-[15px] text-[#F7F6F3] outline-none transition-all duration-150 placeholder:text-[#888888]"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Email</span>
              <input
                type="email"
                name="email"
                required
                disabled={isPending}
                className="h-12 w-full rounded-[6px] border border-[#2A2F4A] bg-[#050508] px-3 text-[15px] text-[#F7F6F3] outline-none transition-all duration-150 placeholder:text-[#888888]"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Téléphone</span>
              <input
                type="tel"
                name="phone"
                disabled={isPending}
                className="h-12 w-full rounded-[6px] border border-[#2A2F4A] bg-[#050508] px-3 text-[15px] text-[#F7F6F3] outline-none transition-all duration-150 placeholder:text-[#888888]"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Mot de passe</span>
              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  name="password"
                  required
                  disabled={isPending}
                  className="h-12 w-full rounded-[6px] border border-[#2A2F4A] bg-[#050508] px-3 pr-12 text-[15px] text-[#F7F6F3] outline-none transition-all duration-150 placeholder:text-[#888888]"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#888888] transition-all duration-150 hover:text-[#F7F6F3]"
                  aria-label={showRegisterPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showRegisterPassword ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            <Button
              type="submit"
              fullWidth
              isLoading={isPending}
              className="h-12 rounded-[2px] bg-[#C9973A] text-sm font-semibold uppercase tracking-[0.08em] text-[#050508]"
            >
              Créer un compte club
            </Button>
          </form>
        )}

        <div className="mt-6 border-t border-[#C9973A]/10 pt-4 text-sm text-[#888888]">
          Vous êtes client NightTable ?
          <Link href="/login" className="ml-2 text-[#C9973A] transition-colors duration-150 hover:text-[#E8C96A]">
            Accéder à la connexion utilisateur
          </Link>
        </div>
      </div>
    </main>
  );
}
