export function formatPrice(value: number) {
  return `৳${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
