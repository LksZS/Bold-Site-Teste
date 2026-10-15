/**
 * A single line-icon family (24x24, 1.6 stroke, round joins) that replaces the
 * emoji glyphs of the original build. One visual language for brand features,
 * values, contact and UI controls; the social glyphs are the original brand
 * marks, kept as filled paths.
 */
type StrokeIcon =
  | "steak"
  | "beer"
  | "globe"
  | "celebrate"
  | "pasta"
  | "wine"
  | "chef"
  | "cheese"
  | "burger"
  | "fries"
  | "shake"
  | "bolt"
  | "target"
  | "handshake"
  | "bulb"
  | "heart"
  | "mail"
  | "phone"
  | "pin"
  | "chart"
  | "cap"
  | "growth"
  | "trophy"
  | "film"
  | "star"
  | "arrowRight"
  | "arrowDown"
  | "arrowUpRight"
  | "play"
  | "pause"
  | "close"
  | "menu"
  | "plus"
  | "expand";

type FillIcon = "instagram" | "linkedin" | "facebook";

const STROKE_PATHS: Record<StrokeIcon, string> = {
  steak:
    "M4.5 12.5a7.5 7.5 0 0 1 15 0 3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3Z M9 9.5c1.2-.9 4.8-.9 6 0 M12 15.5V19",
  beer: "M6 8h9v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8Z M6 8V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v2 M15 10h1.5a2.5 2.5 0 0 1 0 5H15 M9 4V2 M12 4V2",
  globe:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M3.5 9h17 M3.5 15h17 M12 3c2.4 2.6 2.4 15.4 0 18 M12 3c-2.4 2.6-2.4 15.4 0 18",
  celebrate:
    "M4 20l3.6-9.4a1 1 0 0 1 1.9 0L13 20H4Z M13 20h7l-4.4-6.2 M14 4.5c.8 1 2.2 1 3 0 M17.5 8l1.6-1.1 M12.8 6.6 12 8.7 M19 13.4l1.4-.6 M9 3v1.6",
  pasta:
    "M4 13h16a8 8 0 0 1-16 0Z M4 13a8 8 0 0 1 16 0 M8 10.5c.6-1.6 1.6-3 4-4.5 M12 6l1-2 M16 10.5c-.4-1.6-.8-2.6-2-3.5 M7 21h10",
  wine: "M8 4h8l-.6 5a3.4 3.4 0 0 1-6.8 0L8 4Z M12 13v6 M9 21h6 M8.2 7h7.6",
  chef: "M6.5 11a4 4 0 1 1 1.6-7.7 4.2 4.2 0 0 1 7.8 0A4 4 0 1 1 17.5 11v1.5h-11V11Z M6.5 15.5h11V19a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-3.5Z M10.5 17.5h3",
  cheese:
    "M3 16.5 20 8v7.5a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3 16.5Z M3 16.5V15l17-7 M8 13.5h1 M13 11.5h1 M16.5 12.6h1",
  burger:
    "M4 9.5c0-3 3.6-5.5 8-5.5s8 2.5 8 5.5H4Z M3.5 12.5h17 M4 16c2.4-.9 4.8-1 8-1s5.6.1 8 1c0 2.2-2.6 3.5-8 3.5S4 18.2 4 16Z M8 6.6h.01 M12 5.8h.01 M16 6.6h.01",
  fries:
    "M5 12h14l-1 8a1 1 0 0 1-1 .9H7a1 1 0 0 1-1-.9L5 12Z M8 12V5.5 M12 12V4 M16 12V6.5 M5.5 16.5h13",
  shake:
    "M7 8h10l-1 10.5a2 2 0 0 1-2 1.8h-4a2 2 0 0 1-2-1.8L7 8Z M9 8V6a3 3 0 0 1 6 0v2 M17.5 3.5 18.8 2 M6.3 3.8 5 2.5 M12 8l.8 4",
  bolt: "M13.5 3 6 13.2h4.7L10 21l7.6-10.4h-4.8L13.5 3Z",
  target:
    "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M12 11.4a.6.6 0 1 0 0 1.2.6.6 0 0 0 0-1.2Z",
  handshake:
    "M3 12.5 7 8.6l3 2.7-1.8 1.8a1.4 1.4 0 0 0 0 2l1.4 1.3 M21 11.5 17.4 8 14 11.3 M8.5 13.4 11 15.8a1.3 1.3 0 0 1-1.9 1.8L6 14.5 M13.6 14.6l1.8 1.7a1.3 1.3 0 0 0 1.9-1.8l-2-1.9 M3 12.5V18h2 M21 11.5V18h-2",
  bulb: "M9.5 18h5 M10 21h4 M12 3a6 6 0 0 1 3.6 10.8c-.5.4-.8 1-.8 1.6v.6H9.2v-.6c0-.6-.3-1.2-.8-1.6A6 6 0 0 1 12 3Z M12 6.5v4",
  heart:
    "M12 20s-7.5-4.3-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.7 12 20 12 20Z",
  mail: "M3.5 6.5h17v11h-17v-11Z M4 7.5l8 6 8-6",
  phone:
    "M7.2 4h-2A1.2 1.2 0 0 0 4 5.3C4 13.4 10.6 20 18.7 20a1.2 1.2 0 0 0 1.3-1.2v-2a1.2 1.2 0 0 0-.9-1.2l-2.6-.6a1.2 1.2 0 0 0-1.2.4l-.9 1a11.4 11.4 0 0 1-5-5l1-.9a1.2 1.2 0 0 0 .4-1.2l-.6-2.6A1.2 1.2 0 0 0 9.4 4H7.2Z",
  pin: "M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21Z M12 8.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z",
  chart:
    "M4 20V10 M9.4 20V4 M14.8 20v-8 M20 20v-5 M3 20h18",
  cap: "M4 9.5 12 5l8 4.5-8 4.5-8-4.5Z M7 12v4c0 1.1 2.2 2 5 2s5-.9 5-2v-4 M19.2 10v5",
  growth:
    "M4 18.5 10 12l3.5 3L20 8.5 M20 13V8.5h-4.5 M4 20h16",
  trophy:
    "M8 4h8v5a4 4 0 0 1-8 0V4Z M8 5.5H5.5v1.4A3.6 3.6 0 0 0 9 10.5 M16 5.5h2.5v1.4A3.6 3.6 0 0 1 15 10.5 M12 13v3.5 M8.5 20h7 M9.5 16.5h5l.5 3.5h-6l.5-3.5Z",
  film: "M3.5 5.5h17v13h-17v-13Z M3.5 9.5h17 M3.5 14.5h17 M8 5.5v13 M16 5.5v13",
  star: "M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6L8.2 13.3l-4-3.7 5.4-.6L12 4Z",
  arrowRight: "M5 12h13 M12.5 6.5 19 12l-6.5 5.5",
  arrowDown: "M12 5v13 M6.5 12.5 12 19l5.5-6.5",
  arrowUpRight: "M7 17 17 7 M9 7h8v8",
  play: "M9 6.5 17.5 12 9 17.5v-11Z",
  pause: "M9.5 6.5v11 M14.5 6.5v11",
  close: "M6 6l12 12 M18 6 6 18",
  menu: "M4 8h16 M4 16h16",
  plus: "M12 5v14 M5 12h14",
  expand: "M4.5 9V4.5H9 M15 4.5h4.5V9 M19.5 15v4.5H15 M9 19.5H4.5V15",
};

const FILL_PATHS: Record<FillIcon, string> = {
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  linkedin:
    "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  facebook:
    "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
};

type IconProps = {
  name: StrokeIcon | FillIcon;
  size?: number;
  className?: string;
};

const isFill = (name: string): name is FillIcon => name in FILL_PATHS;

export function Icon({ name, size = 22, className }: IconProps) {
  if (isFill(name)) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" className={className}>
        <path d={FILL_PATHS[name]} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={STROKE_PATHS[name as StrokeIcon]} />
    </svg>
  );
}
