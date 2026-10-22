import type { CSSProperties } from "react";
const paths = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  play: "M9 5l11 7-11 7z M4 5v14",
  chart: "M4 20V4 M4 20h17 M8 15l4-5 4 2 5-7",
  link: "M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-2 2 M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l2-2",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  download: "M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5",
  settings: "M4 7h16 M4 17h16 M8 4v6 M16 14v6",
  wallet: "M3 6h17v15H3z M3 6l14-3v3 M15 12h5v5h-5z",
  search: "M21 21l-5-5 M18 10a8 8 0 11-16 0 8 8 0 0116 0",
  check: "M5 12l4 4L20 5",
  bolt: "M13 2L4 14h7l-1 8 10-12h-7z",
  info: "M12 11v6 M12 7h.01 M22 12a10 10 0 11-20 0 10 10 0 0120 0",
  external: "M14 3h7v7 M21 3L10 14 M10 3H3v18h18v-7",
  heart: "M20 5c-3-3-7-1-8 1-1-2-5-4-8-1-4 4 0 9 8 15 8-6 12-11 8-15",
};
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: keyof typeof paths;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
