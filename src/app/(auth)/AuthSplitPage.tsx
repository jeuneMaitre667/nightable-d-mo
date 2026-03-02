"use client";

// Component: AuthSplitPage
// Reference: component.gallery/components/tabs + component.gallery/components/text-input
// Inspired by: Velvet Rope (Banani) split-auth pattern
// NightTable usage: shared login/register split-screen authentication UI

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Tab, Tabs } from "@heroui/react";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  loginAction,
  registerAction,
  registerClientAction,
  registerClubAction,
  registerFemaleVipAction,
} from "@/lib/auth.actions";

import type { FormEvent, ReactElement, ReactNode } from "react";

type AuthTab = "login" | "register";
type RegisterRole = "client" | "club" | "promoter" | "female_vip";

type RoleCard = {
  key: RegisterRole;
  icon: string;
  title: string;
  subtitle: string;
};

type AuthSplitPageProps = {
  initialTab: AuthTab;
};

const ROLE_CARDS: RoleCard[] = [
  {
    key: "client",
    icon: "👤",
    title: "Client",
    subtitle: "Je réserve",
  },
  {
    key: "club",
    icon: "🏢",
    title: "Club",
    subtitle: "Je gère mon club",
  },
  {
    key: "promoter",
    icon: "🔗",
    title: "Promoteur",
    subtitle: "J’amène des clients",
  },
  {
    key: "female_vip",
    icon: "⭐",
    title: "Femme VIP",
    subtitle: "Accès exclusif",
  },
];

function parseRole(value: string | null): RegisterRole {
  if (value === "club" || value === "promoter" || value === "female_vip") {
    return value;
  }

  return "client";
}

function roleCardClass(role: RegisterRole, selectedRole: RegisterRole): string {
  const isActive = role === selectedRole;
  const isVip = role === "female_vip";

  if (!isActive) {
    return "bg-[#0A0F2E] border border-[#2A2F4A]";
  }

  if (isVip) {
    return "border border-[#C4567A] bg-[#C4567A]/10";
  }

  return "border border-[#C9973A] bg-[#C9973A]/10";
}

function roleTextClass(role: RegisterRole, selectedRole: RegisterRole): string {
  if (role !== selectedRole) {
    return "text-[#F7F6F3]";
  }

  return role === "female_vip" ? "text-[#C4567A]" : "text-[#C9973A]";
}

function tabPanelClass(active: boolean): string {
  return [
    "transition-all duration-200 ease-in-out",
    active ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 opacity-0 translate-y-1",
  ].join(" ");
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }): ReactElement {
  return (
    <div>
      <h1 className="font-[Cormorant_Garamond] text-[40px] font-normal leading-[1.05] text-[#F7F6F3]">{title}</h1>
      <p className="mt-2 text-[14px] text-[#888888]">{subtitle}</p>
    </div>
  );
}

function ErrorBox({ children }: { children: ReactNode }): ReactElement {
  return (
    <p className="rounded-[8px] border border-[#C4567A]/45 bg-[#C4567A]/12 px-3 py-2 text-sm text-[#F7F6F3]">
      {children}
    </p>
  );
}

type AuthInputFieldProps = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "password";
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
};

function AuthInputField({
  name,
  label,
  type = "text",
  required,
  disabled,
  autoComplete,
}: AuthInputFieldProps): ReactElement {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-[6px] border border-[#2A2F4A] bg-[#0A0F2E] px-3 text-[15px] text-[#F7F6F3] [text-shadow:none] [-webkit-text-fill-color:#F7F6F3] outline-none ring-0 transition-all duration-150 ease-in-out placeholder:text-[#888888] focus:border-[#2A2F4A] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}

type AuthPasswordFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  showPassword: boolean;
  onToggle: () => void;
};

function AuthPasswordField({
  name,
  label,
  required,
  disabled,
  showPassword,
  onToggle,
}: AuthPasswordFieldProps): ReactElement {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">{label}</span>
      <div className="relative">
        <input
          name={name}
          type={showPassword ? "text" : "password"}
          required={required}
          disabled={disabled}
          autoComplete="current-password"
          className="h-11 w-full rounded-[6px] border border-[#2A2F4A] bg-[#0A0F2E] px-3 pr-12 text-[15px] text-[#F7F6F3] [text-shadow:none] [-webkit-text-fill-color:#F7F6F3] outline-none ring-0 transition-all duration-150 ease-in-out placeholder:text-[#888888] focus:border-[#2A2F4A] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#888888] transition-all duration-150 hover:text-[#F7F6F3]"
          onClick={onToggle}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>
    </label>
  );
}

export function AuthSplitPage({ initialTab }: AuthSplitPageProps): ReactElement {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [selectedRole, setSelectedRole] = useState<RegisterRole>(() => {
    if (typeof window === "undefined") {
      return "client";
    }

    const params = new URLSearchParams(window.location.search);
    return parseRole(params.get("role"));
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [queryError] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const params = new URLSearchParams(window.location.search);
    return params.get("error");
  });

  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState<boolean>(false);
  const [isLoginPending, startLoginTransition] = useTransition();
  const [isRegisterPending, startRegisterTransition] = useTransition();

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const visibleLoginError = useMemo(() => {
    if (activeTab !== "login") {
      return null;
    }

    return loginError ?? queryError;
  }, [activeTab, loginError, queryError]);

  const visibleRegisterError = useMemo(() => {
    if (activeTab !== "register") {
      return null;
    }

    return registerError ?? queryError;
  }, [activeTab, registerError, queryError]);

  function onLoginSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoginError(null);

    startLoginTransition(async () => {
      const result = await loginAction(formData);

      if (!result.success || !result.data?.redirectTo) {
        setLoginError(result.error ?? "Connexion impossible pour le moment.");
        return;
      }

      router.push(result.data.redirectTo);
    });
  }

  function onRegisterSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setRegisterError(null);
    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "").trim();
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const establishmentName = String(formData.get("establishmentName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    startRegisterTransition(async () => {
      if (selectedRole === "club") {
        const result = await registerClubAction({
          email,
          password,
          clubName: establishmentName,
          phone: phone || undefined,
        });

        if (!result.success || !result.data?.redirectTo) {
          setRegisterError(result.error ?? "Inscription club impossible.");
          return;
        }

        router.push(result.data.redirectTo);
        return;
      }

      if (selectedRole === "female_vip") {
        const result = await registerFemaleVipAction({
          email,
          password,
          firstName,
          lastName: lastName || undefined,
        });

        if (!result.success || !result.data?.redirectTo) {
          setRegisterError(result.error ?? "Inscription Femme VIP impossible.");
          return;
        }

        router.push(result.data.redirectTo);
        return;
      }

      if (selectedRole === "promoter") {
        formData.set("role", "promoter");
        const result = await registerAction(formData);

        if (!result.success || !result.data?.redirectTo) {
          setRegisterError(result.error ?? "Inscription promoteur impossible.");
          return;
        }

        router.push(result.data.redirectTo);
        return;
      }

      const result = await registerClientAction({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      if (!result.success || !result.data?.redirectTo) {
        setRegisterError(result.error ?? "Inscription client impossible.");
        return;
      }

      router.push(result.data.redirectTo);
    });
  }

  return (
    <main className="min-h-[100dvh] overflow-y-auto bg-[#050508] text-[#F7F6F3] md:h-screen md:overflow-hidden">
      <div className="grid min-h-[100dvh] w-full md:h-full md:grid-cols-[60%_40%]">
        <section className="relative hidden h-screen md:block">
          <Image
            src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67"
            alt="Ambiance nightclub parisien"
            fill
            priority
            className="object-cover"
            sizes="60vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,8,0.3)_0%,rgba(5,5,8,0.85)_100%),linear-gradient(to_top,rgba(5,5,8,0.9)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 left-0 p-12">
            <p className="font-[Cormorant_Garamond] text-[56px] font-light leading-[0.98] text-[#F7F6F3]">
              L’expérience nocturne
              <br />
              parisienne.
            </p>
          </div>
        </section>

        <section className="flex min-h-[100dvh] items-start justify-center bg-[#050508] px-6 py-8 md:h-screen md:items-center md:p-12">
          <div
            className={[
              "w-full max-w-[380px] transition-all duration-[400ms] ease-out",
              isMounted ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
            ].join(" ")}
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-[Cormorant_Garamond] text-[28px] leading-none text-[#C9973A]">NT</p>
                <p className="text-[14px] text-[#F7F6F3]">NightTable</p>
              </div>

              <Tabs
                selectedKey={activeTab}
                color="primary"
                variant="underlined"
                className="mt-6"
                onSelectionChange={(key) => {
                  setActiveTab(String(key) as AuthTab);
                  setLoginError(null);
                  setRegisterError(null);
                }}
              >
                <Tab key="login" title="Connexion" />
                <Tab key="register" title="Inscription" />
              </Tabs>
            </div>

            <div className="relative mt-6">
              <div className={tabPanelClass(activeTab === "login")}>
                <SectionTitle
                  title="Bon retour."
                  subtitle="Connectez-vous pour gérer vos réservations."
                />

                {visibleLoginError ? <ErrorBox>{visibleLoginError}</ErrorBox> : null}

                <form onSubmit={onLoginSubmit} className="mt-8 space-y-4">
                  <AuthInputField
                    name="email"
                    type="email"
                    label="Adresse e-mail"
                    required
                    disabled={isLoginPending}
                    autoComplete="email"
                  />

                  <div className="flex justify-end">
                    <a href="#" className="text-right text-xs text-[#C9973A] transition-all duration-150 hover:underline">
                      Mot de passe oublié ?
                    </a>
                  </div>

                  <AuthPasswordField
                    name="password"
                    label="Mot de passe"
                    required
                    disabled={isLoginPending}
                    showPassword={showLoginPassword}
                    onToggle={() => setShowLoginPassword((current) => !current)}
                  />

                  <Button
                    type="submit"
                    color="default"
                    radius="none"
                    fullWidth
                    isLoading={isLoginPending}
                    className="mt-6 h-12 border border-[#C9973A]/50 bg-[#C9973A] uppercase tracking-widest text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508]"
                  >
                    Se connecter
                  </Button>
                </form>
              </div>

              <div className={tabPanelClass(activeTab === "register")}>
                <SectionTitle
                  title="Rejoignez NightTable."
                  subtitle="Choisissez votre profil."
                />

                {visibleRegisterError ? <ErrorBox>{visibleRegisterError}</ErrorBox> : null}

                <form onSubmit={onRegisterSubmit} className="mt-8 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {ROLE_CARDS.map((roleCard) => {
                      const cardClassName = roleCardClass(roleCard.key, selectedRole);
                      const textClassName = roleTextClass(roleCard.key, selectedRole);

                      return (
                        <button
                          key={roleCard.key}
                          type="button"
                          className={[
                            "rounded-lg p-3 text-center transition-all duration-150 ease-in-out",
                            "cursor-pointer active:scale-[0.97]",
                            cardClassName,
                          ].join(" ")}
                          onClick={() => setSelectedRole(roleCard.key)}
                        >
                          <p className={`text-base ${textClassName}`}>{roleCard.icon}</p>
                          <p className={`mt-1 text-xs font-semibold uppercase tracking-[0.08em] ${textClassName}`}>
                            {roleCard.title}
                          </p>
                          <p className={`mt-1 text-[11px] ${textClassName}`}>{roleCard.subtitle}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <AuthInputField
                      name="firstName"
                      label="Prénom"
                      required={selectedRole !== "club"}
                      disabled={isRegisterPending}
                      autoComplete="given-name"
                    />
                    <AuthInputField
                      name="lastName"
                      label="Nom"
                      disabled={isRegisterPending}
                      autoComplete="family-name"
                    />
                  </div>

                  <AuthInputField
                    name="email"
                    type="email"
                    label="Adresse e-mail"
                    required
                    disabled={isRegisterPending}
                    autoComplete="email"
                  />

                  <AuthPasswordField
                    name="password"
                    label="Mot de passe"
                    required
                    disabled={isRegisterPending}
                    showPassword={showRegisterPassword}
                    onToggle={() => setShowRegisterPassword((current) => !current)}
                  />

                  <div
                    className={[
                      "space-y-4 transition-all duration-200 ease-in-out",
                      selectedRole === "club" ? "opacity-100" : "pointer-events-none absolute opacity-0",
                    ].join(" ")}
                  >
                    {selectedRole === "club" ? (
                      <>
                        <AuthInputField
                          name="establishmentName"
                          label="Nom de l’établissement"
                          required
                          disabled={isRegisterPending}
                          autoComplete="organization"
                        />
                        <AuthInputField
                          name="phone"
                          label="Téléphone"
                          type="tel"
                          required
                          disabled={isRegisterPending}
                          autoComplete="tel"
                        />
                      </>
                    ) : null}
                  </div>

                  <div
                    className={[
                      "space-y-4 transition-all duration-200 ease-in-out",
                      selectedRole === "promoter" ? "opacity-100" : "pointer-events-none absolute opacity-0",
                    ].join(" ")}
                  >
                    {selectedRole === "promoter" ? (
                      <AuthInputField
                        name="partnerClubName"
                        label="Nom du club partenaire"
                        required
                        disabled={isRegisterPending}
                        autoComplete="organization"
                      />
                    ) : null}
                  </div>

                  <Button
                    type="submit"
                    color="default"
                    radius="none"
                    fullWidth
                    isLoading={isRegisterPending}
                    className="h-12 border border-[#C9973A]/50 bg-[#C9973A] uppercase tracking-widest text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508]"
                  >
                    Créer mon compte
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
