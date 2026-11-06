"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/store/store-provider";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount, hydrated } = useStore();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="bg-neutral-900 px-4 py-2 text-center text-[11px] tracking-wide text-white sm:text-xs">
        Cash on delivery across Bangladesh · Free delivery over ৳2,000 inside
        Dhaka
      </div>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-serif text-xl tracking-tight text-neutral-900 sm:text-2xl"
        >
          Bachman Beauty
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/account"
            aria-label="Account"
            className="rounded-full p-2 text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
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
            aria-label="Cart"
            className="relative rounded-full p-2 text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 7.5h12l-1 12H7l-1-12Zm3 0V6a3 3 0 0 1 6 0v1.5"
              />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
              {hydrated ? cartCount : 0}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-full p-2 text-neutral-700 transition-colors hover:bg-neutral-100 md:hidden"
          >
            {open ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
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
                strokeWidth="1.7"
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
          className="border-t border-neutral-200 bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-neutral-100 py-3 text-sm text-neutral-700 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="py-3 text-sm text-neutral-700"
            >
              My account
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="py-3 text-sm text-neutral-700"
            >
              Wishlist
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
