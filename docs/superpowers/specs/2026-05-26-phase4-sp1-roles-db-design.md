# Phase 4 — Sub-project 1: Roles, Permissions & DB Restructuring

## Goal

Migrate from single-role admin system (SQLite, one `admin` role) to a 3-tier role hierarchy (Ultra Admin / Super Admin / Concierge) on PostgreSQL (Neon), with per-role route protection, concierge-to-client assignment, and a "carnet de route" planning system.

## Scope

This sub-project covers **only** roles, permissions, DB migration, and the concierge briefing data model. Dashboards, payments, and emails are separate sub-projects.

---

## 1. Role Architecture

### 3 Levels

| Role | Slug | Who | Purpose |
|------|------|-----|---------|
| Ultra Admin | `ULTRA_ADMIN` | Owner only | Full system control — manage super admins, concierges, tariffs, config |
| Super Admin | `SUPER_ADMIN` | Management team | Manage concierges, all orders, assign concierges to clients, view reports |
| Concierge | `CONCIERGE` | Field agents | View assigned clients only, daily briefing, update statuses, add notes |

### Permissions Matrix

| Action | Ultra | Super | Concierge |
|--------|-------|-------|-----------|
| Manage Ultra/Super Admins | ✅ | ❌ | ❌ |
| Create/delete Concierges | ✅ | ✅ | ❌ |
| View all orders | ✅ | ✅ | ❌ |
| View assigned clients | ✅ | ✅ | ✅ |
| Assign concierge ↔ client | ✅ | ✅ | ❌ |
| Modify tariffs/services | ✅ | ❌ | ❌ |
| View financial reports | ✅ | ✅ | ❌ |
| Add internal notes | ✅ | ✅ | ✅ |
| Update service status | ✅ | ✅ | ✅ |

### Assignment Flow

- **Auto-assign (round-robin)**: When a new order arrives, assign to the concierge with the fewest active assignments.
- **Manual reassignment**: Ultra Admin or Super Admin can reassign a concierge ↔ client at any time.
- A concierge can have multiple clients simultaneously.

---

## 2. Database Schema Changes

### Provider Migration

- **From**: SQLite (`file:./dev.db`)
- **To**: PostgreSQL on Neon (`postgresql://...`)
- Prisma `datasource.provider` changes from `"sqlite"` to `"postgresql"`

### Role Enum

```prisma
enum Role {
  ULTRA_ADMIN
  SUPER_ADMIN
  CONCIERGE
}
```

### AdminUser (modified)

```prisma
model AdminUser {
  id           String       @id @default(cuid())
  email        String       @unique
  passwordHash String
  nom          String
  role         Role         @default(CONCIERGE)
  actif        Boolean      @default(true)
  assignments  Assignment[]
  notes        Note[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}
```

Changes from current:
- `role` field changes from `String @default("admin")` to `Role @default(CONCIERGE)`
- Added `actif` field for soft-disable
- Added `updatedAt` field
- Added relations to `Assignment` and `Note`

### New Models

```prisma
model Assignment {
  id           String   @id @default(cuid())
  conciergeId  String
  concierge    AdminUser @relation(fields: [conciergeId], references: [id])
  commandeId   String
  commande     Commande  @relation(fields: [commandeId], references: [id])
  actif        Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@unique([conciergeId, commandeId])
}

model Note {
  id           String    @id @default(cuid())
  commandeId   String
  commande     Commande  @relation(fields: [commandeId], references: [id])
  auteurId     String
  auteur       AdminUser @relation(fields: [auteurId], references: [id])
  contenu      String
  createdAt    DateTime  @default(now())
}

model PlanningEntry {
  id           String    @id @default(cuid())
  commandeId   String
  commande     Commande  @relation(fields: [commandeId], references: [id])
  jour         Int       // jour 1, 2, 3...
  heure        String    // "06:30"
  type         String    // transport, repas, hebergement, extra, custom
  titre        String    // "Berline → Pavillon SIREXE"
  details      String?   // structured details (driver name, room type, etc.)
  serviceId    String?
  service      Service?  @relation(fields: [serviceId], references: [id])
  auto         Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

### Commande (modified)

Add relations:

```prisma
model Commande {
  // ... existing fields unchanged ...
  assignments    Assignment[]
  notes          Note[]
  planningEntries PlanningEntry[]
}
```

### Service (modified)

Add relation:

```prisma
model Service {
  // ... existing fields unchanged ...
  planningEntries PlanningEntry[]
}
```

---

## 3. Auth & Route Protection

### requireRole() Helper

Replace `requireAdmin()` with `requireRole(...roles)`:

```typescript
// lib/admin-auth.ts
export async function requireRole(...roles: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }) };
  }
  const userRole = (session.user as any).role as Role;
  if (!roles.includes(userRole)) {
    return { session: null, error: NextResponse.json({ error: "Accès refusé" }, { status: 403 }) };
  }
  return { session, error: null };
}
```

### NextAuth JWT & Session

The existing callbacks already pass `role` through JWT → session. Change the authorize function to return the `Role` enum value instead of the string.

### Route Protection Rules

| Route | Allowed Roles |
|-------|---------------|
| `/dashboard` | ALL (content varies by role) |
| `/commandes` | ULTRA_ADMIN, SUPER_ADMIN |
| `/commandes/[id]` | ALL (concierge: only if assigned) |
| `/tarifs` | ULTRA_ADMIN |
| `/voyageurs` | ULTRA_ADMIN, SUPER_ADMIN |
| `/chauffeurs` | ULTRA_ADMIN, SUPER_ADMIN |
| `/rapports` | ULTRA_ADMIN, SUPER_ADMIN |
| `/parametres` | ULTRA_ADMIN (full), SUPER_ADMIN (profile only) |
| `/briefing` | CONCIERGE (new route) |
| `/briefing/[commandeId]` | CONCIERGE (only if assigned) |

### Sidebar Filtering

The sidebar `NAV_ITEMS` array gets a `roles` field. Items are filtered client-side based on `session.user.role`. Concierge sees: Tableau de bord, Briefing, Paramètres (profile only).

### Middleware

Update `middleware.ts` to check auth on all `/` admin routes (except `/login`). Role-level checks happen in API routes and page components via `requireRole()`, not middleware.

---

## 4. Concierge Briefing & Carnet de Route

### Briefing View (`/briefing`)

The concierge sees a list of their assigned clients with:
- Client name, dates of stay, number of persons
- Order status badge
- Quick link to the full carnet de route

### Carnet de Route (`/briefing/[commandeId]`)

A day-by-day breakdown of the client's entire stay. Each day shows chronological entries:

**Entry types:**

| Type | Content | Example |
|------|---------|---------|
| `transport` | Vehicle, driver name, languages, phone, route | "Berline → Aéroport FHB. Chauffeur: Koné Ibrahim · anglophone · 07 XX XX XX" |
| `repas` | Meal type (petit-déj/déjeuner/dîner), restaurant, cuisine type, dietary notes | "Déjeuner — Restaurant Le Bélier, cuisine ivoirienne. Allergies: aucune" |
| `hebergement` | Hotel name, room type, floor, check-in/out times | "Hôtel Ivoire — Suite Junior, 3e étage. Check-in 14h" |
| `extra` | Any service (spa, excursion, etc.) | "Spa Abidjan Zen — Massage 60min à 16h" |
| `custom` | Free-form entry by concierge | "Client préfère eau plate, préparer au véhicule" |

**Auto-generation**: When an order is confirmed, `PlanningEntry` records are auto-generated from the `LigneCommande` items. Transport entries pull driver info from `Chauffeur` if assigned.

**Manual enrichment**: Concierge can add `custom` entries and edit `details` on any entry. The `auto` boolean tracks origin.

---

## 5. Seed Data

Update `prisma/seed.ts` to create:
- 1 Ultra Admin: `admin@sirexe.com` / `sirexe2026` (existing user, role upgraded)
- 1 Super Admin: `manager@sirexe.com` / `sirexe2026`
- 2 Concierges: `concierge1@sirexe.com`, `concierge2@sirexe.com` / `sirexe2026`
- Sample assignments and planning entries for demo data

---

## 6. Migration Strategy

1. Set up Neon PostgreSQL database
2. Update `DATABASE_URL` in `.env`
3. Change Prisma provider to `postgresql`
4. Run `prisma migrate dev` to create fresh PostgreSQL schema
5. Run `prisma db seed` to populate demo data
6. Existing SQLite data is dev-only — no production data migration needed

---

## Out of Scope

- Role-specific dashboard content (sub-project 2)
- Payment integration — Stripe, GeniusPay (sub-project 3)
- Transactional emails — confirmations, briefing notifications (sub-project 4)
- Client-facing booking flow changes
- WhatsApp/phone integration (external, manual)
