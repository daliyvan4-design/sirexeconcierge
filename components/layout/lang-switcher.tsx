"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

const LOCALES = ["fr", "en", "ar"] as const;

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex items-center gap-0">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span className="w-px h-[10px] bg-cream/15" />
          )}
          <button
            onClick={() => switchLocale(l)}
            className={`px-[10px] py-1 text-[11px] font-medium tracking-[0.14em] transition-colors ${
              locale === l
                ? "text-gold"
                : "text-cream/45 hover:text-cream/85"
            }`}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
