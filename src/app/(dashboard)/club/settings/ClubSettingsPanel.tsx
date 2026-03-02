"use client";

// Component: ClubSettingsPanel
// Reference: component.gallery/components/text-input
// Inspired by: Atlassian Design System form pattern
// NightTable usage: club dashboard settings form

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button, Chip, Input } from "@heroui/react";
import { updateClubSettingsAction } from "@/lib/club.actions";

type ClubSettingsData = {
  clubId: string;
  clubName: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  instagramHandle: string;
  logoUrl: string;
  coverUrl: string;
  subscriptionTier: string;
  subscriptionActive: boolean;
};

type ClubSettingsPanelProps = {
  initialData: ClubSettingsData;
};

export default function ClubSettingsPanel({ initialData }: ClubSettingsPanelProps): React.JSX.Element {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  function handleSubmit(formData: FormData): void {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await updateClubSettingsAction({
        clubId: String(formData.get("club_id") ?? "").trim(),
        clubName: String(formData.get("club_name") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        city: String(formData.get("city") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        website: String(formData.get("website") ?? "").trim(),
        instagramHandle: String(formData.get("instagram_handle") ?? "").trim(),
        logoUrl: String(formData.get("logo_url") ?? "").trim(),
        coverUrl: String(formData.get("cover_url") ?? "").trim(),
      });

      if (!result.success) {
        setError(result.error ?? "Impossible de sauvegarder les paramètres.");
        return;
      }

      setSuccess("Paramètres du club mis à jour.");
      router.refresh();
    });
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-[#C9973A]/15 bg-[linear-gradient(135deg,rgba(10,15,46,0.9)_0%,rgba(18,23,43,0.96)_65%,rgba(8,10,18,0.96)_100%)] p-4 md:p-6">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[#888888] md:text-[11px]">Gestion</p>
        <h1 className="mt-1 text-lg font-semibold text-[#F7F6F3] md:text-xl">Paramètres du club</h1>
        <p className="mt-2 text-sm text-[#9A9AA0]">Mettez à jour vos informations publiques et votre identité de marque.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Abonnement</p>
          <p className="mt-3 text-lg font-semibold text-[#F7F6F3] capitalize">{initialData.subscriptionTier}</p>
        </article>
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Statut</p>
          <div className="mt-3">
            <Chip color={initialData.subscriptionActive ? "success" : "default"} variant="flat" size="sm">
              {initialData.subscriptionActive ? "Actif" : "Inactif"}
            </Chip>
          </div>
        </article>
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Identité</p>
          <p className="mt-3 text-sm text-[#F7F6F3] truncate">{initialData.clubName || "Club"}</p>
        </article>
      </section>

      {error ? (
        <p className="rounded-md border border-[#C4567A]/45 bg-[#C4567A]/12 px-3 py-2 text-sm text-[#f2c7d5]">{error}</p>
      ) : null}
      {success ? (
        <p className="rounded-md border border-[#3A9C6B]/45 bg-[#3A9C6B]/12 px-3 py-2 text-sm text-[#c2f2dc]">{success}</p>
      ) : null}

      <form action={handleSubmit} className="space-y-4 rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-6">
        <input type="hidden" name="club_id" value={initialData.clubId} />

        <div className="grid gap-3 md:grid-cols-2">
          <Input
            name="club_name"
            label="Nom du club"
            labelPlacement="outside"
            isRequired
            defaultValue={initialData.clubName}
            variant="bordered"
            color="primary"
            classNames={{
              label: "text-[11px] uppercase tracking-widest text-[#888888]",
              inputWrapper: "min-h-12 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
          <Input
            name="city"
            label="Ville"
            labelPlacement="outside"
            isRequired
            defaultValue={initialData.city}
            variant="bordered"
            color="primary"
            classNames={{
              label: "text-[11px] uppercase tracking-widest text-[#888888]",
              inputWrapper: "min-h-12 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Input
            name="address"
            label="Adresse"
            labelPlacement="outside"
            defaultValue={initialData.address}
            variant="bordered"
            color="primary"
            classNames={{
              label: "text-[11px] uppercase tracking-widest text-[#888888]",
              inputWrapper: "min-h-12 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
          <Input
            name="phone"
            label="Téléphone"
            labelPlacement="outside"
            defaultValue={initialData.phone}
            variant="bordered"
            color="primary"
            classNames={{
              label: "text-[11px] uppercase tracking-widest text-[#888888]",
              inputWrapper: "min-h-12 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
        </div>

        <Input
          name="description"
          label="Description"
          labelPlacement="outside"
          defaultValue={initialData.description}
          variant="bordered"
          color="primary"
          classNames={{
            label: "text-[11px] uppercase tracking-widest text-[#888888]",
            inputWrapper: "min-h-12 bg-[#0A0F2E] border border-[#2A2F4A]",
            input: "text-[#F7F6F3]",
          }}
        />

        <div className="grid gap-3 md:grid-cols-2">
          <Input
            name="website"
            label="Site web"
            labelPlacement="outside"
            defaultValue={initialData.website}
            variant="bordered"
            color="primary"
            classNames={{
              label: "text-[11px] uppercase tracking-widest text-[#888888]",
              inputWrapper: "min-h-12 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
          <Input
            name="instagram_handle"
            label="Instagram"
            labelPlacement="outside"
            defaultValue={initialData.instagramHandle}
            variant="bordered"
            color="primary"
            classNames={{
              label: "text-[11px] uppercase tracking-widest text-[#888888]",
              inputWrapper: "min-h-12 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Input
            name="logo_url"
            label="URL logo"
            labelPlacement="outside"
            defaultValue={initialData.logoUrl}
            variant="bordered"
            color="primary"
            classNames={{
              label: "text-[11px] uppercase tracking-widest text-[#888888]",
              inputWrapper: "min-h-12 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
          <Input
            name="cover_url"
            label="URL cover"
            labelPlacement="outside"
            defaultValue={initialData.coverUrl}
            variant="bordered"
            color="primary"
            classNames={{
              label: "text-[11px] uppercase tracking-widest text-[#888888]",
              inputWrapper: "min-h-12 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            color="primary"
            radius="none"
            className="h-12 w-full px-5 text-sm font-semibold tracking-[0.08em] md:w-auto"
            isDisabled={isPending}
            isLoading={isPending}
          >
            Enregistrer les paramètres
          </Button>
        </div>
      </form>
    </section>
  );
}
