import type { AuthState } from "@/actions/auth";

export function FormMessage({ state }: { state: AuthState }) {
  if (!state?.error && !state?.success) return null;

  const isError = Boolean(state.error);

  return (
    <p
      role="status"
      className={
        isError
          ? "rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
          : "rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
      }
    >
      {isError ? state.error : state.success}
    </p>
  );
}
