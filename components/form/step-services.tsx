"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, CarFront, BedDouble, Utensils, Sparkles } from "lucide-react";
import type { CartState } from "./wizard-shell";
import type { ServiceGroups, ServiceItem } from "@/components/services/types";
import { TransportCard } from "@/components/services/transport-card";
import { HotelCard } from "@/components/services/hotel-card";
import { MealToggle } from "@/components/services/meal-toggle";
import { ExtraPill } from "@/components/services/extra-pill";
import { StickyCart } from "@/components/services/sticky-cart";
import { Check } from "lucide-react";

type Tab = "transport" | "hotel" | "meals" | "extras";

const TABS: { key: Tab; icon: typeof CarFront }[] = [
  { key: "transport", icon: CarFront },
  { key: "hotel", icon: BedDouble },
  { key: "meals", icon: Utensils },
  { key: "extras", icon: Sparkles },
];

interface StepServicesProps {
  cart: CartState;
  setCart: React.Dispatch<React.SetStateAction<CartState>>;
  pax: number;
  nights: number;
  onNext: () => void;
  onBack: () => void;
}

export function StepServices({
  cart,
  setCart,
  pax,
  nights,
  onNext,
  onBack,
}: StepServicesProps) {
  const t = useTranslations("s3");
  const [tab, setTab] = useState<Tab>("transport");
  const [services, setServices] = useState<ServiceGroups | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data: ServiceGroups) => setServices(data))
      .catch(() => {});
  }, []);

  /* ---------- cart helpers ---------- */
  const setTransportQty = (id: string, qty: number) => {
    setCart((prev) => {
      const next = { ...prev, transport: { ...prev.transport } };
      if (qty <= 0) delete next.transport[id];
      else next.transport[id] = qty;
      return next;
    });
  };

  const pickHotel = (id: string) => {
    setCart((prev) => {
      if (prev.hotel && prev.hotel.id === id) return { ...prev, hotel: null };
      return { ...prev, hotel: { id, nights: prev.nights } };
    });
  };

  const setHotelNights = (n: number) => {
    setCart((prev) => {
      if (!prev.hotel) return prev;
      return { ...prev, hotel: { ...prev.hotel, nights: n } };
    });
  };

  const toggleMeal = (id: string) => {
    setCart((prev) => {
      const next = { ...prev, meals: { ...prev.meals } };
      if (next.meals[id]) delete next.meals[id];
      else next.meals[id] = true;
      return next;
    });
  };

  const toggleExtra = (id: string) => {
    setCart((prev) => {
      const next = { ...prev, extras: new Set(prev.extras) };
      if (next.extras.has(id)) next.extras.delete(id);
      else next.extras.add(id);
      return next;
    });
  };

  /* ---------- cart totals ---------- */
  const { count, total } = useMemo(() => {
    if (!services) return { count: 0, total: 0 };
    let c = 0;
    let sum = 0;

    // transport
    const transportMap = new Map(services.transport.map((s) => [s.id, s]));
    for (const [id, qty] of Object.entries(cart.transport)) {
      if (qty > 0) {
        c++;
        const svc = transportMap.get(id);
        if (svc) sum += svc.prixBase * qty;
      }
    }

    // hotel
    if (cart.hotel) {
      c++;
      const hotel = services.hebergement.find((s) => s.id === cart.hotel!.id);
      if (hotel) sum += hotel.prixBase * cart.hotel.nights;
    }

    // meals
    const mealMap = new Map(services.repas.map((s) => [s.id, s]));
    for (const [id, on] of Object.entries(cart.meals)) {
      if (on) {
        c++;
        const svc = mealMap.get(id);
        if (svc) sum += svc.prixBase * pax;
      }
    }

    // extras
    const extraMap = new Map(services.extra.map((s) => [s.id, s]));
    for (const id of Array.from(cart.extras)) {
      c++;
      const svc = extraMap.get(id);
      if (svc) sum += svc.prixBase;
    }

    return { count: c, total: sum };
  }, [cart, services, pax]);

  /* ---------- tab counts ---------- */
  const tabCounts = useMemo(() => {
    if (!services) return { transport: 0, hotel: 0, meals: 0, extras: 0 };
    return {
      transport: services.transport.length,
      hotel: services.hebergement.length,
      meals: services.repas.length,
      extras: services.extra.length,
    };
  }, [services]);

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-10 pb-40">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onBack}
            className="text-[13px] text-mute hover:text-ink flex items-center gap-1.5"
          >
            <ArrowLeft size={14} className="rtl:rotate-180" />
            <span>{t("back")}</span>
          </button>
          <span className="text-[11px] uppercase tracking-[0.22em] text-mute">
            {t("step")}
          </span>
        </div>
        {/* Progress pills */}
        <div className="flex items-center gap-3">
          <span className="pill-step bg-ok text-cream">
            <Check size={12} />
          </span>
          <span className="pill-line bg-ok" />
          <span className="pill-step bg-ink text-gold">2</span>
          <span className="pill-line bg-ink/10" />
          <span className="pill-step bg-cream2 text-ink/40 border border-line">
            3
          </span>
        </div>
        <h2 className="font-serif text-[32px] sm:text-[40px] text-ink mt-6">
          {t("title")}
        </h2>
        <p className="text-mute mt-1 max-w-2xl text-[15px]">{t("lead")}</p>
      </div>

      {/* Tab strip */}
      <div className="bg-white rounded-2xl border border-line shadow-card mb-6 sticky top-16 z-20">
        <div className="overflow-x-auto flex items-center gap-1 p-1.5">
          {TABS.map(({ key, icon: TabIcon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-colors ${
                tab === key
                  ? "bg-ink text-cream"
                  : "text-ink hover:bg-cream2"
              }`}
            >
              <TabIcon size={16} />
              <span>{t(`tab.${key}`)}</span>
              <span className="mono text-[10px] bg-cream2 text-mute rounded-full px-2 py-0.5">
                {tabCounts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Panels */}
      {tab === "transport" && (
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.22em] text-mute mb-4">
            {t("sec.transport")}
          </h3>
          <div className="space-y-3">
            {services?.transport.map((s) => (
              <TransportCard
                key={s.id}
                service={s}
                qty={cart.transport[s.id] || 0}
                onQtyChange={(v) => setTransportQty(s.id, v)}
              />
            ))}
          </div>
        </div>
      )}

      {tab === "hotel" && (
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.22em] text-mute mb-4">
            {t("sec.hotel")}
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {services?.hebergement.map((s) => (
              <HotelCard
                key={s.id}
                service={s}
                selected={cart.hotel?.id === s.id}
                nights={cart.hotel?.id === s.id ? cart.hotel.nights : nights}
                defaultNights={nights}
                onSelect={() => pickHotel(s.id)}
                onNightsChange={setHotelNights}
              />
            ))}
          </div>
        </div>
      )}

      {tab === "meals" && (
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.22em] text-mute mb-4">
            {t("sec.meals")}
          </h3>
          <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
            {services?.repas.map((s, i) => (
              <MealToggle
                key={s.id}
                service={s}
                on={!!cart.meals[s.id]}
                onToggle={() => toggleMeal(s.id)}
                isFirst={i === 0}
              />
            ))}
          </div>
        </div>
      )}

      {tab === "extras" && (
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.22em] text-mute mb-4">
            {t("sec.extras")}
          </h3>
          <div className="flex flex-wrap gap-3">
            {services?.extra.map((s) => (
              <ExtraPill
                key={s.id}
                service={s}
                active={cart.extras.has(s.id)}
                onToggle={() => toggleExtra(s.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sticky cart */}
      <StickyCart count={count} total={total} onNext={onNext} />
    </div>
  );
}
