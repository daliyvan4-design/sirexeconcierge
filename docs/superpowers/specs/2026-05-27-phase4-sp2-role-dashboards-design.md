# Phase 4 — Sub-project 2: Role-Specific Dashboards

## Goal

Adapt the admin dashboard so each role (Ultra Admin, Super Admin, Concierge) sees content relevant to their responsibilities. One route (`/dashboard`), three views.

## Scope

This sub-project covers **only** the dashboard page and its supporting APIs. No changes to other admin pages, sidebar filtering, or route protection (already done in SP1).

---

## 1. Architecture

`app/(admin)/dashboard/page.tsx` becomes a **server component** that reads `session.user.role` and renders the matching client component:

| Role | Component | Purpose |
|------|-----------|---------|
| `ULTRA_ADMIN` | `DashboardUltra` | Full financial overview — KPIs, charts, orders table |
| `SUPER_ADMIN` | `DashboardSuper` | Operational overview — KPIs, team load, orders table |
| `CONCIERGE` | `DashboardConcierge` | Briefing enrichi — assigned clients, day timeline, recent notes |

Each sub-component is a self-contained client component that fetches its own data from dedicated API endpoints.

---

## 2. Dashboard Ultra Admin

Identical to the current dashboard. Extracted into `DashboardUltra` with no functional changes.

**Layout:**
- 4 KPI cards: Commandes aujourd'hui, CA du jour, En attente, Confirmées
- Arrivals chart (14 days) — 2/3 width
- CA breakdown by category — 1/3 width
- Orders table with status filter tabs

**APIs used:** `/api/admin/stats`, `/api/admin/stats/arrivals`, `/api/admin/stats/breakdown`, `/api/admin/commandes`

---

## 3. Dashboard Super Admin

**KPI cards** (reuses `KpiCard` component):
- Commandes aujourd'hui — same data as Ultra
- En attente — same
- Clients actifs ce mois — count of commandes with `dateDepart >= today` this month
- Concierges actifs — count of AdminUser with `role=CONCIERGE` and `actif=true`

**Team load section** — new `TeamLoadCard` component:
- Table with columns: Concierge name, initials avatar, active client count, latest note date
- Horizontal progress bar showing relative load (client count / max client count across team)
- Design: white card, `rounded-2xl border border-line`, serif heading, same table style as `OrdersTable`

**Orders table:** Same `OrdersTable` component, 8 most recent orders, with status filter tabs.

**APIs used:**
- `/api/admin/stats` — reused for commandes/pending KPIs
- `/api/admin/stats/team` — **new** — returns concierge load data
- `/api/admin/commandes` — reused for orders table

---

## 4. Dashboard Concierge (Briefing Enrichi)

No financial KPIs. The dashboard IS the concierge's briefing.

**Section "Vos clients"** — reuses `BriefingCard` component:
- Split into two groups:
  - **Aujourd'hui** — clients with `dateArrivee <= today <= dateDepart`
  - **À venir** — clients with `dateArrivee > today`
- Each card links to `/briefing/[commandeId]` for the full carnet de route
- Empty state: centered icon + "Aucun client assigné pour le moment"

**Section "Planning du jour"** — new `DayTimeline` component:
- Consolidated timeline of ALL planning entries for today across all assigned clients
- Each entry shows: heure, client name, titre, type icon
- Sorted by `heure` ascending
- Type icons reuse the same mapping as `PlanningTimeline` (Car, BedDouble, Utensils, Sparkles, MessageSquare)
- Design: white card, entries as rows with left time column and right content

**Section "Notes récentes"** — inline in `DashboardConcierge`:
- Last 5 notes across all assigned clients
- Each note shows: author name, date relative, client name, content excerpt (truncated 100 chars)
- Design: white card, divide-y rows

**APIs used:**
- `/api/admin/stats/concierge` — **new** — returns assigned clients, today's planning entries, recent notes

---

## 5. New API Endpoints

### `GET /api/admin/stats/team`

**Access:** `ULTRA_ADMIN`, `SUPER_ADMIN`

**Returns:**
```json
{
  "concierges": [
    {
      "id": "...",
      "nom": "Concierge 1",
      "initials": "C1",
      "activeClients": 4,
      "lastNoteDate": "2026-05-27T10:30:00Z"
    }
  ],
  "activeClientsTotal": 12,
  "conciergesActifs": 2
}
```

**Query:** Joins AdminUser (role=CONCIERGE, actif=true) → Assignment (actif=true) → Commande (dateDepart >= today). Counts per concierge. Latest note date from Note table.

### `GET /api/admin/stats/concierge`

**Access:** `CONCIERGE` only (uses session user ID to scope data)

**Returns:**
```json
{
  "clients": [
    {
      "commandeId": "...",
      "reference": "SIREXE-26-A8F2",
      "prenom": "Amadou",
      "nom": "Diallo",
      "dateArrivee": "2026-03-12",
      "dateDepart": "2026-03-16",
      "nombrePersonnes": 2,
      "statut": "CONFIRMEE"
    }
  ],
  "todayPlanning": [
    {
      "heure": "08:00",
      "clientName": "Amadou Diallo",
      "titre": "Berline → Pavillon SIREXE",
      "type": "transport"
    }
  ],
  "recentNotes": [
    {
      "id": "...",
      "auteurNom": "Concierge 1",
      "clientName": "Amadou Diallo",
      "contenu": "Client préfère eau plate...",
      "createdAt": "2026-05-27T10:30:00Z"
    }
  ]
}
```

**Query:**
- Clients: Assignment (conciergeId=me, actif=true) → Commande
- Today planning: PlanningEntry where commandeId IN assigned commandes AND jour matches today relative to commande.dateArrivee
- Recent notes: Note where commandeId IN assigned commandes, ORDER BY createdAt DESC LIMIT 5

---

## 6. File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `app/(admin)/dashboard/page.tsx` | Server component — session check, role switch |
| Create | `components/admin/dashboard-ultra.tsx` | Ultra Admin dashboard (extracted from current) |
| Create | `components/admin/dashboard-super.tsx` | Super Admin dashboard |
| Create | `components/admin/dashboard-concierge.tsx` | Concierge briefing dashboard |
| Create | `components/admin/team-load-card.tsx` | Team workload table + progress bars |
| Create | `components/admin/day-timeline.tsx` | Consolidated daily timeline across clients |
| Create | `app/api/admin/stats/team/route.ts` | Team load API |
| Create | `app/api/admin/stats/concierge/route.ts` | Concierge briefing API |

---

## 7. Design Tokens

All new components follow the existing SIREXE design language:
- Cards: `bg-white rounded-2xl border border-line p-5 shadow-card`
- Headings: `font-serif text-[18px] text-ink`
- Labels: `text-[11px] uppercase tracking-[0.18em] text-mute`
- Tables: `text-[13px]`, thead `text-[10px] uppercase tracking-[0.18em] text-mute bg-cream/50`
- KPI values: `.figure text-[40px] text-ink`
- Progress bars: `h-2 bg-cream rounded-full` with colored fill

---

## Out of Scope

- Sidebar changes (already role-filtered in SP1)
- Route protection changes (already done in SP1)
- Payment integration (SP3)
- Email notifications (SP4)
- Real-time updates / WebSockets
- Mobile-specific layouts beyond responsive Tailwind
