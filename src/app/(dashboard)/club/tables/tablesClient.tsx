"use client";

// Component: TablesClient
// Reference: component.gallery/components/modal
// Inspired by: Atlassian Design System pattern
// NightTable usage: interactive table management with floor-plan editing

import { useMemo, useState, useTransition } from "react";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
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

function zoneChipColor(zone: string | null): "default" | "secondary" | "success" | "primary" {
  if (zone === "dancefloor") return "primary";
  if (zone === "vip") return "secondary";
  if (zone === "terrasse") return "success";
  return "default";
}

export default function TablesClient({ initialTables, className }: TablesClientProps): ReactElement {
  const [tables, setTables] = useState<ClubTable[]>(initialTables);
  const [selectedTableId, setSelectedTableId] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isPromoSelected, setIsPromoSelected] = useState<boolean>(false);
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

  const totalCapacity = useMemo<number>(() => tables.reduce((sum, table) => sum + table.capacity, 0), [tables]);
  const promoTables = useMemo<number>(() => tables.filter((table) => table.is_promo).length, [tables]);
  const mappedZones = useMemo<number>(
    () => new Set(tables.map((table) => table.zone ?? "inconnue")).size,
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
      setIsPromoSelected(false);
      setShowModal(false);
    });
  }

  return (
    <div className={`space-y-6 ${className ?? ""}`.trim()}>
      <header className="rounded-xl border border-[#C9973A]/15 bg-[linear-gradient(135deg,rgba(10,15,46,0.9)_0%,rgba(18,23,43,0.96)_65%,rgba(8,10,18,0.96)_100%)] p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#888888] md:text-[11px]">Gestion</p>
            <h1 className="mt-1 text-lg font-semibold text-[#F7F6F3] md:text-xl">Tables</h1>
            <p className="mt-2 text-sm text-[#9A9AA0]">Configuration du floor plan, des zones et des capacités</p>
          </div>

          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <Button
              type="button"
              color="primary"
              radius="none"
              className="h-12 w-full px-4 text-sm font-semibold tracking-[0.08em] md:w-auto"
              onPress={() => setShowModal(true)}
            >
              Ajouter une table
            </Button>
            <Button
              type="button"
              className="h-12 w-full bg-[#C9973A] px-4 text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              onPress={onSavePositions}
              isDisabled={isPending}
              isLoading={isPending}
            >
              Sauvegarder positions
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Tables actives</p>
          <p className="mt-3 nt-heading text-2xl leading-none text-[#F7F6F3] md:text-4xl">{tables.length}</p>
        </article>
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Capacité totale</p>
          <p className="mt-3 nt-heading text-2xl leading-none text-[#F7F6F3] md:text-4xl">{totalCapacity}</p>
        </article>
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Tables promo</p>
          <p className="mt-3 nt-heading text-2xl leading-none text-[#F7F6F3] md:text-4xl">{promoTables}</p>
        </article>
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Zones mappées</p>
          <p className="mt-3 nt-heading text-2xl leading-none text-[#F7F6F3] md:text-4xl">{mappedZones}</p>
        </article>
      </section>

      {error ? (
        <p className="rounded-md border border-[#C4567A]/45 bg-[#C4567A]/12 px-3 py-2 text-sm text-[#f2c7d5]">{error}</p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <section className="rounded-xl border border-white/5 bg-[#1A1D24] p-3 md:p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-medium text-[#F7F6F3]">Plan de salle</h2>
            <p className="text-xs text-[#888888]">Glisser-déposer pour positionner</p>
          </div>
          <FloorPlan
            tables={floorPlanTables}
            mode="edit"
            selectedTableId={selectedTableId}
            onTableSelect={setSelectedTableId}
            onPositionChange={onPositionChange}
          />
        </section>

        <aside className="rounded-xl border border-white/5 bg-[#1A1D24] p-3 md:p-4">
          <h2 className="px-1 text-[15px] font-medium text-[#F7F6F3]">Tables du club</h2>

          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {tables.map((table) => (
              <article key={`mobile-${table.id}`} className="rounded-xl border border-white/5 bg-[#12172B] p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#F7F6F3]">{table.name}</p>
                    <p className="text-xs text-[#888888]">{formatEuros(table.base_price)} · {table.capacity} pers.</p>
                  </div>
                  <Chip color={zoneChipColor(table.zone)} variant="flat" size="sm">
                    <span className="text-[10px] uppercase tracking-[0.04em]">{table.zone ?? "inconnue"}</span>
                  </Chip>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#888888]">Promo</span>
                  <Switch
                    isSelected={table.is_promo}
                    isDisabled
                    color="secondary"
                    size="sm"
                    aria-label={`Promo ${table.name}`}
                  />
                </div>

                <Button
                  type="button"
                  variant={selectedTableId === table.id ? "solid" : "bordered"}
                  className={`mt-3 h-11 w-full ${selectedTableId === table.id ? "bg-[#C9973A] text-[#050508]" : "border-[#C9973A]/40 text-[#C9973A]"}`}
                  onPress={() => setSelectedTableId(table.id)}
                >
                  {selectedTableId === table.id ? "Table sélectionnée" : "Sélectionner"}
                </Button>
              </article>
            ))}
          </div>

          <div className="mt-4 hidden md:block">
            <div className="overflow-x-auto">
              <Table
                removeWrapper
                aria-label="Liste des tables du club"
                classNames={{
                  th: "bg-[#111318] text-[#888888] uppercase text-[11px] tracking-[0.05em]",
                  td: "text-[#F7F6F3] border-b border-white/5",
                  tr: "hover:bg-[#C9973A]/6 transition-colors duration-150",
                }}
              >
                <TableHeader>
                  <TableColumn>TABLE</TableColumn>
                  <TableColumn>ZONE</TableColumn>
                  <TableColumn>CAPACITÉ</TableColumn>
                  <TableColumn>PRIX DE BASE</TableColumn>
                  <TableColumn>PROMO</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"Aucune table disponible"}>
                  {tables.map((table) => (
                    <TableRow key={table.id}>
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>
                        <Chip color={zoneChipColor(table.zone)} variant="flat" size="sm">
                          <span className="text-[10px] uppercase tracking-[0.04em]">
                            {table.zone ?? "inconnue"}
                          </span>
                        </Chip>
                      </TableCell>
                      <TableCell className="text-[#888888]">{table.capacity}</TableCell>
                      <TableCell>{formatEuros(table.base_price)}</TableCell>
                      <TableCell>
                        <Switch
                          isSelected={table.is_promo}
                          isDisabled
                          color="secondary"
                          size="sm"
                          aria-label={`Promo ${table.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          aria-label={`Sélectionner ${table.name}`}
                          className={
                            selectedTableId === table.id
                              ? "h-11 min-w-[44px] bg-[#C9973A] text-[#050508]"
                              : "h-11 min-w-[44px] text-[#C9973A]"
                          }
                          onPress={() => setSelectedTableId(table.id)}
                        >
                          {selectedTableId === table.id ? "✓" : "◎"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </aside>
      </div>

      <Modal
        isOpen={showModal}
        onOpenChange={(isOpen: boolean) => {
          setShowModal(isOpen);
          if (!isOpen) {
            setIsPromoSelected(false);
          }
        }}
        backdrop="blur"
        classNames={{
          base: "fixed bottom-0 w-full rounded-t-2xl border border-[#C9973A]/20 bg-[#12172B] text-[#F7F6F3] md:relative md:bottom-auto md:max-w-lg md:rounded-xl",
          header: "border-b border-[#C9973A]/10",
          footer: "border-t border-[#C9973A]/10",
        }}
      >
        <ModalContent>
          <form action={onCreateTable}>
            <ModalHeader>Ajouter une table</ModalHeader>
            <ModalBody>
              <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-white/20 md:hidden" />
              <Input
                name="name"
                label="Nom"
                labelPlacement="outside"
                placeholder="Table Or 1"
                isRequired
                color="primary"
                variant="bordered"
                classNames={{
                  label: "text-[11px] uppercase tracking-[0.08em] text-[#888888]",
                  inputWrapper: "min-h-12 border border-[#2A2F4A] bg-[#0A0F2E]",
                  input: "text-[#F7F6F3]",
                }}
              />

              <Input
                name="capacity"
                label="Capacité"
                labelPlacement="outside"
                type="number"
                min={1}
                isRequired
                color="primary"
                variant="bordered"
                classNames={{
                  label: "text-[11px] uppercase tracking-[0.08em] text-[#888888]",
                  inputWrapper: "min-h-12 border border-[#2A2F4A] bg-[#0A0F2E]",
                  input: "text-[#F7F6F3]",
                }}
              />

              <Input
                name="basePrice"
                label="Prix de base"
                labelPlacement="outside"
                type="number"
                min={1}
                isRequired
                color="primary"
                variant="bordered"
                classNames={{
                  label: "text-[11px] uppercase tracking-[0.08em] text-[#888888]",
                  inputWrapper: "min-h-12 border border-[#2A2F4A] bg-[#0A0F2E]",
                  input: "text-[#F7F6F3]",
                }}
              />

              <Select
                name="zone"
                label="Zone"
                labelPlacement="outside"
                defaultSelectedKeys={["vip"]}
                color="primary"
                variant="bordered"
                classNames={{
                  label: "text-[11px] uppercase tracking-[0.08em] text-[#888888]",
                  trigger: "min-h-12 border border-[#2A2F4A] bg-[#0A0F2E]",
                  value: "text-[#F7F6F3]",
                }}
              >
                <SelectItem key="dancefloor" variant="bordered">dancefloor</SelectItem>
                <SelectItem key="vip" variant="bordered">vip</SelectItem>
                <SelectItem key="loge" variant="bordered">loge</SelectItem>
                <SelectItem key="terrasse" variant="bordered">terrasse</SelectItem>
              </Select>

              <div className="flex items-center justify-between rounded-lg border border-[#C9973A]/15 bg-[#0A0F2E] p-3">
                <div>
                  <p className="text-sm text-[#F7F6F3]">Table promotionnelle</p>
                  <p className="text-xs text-[#888888]">Met en avant cette table dans le floor plan.</p>
                </div>
                <Switch
                  isSelected={isPromoSelected}
                  onValueChange={setIsPromoSelected}
                  color="secondary"
                  size="sm"
                  aria-label="Activer table promotionnelle"
                />
                <input type="hidden" name="isPromo" value={isPromoSelected ? "on" : "off"} />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="bordered"
                className="min-h-12 border-[#C9973A]/30 text-[#C9973A]"
                onPress={() => {
                  setIsPromoSelected(false);
                  setShowModal(false);
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="min-h-12 bg-[#C9973A] font-semibold text-[#050508]"
                isLoading={isPending}
                isDisabled={isPending}
              >
                Ajouter
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
