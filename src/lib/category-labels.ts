const categoryLabels: Record<string, string> = {
  cleanser: "ক্লিনজার",
  toner: "টোনার",
  serum: "সিরাম",
  moisturizer: "ময়েশ্চারাইজার",
  sunscreen: "সানস্ক্রিন",
  "face-mask": "ফেস মাস্ক",
};

export function categoryLabel(
  slug: string | null | undefined,
  fallback: string,
) {
  if (!slug) return fallback;
  return categoryLabels[slug] ?? fallback;
}
