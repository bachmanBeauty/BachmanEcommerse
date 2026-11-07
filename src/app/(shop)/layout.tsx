import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StoreProvider } from "@/components/store/store-provider";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen flex-col bg-[#fff7ee]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </StoreProvider>
  );
}
