"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/store/store-provider";

const navigation = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount, hydrated } = useStore();

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-neutral-950 px-4 py-2 text-center text-[11px] tracking-wide text-neutral-200 sm:text-xs">
        Free delivery over ৳2,000 inside Dhaka · Cash on delivery nationwide
      </div>

      <div className="border-b border-neutral-200/70 bg-[#fbf8f4]/90 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 font-serif text-base text-white">
              B
            </span>
            <span className="font-serif text-lg tracking-tight text-neutral-900 sm:text-xl">
              Bachman Beauty
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium tracking-wide text-neutral-600 transition-colors hover:text-neutral-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="rounded-full p-2.5 text-neutral-700 transition-colors hover:bg-neutral-900/5"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-[19px] w-[19px]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0 4.5-7.5 9.75-9 10.5-1.5-.75-9-6-9-10.5A4.5 4.5 0 0 1 12 5.4a4.5 4.5 0 0 1 9 2.85Z"
                />
              </svg>
            </Link>

            <Link
              href="/account"
              aria-label="Account"
              className="hidden rounded-full p-2.5 text-neutral-700 transition-colors hover:bg-neutral-900/5 sm:block"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-[19px] w-[19px]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                />
              </svg>
            </Link>

            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="relative rounded-full p-2.5 text-neutral-700 transition-colors hover:bg-neutral-900/5"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-[19px] w-[19px]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 7.5h12l-1 12H7l-1-12Zm3 0V6a3 3 0 0 1 6 0v1.5"
                />
              </svg>
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
                {hydrated ? cartCount : 0}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Close menu" : "Open menu"}
              className="rounded-full p-2.5 text-neutral-700 transition-colors hover:bg-neutral-900/5 md:hidden"
            >
              {open ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile"
            className="border-t border-neutral-200/70 bg-[#fbf8f4] md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-neutral-200/60 py-3.5 text-sm font-medium text-neutral-800 last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="border-b border-neutral-200/60 py-3.5 text-sm text-neutral-600"
              >
                My account
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="py-3.5 text-sm text-neutral-600"
              >
                Wishlist
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
