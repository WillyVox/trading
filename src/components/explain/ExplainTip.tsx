"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GAP = 10; // px between the "?" and the tooltip
const EDGE = 12; // px kept clear of the viewport edges
const HIDE_DELAY = 120; // ms grace so the pointer can travel onto the tooltip

/**
 * Client half of `Explain`: the "?" button plus a tooltip anchored to it.
 *
 * The tooltip is a native `popover="manual"`, so it lives in the top layer
 * (the compare table's horizontal scroll container can't clip it and no
 * z-index is needed) while its content stays in the server-rendered HTML.
 * Placement is computed from the button's rect: above by default, flipped
 * below when there is no room, clamped to the viewport, with the arrow kept
 * pointing at the button.
 *
 * Behaviour
 *  - mouse: opens on hover, closes shortly after the pointer leaves
 *  - keyboard: opens on focus; Tab moves on into any links inside it
 *  - touch / click: click pins it open until Esc, a second click, or a tap
 *    outside
 *
 * `children` is the tooltip's content, rendered by the server component.
 */
export function ExplainTip({
  id,
  label,
  labelledBy,
  children,
}: {
  id: string;
  label: string;
  labelledBy: string;
  children: React.ReactNode;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const pinned = useRef(false);
  const [open, setOpen] = useState(false);

  const place = useCallback(() => {
    const btn = btnRef.current;
    const tip = tipRef.current;
    if (!btn || !tip) return;

    const r = btn.getBoundingClientRect();
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const vw = document.documentElement.clientWidth;

    const side = r.top - th - GAP >= EDGE ? "top" : "bottom";
    const top = side === "top" ? r.top - th - GAP : r.bottom + GAP;
    const cx = r.left + r.width / 2;
    const left = Math.min(Math.max(cx - tw / 2, EDGE), vw - tw - EDGE);

    tip.dataset.side = side;
    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;
    tip.style.setProperty(
      "--arrow-x",
      `${Math.min(Math.max(cx - left, 16), tw - 16)}px`
    );
  }, []);

  const show = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    const tip = tipRef.current;
    if (!tip) return;
    if (!tip.matches(":popover-open")) tip.showPopover?.();
    place();
    setOpen(true);
  }, [place]);

  const hide = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    const tip = tipRef.current;
    if (tip?.matches(":popover-open")) tip.hidePopover?.();
    pinned.current = false;
    setOpen(false);
  }, []);

  const scheduleHide = useCallback(() => {
    if (pinned.current) return;
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(hide, HIDE_DELAY);
  }, [hide]);

  // While open: keep it anchored on scroll/resize, close on Esc or outside tap.
  useEffect(() => {
    if (!open) return;

    const onMove = () => place();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (tipRef.current?.contains(target) || btnRef.current?.contains(target))
        return;
      hide();
    };

    window.addEventListener("scroll", onMove, { capture: true, passive: true });
    window.addEventListener("resize", onMove);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("scroll", onMove, { capture: true });
      window.removeEventListener("resize", onMove);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, place, hide]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onPointerEnter={(e) => e.pointerType === "mouse" && show()}
        onPointerLeave={(e) => e.pointerType === "mouse" && scheduleHide()}
        onFocus={() => !pinned.current && show()}
        onBlur={(e) => {
          if (pinned.current || tipRef.current?.contains(e.relatedTarget))
            return;
          scheduleHide();
        }}
        onClick={() => {
          if (open && pinned.current) {
            hide();
            return;
          }
          show();
          pinned.current = true;
        }}
        className="border-gold bg-panel text-gold hover:bg-gold hover:text-panel aria-expanded:bg-gold aria-expanded:text-panel focus-visible:outline-navy relative ml-1.5 inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border align-middle text-[11px] leading-none font-semibold transition-colors before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        ?
      </button>

      {/*
        Do not add a `display` utility to this element: an author `display`
        beats the browser's `display: none` for a closed popover. Layout
        lives on the inner wrapper. Position, arrow and animation are in
        globals.css (`.explain-tip`).
      */}
      <div
        ref={tipRef}
        id={id}
        popover="manual"
        role="group"
        aria-labelledby={labelledBy}
        onPointerEnter={(e) =>
          e.pointerType === "mouse" && window.clearTimeout(hideTimer.current)
        }
        onPointerLeave={(e) => e.pointerType === "mouse" && scheduleHide()}
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null;
          if (
            pinned.current ||
            tipRef.current?.contains(next) ||
            btnRef.current?.contains(next)
          )
            return;
          scheduleHide();
        }}
        className="explain-tip bg-navy w-[min(21rem,calc(100vw-1.5rem))] rounded-xl text-left text-white"
      >
        <div className="max-h-[min(70vh,28rem)] overflow-y-auto px-4 py-3.5">
          {children}
        </div>
      </div>
    </>
  );
}
