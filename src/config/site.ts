export const siteConfig = {
  name: "Bachman Beauty",
  description: "Skincare essentials for healthy, glowing skin.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_BD",
  currency: "BDT",
  contact: {
    phone: "",
    email: "",
  },
} as const;
