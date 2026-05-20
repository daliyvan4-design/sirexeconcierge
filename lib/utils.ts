import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const RATE: Record<string, number> = {
  XOF: 1,
  EUR: 1 / 655.957,
  USD: 1 / 600,
};

export const SYM: Record<string, string> = {
  XOF: "XOF",
  EUR: "€",
  USD: "$",
};

export function fmt(amountXof: number, currency: string = "XOF"): string {
  const v = amountXof * RATE[currency];
  if (currency === "XOF")
    return (
      Math.round(v)
        .toLocaleString("fr-FR")
        .replace(/,/g, " ") + " XOF"
    );
  if (currency === "EUR")
    return v.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";
  return "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
