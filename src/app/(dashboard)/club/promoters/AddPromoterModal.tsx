"use client";

// Component: AddPromoterModal
// Reference: component.gallery/components/modal
// Inspired by: Atlassian modal form pattern
// NightTable usage: Club dashboard promoter creation flow

import { useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Slider } from "@heroui/react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createPromoterAction } from "@/lib/promoter.actions";

export function AddPromoterModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set("commission_rate", String(commissionRate));
    const result = await createPromoterAction(formData);

    if (!result.success) {
      setErrorMessage(result.error ?? "Impossible de créer ce promoteur.");
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("Promoteur créé avec succès.");
    setIsSubmitting(false);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button
        type="button"
        onPress={() => setIsOpen(true)}
        color="primary"
        radius="none"
        className="min-h-11 px-4 text-xs font-semibold uppercase tracking-widest"
      >
        Ajouter un promoteur
      </Button>

      {successMessage ? (
        <p className="mt-3 rounded-lg border border-[#3A9C6B]/30 bg-[#3A9C6B]/10 px-3 py-2 text-sm text-[#3A9C6B]">
          {successMessage}
        </p>
      ) : null}

      <Modal
        isOpen={isOpen}
        onOpenChange={(open: boolean) => {
          setIsOpen(open);
          if (!open) {
            setErrorMessage("");
          }
        }}
        backdrop="blur"
        classNames={{
          base: "bg-[#12172B] border border-[#C9973A]/20 text-[#F7F6F3]",
          header: "border-b border-[#C9973A]/10",
          footer: "border-t border-[#C9973A]/10",
        }}
      >
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Nouveau promoteur</ModalHeader>
            <ModalBody className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  name="first_name"
                  isRequired
                  placeholder="Prénom"
                  label="Prénom"
                  labelPlacement="outside"
                  variant="bordered"
                  color="primary"
                  classNames={{
                    label: "text-[11px] uppercase tracking-widest text-[#888888]",
                    inputWrapper: "bg-[#0A0F2E] border border-[#2A2F4A]",
                    input: "text-[#F7F6F3]",
                  }}
                />
                <Input
                  name="last_name"
                  isRequired
                  placeholder="Nom"
                  label="Nom"
                  labelPlacement="outside"
                  variant="bordered"
                  color="primary"
                  classNames={{
                    label: "text-[11px] uppercase tracking-widest text-[#888888]",
                    inputWrapper: "bg-[#0A0F2E] border border-[#2A2F4A]",
                    input: "text-[#F7F6F3]",
                  }}
                />
              </div>

              <Input
                type="email"
                name="email"
                isRequired
                placeholder="Email"
                label="Email"
                labelPlacement="outside"
                variant="bordered"
                color="primary"
                classNames={{
                  label: "text-[11px] uppercase tracking-widest text-[#888888]",
                  inputWrapper: "bg-[#0A0F2E] border border-[#2A2F4A]",
                  input: "text-[#F7F6F3]",
                }}
              />

              <Input
                name="phone"
                placeholder="Téléphone (optionnel)"
                label="Téléphone"
                labelPlacement="outside"
                variant="bordered"
                color="primary"
                classNames={{
                  label: "text-[11px] uppercase tracking-widest text-[#888888]",
                  inputWrapper: "bg-[#0A0F2E] border border-[#2A2F4A]",
                  input: "text-[#F7F6F3]",
                }}
              />

              <Slider
                label="Taux de commission"
                minValue={5}
                maxValue={15}
                step={0.5}
                showSteps={false}
                showTooltip
                value={commissionRate}
                onChange={(value) => setCommissionRate(Number(value))}
                classNames={{
                  label: "text-[11px] uppercase tracking-widest text-[#888888]",
                  track: "bg-[#2A2F4A]",
                  filler: "bg-[#C9973A]",
                }}
              />

              <p className="text-xs text-[#888888]">Commission sélectionnée: {commissionRate}%</p>

              {errorMessage ? (
                <p className="rounded-lg border border-[#C4567A]/30 bg-[#C4567A]/10 px-3 py-2 text-sm text-[#C4567A]">
                  {errorMessage}
                </p>
              ) : null}
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="bordered"
                className="min-h-11 border-[#C9973A]/30 text-[#C9973A]"
                onPress={() => setIsOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                color="primary"
                radius="none"
                className="min-h-11 font-semibold"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Création..." : "Créer"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
