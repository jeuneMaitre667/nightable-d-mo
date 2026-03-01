"use client";

// Component: TablesClient
// Reference: component.gallery/components/modal
// Inspired by: Atlassian Design System pattern
// NightTable usage: interactive table management with floor-plan editing

import { useMemo, useState, useTransition } from "react";
import FloorPlan from "@/components/floor-plan/FloorPlan";
import { createTableAction, updateTablePositionAction } from "@/lib/club.actions";

import type { ReactElement } from "react";

type ClubTable = {
  id: string;
  name: string;
  capacity: number;
  base_price: number;
  zone: string | null;
  x_position: number | null;
  y_position: number | null;
  is_promo: boolean;
};

type TablesClientProps = {
  /** Initial list of club tables fetched server-side. */
  initialTables: ClubTable[];
  /** Optional utility classes for wrapper composition. */
  className?: string;
};

type FloorPlanStatus = "available" | "reserved" | "occupied" | "selected" | "promo" | "disabled" | "sold_out";

type FloorPlanTableRow = {
  id: string;
  name: string;
  capacity: number;
  base_price: number;
  zone: string | null;
  position_x: number | null;
  position_y: number | null;
  status: FloorPlanStatus;
};

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TablesClient({ initialTables, className }: TablesClientProps): ReactElement {
  const [tables, setTables] = useState<ClubTable[]>(initialTables);
  const [selectedTableId, setSelectedTableId] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const floorPlanTables = useMemo<FloorPlanTableRow[]>(
    () =>
      tables.map((table) => ({
        id: table.id,
        name: table.name,
        capacity: table.capacity,
        base_price: table.base_price,
        zone: table.zone,
        position_x: table.x_position,
        position_y: table.y_position,
        status: (table.is_promo ? "promo" : "available") as FloorPlanStatus,
      })),
    [tables]
  );

  function onPositionChange(tableId: string, positionX: number, positionY: number): void {
    setTables((current) =>
      current.map((table) =>
        table.id === tableId
          ? {
              ...table,
              x_position: positionX,
              y_position: positionY,
            }
          : table
      )
    );
  }

  function onSavePositions(): void {
    setError(null);

    startTransition(async () => {
      const payload = tables.map((table) => ({
        id: table.id,
        positionX: table.x_position ?? 0,
        positionY: table.y_position ?? 0,
      }));

      const result = await updateTablePositionAction(payload);
      if (!result.success) {
        setError(result.error ?? "Impossible de sauvegarder les positions.");
      }
    });
  }

  function onCreateTable(formData: FormData): void {
    setError(null);

    startTransition(async () => {
      const payload = {
        name: String(formData.get("name") ?? "").trim(),
        capacity: Number(formData.get("capacity") ?? 0),
        basePrice: Number(formData.get("basePrice") ?? 0),
        zone: String(formData.get("zone") ?? "vip") as "dancefloor" | "vip" | "loge" | "terrasse",
        isPromo: String(formData.get("isPromo") ?? "") === "on",
      };

      const result = await createTableAction(payload);
      if (!result.success || !result.data?.tableId) {
        setError(result.error ?? "Impossible d'ajouter la table.");
        return;
      }

      const tableId = result.data.tableId;

      setTables((current) => [
        ...current,
        {
          id: tableId,
          name: payload.name,
          capacity: payload.capacity,
          base_price: payload.basePrice,
          zone: payload.zone,
          x_position: null,
          y_position: null,
          is_promo: payload.isPromo,
        },
      ]);
      setShowModal(false);
    });
  }

  return (
    <div className={`space-y-6 ${className ?? ""}`.trim()}>
      <header className="flex flex-col gap-4 rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#888888]">Club Dashboard</p>
          <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3] md:text-4xl">Gestion des tables</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="nt-btn nt-btn-secondary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
            onClick={() => setShowModal(true)}
          >
            Ajouter une table
          </button>
          <button
            type="button"
            className="nt-btn nt-btn-primary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onSavePositions}
            disabled={isPending}
          >
            Sauvegarder positions
          </button>
        </div>
      </header>

      {error ? (
        <p className="rounded-md border border-[#C4567A]/45 bg-[#C4567A]/12 px-3 py-2 text-sm text-[#f2c7d5]">{error}</p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <FloorPlan
            tables={floorPlanTables}
            mode="edit"
            selectedTableId={selectedTableId}
            onTableSelect={setSelectedTableId}
            onPositionChange={onPositionChange}
          />
        </section>

        <aside className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <h2 className="nt-heading text-2xl text-[#F7F6F3]">Tables</h2>
          <div className="mt-4 space-y-2">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`rounded-md border px-3 py-2 ${selectedTableId === table.id ? "border-[#C9973A]/55 bg-[#C9973A]/10" : "border-[#C9973A]/15 bg-[#0A0F2E]"}`}
              >
                <p className="text-sm font-medium text-[#F7F6F3]">{table.name}</p>
                <p className="text-xs text-[#888888]">
                  {table.zone ?? "zone inconnue"} · {table.capacity} pers. · {formatEuros(table.base_price)}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#050508]/80 px-4">
          <form
            action={onCreateTable}
            className="w-full max-w-lg rounded-xl border border-[#C9973A]/30 bg-[#12172B] p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Ajouter une table"
          >
            <h3 className="nt-heading text-2xl text-[#F7F6F3]">Ajouter une table</h3>

            <div className="mt-4 grid gap-3">
              <div>
                <label htmlFor="name" className="nt-label mb-1 block">Nom</label>
                <input id="name" name="name" type="text" required className="nt-input" />
              </div>
              <div>
                <label htmlFor="capacity" className="nt-label mb-1 block">Capacité</label>
                <input id="capacity" name="capacity" type="number" min={1} required className="nt-input" />
              </div>
              <div>
                <label htmlFor="basePrice" className="nt-label mb-1 block">Prix de base</label>
                <input id="basePrice" name="basePrice" type="number" min={1} required className="nt-input" />
              </div>
              <div>
                <label htmlFor="zone" className="nt-label mb-1 block">Zone</label>
                <select id="zone" name="zone" className="nt-input">
                  <option value="dancefloor">dancefloor</option>
                  <option value="vip">vip</option>
                  <option value="loge">loge</option>
                  <option value="terrasse">terrasse</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-[#F7F6F3]">
                <input type="checkbox" name="isPromo" className="h-4 w-4 accent-[#C4567A]" />
                is_promo
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="nt-btn nt-btn-secondary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="nt-btn nt-btn-primary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isPending}
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
