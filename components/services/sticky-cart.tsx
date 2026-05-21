"use client";

import { useTranslations } from "next-intl";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { fmt } from "@/lib/utils";

interface StickyCartProps {
  count: number;
  total: number;
  onNext: () => void;
}

export function StickyCart({ count, total, onNext }: StickyCartProps) {
  const t = useTranslations("s3");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="bg-ink text-cream rounded-2xl shadow-float p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cream/10 flex items-center justify-center">
              <ShoppingBag className="text-gold" size={22} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cream/60">
                {t("cart.label")}
              </p>
              <p className="text-[15px] mt-0.5">
                <span className="font-semibold">{count}</span>{" "}
                {t("cart.svcs")}{" "}
                <span className="figure text-gold text-[20px] ml-1">
                  {fmt(total)}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNext}
            className="btn-press inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold2 text-ink rounded-full px-6 py-3.5 text-[14px] font-semibold"
          >
            <span>{t("cart.cta")}</span>
            <ArrowRight size={16} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
