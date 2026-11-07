export function formatPrice(value: number) {
  return `৳${value.toLocaleString("bn-BD", { maximumFractionDigits: 0 })}`;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
