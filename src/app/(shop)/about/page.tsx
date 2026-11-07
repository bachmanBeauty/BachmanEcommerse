import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "আমাদের গল্প",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
        আমাদের গল্প
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl">
        আসল রুটিনের জন্য তৈরি স্কিনকেয়ার।
      </h1>

      <div className="mt-8 space-y-5 text-base leading-relaxed text-neutral-700">
        <p>
          স্কিনকেয়ারকে ঘিরে অনেক হৈচৈ আর জটিলতা দেখে বাচম্যান বিউটির শুরু। অনেক
          প্রোডাক্ট, অনেক দাবি — কিন্তু আমাদের ত্বক আর আবহাওয়ার জন্য খুব কম।
        </p>
        <p>
          তাই আমরা একটা ছোট, ফোকাসড কালেকশন গড়ছি — ক্লিনজার, সিরাম,
          ময়েশ্চারাইজার আর সানস্ক্রিন। আর্দ্র গ্রীষ্ম, ধুলোভরা শীত আর
          বাংলাদেশের প্রতিদিনের জীবনের কথা ভেবে বাছাই করা। প্রতিটি প্রোডাক্ট
          আসল, স্পষ্টভাবে ব্যাখ্যা করা, আর সহজে মানা যায় এমন।
        </p>
        <p>
          কোনো অলৌকিক দাবি নেই। শুধু সৎ ফর্মুলা, যত্নের বাছাই আর এমন একটা টিম —
          যাদের সাথে আপনি সত্যিই কথা বলতে পারবেন।
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/shop">শপ দেখুন</ButtonLink>
        <ButtonLink href="/contact" variant="outline">
          যোগাযোগ করুন
        </ButtonLink>
      </div>
    </div>
  );
}
