export const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

export const numberOrNull = (formData: FormData, key: string) => {
  const value = text(formData, key);
  return value === "" ? null : Number(value);
};

export const bool = (formData: FormData, key: string) =>
  formData.get(key) === "on" || formData.get(key) === "true";

export const list = (formData: FormData, key: string) => {
  const value = text(formData, key);
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : null;
};

export const dateOrNull = (formData: FormData, key: string) => {
  const value = text(formData, key);
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};
