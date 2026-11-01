"use client";

import { cn } from "cn";
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Active = {
  label: string;
  /** Centre of the cell, relative to the wrapper. */
  x: number;
  /** Top of the cell, relative to the wrapper. */
  y: number;
  align: "start" | "center" | "end";
};

const CELL_SELECTOR = "rect[data-label]";
/** Within this distance of an edge, the tooltip aligns to the cell instead of centring. */
const EDGE = 96;

const arrows: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

/**
 * GitHub-style day tooltips for the server-rendered contribution SVG. The SVG
 * stays server HTML; this only reads each cell's data attributes. Hover with a
 * mouse, tap or click on any pointer, or focus and use the arrow keys.
 */
export function ContributionTooltip({
  summary,
  keyboardHint,
  children,
}: {
  summary: string;
  keyboardHint: string;
  children: ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeCellRef = useRef<SVGRectElement | null>(null);
  const [active, setActive] = useState<Active | null>(null);

  function show(cell: SVGRectElement) {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    activeCellRef.current?.removeAttribute("data-active");
    cell.setAttribute("data-active", "");
    activeCellRef.current = cell;

    const box = wrapper.getBoundingClientRect();
    const rect = cell.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - box.left;
    setActive({
      label: cell.dataset.label ?? "",
      x,
      y: rect.top - box.top,
      align: x < EDGE ? "start" : x > box.width - EDGE ? "end" : "center",
    });
  }

  const hide = useCallback(() => {
    activeCellRef.current?.removeAttribute("data-active");
    activeCellRef.current = null;
    setActive(null);
  }, []);

  // A tap outside closes the tooltip; so does Escape anywhere.
  useEffect(() => {
    if (!active) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) hide();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, hide]);

  const cellFrom = (target: EventTarget) =>
    target instanceof Element
      ? target.closest<SVGRectElement>(CELL_SELECTOR)
      : null;

  function onPointerOver(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    const cell = cellFrom(event.target);
    if (cell) show(cell);
  }

  function onClick(event: { target: EventTarget }) {
    const cell = cellFrom(event.target);
    if (!cell) return;
    if (cell === activeCellRef.current) {
      // A second tap on the same day closes it on touch screens; with a mouse, hover already shows it.
      if (!window.matchMedia("(hover: hover)").matches) hide();
      return;
    }
    show(cell);
  }

  function onKeyDown(event: KeyboardEvent) {
    const step = arrows[event.key];
    if (!step) return;
    event.preventDefault();
    const wrapper = wrapperRef.current;
    const current =
      activeCellRef.current ??
      wrapper?.querySelector<SVGRectElement>("rect[data-today]");
    if (!wrapper || !current) return;
    const column = Number(current.dataset.column) + step[0];
    const row = Number(current.dataset.row) + step[1];
    const next = wrapper.querySelector<SVGRectElement>(
      `rect[data-column="${column}"][data-row="${row}"]`,
    );
    if (next) show(next);
  }

  function onFocus() {
    // Keyboard focus starts on today; a click already chose its own day.
    if (!wrapperRef.current?.matches(":focus-visible")) return;
    const today =
      wrapperRef.current.querySelector<SVGRectElement>("rect[data-today]");
    if (today) show(today);
  }

  return (
    <div
      ref={wrapperRef}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: one focus stop for the whole year; the arrow keys move between days.
      tabIndex={0}
      role="application"
      aria-roledescription="contribution calendar"
      aria-label={`${summary}. ${keyboardHint}`}
      className="relative rounded-xs outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
      onPointerOver={onPointerOver}
      onPointerLeave={(event) => event.pointerType === "mouse" && hide()}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide();
      }}
    >
      {children}
      {active ? (
        <div
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-10 whitespace-nowrap rounded-sm bg-foreground px-2.5 py-1.5 font-sans text-background text-xs",
            // Enters softly once; moving between days while open is instant (the element stays mounted).
            "transition-[opacity,scale] duration-150 ease-out starting:scale-[0.97] starting:opacity-0 motion-reduce:starting:scale-100",
            active.align === "center" && "-translate-x-1/2 origin-bottom",
            active.align === "start" && "-translate-x-[5px] origin-bottom-left",
            active.align === "end" &&
              "-translate-x-[calc(100%-5px)] origin-bottom-right",
          )}
          // Sits 8px above the cell; `transform` lifts it by its own height.
          style={{
            left: active.x,
            top: active.y - 8,
            transform: "translateY(-100%)",
          }}
        >
          {active.label}
        </div>
      ) : null}
      {/* Announces the day for screen readers as the arrow keys move. */}
      <p aria-live="polite" className="sr-only">
        {active?.label}
      </p>
    </div>
  );
}
