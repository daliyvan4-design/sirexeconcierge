const STATUSES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  CONFIRMEE: { bg: "bg-ok/10", text: "text-ok", dot: "bg-ok", label: "Confirmée" },
  EN_ATTENTE: { bg: "bg-gold/15", text: "text-gold2", dot: "bg-gold", label: "En attente" },
  ANNULEE: { bg: "bg-err/10", text: "text-err", dot: "bg-err", label: "Annulée" },
  PAYEE: { bg: "bg-ok/10", text: "text-ok", dot: "bg-ok", label: "Payée" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUSES[status] || STATUSES.EN_ATTENTE;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] ${s.bg} ${s.text} rounded-full px-2.5 py-1`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
