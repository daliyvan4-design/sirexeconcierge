"use client";

export function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-[42px] h-6 rounded-full transition-colors cursor-pointer ${
        on ? "bg-ink" : "bg-line"
      }`}
    >
      <span
        className={`absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
          on ? "left-5" : "left-[2px]"
        }`}
      />
    </button>
  );
}
