import Link from "next/link";
import { siteConfig } from "@/config/site";

const shopLinks = [
  { href: "/shop?category=cleanser", label: "Cleanser" },
  { href: "/shop?category=toner", label: "Toner" },
  { href: "/shop?category=serum", label: "Serum" },
  { href: "/shop?category=moisturizer", label: "Moisturizer" },
  { href: "/shop?category=sunscreen", label: "Sunscreen" },
];

const helpLinks = [
  { href: "/contact", label: "Contact us" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About us" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-xl text-neutral-900">{siteConfig.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-600">
            Thoughtfully formulated skincare for everyday routines. Honest
            ingredients, gentle formulas, visible results.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
            Shop
          </p>
          <ul className="mt-4 space-y-2.5">
            {shopLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-neutral-600 transition-colors hover:text-rose-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
            Help
          </p>
          <ul className="mt-4 space-y-2.5">
            {helpLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-neutral-600 transition-colors hover:text-rose-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="text-sm text-neutral-600">
              Delivery &amp; returns policy
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
            Get in touch
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-neutral-600">
            <li>
              <a
                href={`mailto:${siteConfig.contact.email || "hello@bachmanbeauty.com"}`}
                className="transition-colors hover:text-rose-600"
              >
                {siteConfig.contact.email || "hello@bachmanbeauty.com"}
              </a>
            </li>
            <li>{siteConfig.contact.phone || "Phone number coming soon"}</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.name}. All rights reserved.
          </p>
          <p>Cash on Delivery · bKash · Nagad</p>
        </div>
      </div>
    </footer>
  );
}
