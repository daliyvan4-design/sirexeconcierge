import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  trend?: { value: string; type: "up" | "warning" | "success" };
}

export function KpiCard({ label, value, sub, trend }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-line p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.18em] text-mute">{label}</p>
        {trend && (
          <span
            className={`text-[11px] flex items-center gap-1 ${
              trend.type === "up" ? "text-ok" : trend.type === "warning" ? "text-err" : "text-ok"
            }`}
          >
            {trend.type === "up" && <TrendingUp size={12} />}
            {trend.type === "warning" && <AlertTriangle size={12} />}
            {trend.type === "success" && <CheckCircle2 size={12} />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="figure text-[40px] text-ink mt-3">{value}</p>
      <p className="text-[11px] text-mute mt-1">{sub}</p>
    </div>
  );
}
