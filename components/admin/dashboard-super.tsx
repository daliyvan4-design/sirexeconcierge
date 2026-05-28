"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/admin/topbar";
import { KpiCard } from "@/components/admin/kpi-card";
import { TeamLoadCard } from "@/components/admin/team-load-card";
import { OrdersTable } from "@/components/admin/orders-table";

interface TeamData {
  concierges: {
    id: string;
    nom: string;
    initials: string;
    activeClients: number;
    lastNoteDate: string | null;
  }[];
  activeClientsTotal: number;
  conciergesActifs: number;
}

export function DashboardSuper() {
  const [stats, setStats] = useState<any>(null);
  const [team, setTeam] = useState<TeamData | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
    fetch("/api/admin/stats/team").then((r) => r.json()).then(setTeam);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ page: "1", limit: "8" });
    if (filter) params.set("status", filter);
    fetch(`/api/admin/commandes?${params}`).then((r) => r.json()).then((d) => setOrders(d.orders || []));
  }, [filter]);

  return (
    <>
      <Topbar title="Tableau de bord" subtitle="Gestion de l'équipe" />
      <div className="p-6 lg:p-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KpiCard
            label="Commandes aujourd'hui"
            value={String(stats?.ordersToday ?? "—")}
            sub={`vs. ${stats?.ordersYesterday ?? "—"} hier`}
          />
          <KpiCard
            label="En attente"
            value={String(stats?.pending ?? "—")}
            sub="À traiter sous 2h"
            trend={stats?.pending > 3 ? { value: `${stats.pending} urgents`, type: "warning" } : undefined}
          />
          <KpiCard
            label="Clients actifs"
            value={String(team?.activeClientsTotal ?? "—")}
            sub="Ce mois"
          />
          <KpiCard
            label="Concierges actifs"
            value={String(team?.conciergesActifs ?? "—")}
            sub="En service"
            trend={team ? { value: `${team.conciergesActifs}`, type: "success" } : undefined}
          />
        </div>

        <div className="mb-8">
          {team && <TeamLoadCard concierges={team.concierges} />}
        </div>

        <OrdersTable orders={orders} filter={filter} onFilterChange={setFilter} />
      </div>
    </>
  );
}
