"use client";

import { Trash2 } from "lucide-react";
import { RATE } from "@/lib/utils";

interface TariffRowProps {
  tarif: { id: string; label: string; prix: number };
  serviceActif: boolean;
  onLabelChange: (id: string, label: string) => void;
  onPriceChange: (id: string, prix: number) => void;
  onToggleVisible: (visible: boolean) => void;
  onDelete: (id: string) => void;
}

export function TariffRow({ tarif, serviceActif, onLabelChange, onPriceChange, onToggleVisible, onDelete }: TariffRowProps) {
  return (
    <tr className="group">
      <td className="px-5 py-3 text-ink">
        <input
          defaultValue={tarif.label}
          onBlur={(e) => onLabelChange(tarif.id, e.target.value)}
          className="bg-transparent w-full focus:bg-cream rounded px-1 py-0.5"
        />
      </td>
      <td className="px-5 py-3 text-right">
        <input
          defaultValue={Math.round(tarif.prix).toLocaleString("fr-FR").replace(/,/g, " ")}
          onBlur={(e) => {
            const v = parseInt(e.target.value.replace(/\D/g, "")) || 0;
            onPriceChange(tarif.id, v);
          }}
          className="bg-transparent text-right mono w-28 focus:bg-cream rounded px-2 py-1 text-ink font-semibold"
        />
      </td>
      <td className="px-5 py-3 text-right mono text-mute">
        {Math.round(tarif.prix * RATE.EUR)} €
      </td>
      <td className="px-5 py-3 text-right mono text-mute">
        ${Math.round(tarif.prix * RATE.USD)}
      </td>
      <td className="px-5 py-3 text-right">
        <button
          onClick={() => onToggleVisible(!serviceActif)}
          className={`relative w-[42px] h-6 rounded-full transition-colors cursor-pointer inline-block align-middle ${
            serviceActif ? "bg-ink" : "bg-line"
          }`}
        >
          <span
            className={`absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
              serviceActif ? "left-5" : "left-[2px]"
            }`}
          />
        </button>
      </td>
      <td className="px-5 py-3 text-right">
        <button
          onClick={() => onDelete(tarif.id)}
          className="text-mute opacity-0 group-hover:opacity-100 transition hover:text-err"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
