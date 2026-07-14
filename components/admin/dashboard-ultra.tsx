"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/admin/topbar";
import { KpiCard } from "@/components/admin/kpi-card";
import { BreakdownBars } from "@/components/admin/breakdown-bars";
import { OrdersTable } from "@/components/admin/orders-table";
import { fmt } from "@/lib/utils";

export function DashboardUltra() {
  const [stats, setStats] = useState<any>(null);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
    fetch("/api/admin/stats/breakdown").then((r) => r.json()).then(setBreakdown);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ page: "1", limit: "8" });
    if (filter) params.set("status", filter);
    fetch(`/api/admin/commandes?${params}`).then((r) => r.json()).then((d) => setOrders(d.orders || []));
  }, [filter]);

  const ordersChange =
    stats && stats.ordersYesterday > 0
      ? Math.round(((stats.ordersToday - stats.ordersYesterday) / stats.ordersYesterday) * 100)
      : 0;
  const caChange =
    stats && stats.caYesterday > 0
      ? Math.round(((stats.caToday - stats.caYesterday) / stats.caYesterday) * 100)
      : 0;
  const confRate =
    stats && stats.monthTotal > 0
      ? Math.round((stats.monthConfirmed / stats.monthTotal) * 100)
      : 0;

  return (
    <>
      <Topbar title="Tableau de bord" subtitle="AIKO Board · 2026" />
      <div className="p-6 lg:p-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KpiCard
            label="Commandes aujourd'hui"
            value={String(stats?.ordersToday ?? "—")}
            sub={`vs. ${stats?.ordersYesterday ?? "—"} hier`}
            trend={ordersChange !== 0 ? { value: `${ordersChange > 0 ? "+" : ""}${ordersChange}%`, type: "up" } : undefined}
          />
          <KpiCard
            label="CA du jour"
            value={stats ? fmt(stats.caToday) : "—"}
            sub={stats ? `≈ ${fmt(stats.caToday, "EUR")}` : ""}
            trend={caChange !== 0 ? { value: `${caChange > 0 ? "+" : ""}${caChange}%`, type: "up" } : undefined}
          />
          <KpiCard
            label="En attente"
            value={String(stats?.pending ?? "—")}
            sub="À traiter sous 2h"
            trend={stats?.pending > 3 ? { value: `${stats.pending} urgents`, type: "warning" } : undefined}
          />
          <KpiCard
            label="Confirmées"
            value={String(stats?.monthConfirmed ?? "—")}
            sub={`Sur ${stats?.monthTotal ?? "—"} ce mois`}
            trend={confRate > 0 ? { value: `${confRate}%`, type: "success" } : undefined}
          />
        </div>

        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-line p-5 shadow-card max-w-md">
            <h3 className="font-serif text-[18px] text-ink mb-5">Répartition CA · ce mois</h3>
            <BreakdownBars data={breakdown} />
          </div>
        </div>

        <OrdersTable orders={orders} filter={filter} onFilterChange={setFilter} />
      </div>
    </>
  );
}
