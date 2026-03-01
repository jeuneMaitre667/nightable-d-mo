"use client";

import { Fragment, useMemo, useState } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";

type FloorPlanTable = {
  id: string;
  name: string;
  capacity: number;
  base_price: number;
  zone: string | null;
  position_x: number | null;
  position_y: number | null;
  status: "available" | "reserved" | "occupied" | "selected" | "promo" | "disabled" | "sold_out";
};

type FloorPlanProps = {
  tables: FloorPlanTable[];
  onTableSelect: (tableId: string) => void;
  selectedTableId?: string;
  mode: "view" | "edit" | "booking";
  onPositionChange?: (tableId: string, positionX: number, positionY: number) => void;
};

type TooltipState = {
  x: number;
  y: number;
  table: FloorPlanTable;
} | null;

const CANVAS_WIDTH = 1100;
const CANVAS_HEIGHT = 680;
const TABLE_WIDTH = 80;
const TABLE_HEIGHT = 60;

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getTableStyle(table: FloorPlanTable, isSelected: boolean): { fill: string; stroke: string; text: string } {
  if (isSelected) {
    return { fill: "#C9973A", stroke: "#C9973A", text: "#050508" };
  }

  if (table.status === "promo") {
    return { fill: "transparent", stroke: "#C4567A", text: "#F7F6F3" };
  }

  if (table.status === "reserved") {
    return { fill: "#2A2F4A", stroke: "#444444", text: "#F7F6F3" };
  }

  if (table.status === "occupied") {
    return { fill: "#1A2A1A", stroke: "#3A9C6B", text: "#F7F6F3" };
  }

  if (table.status === "available") {
    return { fill: "transparent", stroke: "#C9973A", text: "#F7F6F3" };
  }

  return { fill: "#2A2F4A", stroke: "#444444", text: "#888888" };
}

export default function FloorPlan({
  tables,
  onTableSelect,
  selectedTableId,
  mode,
  onPositionChange,
}: FloorPlanProps): JSX.Element {
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const positionedTables = useMemo(
    () =>
      tables.map((table, index) => ({
        ...table,
        positionX: table.position_x ?? 60 + (index % 8) * 120,
        positionY: table.position_y ?? 70 + Math.floor(index / 8) * 110,
      })),
    [tables]
  );

  return (
    <div className="relative rounded-xl border border-[#C9973A]/20 bg-[#0A0F2E] p-3">
      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="max-w-full overflow-hidden rounded-md">
        <Layer>
          {positionedTables.map((table) => {
            const isSelected = selectedTableId === table.id;
            const isClickable =
              mode === "booking"
                ? table.status === "available"
                : table.status === "available" || table.status === "promo" || mode === "view";
            const style = getTableStyle(table, isSelected);

            return (
              <Fragment key={table.id}>
                <Rect
                  x={table.positionX}
                  y={table.positionY}
                  width={TABLE_WIDTH}
                  height={TABLE_HEIGHT}
                  cornerRadius={12}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={2}
                  draggable={mode === "edit"}
                  onClick={() => {
                    if (isClickable) {
                      onTableSelect(table.id);
                    }
                  }}
                  onTap={() => {
                    if (isClickable) {
                      onTableSelect(table.id);
                    }
                  }}
                  onMouseMove={(event) => {
                    const position = event.target.getStage()?.getPointerPosition();
                    if (!position) {
                      return;
                    }

                    setTooltip({
                      x: position.x,
                      y: position.y,
                      table,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  onDragEnd={(event) => {
                    if (mode !== "edit" || !onPositionChange) {
                      return;
                    }

                    onPositionChange(table.id, event.target.x(), event.target.y());
                  }}
                />
                <Text
                  x={table.positionX + 8}
                  y={table.positionY + 22}
                  width={TABLE_WIDTH - 16}
                  text={table.name}
                  align="center"
                  fontStyle="bold"
                  fontSize={12}
                  fill={style.text}
                />
              </Fragment>
            );
          })}
        </Layer>
      </Stage>

      {tooltip ? (
        <div
          className="pointer-events-none absolute z-20 rounded-md border border-[#C9973A]/35 bg-[#12172B] px-3 py-2 text-xs text-[#F7F6F3]"
          style={{ left: tooltip.x + 18, top: tooltip.y + 18 }}
        >
          <p className="font-medium text-[#E8C96A]">{tooltip.table.name}</p>
          <p>Capacité: {tooltip.table.capacity}</p>
          <p>Prix: {formatEuros(tooltip.table.base_price)}</p>
        </div>
      ) : null}
    </div>
  );
}
