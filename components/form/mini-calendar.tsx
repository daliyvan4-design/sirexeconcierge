"use client";

import { useTranslations } from "next-intl";

interface MiniCalendarProps {
  startDay?: number;
  endDay?: number;
}

export function MiniCalendar({ startDay = 12, endDay = 16 }: MiniCalendarProps) {
  const t = useTranslations("s2");
  const startOffset = 6; // Mar 1 2026 is Sunday, week starts Monday
  const totalDays = 31;

  const days: { num: number; cls: string }[] = [];

  // Previous month filler days (Feb 22-28)
  for (let i = 0; i < startOffset; i++) {
    days.push({ num: 22 + i, cls: "cal-day muted" });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    let cls = "cal-day";
    if (d > startDay && d < endDay) cls += " in-range";
    if (d === startDay) cls += " start";
    if (d === endDay) cls += " end";
    days.push({ num: d, cls });
  }

  // Next month filler days
  const cells = startOffset + totalDays;
  for (let i = 1; cells + i <= 42; i++) {
    days.push({ num: i, cls: "cal-day muted" });
  }

  const dowKeys = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <div className="bg-white rounded-xl p-4 border border-line">
      <div className="flex items-center justify-between mb-3">
        <button type="button" className="text-mute hover:text-ink">&lsaquo;</button>
        <p className="text-[13px] font-medium text-ink">{t("cal.month")}</p>
        <button type="button" className="text-mute hover:text-ink">&rsaquo;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-mute mb-1">
        {dowKeys.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div key={i} className={d.cls}>
            {d.num}
          </div>
        ))}
      </div>
    </div>
  );
}
