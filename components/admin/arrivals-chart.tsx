"use client";

interface ArrivalsChartProps {
  data: Record<string, number>;
}

export function ArrivalsChart({ data }: ArrivalsChartProps) {
  const days: { date: string; label: string; count: number; isSirexe: boolean }[] = [];
  const baseDate = new Date("2026-03-11");

  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    const dayNum = d.getDate();
    const isSirexe = dayNum >= 15 && dayNum <= 17;
    days.push({ date: key, label: String(dayNum), count: data[key] || 0, isSirexe });
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <svg viewBox="0 0 600 180" className="w-full h-44">
      <line x1="0" x2="600" y1="160" y2="160" stroke="#E5E2D8" />
      {days.map((d, i) => {
        const x = 10 + i * 42;
        const h = (d.count / maxCount) * 140;
        const y = 160 - h;
        return (
          <g key={d.date}>
            <rect
              x={x}
              y={y}
              width="22"
              height={Math.max(h, 4)}
              rx="3"
              fill={d.isSirexe ? "#C9A84C" : "#1A1A2E"}
            />
            <text
              x={x + 11}
              y="175"
              textAnchor="middle"
              fontSize="10"
              fontFamily="Inter"
              fill={d.isSirexe ? "#C9A84C" : "#6B6B72"}
              fontWeight={d.isSirexe ? "600" : "400"}
            >
              {d.isSirexe && d.label === "15" ? "SIREXE" : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
