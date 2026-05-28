# Role-Specific Dashboards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the admin dashboard show role-appropriate content — full financial view for Ultra Admin, team management for Super Admin, and enriched briefing for Concierge.

**Architecture:** One server component (`dashboard/page.tsx`) reads the session role and renders one of three client components: `DashboardUltra`, `DashboardSuper`, or `DashboardConcierge`. Each client component fetches its own data from dedicated API endpoints.

**Tech Stack:** Next.js 14 App Router, Prisma/PostgreSQL, NextAuth.js v4, Tailwind with SIREXE tokens, lucide-react icons.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `components/admin/dashboard-ultra.tsx` | Ultra Admin dashboard (extracted from current page) |
| Create | `app/api/admin/stats/team/route.ts` | Team load API for Super Admin |
| Create | `components/admin/team-load-card.tsx` | Concierge workload table with progress bars |
| Create | `components/admin/dashboard-super.tsx` | Super Admin dashboard |
| Create | `app/api/admin/stats/concierge/route.ts` | Concierge briefing data API |
| Create | `components/admin/day-timeline.tsx` | Consolidated daily timeline across clients |
| Create | `components/admin/dashboard-concierge.tsx` | Concierge briefing dashboard |
| Modify | `app/(admin)/dashboard/page.tsx` | Server component — role switch |

---

### Task 1: Extract DashboardUltra

**Files:**
- Create: `components/admin/dashboard-ultra.tsx`

- [ ] **Step 1: Create `components/admin/dashboard-ultra.tsx`**

Move the entire current dashboard client logic into this new file. The content is an exact copy of the current `dashboard/page.tsx` body, wrapped in a named export:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/admin/topbar";
import { KpiCard } from "@/components/admin/kpi-card";
import { ArrivalsChart } from "@/components/admin/arrivals-chart";
import { BreakdownBars } from "@/components/admin/breakdown-bars";
import { OrdersTable } from "@/components/admin/orders-table";
import { fmt } from "@/lib/utils";

export function DashboardUltra() {
  const [stats, setStats] = useState<any>(null);
  const [arrivals, setArrivals] = useState<Record<string, number>>({});
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
    fetch("/api/admin/stats/arrivals").then((r) => r.json()).then(setArrivals);
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
      <Topbar title="Tableau de bord" subtitle="Salon SIREXE 2026" />
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

        <div className="grid lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-line p-5 lg:col-span-2 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-[18px] text-ink">Arrivées prévues — 14 prochains jours</h3>
            </div>
            <ArrivalsChart data={arrivals} />
          </div>
          <div className="bg-white rounded-2xl border border-line p-5 shadow-card">
            <h3 className="font-serif text-[18px] text-ink mb-5">Répartition CA · ce mois</h3>
            <BreakdownBars data={breakdown} />
          </div>
        </div>

        <OrdersTable orders={orders} filter={filter} onFilterChange={setFilter} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/admin/dashboard-ultra.tsx
git commit -m "refactor: extract DashboardUltra component from dashboard page"
```

---

### Task 2: Team Load API

**Files:**
- Create: `app/api/admin/stats/team/route.ts`

- [ ] **Step 1: Create `app/api/admin/stats/team/route.ts`**

This API returns the list of active concierges with their client load and latest note date. Accessible by ULTRA_ADMIN and SUPER_ADMIN.

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const concierges = await prisma.adminUser.findMany({
    where: { role: "CONCIERGE", actif: true },
    select: {
      id: true,
      nom: true,
      assignments: {
        where: {
          actif: true,
          commande: { dateDepart: { gte: today } },
        },
        select: { id: true },
      },
      notes: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  const result = concierges.map((c) => {
    const words = c.nom.split(" ");
    const initials = words.map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return {
      id: c.id,
      nom: c.nom,
      initials,
      activeClients: c.assignments.length,
      lastNoteDate: c.notes[0]?.createdAt || null,
    };
  });

  return NextResponse.json({
    concierges: result,
    activeClientsTotal: result.reduce((s, c) => s + c.activeClients, 0),
    conciergesActifs: result.length,
  });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Test the API manually**

Run: `curl -s http://localhost:3000/api/admin/stats/team | head -5`
Expected: 401 (no auth) — confirms the route exists and auth works.

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/stats/team/route.ts
git commit -m "feat: add team load API for Super Admin dashboard"
```

---

### Task 3: TeamLoadCard Component

**Files:**
- Create: `components/admin/team-load-card.tsx`

- [ ] **Step 1: Create `components/admin/team-load-card.tsx`**

Displays a table of concierges with their client load and a relative progress bar.

```tsx
"use client";

interface ConciergeLoad {
  id: string;
  nom: string;
  initials: string;
  activeClients: number;
  lastNoteDate: string | null;
}

interface TeamLoadCardProps {
  concierges: ConciergeLoad[];
}

export function TeamLoadCard({ concierges }: TeamLoadCardProps) {
  const maxClients = Math.max(...concierges.map((c) => c.activeClients), 1);

  function timeAgo(dateStr: string | null): string {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `il y a ${days}j`;
  }

  return (
    <div className="bg-white rounded-2xl border border-line shadow-card">
      <div className="px-5 py-4">
        <h3 className="font-serif text-[18px] text-ink">Charge de l&apos;équipe</h3>
      </div>
      <table className="w-full text-[13px]">
        <thead className="text-[10px] uppercase tracking-[0.18em] text-mute bg-cream/50">
          <tr>
            <th className="text-left font-medium px-5 py-3">Concierge</th>
            <th className="text-left font-medium px-5 py-3">Clients actifs</th>
            <th className="text-left font-medium px-5 py-3">Charge</th>
            <th className="text-right font-medium px-5 py-3">Dernière activité</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {concierges.map((c) => (
            <tr key={c.id} className="hover:bg-cream/40">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-ink text-[11px] font-semibold font-serif">
                    {c.initials}
                  </div>
                  <span className="text-ink font-medium">{c.nom}</span>
                </div>
              </td>
              <td className="px-5 py-4 mono text-ink">{c.activeClients}</td>
              <td className="px-5 py-4 w-40">
                <div className="h-2 bg-cream rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ink rounded-full"
                    style={{ width: `${(c.activeClients / maxClients) * 100}%` }}
                  />
                </div>
              </td>
              <td className="px-5 py-4 text-right text-mute">{timeAgo(c.lastNoteDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {concierges.length === 0 && (
        <div className="px-5 py-8 text-center text-mute text-[13px]">Aucun concierge actif</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/admin/team-load-card.tsx
git commit -m "feat: add TeamLoadCard component for concierge workload display"
```

---

### Task 4: DashboardSuper Component

**Files:**
- Create: `components/admin/dashboard-super.tsx`

- [ ] **Step 1: Create `components/admin/dashboard-super.tsx`**

Super Admin dashboard with KPIs (commandes, pending, active clients, active concierges), team load section, and recent orders table.

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/admin/dashboard-super.tsx
git commit -m "feat: add DashboardSuper component with team load and KPIs"
```

---

### Task 5: Concierge Stats API

**Files:**
- Create: `app/api/admin/stats/concierge/route.ts`

- [ ] **Step 1: Create `app/api/admin/stats/concierge/route.ts`**

Returns assigned clients, today's planning entries, and recent notes for the logged-in concierge.

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { session, error } = await requireRole("CONCIERGE");
  if (error) return error;

  const userId = (session!.user as any).id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const assignments = await prisma.assignment.findMany({
    where: { conciergeId: userId, actif: true },
    include: {
      commande: {
        select: {
          id: true,
          reference: true,
          prenom: true,
          nom: true,
          dateArrivee: true,
          dateDepart: true,
          nombrePersonnes: true,
          statut: true,
        },
      },
    },
  });

  const clients = assignments.map((a) => ({
    commandeId: a.commande.id,
    reference: a.commande.reference,
    prenom: a.commande.prenom,
    nom: a.commande.nom,
    dateArrivee: a.commande.dateArrivee,
    dateDepart: a.commande.dateDepart,
    nombrePersonnes: a.commande.nombrePersonnes,
    statut: a.commande.statut,
  }));

  const commandeIds = clients.map((c) => c.commandeId);

  const allPlanning = await prisma.planningEntry.findMany({
    where: { commandeId: { in: commandeIds } },
    include: {
      commande: { select: { prenom: true, nom: true, dateArrivee: true } },
    },
    orderBy: { heure: "asc" },
  });

  const todayPlanning = allPlanning.filter((p) => {
    const arrival = new Date(p.commande.dateArrivee);
    arrival.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
    return p.jour === diffDays + 1;
  }).map((p) => ({
    heure: p.heure,
    clientName: `${p.commande.prenom} ${p.commande.nom}`,
    titre: p.titre,
    type: p.type,
  }));

  const recentNotes = await prisma.note.findMany({
    where: { commandeId: { in: commandeIds } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      auteur: { select: { nom: true } },
      commande: { select: { prenom: true, nom: true } },
    },
  });

  return NextResponse.json({
    clients,
    todayPlanning,
    recentNotes: recentNotes.map((n) => ({
      id: n.id,
      auteurNom: n.auteur.nom,
      clientName: `${n.commande.prenom} ${n.commande.nom}`,
      contenu: n.contenu,
      createdAt: n.createdAt,
    })),
  });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Test the API manually**

Run: `curl -s http://localhost:3000/api/admin/stats/concierge | head -5`
Expected: 401 (no auth) — confirms the route exists.

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/stats/concierge/route.ts
git commit -m "feat: add concierge stats API for briefing dashboard"
```

---

### Task 6: DayTimeline Component

**Files:**
- Create: `components/admin/day-timeline.tsx`

- [ ] **Step 1: Create `components/admin/day-timeline.tsx`**

Consolidated daily timeline showing all planning entries across clients for today. Uses the same type-to-icon mapping as `PlanningTimeline`.

```tsx
"use client";

import { Car, Utensils, Hotel, Sparkles, MessageSquare } from "lucide-react";

interface TimelineEntry {
  heure: string;
  clientName: string;
  titre: string;
  type: string;
}

const TYPE_CONFIG: Record<string, { icon: typeof Car; color: string; bg: string }> = {
  transport: { icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
  repas: { icon: Utensils, color: "text-orange-600", bg: "bg-orange-50" },
  hebergement: { icon: Hotel, color: "text-purple-600", bg: "bg-purple-50" },
  extra: { icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50" },
  custom: { icon: MessageSquare, color: "text-gold", bg: "bg-gold/10" },
};

interface DayTimelineProps {
  entries: TimelineEntry[];
}

export function DayTimeline({ entries }: DayTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-line p-5 shadow-card">
        <h3 className="font-serif text-[18px] text-ink mb-4">Planning du jour</h3>
        <p className="text-mute text-[13px] text-center py-6">Aucune entrée prévue aujourd&apos;hui</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-line shadow-card">
      <div className="px-5 py-4">
        <h3 className="font-serif text-[18px] text-ink">Planning du jour</h3>
      </div>
      <div className="divide-y divide-line">
        {entries.map((entry, i) => {
          const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.custom;
          const Icon = config.icon;
          return (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <span className="text-[13px] mono text-mute w-12 shrink-0">{entry.heure}</span>
              <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon size={14} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-ink font-medium truncate">{entry.titre}</p>
                <p className="text-[11px] text-mute">{entry.clientName}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/admin/day-timeline.tsx
git commit -m "feat: add DayTimeline component for concierge daily overview"
```

---

### Task 7: DashboardConcierge Component

**Files:**
- Create: `components/admin/dashboard-concierge.tsx`

- [ ] **Step 1: Create `components/admin/dashboard-concierge.tsx`**

Concierge briefing dashboard with assigned clients (today / upcoming), day timeline, and recent notes.

```tsx
"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/admin/topbar";
import { BriefingCard } from "@/components/admin/briefing-card";
import { DayTimeline } from "@/components/admin/day-timeline";
import { ClipboardCheck } from "lucide-react";

interface ClientData {
  commandeId: string;
  reference: string;
  prenom: string;
  nom: string;
  dateArrivee: string;
  dateDepart: string;
  nombrePersonnes: number;
  statut: string;
}

interface PlanningEntry {
  heure: string;
  clientName: string;
  titre: string;
  type: string;
}

interface NoteData {
  id: string;
  auteurNom: string;
  clientName: string;
  contenu: string;
  createdAt: string;
}

interface ConciergeData {
  clients: ClientData[];
  todayPlanning: PlanningEntry[];
  recentNotes: NoteData[];
}

export function DashboardConcierge() {
  const [data, setData] = useState<ConciergeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats/concierge")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayClients = data?.clients.filter((c) => {
    const arr = new Date(c.dateArrivee);
    const dep = new Date(c.dateDepart);
    arr.setHours(0, 0, 0, 0);
    dep.setHours(23, 59, 59, 999);
    return arr <= today && dep >= today;
  }) || [];

  const upcomingClients = data?.clients.filter((c) => {
    const arr = new Date(c.dateArrivee);
    arr.setHours(0, 0, 0, 0);
    return arr > today;
  }) || [];

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `il y a ${days}j`;
  }

  return (
    <>
      <Topbar title="Tableau de bord" subtitle="Votre briefing du jour" />
      <div className="p-6 lg:p-10">
        {loading ? (
          <div className="text-center text-mute py-20">Chargement…</div>
        ) : data && data.clients.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardCheck size={48} className="mx-auto text-mute/30 mb-4" />
            <p className="text-mute">Aucun client assigné pour le moment</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Today's clients */}
            {todayClients.length > 0 && (
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-mute mb-4">Aujourd&apos;hui</h3>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {todayClients.map((c) => (
                    <BriefingCard
                      key={c.commandeId}
                      commandeId={c.commandeId}
                      reference={c.reference}
                      clientName={`${c.prenom} ${c.nom}`}
                      dateArrivee={c.dateArrivee}
                      dateDepart={c.dateDepart}
                      nombrePersonnes={c.nombrePersonnes}
                      statut={c.statut}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming clients */}
            {upcomingClients.length > 0 && (
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-mute mb-4">À venir</h3>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {upcomingClients.map((c) => (
                    <BriefingCard
                      key={c.commandeId}
                      commandeId={c.commandeId}
                      reference={c.reference}
                      clientName={`${c.prenom} ${c.nom}`}
                      dateArrivee={c.dateArrivee}
                      dateDepart={c.dateDepart}
                      nombrePersonnes={c.nombrePersonnes}
                      statut={c.statut}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Day timeline */}
            {data && <DayTimeline entries={data.todayPlanning} />}

            {/* Recent notes */}
            {data && data.recentNotes.length > 0 && (
              <div className="bg-white rounded-2xl border border-line shadow-card">
                <div className="px-5 py-4">
                  <h3 className="font-serif text-[18px] text-ink">Notes récentes</h3>
                </div>
                <div className="divide-y divide-line">
                  {data.recentNotes.map((n) => (
                    <div key={n.id} className="px-5 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] text-ink font-medium">{n.clientName}</span>
                        <span className="text-[11px] text-mute">{timeAgo(n.createdAt)}</span>
                      </div>
                      <p className="text-[13px] text-mute truncate">
                        {n.auteurNom} — {n.contenu.length > 100 ? n.contenu.slice(0, 100) + "…" : n.contenu}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/admin/dashboard-concierge.tsx
git commit -m "feat: add DashboardConcierge component with briefing, timeline, notes"
```

---

### Task 8: Wire Dashboard Page as Server Component with Role Switch

**Files:**
- Modify: `app/(admin)/dashboard/page.tsx`

- [ ] **Step 1: Replace `app/(admin)/dashboard/page.tsx` with server component**

The page reads the session role and renders the matching dashboard component. Note: the admin layout already has `getServerSession` and redirects if not authenticated, so we can safely access `session.user.role` here.

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardUltra } from "@/components/admin/dashboard-ultra";
import { DashboardSuper } from "@/components/admin/dashboard-super";
import { DashboardConcierge } from "@/components/admin/dashboard-concierge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "CONCIERGE") return <DashboardConcierge />;
  if (role === "SUPER_ADMIN") return <DashboardSuper />;
  return <DashboardUltra />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Test all three dashboards**

1. Log in as `admin@sirexe.com` (ULTRA_ADMIN) → should see KPIs + charts + orders table
2. Log in as `manager@sirexe.com` (SUPER_ADMIN) → should see KPIs + team load + orders table
3. Log in as `concierge1@sirexe.com` (CONCIERGE) → should see assigned clients + day timeline + notes

- [ ] **Step 4: Commit**

```bash
git add app/(admin)/dashboard/page.tsx
git commit -m "feat: role-specific dashboards — Ultra/Super/Concierge views"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Section 1 (Architecture): Task 8 — server component role switch
- ✅ Section 2 (Ultra Admin): Task 1 — extracted unchanged
- ✅ Section 3 (Super Admin): Tasks 2-4 — API + TeamLoadCard + DashboardSuper
- ✅ Section 4 (Concierge): Tasks 5-7 — API + DayTimeline + DashboardConcierge
- ✅ Section 5 (APIs): Tasks 2 and 5
- ✅ Section 6 (File map): All 8 files covered
- ✅ Section 7 (Design tokens): All components use SIREXE classes

**Placeholder scan:** No TBDs, TODOs, or vague steps. All code is complete.

**Type consistency:** `TeamData`, `ConciergeData`, `TimelineEntry` interfaces match across API responses and component props.
