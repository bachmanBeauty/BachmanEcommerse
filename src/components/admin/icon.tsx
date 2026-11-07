import type { ReactNode } from "react";

export type IconName =
  | "grid"
  | "box"
  | "tag"
  | "layers"
  | "cart"
  | "wallet"
  | "users"
  | "ticket"
  | "star"
  | "image"
  | "file"
  | "truck"
  | "chart"
  | "settings"
  | "shield"
  | "menu"
  | "close"
  | "external"
  | "logout"
  | "plus"
  | "arrow";

const paths: Record<IconName, ReactNode> = {
  grid: (
    <>
      <rect x="3.75" y="3.75" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.75" y="3.75" width="6.5" height="6.5" rx="1.5" />
      <rect x="3.75" y="13.75" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.75" y="13.75" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
  box: (
    <>
      <path d="M21 7.5 12 3 3 7.5m18 0L12 12m9-4.5v9L12 21m0-9L3 7.5m9 4.5v9M3 7.5v9L12 21" />
    </>
  ),
  tag: (
    <>
      <path d="M9.75 3.75H5.25A1.5 1.5 0 0 0 3.75 5.25v4.5c0 .4.16.78.44 1.06l8.25 8.25a1.5 1.5 0 0 0 2.12 0l4.5-4.5a1.5 1.5 0 0 0 0-2.12l-8.25-8.25a1.5 1.5 0 0 0-1.06-.44Z" />
      <path d="M6.75 6.75h.01" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5.25-9 5.25-9-5.25L12 3Z" />
      <path d="m3 12 9 5.25L21 12m-18 4.5L12 21.75l9-5.25" />
    </>
  ),
  cart: (
    <>
      <path d="M6 7.5h12l-1 12H7l-1-12Z" />
      <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
    </>
  ),
  wallet: (
    <>
      <path d="M3.75 7.5h16.5v9.75a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V7.5Z" />
      <path d="M3.75 7.5V6A2.25 2.25 0 0 1 6 3.75h9" />
      <path d="M16.5 12.75h.01" />
    </>
  ),
  users: (
    <>
      <path d="M15 19.5a6 6 0 0 0-12 0" />
      <circle cx="9" cy="7.5" r="3.75" />
      <path d="M16.5 19.5a6 6 0 0 0-3-5.2" />
      <path d="M15 11.25a3.75 3.75 0 1 0 0-7.5" />
    </>
  ),
  ticket: (
    <>
      <path d="M7.5 3.75h9A2.25 2.25 0 0 1 18.75 6v2.25a2.25 2.25 0 0 0 0 4.5V18a2.25 2.25 0 0 1-2.25 2.25h-9A2.25 2.25 0 0 1 5.25 18v-5.25a2.25 2.25 0 0 0 0-4.5V6A2.25 2.25 0 0 1 7.5 3.75Z" />
      <path d="M12 8.25v1.5M12 14.25v1.5" />
    </>
  ),
  star: (
    <>
      <path d="m11.48 3.5 2.2 4.46 4.92.72-3.56 3.47.84 4.9-4.4-2.31-4.4 2.31.84-4.9L4.36 8.68l4.92-.72 2.2-4.46Z" />
    </>
  ),
  image: (
    <>
      <rect x="3.75" y="5.25" width="16.5" height="13.5" rx="2" />
      <path d="m6.75 15.75 3-3 3.75 3.75" />
      <path d="M14.25 9h.01" />
    </>
  ),
  file: (
    <>
      <path d="M6.75 3.75h6l4.5 4.5v12H6.75V3.75Z" />
      <path d="M12.75 3.75v4.5h4.5M9 12h6M9 15h6" />
    </>
  ),
  truck: (
    <>
      <path d="M3.75 6.75h9v9h-9v-9Z" />
      <path d="M12.75 9.75h3l3 3v3h-6v-6Z" />
      <circle cx="6.75" cy="17.25" r="1.5" />
      <circle cx="15.75" cy="17.25" r="1.5" />
    </>
  ),
  chart: (
    <>
      <path d="M3.75 20.25h16.5" />
      <path d="M6.75 16.5V12m5 4.5V7.5m5 9v-6" />
    </>
  ),
  settings: (
    <>
      <path d="M4 6h7m4 0h5M4 12h3m4 0h9M4 18h9m4 0h3" />
      <circle cx="13" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="15" cy="18" r="2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5.25 5.25v6c0 4.14 2.86 7.4 6.75 9.75 3.89-2.35 6.75-5.61 6.75-9.75v-6L12 3Z" />
      <path d="m9.75 11.75 1.75 1.75 3.25-3.5" />
    </>
  ),
  menu: (
    <>
      <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </>
  ),
  close: (
    <>
      <path d="M6 18 18 6M6 6l12 12" />
    </>
  ),
  external: (
    <>
      <path d="M13.5 6H18m0 0v4.5M18 6l-7.5 7.5" />
      <path d="M6 6h4.5M6 6v12h12v-4.5" />
    </>
  ),
  logout: (
    <>
      <path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15" />
      <path d="M12 9l3 3-3 3m3-3H3" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14m0 0-6-6m6 6-6 6" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
