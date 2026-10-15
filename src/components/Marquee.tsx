import type { ReactNode } from "react";

/**
 * CSS-only infinite ticker. The duplicate group is aria-hidden and the whole
 * band pauses on hover/focus (WCAG 2.2.2); under reduced motion it degrades to
 * a plain horizontally scrollable row with a single group.
 */
export function Marquee({
  children,
  seconds = 52,
  label,
  className = "",
}: {
  children: ReactNode;
  seconds?: number;
  label: string;
  className?: string;
}) {
  return (
    <div className={`marquee ${className}`} style={{ "--duration": `${seconds}s` } as React.CSSProperties} role="group" aria-label={label}>
      <div className="marquee__track">
        <ul className="marquee__group">{children}</ul>
        <ul className="marquee__group" aria-hidden="true">
          {children}
        </ul>
      </div>
    </div>
  );
}
