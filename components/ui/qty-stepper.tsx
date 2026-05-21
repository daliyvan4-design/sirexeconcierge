"use client";
import { Minus, Plus } from "lucide-react";

interface QtyStepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

export function QtyStepper({ value, onChange, min = 0, max = 20 }: QtyStepperProps) {
  return (
    <div className="inline-flex items-center border border-ink/10 rounded-full bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 inline-flex items-center justify-center text-ink hover:bg-ink/5"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-[28px] text-center mono text-[13px] font-medium">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 inline-flex items-center justify-center text-ink hover:bg-ink/5"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
