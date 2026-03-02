"use client";

// Component: RefreshButton
// Reference: component.gallery/components/text-input
// Inspired by: Atlassian Design System pattern
// NightTable usage: refresh triggers on club dashboard screens

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

import type { ReactElement } from "react";

type RefreshButtonProps = {
  /** Optional utility classes for composition. */
  className?: string;
};

export default function RefreshButton({ className }: RefreshButtonProps): ReactElement {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="bordered"
      color="default"
      size="sm"
      radius="none"
      startContent={<span aria-hidden="true">↻</span>}
      className={`min-h-11 border-[#C9973A]/20 px-4 text-[#F7F6F3] ${className ?? ""}`.trim()}
      onClick={() => router.refresh()}
      aria-label="Rafraîchir le dashboard"
    >
      Rafraîchir
    </Button>
  );
}
