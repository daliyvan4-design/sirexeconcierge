"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/admin/topbar";
import { KpiCard } from "@/components/admin/kpi-card";
import { Building2, Clock, CheckCircle2, Users } from "lucide-react";

interface InstitutionOrder {
  id: string;
  reference: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nationalite: string;
  dateArrivee: string;
  dateDepart: string;
  nombrePersonnes: number;
  statut: string;
  montantTotal: number;
  devise: string;
  createdAt: string;
}

interface InstitutionStats {
  total: number;
  pending: number;
  confirmed: number;
  totalPax: number;
  totalCA: number;
  upcoming: number;
}

interface InstitutionData {
  orders: InstitutionOrder[];
  stats: InstitutionStats;
}

const STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMEE: "bg-emerald-100 text-emerald-800",
  ANNULEE: "bg-red-100 text-red-800",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatXOF(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " F";
}

export function DashboardInstitutionnel() {
  const [data, setData] = useState<InstitutionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats/institutionnel")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  return (
    <>
      <Topbar title="Réservations Institutionnelles" subtitle="Délégations VIP · État" />
      <div className="p-6 lg:p-10">
        {loading ? (
          <div className="text-center text-mute py-20">Chargement…</div>
        ) : !data ? (
          <div className="text-center text-mute py-20">Erreur de chargement</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <KpiCard
                label="Réservations"
                value={String(data.stats.total)}
                sub="Institutionnelles"
                trend={{ value: "VIP", type: "success" }}
              />
              <KpiCard
                label="En attente"
                value={String(data.stats.pending)}
                sub="À traiter"
                trend={data.stats.pending > 0 ? { value: `${data.stats.pending} en cours`, type: "warning" } : undefined}
              />
              <KpiCard
                label="Confirmées"
                value={String(data.stats.confirmed)}
                sub="Validées"
              />
              <KpiCard
                label="Passagers VIP"
                value={String(data.stats.totalPax)}
                sub={`CA: ${formatXOF(data.stats.totalCA)}`}
              />
            </div>

            <div className="bg-white rounded-2xl border border-line shadow-card">
              <div className="px-5 py-4 flex items-center justify-between">
                <h3 className="font-serif text-[18px] text-ink">Délégations</h3>
                <span className="text-[11px] text-mute">{data.orders.length} réservation{data.orders.length > 1 ? "s" : ""}</span>
              </div>
              {data.orders.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <Building2 size={40} className="mx-auto text-mute/30 mb-3" />
                  <p className="text-mute text-[13px]">Aucune réservation institutionnelle</p>
                </div>
              ) : (
                <table className="w-full text-[13px]">
                  <thead className="text-[10px] uppercase tracking-[0.18em] text-mute bg-cream/50">
                    <tr>
                      <th className="text-left font-medium px-5 py-3">Référence</th>
                      <th className="text-left font-medium px-5 py-3">Délégué</th>
                      <th className="text-left font-medium px-5 py-3">Nationalité</th>
                      <th className="text-left font-medium px-5 py-3">Séjour</th>
                      <th className="text-center font-medium px-5 py-3">Pax</th>
                      <th className="text-right font-medium px-5 py-3">Montant</th>
                      <th className="text-center font-medium px-5 py-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {data.orders.map((o) => (
                      <tr key={o.id} className="hover:bg-cream/40">
                        <td className="px-5 py-4 mono text-[12px] text-mute">{o.reference}</td>
                        <td className="px-5 py-4">
                          <p className="text-ink font-medium">{o.prenom} {o.nom}</p>
                          <p className="text-[11px] text-mute">{o.email}</p>
                        </td>
                        <td className="px-5 py-4">{o.nationalite}</td>
                        <td className="px-5 py-4 text-mute">
                          {formatDate(o.dateArrivee)} → {formatDate(o.dateDepart)}
                        </td>
                        <td className="px-5 py-4 text-center mono">{o.nombrePersonnes}</td>
                        <td className="px-5 py-4 text-right mono text-ink font-medium">
                          {formatXOF(o.montantTotal)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[o.statut] || "bg-gray-100 text-gray-600"}`}>
                            {o.statut.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
