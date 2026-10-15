import { useCallback, useRef, type PointerEvent, type ReactNode } from "react";

type Edge = "top" | "right" | "bottom" | "left";

const OFF: Record<Edge, string> = {
  top: "0 -101%",
  right: "101% 0",
  bottom: "0 101%",
  left: "-101% 0",
};

function nearestEdge(event: PointerEvent<HTMLElement>): Edge {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  return Math.abs(x) > Math.abs(y) ? (x > 0 ? "right" : "left") : y > 0 ? "bottom" : "top";
}

/**
 * Primary call to action. The fill sweeps in from the edge the pointer entered
 * and leaves toward the edge it exits — driven by the Web Animations API, so an
 * interrupted hover continues from the current position instead of snapping.
 * Keyboard focus uses the same sweep from the bottom edge. Reduced motion gets
 * the colour change with no travel.
 */
export function SweepButton({
  children,
  href,
  onClick,
  className = "",
  target,
  rel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
}) {
  const fill = useRef<HTMLSpanElement>(null);

  const run = useCallback((to: string, from?: string) => {
    const el = fill.current;
    if (!el) return;
    // Read the current translation BEFORE cancelling the running animation.
    const current = from ?? getComputedStyle(el).translate;
    el.getAnimations().forEach((animation) => animation.cancel());
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.animate([{ translate: current === "none" ? "0 0" : current }, { translate: to }], {
      duration: reduced ? 0 : 460,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      fill: "forwards",
    });
  }, []);

  const content = (
    <>
      <span ref={fill} className="btn__fill" aria-hidden="true" />
      <span className="btn__label">{children}</span>
    </>
  );

  const handlers = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => event.pointerType === "mouse" && run("0 0", OFF[nearestEdge(event)]),
    onPointerLeave: (event: PointerEvent<HTMLElement>) => event.pointerType === "mouse" && run(OFF[nearestEdge(event)]),
    onFocus: () => run("0 0", OFF.bottom),
    onBlur: () => run(OFF.bottom),
  };

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={`btn ${className}`} {...handlers}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`btn ${className}`} {...handlers}>
      {content}
    </button>
  );
}
