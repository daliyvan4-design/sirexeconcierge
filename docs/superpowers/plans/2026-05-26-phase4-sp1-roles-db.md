# Phase 4 SP1 — Roles, Permissions & DB Restructuring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate from single-role SQLite admin to 3-tier role hierarchy (Ultra Admin / Super Admin / Concierge) on PostgreSQL with assignment, notes, and planning models.

**Architecture:** Switch Prisma provider to PostgreSQL (Neon), add Role enum and new models (Assignment, Note, PlanningEntry), replace `requireAdmin()` with `requireRole(...roles)`, filter sidebar nav by role, add `/briefing` routes for concierges.

**Tech Stack:** Next.js 14 App Router, Prisma 6 (PostgreSQL/Neon), NextAuth.js v4, TypeScript, Tailwind CSS (SIREXE tokens), bcryptjs, Lucide React icons.

---

## File Structure

### Files to Create
- `types/next-auth.d.ts` — NextAuth session type augmentation with `role` field
- `lib/roles.ts` — Role enum, permissions map, helper functions
- `app/(admin)/briefing/page.tsx` — Concierge briefing list page
- `app/(admin)/briefing/[commandeId]/page.tsx` — Carnet de route detail page
- `app/api/admin/assignments/route.ts` — Assignment CRUD (GET list, POST create)
- `app/api/admin/assignments/[id]/route.ts` — Assignment PATCH/DELETE
- `app/api/admin/assignments/auto-assign/route.ts` — Round-robin auto-assignment
- `app/api/admin/notes/route.ts` — Notes CRUD (GET by commande, POST create)
- `app/api/admin/planning/route.ts` — Planning entries (GET by commande, POST create)
- `app/api/admin/planning/[id]/route.ts` — Planning entry PATCH/DELETE
- `app/api/admin/planning/generate/route.ts` — Auto-generate planning from commande
- `components/admin/briefing-card.tsx` — Client card for briefing list
- `components/admin/planning-timeline.tsx` — Day-by-day carnet de route UI

### Files to Modify
- `prisma/schema.prisma` — Provider → postgresql, add Role enum, new models, modify AdminUser/Commande/Service
- `.env` — DATABASE_URL → Neon PostgreSQL connection string
- `lib/auth.ts` — Return Role enum in authorize, type JWT/session properly
- `lib/admin-auth.ts` — Replace `requireAdmin()` with `requireRole(...roles)`
- `middleware.ts` — Add `/briefing` to ADMIN_PATHS
- `components/admin/sidebar.tsx` — Add `roles` to NAV_ITEMS, filter by session role, add Briefing link
- `components/admin/admin-shell.tsx` — Pass `userRole` to Sidebar
- `app/(admin)/layout.tsx` — Pass user role to AdminShell
- `app/api/admin/users/route.ts` — Role-based access, pass role on create
- `app/api/admin/users/[id]/route.ts` — Role-based delete protection
- `app/api/admin/commandes/route.ts` — Use requireRole
- `app/api/admin/commandes/[id]/route.ts` — Use requireRole, concierge sees only assigned
- `app/api/admin/tarifs/route.ts` — Restrict to ULTRA_ADMIN
- `app/api/admin/tarifs/[id]/route.ts` — Restrict to ULTRA_ADMIN
- `app/api/admin/chauffeurs/route.ts` — Restrict to ULTRA_ADMIN, SUPER_ADMIN
- `app/api/admin/chauffeurs/[id]/route.ts` — Restrict to ULTRA_ADMIN, SUPER_ADMIN
- `app/api/admin/voyageurs/route.ts` — Restrict to ULTRA_ADMIN, SUPER_ADMIN
- `app/api/admin/stats/route.ts` — Restrict to ULTRA_ADMIN, SUPER_ADMIN
- `app/api/admin/stats/reports/route.ts` — Restrict to ULTRA_ADMIN, SUPER_ADMIN
- `app/api/admin/stats/breakdown/route.ts` — Restrict to ULTRA_ADMIN, SUPER_ADMIN
- `app/api/admin/stats/arrivals/route.ts` — Restrict to ULTRA_ADMIN, SUPER_ADMIN
- `prisma/seed.ts` — Create all 4 user types, sample assignments, planning entries

---

## Task 1: Prisma Schema — PostgreSQL + Role Enum + New Models

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `.env`

- [ ] **Step 1: Update `.env` to use PostgreSQL**

Replace the SQLite DATABASE_URL with a Neon PostgreSQL URL placeholder. The user will paste their actual Neon credentials.

```env
# Replace with your Neon PostgreSQL connection string
DATABASE_URL="postgresql://user:password@ep-xxx.region.neon.tech/sirexe?sslmode=require"
```

- [ ] **Step 2: Rewrite `prisma/schema.prisma`**

Replace the entire file content:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ULTRA_ADMIN
  SUPER_ADMIN
  CONCIERGE
}

model Service {
  id              String          @id @default(cuid())
  nom             String
  nomEn           String          @default("")
  nomAr           String          @default("")
  description     String?
  descEn          String?
  descAr          String?
  categorie       String
  prixBase        Float
  unite           String
  actif           Boolean         @default(true)
  ordre           Int             @default(0)
  icon            String?
  etoiles         Int?
  quartier        String?
  badge           String?
  tarifs          Tarif[]
  lignes          LigneCommande[]
  planningEntries PlanningEntry[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model Tarif {
  id        String          @id @default(cuid())
  serviceId String
  service   Service         @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  label     String
  prix      Float
  devise    String          @default("XOF")
  actif     Boolean         @default(true)
  lignes    LigneCommande[]
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
}

model Commande {
  id                String          @id @default(cuid())
  reference         String          @unique
  statut            String          @default("EN_ATTENTE")
  langue            String          @default("fr")
  prenom            String
  nom               String
  email             String
  telephone         String
  nationalite       String
  dateArrivee       DateTime
  dateDepart        DateTime
  nombrePersonnes   Int
  compagnie         String?
  numeroVol         String?
  heureArrivee      String?
  aeroport          String?         @default("FHB")
  passeport         String?
  typeVisa          String?
  statutVisa        String?         @default("ok")
  notes             String?
  montantTotal      Float
  devise            String          @default("XOF")
  methodePaiement   String?
  referencePaiement String?
  statutPaiement    String?
  lignes            LigneCommande[]
  assignments       Assignment[]
  notesInternes     Note[]
  planningEntries   PlanningEntry[]
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}

model LigneCommande {
  id           String   @id @default(cuid())
  commandeId   String
  commande     Commande @relation(fields: [commandeId], references: [id], onDelete: Cascade)
  serviceId    String
  service      Service  @relation(fields: [serviceId], references: [id])
  tarifId      String?
  tarif        Tarif?   @relation(fields: [tarifId], references: [id])
  quantite     Int
  prixUnitaire Float
  sousTotal    Float
}

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

model Chauffeur {
  id              String   @id @default(cuid())
  nom             String
  telephone       String
  vehicule        String
  immatriculation String
  statut          String   @default("disponible")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Assignment {
  id          String    @id @default(cuid())
  conciergeId String
  concierge   AdminUser @relation(fields: [conciergeId], references: [id])
  commandeId  String
  commande    Commande  @relation(fields: [commandeId], references: [id])
  actif       Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([conciergeId, commandeId])
}

model Note {
  id         String    @id @default(cuid())
  commandeId String
  commande   Commande  @relation(fields: [commandeId], references: [id])
  auteurId   String
  auteur     AdminUser @relation(fields: [auteurId], references: [id])
  contenu    String
  createdAt  DateTime  @default(now())
}

model PlanningEntry {
  id         String   @id @default(cuid())
  commandeId String
  commande   Commande @relation(fields: [commandeId], references: [id])
  jour       Int
  heure      String
  type       String
  titre      String
  details    String?
  serviceId  String?
  service    Service? @relation(fields: [serviceId], references: [id])
  auto       Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

- [ ] **Step 3: Delete old SQLite database**

```bash
rm -f prisma/dev.db prisma/dev.db-journal
```

- [ ] **Step 4: Generate Prisma client and create migration**

```bash
npx prisma migrate dev --name init-postgresql-roles
```

Expected: Migration created successfully, Prisma Client generated.

- [ ] **Step 5: Verify Prisma client types**

```bash
npx prisma generate
```

Expected: `✔ Generated Prisma Client`

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/ .env
git commit -m "feat: migrate to PostgreSQL with Role enum, Assignment, Note, PlanningEntry models"
```

---

## Task 2: NextAuth Type Augmentation + Role Helpers

**Files:**
- Create: `types/next-auth.d.ts`
- Create: `lib/roles.ts`

- [ ] **Step 1: Create NextAuth type declaration**

Create `types/next-auth.d.ts`:

```typescript
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
  }
}
```

- [ ] **Step 2: Create role helpers**

Create `lib/roles.ts`:

```typescript
import { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  ULTRA_ADMIN: "Ultra Admin",
  SUPER_ADMIN: "Super Admin",
  CONCIERGE: "Concierge",
};

export const ROLE_HIERARCHY: Record<Role, number> = {
  ULTRA_ADMIN: 3,
  SUPER_ADMIN: 2,
  CONCIERGE: 1,
};

export function canManageRole(actor: Role, target: Role): boolean {
  return ROLE_HIERARCHY[actor] > ROLE_HIERARCHY[target];
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No errors related to `next-auth.d.ts` or `roles.ts`.

- [ ] **Step 4: Commit**

```bash
git add types/next-auth.d.ts lib/roles.ts
git commit -m "feat: add NextAuth type augmentation and role helper utilities"
```

---

## Task 3: Update NextAuth Config + requireRole()

**Files:**
- Modify: `lib/auth.ts`
- Modify: `lib/admin-auth.ts`

- [ ] **Step 1: Update `lib/auth.ts`**

Replace the entire file:

```typescript
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.actif) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.nom, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "sirexe-dev-secret-change-in-prod",
};

export default NextAuth(authOptions);
```

- [ ] **Step 2: Replace `requireAdmin()` with `requireRole()` in `lib/admin-auth.ts`**

Replace the entire file:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

const ALL_ROLES: Role[] = ["ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE"];

export async function requireRole(...roles: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }) };
  }
  if (!roles.includes(session.user.role)) {
    return { session: null, error: NextResponse.json({ error: "Accès refusé" }, { status: 403 }) };
  }
  return { session, error: null };
}

export async function requireAnyAdmin() {
  return requireRole(...ALL_ROLES);
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: Errors only from files still using `requireAdmin` (expected — we fix those in Task 5).

- [ ] **Step 4: Commit**

```bash
git add lib/auth.ts lib/admin-auth.ts
git commit -m "feat: requireRole() replaces requireAdmin(), typed NextAuth session"
```

---

## Task 4: Update Middleware + Admin Layout

**Files:**
- Modify: `middleware.ts`
- Modify: `app/(admin)/layout.tsx`
- Modify: `components/admin/admin-shell.tsx`

- [ ] **Step 1: Update `middleware.ts` to include `/briefing`**

Replace the entire file:

```typescript
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n-routing";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_PATHS = ["/dashboard", "/commandes", "/tarifs", "/voyageurs", "/chauffeurs", "/rapports", "/parametres", "/briefing"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "sirexe-dev-secret-change-in-prod" });
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|assets|uploads|.*\\..*).*)"],
};
```

- [ ] **Step 2: Update `app/(admin)/layout.tsx` to pass role**

Replace the entire file:

```typescript
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { ROLE_LABELS } from "@/lib/roles";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const pendingCount = await prisma.commande.count({
    where: { statut: "EN_ATTENTE" },
  });

  return (
    <AdminShell
      adminName={session.user.name}
      adminRole={ROLE_LABELS[session.user.role]}
      userRole={session.user.role}
      pendingCount={pendingCount}
    >
      {children}
    </AdminShell>
  );
}
```

- [ ] **Step 3: Update `components/admin/admin-shell.tsx` to accept and pass `userRole`**

Replace the entire file:

```typescript
"use client";

import { createContext, useContext, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./sidebar";
import { ToastProvider } from "./toast";
import { Role } from "@prisma/client";

const SidebarContext = createContext<{ toggleSidebar: () => void }>({ toggleSidebar: () => {} });
export const useSidebar = () => useContext(SidebarContext);

interface AdminShellProps {
  adminName: string;
  adminRole: string;
  userRole: Role;
  pendingCount: number;
  children: React.ReactNode;
}

export function AdminShell({ adminName, adminRole, userRole, pendingCount, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <ToastProvider>
        <SidebarContext.Provider value={{ toggleSidebar: () => setSidebarOpen((o) => !o) }}>
          <div className="min-h-screen flex">
            <Sidebar
              adminName={adminName}
              adminRole={adminRole}
              userRole={userRole}
              pendingCount={pendingCount}
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <main className="flex-1 bg-cream min-h-screen lg:ml-0">
              {children}
            </main>
          </div>
        </SidebarContext.Provider>
      </ToastProvider>
    </SessionProvider>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add middleware.ts app/\(admin\)/layout.tsx components/admin/admin-shell.tsx
git commit -m "feat: pass user role through admin layout, add /briefing to middleware"
```

---

## Task 5: Role-Filtered Sidebar

**Files:**
- Modify: `components/admin/sidebar.tsx`

- [ ] **Step 1: Update sidebar with role-filtered navigation**

Replace the entire file:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { SirexeLogo } from "@/components/brand/sirexe-logo";
import { Role } from "@prisma/client";
import {
  LayoutDashboard,
  ClipboardList,
  Banknote,
  Users,
  CarFront,
  BarChart3,
  Settings,
  LogOut,
  ClipboardCheck,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  roles: Role[];
  badge?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord", roles: ["ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE"] },
  { href: "/briefing", icon: ClipboardCheck, label: "Briefing", roles: ["CONCIERGE"] },
  { href: "/commandes", icon: ClipboardList, label: "Commandes", badge: true, roles: ["ULTRA_ADMIN", "SUPER_ADMIN"] },
  { href: "/tarifs", icon: Banknote, label: "Tarifs", roles: ["ULTRA_ADMIN"] },
  { href: "/voyageurs", icon: Users, label: "Voyageurs", roles: ["ULTRA_ADMIN", "SUPER_ADMIN"] },
  { href: "/chauffeurs", icon: CarFront, label: "Chauffeurs", roles: ["ULTRA_ADMIN", "SUPER_ADMIN"] },
  { href: "/rapports", icon: BarChart3, label: "Rapports", roles: ["ULTRA_ADMIN", "SUPER_ADMIN"] },
];

interface SidebarProps {
  adminName: string;
  adminRole: string;
  userRole: Role;
  pendingCount: number;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ adminName, adminRole, userRole, pendingCount, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-ink text-cream flex flex-col transform transition-transform lg:transform-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 py-5 border-b border-cream/10">
          <SirexeLogo dark height={32} />
          <p className="text-[10px] uppercase tracking-[0.18em] text-cream/50 mt-2">Panel admin</p>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {visibleItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] transition-colors ${
                  active
                    ? "bg-gradient-to-b from-gold/[0.18] to-gold/[0.08] text-cream shadow-[inset_0_0_0_1px_rgba(201,168,76,0.25)]"
                    : "text-cream/70 hover:bg-white/5 hover:text-cream"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.badge && pendingCount > 0 && (
                  <span className="ml-auto text-[10px] mono bg-gold text-ink rounded-full px-2 py-0.5">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="h-px bg-cream/10 my-4" />
          <Link
            href="/parametres"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] transition-colors ${
              pathname === "/parametres"
                ? "bg-gradient-to-b from-gold/[0.18] to-gold/[0.08] text-cream shadow-[inset_0_0_0_1px_rgba(201,168,76,0.25)]"
                : "text-cream/70 hover:bg-white/5 hover:text-cream"
            }`}
          >
            <Settings size={18} />
            <span>Paramètres</span>
          </Link>
        </nav>

        <div className="p-3 border-t border-cream/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-ink font-serif font-semibold text-[13px]">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-cream truncate">{adminName}</p>
              <p className="text-[10px] text-cream/50">{adminRole}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-cream/50 hover:text-cream"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Verify the app builds**

```bash
npx next build 2>&1 | tail -20
```

Expected: Build succeeds (or only unrelated warnings).

- [ ] **Step 3: Commit**

```bash
git add components/admin/sidebar.tsx
git commit -m "feat: role-filtered sidebar navigation"
```

---

## Task 6: Migrate All API Routes to requireRole()

**Files:**
- Modify: `app/api/admin/commandes/route.ts`
- Modify: `app/api/admin/commandes/[id]/route.ts`
- Modify: `app/api/admin/commandes/export/route.ts`
- Modify: `app/api/admin/tarifs/route.ts`
- Modify: `app/api/admin/tarifs/[id]/route.ts`
- Modify: `app/api/admin/chauffeurs/route.ts`
- Modify: `app/api/admin/chauffeurs/[id]/route.ts`
- Modify: `app/api/admin/voyageurs/route.ts`
- Modify: `app/api/admin/stats/route.ts`
- Modify: `app/api/admin/stats/reports/route.ts`
- Modify: `app/api/admin/stats/breakdown/route.ts`
- Modify: `app/api/admin/stats/arrivals/route.ts`
- Modify: `app/api/admin/services/[id]/route.ts`
- Modify: `app/api/admin/profile/route.ts`
- Modify: `app/api/admin/password/route.ts`

- [ ] **Step 1: Update `app/api/admin/commandes/route.ts`**

Replace `requireAdmin` import and call:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";

  const where: any = {};
  if (status) where.statut = status;
  if (search) {
    where.OR = [
      { reference: { contains: search, mode: "insensitive" } },
      { nom: { contains: search, mode: "insensitive" } },
      { prenom: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.commande.findMany({
      where,
      include: { lignes: { include: { service: { select: { categorie: true } } } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.commande.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, limit });
}
```

Note: PostgreSQL supports `mode: "insensitive"` for case-insensitive search — add it to all `contains` filters.

- [ ] **Step 2: Update `app/api/admin/commandes/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE");
  if (error) return error;

  const { id } = await params;

  if (session!.user.role === "CONCIERGE") {
    const assignment = await prisma.assignment.findFirst({
      where: { commandeId: id, conciergeId: session!.user.id, actif: true },
    });
    if (!assignment) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
  }

  const commande = await prisma.commande.findUnique({
    where: { id },
    include: { lignes: { include: { service: true, tarif: true } } },
  });

  if (!commande) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(commande);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { statut } = body;

  if (!["EN_ATTENTE", "CONFIRMEE", "ANNULEE", "PAYEE"].includes(statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const commande = await prisma.commande.update({
    where: { id },
    data: { statut },
  });

  return NextResponse.json(commande);
}
```

- [ ] **Step 3: Update `app/api/admin/commandes/export/route.ts`**

Find the `requireAdmin` import and replace:

```typescript
// Change this import:
// import { requireAdmin } from "@/lib/admin-auth";
// To:
import { requireRole } from "@/lib/admin-auth";

// Change this call:
// const { error } = await requireAdmin();
// To:
const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
```

- [ ] **Step 4: Update tarif routes**

`app/api/admin/tarifs/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN");
  if (error) return error;

  const { serviceId, label, prix } = await request.json();

  const tarif = await prisma.tarif.create({
    data: { serviceId, label: label || "Nouveau tarif", prix: prix || 0 },
  });

  return NextResponse.json(tarif, { status: 201 });
}
```

`app/api/admin/tarifs/[id]/route.ts` — replace `requireAdmin` with `requireRole("ULTRA_ADMIN")`.

- [ ] **Step 5: Update chauffeur routes**

`app/api/admin/chauffeurs/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const chauffeurs = await prisma.chauffeur.findMany({ orderBy: { nom: "asc" } });
  return NextResponse.json(chauffeurs);
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const body = await request.json();
  const chauffeur = await prisma.chauffeur.create({
    data: {
      nom: body.nom,
      telephone: body.telephone,
      vehicule: body.vehicule,
      immatriculation: body.immatriculation,
      statut: body.statut || "disponible",
    },
  });
  return NextResponse.json(chauffeur, { status: 201 });
}
```

`app/api/admin/chauffeurs/[id]/route.ts` — replace `requireAdmin` with `requireRole("ULTRA_ADMIN", "SUPER_ADMIN")`.

- [ ] **Step 6: Update remaining routes**

For each of these files, replace `import { requireAdmin }` with `import { requireRole }` and replace `await requireAdmin()` with the appropriate role call:

| File | Role Call |
|------|-----------|
| `app/api/admin/voyageurs/route.ts` | `requireRole("ULTRA_ADMIN", "SUPER_ADMIN")` |
| `app/api/admin/stats/route.ts` | `requireRole("ULTRA_ADMIN", "SUPER_ADMIN")` |
| `app/api/admin/stats/reports/route.ts` | `requireRole("ULTRA_ADMIN", "SUPER_ADMIN")` |
| `app/api/admin/stats/breakdown/route.ts` | `requireRole("ULTRA_ADMIN", "SUPER_ADMIN")` |
| `app/api/admin/stats/arrivals/route.ts` | `requireRole("ULTRA_ADMIN", "SUPER_ADMIN")` |
| `app/api/admin/services/[id]/route.ts` | `requireRole("ULTRA_ADMIN")` |
| `app/api/admin/profile/route.ts` | `requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE")` |
| `app/api/admin/password/route.ts` | `requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE")` |

For each file the change is the same pattern — swap import and function call.

- [ ] **Step 7: Verify no `requireAdmin` references remain**

```bash
grep -r "requireAdmin" app/ lib/ --include="*.ts" --include="*.tsx"
```

Expected: No output (all references replaced).

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add app/api/admin/
git commit -m "feat: migrate all API routes from requireAdmin to requireRole"
```

---

## Task 7: User Management API — Role-Aware

**Files:**
- Modify: `app/api/admin/users/route.ts`
- Modify: `app/api/admin/users/[id]/route.ts`

- [ ] **Step 1: Update `app/api/admin/users/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import { canManageRole } from "@/lib/roles";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function GET() {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const users = await prisma.adminUser.findMany({
    select: { id: true, email: true, nom: true, role: true, actif: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  if (session!.user.role === "SUPER_ADMIN") {
    return NextResponse.json(users.filter((u) => u.role === "CONCIERGE"));
  }

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { email, nom, password, role } = await request.json();
  const targetRole = (role as Role) || "CONCIERGE";

  if (!canManageRole(session!.user.role, targetRole)) {
    return NextResponse.json({ error: "Vous ne pouvez pas créer ce rôle" }, { status: 403 });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.create({
    data: { email, nom, passwordHash: hash, role: targetRole },
  });

  return NextResponse.json({ id: user.id, email: user.email, nom: user.nom, role: user.role }, { status: 201 });
}
```

- [ ] **Step 2: Update `app/api/admin/users/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import { canManageRole } from "@/lib/roles";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  if (!canManageRole(session!.user.role, target.role)) {
    return NextResponse.json({ error: "Vous ne pouvez pas supprimer ce rôle" }, { status: 403 });
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  if (!canManageRole(session!.user.role, target.role)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const data: any = {};
  if (body.nom !== undefined) data.nom = body.nom;
  if (body.actif !== undefined) data.actif = body.actif;

  const updated = await prisma.adminUser.update({ where: { id }, data });
  return NextResponse.json({ id: updated.id, email: updated.email, nom: updated.nom, role: updated.role, actif: updated.actif });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/users/
git commit -m "feat: role-aware user management — hierarchy enforcement on create/delete"
```

---

## Task 8: Assignment API — CRUD + Auto-Assign

**Files:**
- Create: `app/api/admin/assignments/route.ts`
- Create: `app/api/admin/assignments/[id]/route.ts`
- Create: `app/api/admin/assignments/auto-assign/route.ts`

- [ ] **Step 1: Create `app/api/admin/assignments/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const commandeId = searchParams.get("commandeId");
  const conciergeId = searchParams.get("conciergeId");

  const where: any = { actif: true };
  if (commandeId) where.commandeId = commandeId;

  if (session!.user.role === "CONCIERGE") {
    where.conciergeId = session!.user.id;
  } else if (conciergeId) {
    where.conciergeId = conciergeId;
  }

  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      commande: { select: { id: true, reference: true, prenom: true, nom: true, dateArrivee: true, dateDepart: true, nombrePersonnes: true, statut: true } },
      concierge: { select: { id: true, nom: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assignments);
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { conciergeId, commandeId } = await request.json();

  const concierge = await prisma.adminUser.findFirst({
    where: { id: conciergeId, role: "CONCIERGE", actif: true },
  });
  if (!concierge) return NextResponse.json({ error: "Concierge introuvable" }, { status: 404 });

  const assignment = await prisma.assignment.upsert({
    where: { conciergeId_commandeId: { conciergeId, commandeId } },
    update: { actif: true },
    create: { conciergeId, commandeId },
    include: {
      commande: { select: { reference: true, prenom: true, nom: true } },
      concierge: { select: { nom: true } },
    },
  });

  return NextResponse.json(assignment, { status: 201 });
}
```

- [ ] **Step 2: Create `app/api/admin/assignments/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  const { actif } = await request.json();

  const assignment = await prisma.assignment.update({
    where: { id },
    data: { actif },
  });

  return NextResponse.json(assignment);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  await prisma.assignment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Create `app/api/admin/assignments/auto-assign/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { commandeId } = await request.json();

  const commande = await prisma.commande.findUnique({ where: { id: commandeId } });
  if (!commande) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  const concierges = await prisma.adminUser.findMany({
    where: { role: "CONCIERGE", actif: true },
    include: { assignments: { where: { actif: true } } },
  });

  if (concierges.length === 0) {
    return NextResponse.json({ error: "Aucun concierge disponible" }, { status: 400 });
  }

  const sorted = concierges.sort((a, b) => a.assignments.length - b.assignments.length);
  const chosen = sorted[0];

  const assignment = await prisma.assignment.upsert({
    where: { conciergeId_commandeId: { conciergeId: chosen.id, commandeId } },
    update: { actif: true },
    create: { conciergeId: chosen.id, commandeId },
    include: {
      concierge: { select: { nom: true, email: true } },
      commande: { select: { reference: true } },
    },
  });

  return NextResponse.json(assignment, { status: 201 });
}
```

- [ ] **Step 4: Create directories and verify**

```bash
mkdir -p "app/api/admin/assignments"
ls app/api/admin/assignments/
```

Expected: `route.ts`, `[id]/route.ts` (directory), `auto-assign/route.ts` (directory).

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/assignments/
git commit -m "feat: assignment API — manual CRUD + round-robin auto-assign"
```

---

## Task 9: Notes API

**Files:**
- Create: `app/api/admin/notes/route.ts`

- [ ] **Step 1: Create `app/api/admin/notes/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const commandeId = searchParams.get("commandeId");
  if (!commandeId) return NextResponse.json({ error: "commandeId requis" }, { status: 400 });

  if (session!.user.role === "CONCIERGE") {
    const assignment = await prisma.assignment.findFirst({
      where: { commandeId, conciergeId: session!.user.id, actif: true },
    });
    if (!assignment) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const notes = await prisma.note.findMany({
    where: { commandeId },
    include: { auteur: { select: { nom: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE");
  if (error) return error;

  const { commandeId, contenu } = await request.json();

  if (session!.user.role === "CONCIERGE") {
    const assignment = await prisma.assignment.findFirst({
      where: { commandeId, conciergeId: session!.user.id, actif: true },
    });
    if (!assignment) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const note = await prisma.note.create({
    data: { commandeId, auteurId: session!.user.id, contenu },
    include: { auteur: { select: { nom: true, role: true } } },
  });

  return NextResponse.json(note, { status: 201 });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/admin/notes/
git commit -m "feat: notes API — internal notes per commande with assignment check"
```

---

## Task 10: Planning API + Auto-Generation

**Files:**
- Create: `app/api/admin/planning/route.ts`
- Create: `app/api/admin/planning/[id]/route.ts`
- Create: `app/api/admin/planning/generate/route.ts`

- [ ] **Step 1: Create `app/api/admin/planning/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const commandeId = searchParams.get("commandeId");
  if (!commandeId) return NextResponse.json({ error: "commandeId requis" }, { status: 400 });

  if (session!.user.role === "CONCIERGE") {
    const assignment = await prisma.assignment.findFirst({
      where: { commandeId, conciergeId: session!.user.id, actif: true },
    });
    if (!assignment) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const entries = await prisma.planningEntry.findMany({
    where: { commandeId },
    include: { service: { select: { nom: true, categorie: true, icon: true } } },
    orderBy: [{ jour: "asc" }, { heure: "asc" }],
  });

  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE");
  if (error) return error;

  const { commandeId, jour, heure, type, titre, details, serviceId } = await request.json();

  if (session!.user.role === "CONCIERGE") {
    const assignment = await prisma.assignment.findFirst({
      where: { commandeId, conciergeId: session!.user.id, actif: true },
    });
    if (!assignment) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const entry = await prisma.planningEntry.create({
    data: { commandeId, jour, heure, type, titre, details, serviceId, auto: false },
  });

  return NextResponse.json(entry, { status: 201 });
}
```

- [ ] **Step 2: Create `app/api/admin/planning/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const data: any = {};
  if (body.heure !== undefined) data.heure = body.heure;
  if (body.titre !== undefined) data.titre = body.titre;
  if (body.details !== undefined) data.details = body.details;
  if (body.type !== undefined) data.type = body.type;

  const entry = await prisma.planningEntry.update({ where: { id }, data });
  return NextResponse.json(entry);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  await prisma.planningEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Create `app/api/admin/planning/generate/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { commandeId } = await request.json();

  const commande = await prisma.commande.findUnique({
    where: { id: commandeId },
    include: { lignes: { include: { service: true } } },
  });
  if (!commande) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  await prisma.planningEntry.deleteMany({ where: { commandeId, auto: true } });

  const arrivalDate = new Date(commande.dateArrivee);
  const departureDate = new Date(commande.dateDepart);
  const totalDays = Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));

  const entries: Array<{
    commandeId: string;
    jour: number;
    heure: string;
    type: string;
    titre: string;
    details: string | null;
    serviceId: string | null;
    auto: boolean;
  }> = [];

  for (const ligne of commande.lignes) {
    const cat = ligne.service.categorie;

    if (cat === "transport") {
      entries.push({
        commandeId,
        jour: 1,
        heure: commande.heureArrivee || "08:00",
        type: "transport",
        titre: `${ligne.service.nom}`,
        details: null,
        serviceId: ligne.serviceId,
        auto: true,
      });
    } else if (cat === "hebergement") {
      for (let d = 1; d <= totalDays; d++) {
        entries.push({
          commandeId,
          jour: d,
          heure: d === 1 ? "14:00" : "00:00",
          type: "hebergement",
          titre: `${ligne.service.nom}`,
          details: `${ligne.quantite} nuit(s)`,
          serviceId: ligne.serviceId,
          auto: true,
        });
      }
    } else if (cat === "repas") {
      for (let d = 1; d <= totalDays; d++) {
        const heure = ligne.service.nom.toLowerCase().includes("petit") ? "07:30"
          : ligne.service.nom.toLowerCase().includes("déjeuner") || ligne.service.nom.toLowerCase().includes("lunch") ? "12:30"
          : "19:30";
        entries.push({
          commandeId,
          jour: d,
          heure,
          type: "repas",
          titre: `${ligne.service.nom}`,
          details: `${commande.nombrePersonnes} pax`,
          serviceId: ligne.serviceId,
          auto: true,
        });
      }
    } else {
      entries.push({
        commandeId,
        jour: 1,
        heure: "10:00",
        type: "extra",
        titre: `${ligne.service.nom}`,
        details: `Qté: ${ligne.quantite}`,
        serviceId: ligne.serviceId,
        auto: true,
      });
    }
  }

  if (entries.length > 0) {
    await prisma.planningEntry.createMany({ data: entries });
  }

  const created = await prisma.planningEntry.findMany({
    where: { commandeId, auto: true },
    orderBy: [{ jour: "asc" }, { heure: "asc" }],
  });

  return NextResponse.json(created, { status: 201 });
}
```

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/planning/
git commit -m "feat: planning API — CRUD + auto-generation from commande services"
```

---

## Task 11: Briefing Pages — List + Carnet de Route

**Files:**
- Create: `components/admin/briefing-card.tsx`
- Create: `components/admin/planning-timeline.tsx`
- Create: `app/(admin)/briefing/page.tsx`
- Create: `app/(admin)/briefing/[commandeId]/page.tsx`

- [ ] **Step 1: Create `components/admin/briefing-card.tsx`**

```typescript
"use client";

import Link from "next/link";
import { StatusBadge } from "./status-badge";
import { Calendar, Users, ChevronRight } from "lucide-react";

interface BriefingCardProps {
  commandeId: string;
  reference: string;
  clientName: string;
  dateArrivee: string;
  dateDepart: string;
  nombrePersonnes: number;
  statut: string;
}

export function BriefingCard({
  commandeId,
  reference,
  clientName,
  dateArrivee,
  dateDepart,
  nombrePersonnes,
  statut,
}: BriefingCardProps) {
  const arrival = new Date(dateArrivee).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const departure = new Date(dateDepart).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  return (
    <Link
      href={`/briefing/${commandeId}`}
      className="block bg-white rounded-2xl border border-line p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-serif text-[18px] text-ink">{clientName}</p>
          <p className="text-[12px] text-mute mono">{reference}</p>
        </div>
        <StatusBadge status={statut} />
      </div>
      <div className="flex items-center gap-4 text-[13px] text-mute">
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {arrival} → {departure}
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} /> {nombrePersonnes} pax
        </span>
      </div>
      <div className="flex justify-end mt-3">
        <span className="text-[12px] text-gold flex items-center gap-1">
          Voir le carnet <ChevronRight size={14} />
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create `components/admin/planning-timeline.tsx`**

```typescript
"use client";

import { Car, Utensils, Hotel, Sparkles, MessageSquare } from "lucide-react";

interface PlanningEntry {
  id: string;
  jour: number;
  heure: string;
  type: string;
  titre: string;
  details: string | null;
  auto: boolean;
}

const TYPE_CONFIG: Record<string, { icon: typeof Car; color: string; bg: string }> = {
  transport: { icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
  repas: { icon: Utensils, color: "text-orange-600", bg: "bg-orange-50" },
  hebergement: { icon: Hotel, color: "text-purple-600", bg: "bg-purple-50" },
  extra: { icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50" },
  custom: { icon: MessageSquare, color: "text-gold", bg: "bg-gold/10" },
};

interface PlanningTimelineProps {
  entries: PlanningEntry[];
  arrivalDate: string;
}

export function PlanningTimeline({ entries, arrivalDate }: PlanningTimelineProps) {
  const arrival = new Date(arrivalDate);
  const days = Array.from(new Set(entries.map((e) => e.jour))).sort((a, b) => a - b);

  function getDayDate(jour: number): string {
    const d = new Date(arrival);
    d.setDate(d.getDate() + jour - 1);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  }

  return (
    <div className="space-y-8">
      {days.map((jour) => (
        <div key={jour}>
          <h3 className="font-serif text-[16px] text-ink mb-4 capitalize">
            Jour {jour} — {getDayDate(jour)}
          </h3>
          <div className="space-y-3">
            {entries
              .filter((e) => e.jour === jour)
              .map((entry) => {
                const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.custom;
                const Icon = config.icon;
                return (
                  <div key={entry.id} className="flex gap-3 items-start">
                    <div className="text-[13px] mono text-mute w-12 pt-1 shrink-0">{entry.heure}</div>
                    <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-ink font-medium">{entry.titre}</p>
                      {entry.details && <p className="text-[12px] text-mute mt-0.5">{entry.details}</p>}
                      {!entry.auto && (
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                          Manuel
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `app/(admin)/briefing/page.tsx`**

```typescript
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Topbar } from "@/components/admin/topbar";
import { useSidebar } from "@/components/admin/admin-shell";
import { BriefingCard } from "@/components/admin/briefing-card";
import { ClipboardCheck } from "lucide-react";

interface AssignmentData {
  id: string;
  commande: {
    id: string;
    reference: string;
    prenom: string;
    nom: string;
    dateArrivee: string;
    dateDepart: string;
    nombrePersonnes: number;
    statut: string;
  };
}

export default function BriefingPage() {
  const { toggleSidebar } = useSidebar();
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/assignments")
      .then((r) => r.json())
      .then((data) => {
        setAssignments(data);
        setLoading(false);
      });
  }, []);

  const today = new Date();
  const active = assignments.filter((a) => new Date(a.commande.dateDepart) >= today);
  const past = assignments.filter((a) => new Date(a.commande.dateDepart) < today);

  return (
    <>
      <Topbar title="Briefing" subtitle="Vos clients assignés" onMenuToggle={toggleSidebar} />
      <div className="p-6 lg:p-10">
        {loading ? (
          <div className="text-center text-mute py-20">Chargement…</div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardCheck size={48} className="mx-auto text-mute/30 mb-4" />
            <p className="text-mute">Aucun client assigné pour le moment</p>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[12px] uppercase tracking-wider text-mute mb-4">En cours / À venir</h3>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {active.map((a) => (
                    <BriefingCard
                      key={a.id}
                      commandeId={a.commande.id}
                      reference={a.commande.reference}
                      clientName={`${a.commande.prenom} ${a.commande.nom}`}
                      dateArrivee={a.commande.dateArrivee}
                      dateDepart={a.commande.dateDepart}
                      nombrePersonnes={a.commande.nombrePersonnes}
                      statut={a.commande.statut}
                    />
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-mute mb-4">Passés</h3>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 opacity-60">
                  {past.map((a) => (
                    <BriefingCard
                      key={a.id}
                      commandeId={a.commande.id}
                      reference={a.commande.reference}
                      clientName={`${a.commande.prenom} ${a.commande.nom}`}
                      dateArrivee={a.commande.dateArrivee}
                      dateDepart={a.commande.dateDepart}
                      nombrePersonnes={a.commande.nombrePersonnes}
                      statut={a.commande.statut}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 4: Create `app/(admin)/briefing/[commandeId]/page.tsx`**

```typescript
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Topbar } from "@/components/admin/topbar";
import { useSidebar } from "@/components/admin/admin-shell";
import { PlanningTimeline } from "@/components/admin/planning-timeline";
import { ArrowLeft } from "lucide-react";

interface CommandeData {
  id: string;
  reference: string;
  prenom: string;
  nom: string;
  dateArrivee: string;
  dateDepart: string;
  nombrePersonnes: number;
  telephone: string;
  email: string;
  nationalite: string;
  statut: string;
  notes: string | null;
}

interface PlanningEntry {
  id: string;
  jour: number;
  heure: string;
  type: string;
  titre: string;
  details: string | null;
  auto: boolean;
}

export default function CarnetDeRoutePage() {
  const { commandeId } = useParams<{ commandeId: string }>();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [commande, setCommande] = useState<CommandeData | null>(null);
  const [entries, setEntries] = useState<PlanningEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/commandes/${commandeId}`).then((r) => r.json()),
      fetch(`/api/admin/planning?commandeId=${commandeId}`).then((r) => r.json()),
    ]).then(([cmd, plan]) => {
      setCommande(cmd);
      setEntries(plan);
      setLoading(false);
    });
  }, [commandeId]);

  if (loading) {
    return (
      <>
        <Topbar title="Carnet de route" onMenuToggle={toggleSidebar} />
        <div className="p-6 text-center text-mute py-20">Chargement…</div>
      </>
    );
  }

  if (!commande) {
    return (
      <>
        <Topbar title="Carnet de route" onMenuToggle={toggleSidebar} />
        <div className="p-6 text-center text-mute py-20">Commande introuvable ou accès refusé</div>
      </>
    );
  }

  return (
    <>
      <Topbar title={`${commande.prenom} ${commande.nom}`} subtitle={commande.reference} onMenuToggle={toggleSidebar}>
        <button onClick={() => router.push("/briefing")} className="flex items-center gap-1 text-[13px] text-mute hover:text-ink">
          <ArrowLeft size={16} /> Retour
        </button>
      </Topbar>
      <div className="p-6 lg:p-10">
        <div className="bg-white rounded-2xl border border-line p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[13px]">
            <div>
              <p className="text-mute text-[10px] uppercase tracking-wider mb-1">Téléphone</p>
              <p className="text-ink">{commande.telephone}</p>
            </div>
            <div>
              <p className="text-mute text-[10px] uppercase tracking-wider mb-1">Email</p>
              <p className="text-ink truncate">{commande.email}</p>
            </div>
            <div>
              <p className="text-mute text-[10px] uppercase tracking-wider mb-1">Nationalité</p>
              <p className="text-ink">{commande.nationalite}</p>
            </div>
            <div>
              <p className="text-mute text-[10px] uppercase tracking-wider mb-1">Personnes</p>
              <p className="text-ink">{commande.nombrePersonnes} pax</p>
            </div>
          </div>
          {commande.notes && (
            <div className="mt-4 pt-4 border-t border-line">
              <p className="text-mute text-[10px] uppercase tracking-wider mb-1">Notes client</p>
              <p className="text-[13px] text-ink">{commande.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-line p-6">
          <h2 className="font-serif text-[18px] text-ink mb-6">Carnet de route</h2>
          {entries.length === 0 ? (
            <p className="text-mute text-center py-8">Aucune entrée de planning. Le planning sera généré à la confirmation de la commande.</p>
          ) : (
            <PlanningTimeline entries={entries} arrivalDate={commande.dateArrivee} />
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/admin/briefing-card.tsx components/admin/planning-timeline.tsx app/\(admin\)/briefing/
git commit -m "feat: concierge briefing pages — client list + carnet de route"
```

---

## Task 12: Updated Seed Data

**Files:**
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Rewrite `prisma/seed.ts`**

Replace the entire file. This keeps all existing service/chauffeur/order seeding and adds new users + assignments + planning:

```typescript
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean up in correct order (respecting foreign keys)
  await prisma.planningEntry.deleteMany();
  await prisma.note.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.ligneCommande.deleteMany();
  await prisma.tarif.deleteMany();
  await prisma.service.deleteMany();
  await prisma.commande.deleteMany();
  await prisma.chauffeur.deleteMany();
  await prisma.adminUser.deleteMany();

  // ── Transport (5) ──────────────────────────────────────────────

  await prisma.service.create({
    data: {
      nom: "Accueil VIP aéroport FHB",
      nomEn: "VIP Airport Welcome FHB",
      nomAr: "استقبال VIP في مطار FHB",
      description: "Fast-track douanes + porteur + salon Pearl Lounge",
      descEn: "Fast-track customs + porter + Pearl Lounge access",
      descAr: "تسريع الجمارك + حمّال + صالة بيرل لاونج",
      categorie: "transport",
      prixBase: 75000,
      unite: "personne",
      icon: "plane",
      ordre: 1,
      tarifs: { create: { label: "Accueil VIP aéroport", prix: 75000 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Berline avec chauffeur · 4h",
      nomEn: "Sedan with driver · 4h",
      nomAr: "سيارة سيدان مع سائق · 4 ساعات",
      description: "Mercedes Classe E ou similaire, chauffeur bilingue FR/EN",
      descEn: "Mercedes E-Class or similar, bilingual FR/EN driver",
      descAr: "مرسيدس الفئة E أو ما يعادلها، سائق ثنائي اللغة فر/إنج",
      categorie: "transport",
      prixBase: 120000,
      unite: "course",
      icon: "car",
      ordre: 2,
      tarifs: { create: { label: "Berline 4h", prix: 120000 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Van 7 places · 8h",
      nomEn: "7-seat van · 8h",
      nomAr: "فان 7 مقاعد · 8 ساعات",
      description: "Toyota HiAce VIP, idéal pour délégations de 4 à 7 personnes",
      descEn: "Toyota HiAce VIP, ideal for delegations of 4 to 7 people",
      descAr: "تويوتا هايس VIP، مثالي للوفود من 4 إلى 7 أشخاص",
      categorie: "transport",
      prixBase: 180000,
      unite: "journée",
      icon: "bus",
      ordre: 3,
      tarifs: { create: { label: "Van 7 places 8h", prix: 180000 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Escorte sécuritaire",
      nomEn: "Security escort",
      nomAr: "مرافقة أمنية",
      description: "Véhicule escorte + agent de sécurité certifié",
      descEn: "Escort vehicle + certified security agent",
      descAr: "مركبة مرافقة + عميل أمن معتمد",
      categorie: "transport",
      prixBase: 95000,
      unite: "mission",
      icon: "shield",
      ordre: 4,
      tarifs: { create: { label: "Escorte sécuritaire", prix: 95000 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Transfert hélicoptère",
      nomEn: "Helicopter transfer",
      nomAr: "نقل بالهليكوبتر",
      description: "Transfert héliporté Abidjan – zone SIREXE, 4 passagers max",
      descEn: "Helicopter transfer Abidjan – SIREXE zone, 4 passengers max",
      descAr: "نقل بالهليكوبتر أبيدجان – منطقة SIREXE، 4 ركاب كحد أقصى",
      categorie: "transport",
      prixBase: 850000,
      unite: "vol",
      icon: "helicopter",
      ordre: 5,
      tarifs: { create: { label: "Transfert hélicoptère", prix: 850000 } },
    },
  });

  // ── Hébergement (4) ────────────────────────────────────────────

  await prisma.service.create({
    data: {
      nom: "Pullman Plateau",
      nomEn: "Pullman Plateau",
      nomAr: "بولمان بلاتو",
      description: "Chambre Supérieure, petit-déjeuner inclus, Wi-Fi haut débit",
      descEn: "Superior room, breakfast included, high-speed Wi-Fi",
      descAr: "غرفة سوبيريور، فطور مشمول، واي فاي عالي السرعة",
      categorie: "hebergement",
      prixBase: 185000,
      unite: "nuit",
      icon: "hotel",
      etoiles: 5,
      quartier: "Plateau",
      badge: "Hôtel officiel",
      ordre: 1,
      tarifs: { create: { label: "Pullman Plateau · nuit", prix: 185000 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Sofitel Hôtel Ivoire",
      nomEn: "Sofitel Hotel Ivoire",
      nomAr: "سوفيتل فندق إيفوار",
      description: "Suite Junior, vue lagune, accès piscine et spa",
      descEn: "Junior Suite, lagoon view, pool and spa access",
      descAr: "جناح جونيور، إطلالة على البحيرة، دخول المسبح والسبا",
      categorie: "hebergement",
      prixBase: 245000,
      unite: "nuit",
      icon: "hotel",
      etoiles: 5,
      quartier: "Cocody",
      ordre: 2,
      tarifs: { create: { label: "Sofitel Hôtel Ivoire · nuit", prix: 245000 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Mövenpick Abidjan",
      nomEn: "Mövenpick Abidjan",
      nomAr: "موفنبيك أبيدجان",
      description: "Chambre Deluxe, restaurant panoramique, centre d'affaires",
      descEn: "Deluxe room, panoramic restaurant, business centre",
      descAr: "غرفة ديلوكس، مطعم بانورامي، مركز أعمال",
      categorie: "hebergement",
      prixBase: 175000,
      unite: "nuit",
      icon: "hotel",
      etoiles: 5,
      quartier: "Plateau",
      ordre: 3,
      tarifs: { create: { label: "Mövenpick Abidjan · nuit", prix: 175000 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Noom Hotel",
      nomEn: "Noom Hotel",
      nomAr: "فندق نوم",
      description: "Chambre Standard, tarif préférentiel délégation SIREXE",
      descEn: "Standard room, preferential SIREXE delegation rate",
      descAr: "غرفة قياسية، سعر تفضيلي لوفد SIREXE",
      categorie: "hebergement",
      prixBase: 135000,
      unite: "nuit",
      icon: "hotel",
      etoiles: 4,
      quartier: "Plateau",
      badge: "Tarif délégation",
      ordre: 4,
      tarifs: { create: { label: "Noom Hotel · nuit", prix: 135000 } },
    },
  });

  // ── Repas (5) ──────────────────────────────────────────────────

  await prisma.service.create({
    data: {
      nom: "Petit-déjeuner buffet",
      nomEn: "Buffet breakfast",
      nomAr: "فطور بوفيه",
      description: "Buffet international, options continentales et locales",
      descEn: "International buffet, continental and local options",
      descAr: "بوفيه دولي، خيارات قارية ومحلية",
      categorie: "repas",
      prixBase: 18000,
      unite: "pax",
      icon: "coffee",
      ordre: 1,
      tarifs: { create: { label: "Petit-déjeuner buffet", prix: 18000 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Déjeuner d'affaires",
      nomEn: "Business lunch",
      nomAr: "غداء عمل",
      description: "Menu 3 plats, boissons incluses, salle privée disponible",
      descEn: "3-course menu, drinks included, private room available",
      descAr: "قائمة 3 أطباق، مشروبات مشمولة، غرفة خاصة متاحة",
      categorie: "repas",
      prixBase: 32000,
      unite: "pax",
      icon: "utensils",
      ordre: 2,
      tarifs: { create: { label: "Déjeuner d'affaires", prix: 32000 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Dîner gastronomique",
      nomEn: "Gourmet dinner",
      nomAr: "عشاء فاخر",
      description: "Menu dégustation 5 plats, accords mets-vins, chef étoilé",
      descEn: "5-course tasting menu, wine pairing, star chef",
      descAr: "قائمة تذوق 5 أطباق، مزج النبيذ، شيف حاصل على نجمة",
      categorie: "repas",
      prixBase: 55000,
      unite: "pax",
      icon: "wine",
      ordre: 3,
      tarifs: { create: { label: "Dîner gastronomique", prix: 55000 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Menu halal certifié",
      nomEn: "Certified halal menu",
      nomAr: "قائمة حلال معتمدة",
      description: "Supplément menu halal certifié pour tout repas",
      descEn: "Certified halal menu supplement for any meal",
      descAr: "ملحق قائمة حلال معتمدة لأي وجبة",
      categorie: "repas",
      prixBase: 0,
      unite: "pax",
      icon: "leaf",
      ordre: 4,
      tarifs: { create: { label: "Menu halal certifié", prix: 0 } },
    },
  });

  await prisma.service.create({
    data: {
      nom: "Boxed lunch SIREXE",
      nomEn: "SIREXE boxed lunch",
      nomAr: "غداء معلب SIREXE",
      description: "Panier repas premium à emporter, idéal pour les sessions",
      descEn: "Premium packed lunch, ideal for sessions",
      descAr: "وجبة غداء معلبة فاخرة، مثالية للجلسات",
      categorie: "repas",
      prixBase: 14000,
      unite: "pax",
      icon: "sandwich",
      ordre: 5,
      tarifs: { create: { label: "Boxed lunch SIREXE", prix: 14000 } },
    },
  });

  // ── Extras (8) ─────────────────────────────────────────────────

  const extras = [
    { nom: "SIM 4G + data 20 Go", nomEn: "4G SIM + 20 GB data", nomAr: "شريحة 4G + بيانات 20 جيجا", description: "Carte SIM prépayée Orange CI, 20 Go data + appels locaux", descEn: "Prepaid Orange CI SIM card, 20 GB data + local calls", descAr: "بطاقة SIM مسبقة الدفع أورانج CI، 20 جيجا بيانات + مكالمات محلية", prixBase: 15000, unite: "pièce", icon: "smartphone" },
    { nom: "Service blanchisserie", nomEn: "Laundry service", nomAr: "خدمة الغسيل", description: "Pressing express livré à l'hôtel sous 24h", descEn: "Express dry cleaning delivered to hotel within 24h", descAr: "تنظيف جاف سريع يُسلَّم إلى الفندق خلال 24 ساعة", prixBase: 22000, unite: "lot", icon: "shirt" },
    { nom: "Bouquet d'accueil", nomEn: "Welcome bouquet", nomAr: "باقة ترحيب", description: "Bouquet de fleurs tropicales + carte de bienvenue personnalisée", descEn: "Tropical flower bouquet + personalized welcome card", descAr: "باقة زهور استوائية + بطاقة ترحيب مخصصة", prixBase: 18000, unite: "pièce", icon: "flower" },
    { nom: "Interprète FR↔AR · 4h", nomEn: "FR↔AR interpreter · 4h", nomAr: "مترجم فر↔عر · 4 ساعات", description: "Interprète certifié français-arabe, 4 heures minimum", descEn: "Certified French-Arabic interpreter, 4-hour minimum", descAr: "مترجم فرنسي-عربي معتمد، 4 ساعات كحد أدنى", prixBase: 90000, unite: "séance", icon: "languages" },
    { nom: "Photographe événementiel", nomEn: "Event photographer", nomAr: "مصور فعاليات", description: "Photographe professionnel, 200 photos HD livrées sous 48h", descEn: "Professional photographer, 200 HD photos delivered within 48h", descAr: "مصور محترف، 200 صورة عالية الدقة تُسلَّم خلال 48 ساعة", prixBase: 120000, unite: "séance", icon: "camera" },
    { nom: "Excursion Grand-Bassam", nomEn: "Grand-Bassam excursion", nomAr: "رحلة غران باسام", description: "Visite guidée de la ville historique UNESCO, transport inclus", descEn: "Guided tour of the UNESCO historic city, transport included", descAr: "جولة مع مرشد في المدينة التاريخية المدرجة في اليونسكو، النقل مشمول", prixBase: 65000, unite: "personne", icon: "palmtree" },
    { nom: "Soirée gala SIREXE", nomEn: "SIREXE gala evening", nomAr: "أمسية غالا SIREXE", description: "Invitation soirée de gala officielle SIREXE, tenue de soirée", descEn: "Official SIREXE gala evening invitation, formal attire", descAr: "دعوة لأمسية غالا SIREXE الرسمية، لباس رسمي", prixBase: 80000, unite: "personne", icon: "ticket" },
    { nom: "Visa Express · 48h", nomEn: "Express Visa · 48h", nomAr: "تأشيرة سريعة · 48 ساعة", description: "Assistance visa accéléré, traitement en 48h garanti", descEn: "Expedited visa assistance, guaranteed 48h processing", descAr: "مساعدة تأشيرة سريعة، معالجة مضمونة خلال 48 ساعة", prixBase: 45000, unite: "personne", icon: "shield-check" },
  ];

  for (let i = 0; i < extras.length; i++) {
    const e = extras[i];
    await prisma.service.create({
      data: {
        nom: e.nom, nomEn: e.nomEn, nomAr: e.nomAr,
        description: e.description, descEn: e.descEn, descAr: e.descAr,
        categorie: "extras", prixBase: e.prixBase, unite: e.unite, icon: e.icon, ordre: i + 1,
        tarifs: { create: { label: e.nom, prix: e.prixBase } },
      },
    });
  }

  // ── Admin users (4 roles) ──────────────────────────────────────

  const hash = await bcrypt.hash("sirexe2026", 10);

  const ultraAdmin = await prisma.adminUser.create({
    data: { email: "admin@sirexe.com", passwordHash: hash, nom: "Aïssa Koné", role: "ULTRA_ADMIN" },
  });

  const superAdmin = await prisma.adminUser.create({
    data: { email: "manager@sirexe.com", passwordHash: hash, nom: "Mamadou Traoré", role: "SUPER_ADMIN" },
  });

  const concierge1 = await prisma.adminUser.create({
    data: { email: "concierge1@sirexe.com", passwordHash: hash, nom: "Fatou Diallo", role: "CONCIERGE" },
  });

  const concierge2 = await prisma.adminUser.create({
    data: { email: "concierge2@sirexe.com", passwordHash: hash, nom: "Koné Ibrahim", role: "CONCIERGE" },
  });

  // ── Demo chauffeurs ──────────────────────────────────────────

  const chauffeurs = [
    { nom: "Konan Yao", telephone: "+225 07 01 02 03", vehicule: "Mercedes E-Class", immatriculation: "AB 1234 CI", statut: "disponible" },
    { nom: "Ouattara Ibrahim", telephone: "+225 05 04 05 06", vehicule: "Toyota Land Cruiser", immatriculation: "CD 5678 CI", statut: "en_course" },
    { nom: "Bamba Moussa", telephone: "+225 01 07 08 09", vehicule: "Mercedes V-Class", immatriculation: "EF 9012 CI", statut: "disponible" },
    { nom: "Traoré Seydou", telephone: "+225 07 10 11 12", vehicule: "BMW Série 5", immatriculation: "GH 3456 CI", statut: "indisponible" },
  ];
  for (const c of chauffeurs) {
    await prisma.chauffeur.create({ data: c });
  }

  // ── Demo commandes ─────────────────────────────────────────────

  const allServices = await prisma.service.findMany({ include: { tarifs: true } });

  const demoOrders = [
    { ref: "SIREXE-26-A8F2", prenom: "Amadou", nom: "Diallo", email: "amadou.diallo@sonangaz.com", telephone: "+221771234567", nationalite: "🇸🇳 Sénégalaise", dateArrivee: "2026-03-12T23:40:00Z", dateDepart: "2026-03-16T08:00:00Z", nombrePersonnes: 2, compagnie: "Air France", numeroVol: "AF 528", heureArrivee: "23:40", montantTotal: 1245000, statut: "CONFIRMEE" },
    { ref: "SIREXE-26-B102", prenom: "Sarah", nom: "Mensah", email: "sarah.mensah@ghanamining.gh", telephone: "+233201234567", nationalite: "🇬🇭 Ghanéenne", dateArrivee: "2026-03-13T08:15:00Z", dateDepart: "2026-03-17T10:00:00Z", nombrePersonnes: 1, compagnie: "ASKY", numeroVol: "KP 022", heureArrivee: "08:15", montantTotal: 880000, statut: "EN_ATTENTE" },
    { ref: "SIREXE-26-C937", prenom: "Khalid", nom: "Al-Faisal", email: "k.alfaisal@adnoc.ae", telephone: "+971501234567", nationalite: "🇦🇪 Émiratie", dateArrivee: "2026-03-13T14:30:00Z", dateDepart: "2026-03-18T16:00:00Z", nombrePersonnes: 3, compagnie: "Emirates", numeroVol: "EK 787", heureArrivee: "14:30", montantTotal: 2480000, statut: "CONFIRMEE" },
    { ref: "SIREXE-26-D451", prenom: "Jean", nom: "Dupont", email: "j.dupont@totalenergies.fr", telephone: "+33612345678", nationalite: "🇫🇷 Française", dateArrivee: "2026-03-14T06:55:00Z", dateDepart: "2026-03-16T18:00:00Z", nombrePersonnes: 1, compagnie: "Air France", numeroVol: "AF 530", heureArrivee: "06:55", montantTotal: 425000, statut: "CONFIRMEE" },
    { ref: "SIREXE-26-E284", prenom: "Fatima", nom: "Bensalah", email: "f.bensalah@ocp.ma", telephone: "+212661234567", nationalite: "🇲🇦 Marocaine", dateArrivee: "2026-03-14T11:20:00Z", dateDepart: "2026-03-17T09:00:00Z", nombrePersonnes: 2, compagnie: "Royal Air Maroc", numeroVol: "AT 552", heureArrivee: "11:20", montantTotal: 1080000, statut: "EN_ATTENTE" },
    { ref: "SIREXE-26-F673", prenom: "Tunde", nom: "Olatunji", email: "t.olatunji@nnpc.ng", telephone: "+2348012345678", nationalite: "🇳🇬 Nigériane", dateArrivee: "2026-03-14T19:45:00Z", dateDepart: "2026-03-18T12:00:00Z", nombrePersonnes: 2, compagnie: "Arik Air", numeroVol: "W3 101", heureArrivee: "19:45", montantTotal: 1620000, statut: "CONFIRMEE" },
    { ref: "SIREXE-26-G129", prenom: "Mary", nom: "Johnson", email: "m.johnson@bp.co.uk", telephone: "+447911234567", nationalite: "🇬🇧 Britannique", dateArrivee: "2026-03-15T09:10:00Z", dateDepart: "2026-03-17T14:00:00Z", nombrePersonnes: 1, compagnie: "British Airways", numeroVol: "BA 079", heureArrivee: "09:10", montantTotal: 760000, statut: "ANNULEE" },
    { ref: "SIREXE-26-H805", prenom: "Omar", nom: "Sissoko", email: "o.sissoko@somilo.ml", telephone: "+22376123456", nationalite: "🇲🇱 Malienne", dateArrivee: "2026-03-15T15:35:00Z", dateDepart: "2026-03-19T08:00:00Z", nombrePersonnes: 4, compagnie: "ASKY", numeroVol: "KP 045", heureArrivee: "15:35", montantTotal: 1985000, statut: "CONFIRMEE" },
  ];

  const createdOrders: Array<{ id: string; ref: string }> = [];
  for (const o of demoOrders) {
    const order = await prisma.commande.create({
      data: {
        reference: o.ref,
        prenom: o.prenom,
        nom: o.nom,
        email: o.email,
        telephone: o.telephone,
        nationalite: o.nationalite,
        dateArrivee: new Date(o.dateArrivee),
        dateDepart: new Date(o.dateDepart),
        nombrePersonnes: o.nombrePersonnes,
        compagnie: o.compagnie,
        numeroVol: o.numeroVol,
        heureArrivee: o.heureArrivee,
        montantTotal: o.montantTotal,
        statut: o.statut,
        devise: "XOF",
        lignes: {
          create: [
            {
              serviceId: allServices[0].id,
              quantite: 1,
              prixUnitaire: allServices[0].prixBase,
              sousTotal: allServices[0].prixBase,
            },
          ],
        },
      },
    });
    createdOrders.push({ id: order.id, ref: o.ref });
  }

  // ── Assignments (round-robin demo) ─────────────────────────────

  for (let i = 0; i < createdOrders.length; i++) {
    const concierge = i % 2 === 0 ? concierge1 : concierge2;
    await prisma.assignment.create({
      data: { conciergeId: concierge.id, commandeId: createdOrders[i].id },
    });
  }

  // ── Planning entries for first order ───────────────────────────

  const firstOrder = createdOrders[0];
  await prisma.planningEntry.createMany({
    data: [
      { commandeId: firstOrder.id, jour: 1, heure: "23:40", type: "transport", titre: "Accueil VIP aéroport FHB", details: "Chauffeur: Konan Yao · Mercedes E-Class · FR/EN", auto: true },
      { commandeId: firstOrder.id, jour: 1, heure: "00:30", type: "hebergement", titre: "Pullman Plateau — Check-in", details: "Chambre Supérieure, 3e étage", auto: true },
      { commandeId: firstOrder.id, jour: 2, heure: "07:30", type: "repas", titre: "Petit-déjeuner buffet", details: "2 pax — Buffet international", auto: true },
      { commandeId: firstOrder.id, jour: 2, heure: "09:00", type: "transport", titre: "Berline → Pavillon SIREXE", details: "Chauffeur: Konan Yao · anglophone", auto: true },
      { commandeId: firstOrder.id, jour: 2, heure: "12:30", type: "repas", titre: "Déjeuner d'affaires", details: "2 pax — Restaurant Le Bélier, salle privée", auto: true },
      { commandeId: firstOrder.id, jour: 2, heure: "19:30", type: "repas", titre: "Dîner gastronomique", details: "2 pax — Chef étoilé, menu dégustation", auto: true },
      { commandeId: firstOrder.id, jour: 2, heure: "10:00", type: "custom", titre: "Note concierge", details: "Client préfère eau plate, préparer au véhicule", auto: false },
      { commandeId: firstOrder.id, jour: 3, heure: "07:30", type: "repas", titre: "Petit-déjeuner buffet", details: "2 pax", auto: true },
      { commandeId: firstOrder.id, jour: 3, heure: "10:00", type: "extra", titre: "Excursion Grand-Bassam", details: "Visite guidée UNESCO, transport inclus", auto: true },
      { commandeId: firstOrder.id, jour: 4, heure: "06:00", type: "transport", titre: "Transfert hôtel → aéroport FHB", details: "Chauffeur: Konan Yao · départ vol 08:00", auto: true },
    ],
  });

  // ── Notes internes demo ────────────────────────────────────────

  await prisma.note.create({
    data: { commandeId: firstOrder.id, auteurId: concierge1.id, contenu: "Client arrivé sans encombre, accueil VIP OK. Bagages récupérés rapidement." },
  });

  await prisma.note.create({
    data: { commandeId: firstOrder.id, auteurId: superAdmin.id, contenu: "Chambre upgradée en Suite sur demande du client — voir avec la réception." },
  });

  console.log("Seeded: 22 services, 4 admin users (Ultra/Super/2×Concierge), 8 orders, 4 chauffeurs, 8 assignments, 10 planning entries, 2 notes.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 2: Run the seed**

```bash
npx prisma db seed
```

Expected: `Seeded: 22 services, 4 admin users (Ultra/Super/2×Concierge), 8 orders, 4 chauffeurs, 8 assignments, 10 planning entries, 2 notes.`

- [ ] **Step 3: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: seed data with all role types, assignments, planning entries, and notes"
```

---

## Task 13: Build Verification + Manual Test

**Files:** None (verification only)

- [ ] **Step 1: Run full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2: Run Next.js build**

```bash
npx next build
```

Expected: Build succeeds.

- [ ] **Step 3: Start dev server and test login as each role**

```bash
npm run dev
```

Test in browser:

1. Login as `admin@sirexe.com` / `sirexe2026` — should see all sidebar items (Dashboard, Commandes, Tarifs, Voyageurs, Chauffeurs, Rapports, Paramètres)
2. Login as `manager@sirexe.com` / `sirexe2026` — should see Dashboard, Commandes, Voyageurs, Chauffeurs, Rapports, Paramètres (no Tarifs)
3. Login as `concierge1@sirexe.com` / `sirexe2026` — should see Dashboard, Briefing, Paramètres only
4. As concierge, navigate to `/briefing` — should see assigned clients
5. Click a client card — should see carnet de route with timeline entries

- [ ] **Step 4: Verify API protection**

As concierge, try accessing `/commandes` directly — should not show in sidebar and API should return 403.

As concierge, try `/api/admin/tarifs` — should return 403.

- [ ] **Step 5: Commit final verification**

```bash
git add -A
git status
```

If there are any uncommitted fixes, commit them:

```bash
git commit -m "fix: address build issues from roles migration"
```
