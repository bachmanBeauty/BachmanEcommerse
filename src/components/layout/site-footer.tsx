import Link from "next/link";
import { siteConfig } from "@/config/site";

const shopLinks = [
  { href: "/shop?category=cleanser", label: "ক্লিনজার" },
  { href: "/shop?category=toner", label: "টোনার" },
  { href: "/shop?category=serum", label: "সিরাম" },
  { href: "/shop?category=moisturizer", label: "ময়েশ্চারাইজার" },
  { href: "/shop?category=sunscreen", label: "সানস্ক্রিন" },
];

const helpLinks = [
  { href: "/shop", label: "সব প্রোডাক্ট" },
  { href: "/about", label: "আমাদের গল্প" },
  { href: "/contact", label: "যোগাযোগ করুন" },
  { href: "/track", label: "অর্ডার ট্র্যাক করুন" },
];

export function SiteFooter() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:pr-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff7ee] font-serif text-base text-neutral-900">
              B
            </span>
            <span className="font-serif text-xl text-white">
              {siteConfig.name}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
            প্রতিদিনের রুটিনের জন্য যত্নে তৈরি স্কিনকেয়ার। সৎ উপাদান, কোমল
            ফর্মুলা, দৃশ্যমান ফলাফল।
          </p>
          <div className="mt-5 flex gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 text-neutral-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true">
                <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="5" />
                <circle cx="12" cy="12" r="3.75" />
                <path d="M17.25 6.75h.01" />
              </svg>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 text-neutral-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.24-1.46 1.5-1.46h1.6V4.45A21 21 0 0 0 14.3 4c-2.33 0-3.93 1.42-3.93 4.04v2.46H7.75v3h2.62V21h3.13Z" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            শপ
          </p>
          <ul className="mt-4 space-y-2.5">
            {shopLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            সহায়তা
          </p>
          <ul className="mt-4 space-y-2.5">
            {helpLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="text-sm text-neutral-500">
              ডেলিভারি ও রিটার্ন নীতি
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            যোগাযোগ
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-neutral-400">
            <li>
              <a
                href={`mailto:${siteConfig.contact.email || "hello@bachmanbeauty.com"}`}
                className="transition-colors hover:text-white"
              >
                {siteConfig.contact.email || "hello@bachmanbeauty.com"}
              </a>
            </li>
            <li>{siteConfig.contact.phone || "ফোন নম্বর শীঘ্রই আসছে"}</li>
            <li>ঢাকা, বাংলাদেশ</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-neutral-500">
            © {siteConfig.copyrightYear} {siteConfig.name}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {["ক্যাশ অন ডেলিভারি", "বিকাশ", "নগদ"].map((method) => (
              <span
                key={method}
                className="rounded-full border border-neutral-800 px-2.5 py-1 text-[10px] uppercase tracking-wide text-neutral-400"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
