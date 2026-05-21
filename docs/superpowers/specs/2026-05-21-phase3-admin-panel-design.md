# Phase 3 — Panel Administration SIREXE Concierge

## Contexte

SIREXE Concierge est un SaaS de conciergerie pour le salon SIREXE 2026 à Abidjan. La Phase 1 (formulaire client, pages éditoriales, API) est terminée. La Phase 2 (paiements) est reportée. Cette Phase 3 implémente le panel d'administration complet, reproduisant exactement le prototype `Sirexe Admin.html`.

Le panel permet aux concierges de gérer les commandes, tarifs, voyageurs, chauffeurs, et de suivre l'activité via un dashboard temps réel.

## Stack technique

- Next.js 14, App Router, TypeScript (existant)
- NextAuth.js v5 (Auth.js) — CredentialsProvider, session JWT
- Prisma + SQLite (existant, ajout modèle Chauffeur)
- Tailwind CSS avec tokens SIREXE (existant)
- Lucide React pour les icônes
- bcryptjs pour le hachage des mots de passe

## Architecture

### Route Group

L'admin utilise un route group `(admin)` avec son propre layout (sidebar + topbar), séparé du côté voyageur `[locale]`. Pas d'i18n — interface en français uniquement.

```
/app/(admin)/
  layout.tsx              -- sidebar + topbar + session guard
  /dashboard/page.tsx     -- KPIs, graphique arrivées, répartition CA, dernières commandes
  /commandes/page.tsx     -- table commandes pleine page avec filtres + pagination
  /tarifs/page.tsx        -- éditeur de tarifs inline par catégorie
  /voyageurs/page.tsx     -- liste voyageurs agrégée depuis Commande
  /chauffeurs/page.tsx    -- CRUD chauffeurs
  /rapports/page.tsx      -- statistiques CA par catégorie/période
  /parametres/page.tsx    -- profil admin, mot de passe, liste admins
/app/(admin)/login/
  layout.tsx              -- layout minimal (pas de sidebar)
  page.tsx                -- formulaire connexion
```

URL résultantes : `/dashboard`, `/commandes`, `/tarifs`, etc. (pas de segment `/admin/` dans l'URL grâce au route group). Le middleware NextAuth matche ces chemins explicitement : `["/dashboard", "/commandes", "/tarifs", "/voyageurs", "/chauffeurs", "/rapports", "/parametres"]`.

### Protection des routes

Middleware NextAuth sur toutes les routes `(admin)` sauf `/login`. Redirection vers `/login` si pas de session. Les API routes `/api/admin/*` vérifient aussi la session.

### Nouveau modèle Prisma

```prisma
model Chauffeur {
  id              String   @id @default(cuid())
  nom             String
  telephone       String
  vehicule        String
  immatriculation String
  statut          String   @default("disponible")  // disponible, en_course, indisponible
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

Le modèle `AdminUser` existant est déjà prêt (email, passwordHash, nom, role).

### Seed admin

Un admin par défaut est créé dans `prisma/seed.ts` :
- Email : `admin@sirexe.com`
- Mot de passe : `sirexe2026` (haché avec bcryptjs)
- Nom : `Aïssa Koné`
- Rôle : `admin`

Des commandes de démo (8 commandes du prototype) et des chauffeurs de démo (4-5) sont aussi créés pour que le dashboard ne soit pas vide.

## Pages

### Login

Fond `bg-ink` pleine page. Card centrée avec :
- Logo dots (orange/cream/green) + "SIREXE Concierge"
- Titre "Panel administration"
- Champ email + champ mot de passe
- Bouton "Se connecter" (bg-gold)
- Message d'erreur si credentials invalides

### Layout Admin (sidebar + topbar)

**Sidebar** (w-64, bg-ink, fixe à gauche, cachée mobile) :
- Header : dots verticaux + "SIREXE Concierge" (serif, gold) + "Panel admin" (muted)
- Nav items avec icônes Lucide :
  - `layout-dashboard` Tableau de bord
  - `clipboard-list` Commandes (badge compteur "en attente")
  - `banknote` Tarifs
  - `users` Voyageurs
  - `car-front` Chauffeurs
  - `bar-chart-3` Rapports
  - séparateur
  - `settings` Paramètres
- Item actif : gradient gold, border gold, texte cream
- Footer : avatar initiales (bg-gold, text-ink), nom admin, rôle, bouton logout

**Topbar** (bg-white, border-b border-line, h-16) :
- Gauche : titre page (serif, 22px) + sous-titre contextuel
- Droite : search input (⌘K), notification bell (badge rouge), lien "Vue voyageur" → `/fr`

**Mobile** : hamburger menu qui ouvre la sidebar en overlay.

### Dashboard

**4 KPI cards** (grid 2x2 → 4 cols desktop) :
1. Commandes aujourd'hui — `figure text-[40px]`, % vs hier (vert/rouge), "vs. X hier"
2. CA du jour — montant XOF `figure`, équivalent EUR, % croissance
3. En attente — compteur, "X urgents" en rouge, "À traiter sous 2h"
4. Confirmées — compteur, taux % sur total mois

KPIs calculés par API depuis la table `Commande` avec agrégation par date.

**Graphique arrivées** (lg:col-span-2) :
- SVG bar chart, 14 barres (jours), barres dorées pour la semaine SIREXE (jours 15-17 mars)
- Toggle pill J+14 / J+30
- Données : comptage `Commande.dateArrivee` par jour

**Répartition CA** (lg:col-span-1) :
- 4 barres de progression horizontales : Transport, Hébergement, Repas, Extras
- % et icônes colorées
- Calculé depuis `LigneCommande` jointe à `Service.categorie`

**Table dernières commandes** :
- 8 lignes les plus récentes
- Colonnes : Réf (mono), Voyageur (avatar initiales + flag + nom + email), Arrivée (date mono), Services (pills), Montant (mono, bold), Statut (badge coloré), Actions (eye + more)
- Filtres pills : Toutes / En attente / Confirmées / Annulées
- Boutons : Filtres, Export CSV
- Pagination : "1-8 sur N commandes" + numéros de page

### Commandes

Table pleine page identique à celle du dashboard mais avec :
- Pagination serveur (10 par page)
- Filtres : statut (multi-select), recherche texte (réf, nom, email), plage de dates
- Export CSV (télécharge toutes les commandes filtrées)
- Actions par ligne :
  - Voir détail (modal ou page) : toutes les infos voyageur + lignes de commande
  - Changer statut (dropdown : EN_ATTENTE → CONFIRMEE → ANNULEE)
  - Les changements de statut sont immédiats (appel API PATCH)

### Tarifs

Reproduction exacte du prototype `admin-tariffs` :

**Topbar spécifique** : switcher devise (XOF/EUR), bouton "Historique", bouton "Publier les changements"

**Barre filtre** : recherche, dropdown catégorie, toggle "Visibles uniquement", compteur "22 tarifs"

**4 blocs catégorie** (Transport, Hébergement, Repas, Extras) :
- Header : icône dans carré ink/gold, nom catégorie (serif), compteur, bouton "Ajouter un tarif"
- Table inline :
  - Service : input texte éditable (modifie `Tarif.label`)
  - Prix XOF : input numérique éditable (modifie `Tarif.prix`)
  - Prix EUR : calculé en lecture seule (÷ 655.957)
  - Prix USD : calculé en lecture seule (÷ 600)
  - Visible : toggle switch (modifie `Service.actif`)
  - Supprimer : icône trash, visible au hover

Chaque modification appelle l'API et affiche un toast de confirmation.

### Voyageurs

Pas de nouveau modèle — agrégation depuis `Commande` :
- Table : nom complet, email, téléphone, nationalité, nb commandes, montant total, dernière commande (date)
- Recherche + tri par colonne
- Clic sur une ligne → panneau détail avec historique des commandes du voyageur
- Les voyageurs sont dédupliqués par email

### Chauffeurs

CRUD sur le modèle `Chauffeur` :
- Table : nom, téléphone, véhicule, immatriculation, statut (badge coloré), actions
- Statuts : Disponible (vert), En course (gold), Indisponible (rouge)
- Bouton "Ajouter un chauffeur" → formulaire modal ou inline
- Actions : modifier, changer statut, supprimer
- Toggle statut rapide par clic sur le badge

### Rapports

Page statistiques avec :
- Sélecteur période : Aujourd'hui / 7 jours / 30 jours / Personnalisé
- **CA par catégorie** : barres horizontales (même style que le dashboard)
- **CA par jour** : graphique SVG courbe/barres sur la période sélectionnée
- **Top 5 services** : table avec nom, quantité vendue, CA généré
- **Métriques** : panier moyen, taux de confirmation, délai moyen de paiement

Données calculées depuis `Commande` + `LigneCommande` + `Service`.

### Paramètres

- **Profil** : formulaire avec nom, email de l'admin connecté. Bouton sauvegarder.
- **Mot de passe** : ancien mot de passe + nouveau + confirmation. Validation bcrypt.
- **Gestion admins** (si admin principal) : liste des AdminUser, bouton ajouter admin, supprimer.

## API Routes

```
POST   /api/auth/[...nextauth]    -- NextAuth handler

GET    /api/admin/stats            -- KPIs dashboard (commandes today, CA, pending, confirmed)
GET    /api/admin/stats/arrivals   -- données graphique arrivées (groupBy dateArrivee)
GET    /api/admin/stats/breakdown  -- répartition CA par catégorie
GET    /api/admin/stats/reports    -- données rapports (CA par jour, top services)

GET    /api/admin/commandes        -- liste paginée (?page=1&status=&search=&from=&to=)
GET    /api/admin/commandes/[id]   -- détail commande avec lignes
PATCH  /api/admin/commandes/[id]   -- modifier statut
GET    /api/admin/commandes/export -- CSV export

PATCH  /api/admin/tarifs/[id]      -- modifier tarif (label, prix)
POST   /api/admin/tarifs           -- ajouter tarif
DELETE /api/admin/tarifs/[id]      -- supprimer tarif
PATCH  /api/admin/services/[id]    -- modifier service (actif toggle)

GET    /api/admin/voyageurs        -- liste agrégée (?search=&page=)
GET    /api/admin/voyageurs/[email] -- détail voyageur + commandes

GET    /api/admin/chauffeurs       -- liste
POST   /api/admin/chauffeurs       -- créer
PATCH  /api/admin/chauffeurs/[id]  -- modifier (nom, véhicule, statut)
DELETE /api/admin/chauffeurs/[id]  -- supprimer

PATCH  /api/admin/profile          -- modifier profil admin
PATCH  /api/admin/password         -- changer mot de passe
GET    /api/admin/users            -- liste admins
POST   /api/admin/users            -- créer admin
DELETE /api/admin/users/[id]       -- supprimer admin
```

Toutes les routes `/api/admin/*` vérifient la session NextAuth. Retournent 401 si non authentifié.

## Composants

```
/components/admin/
  sidebar.tsx           -- navigation sidebar avec items actifs
  topbar.tsx            -- barre supérieure avec search + notifications
  kpi-card.tsx          -- carte KPI réutilisable
  arrivals-chart.tsx    -- graphique SVG barres arrivées
  breakdown-bars.tsx    -- barres répartition CA
  orders-table.tsx      -- table commandes réutilisable (dashboard + page commandes)
  order-detail.tsx      -- modal/panneau détail commande
  status-badge.tsx      -- badge statut coloré (confirmée/en attente/annulée)
  tariff-category.tsx   -- bloc catégorie avec table tarifs inline
  tariff-row.tsx        -- ligne tarif éditable
  voyageur-table.tsx    -- table voyageurs
  chauffeur-table.tsx   -- table chauffeurs
  chauffeur-form.tsx    -- formulaire ajout/modification chauffeur
  report-chart.tsx      -- graphiques rapports
  toast.tsx             -- notification toast
  admin-search.tsx      -- search bar ⌘K
```

## Design

Même design system SIREXE que la Phase 1 (ink/gold/cream). Spécificités admin :
- Sidebar dark (bg-ink) avec nav items gradient gold quand actif
- Cards blanches avec `rounded-2xl border border-line`
- Tables avec headers `text-[10px] uppercase tracking-[0.18em] bg-cream/50`
- Status badges : ok/green (confirmée), gold (en attente), err/red (annulée)
- Inputs éditables : fond transparent, `focus:bg-cream` avec ring gold
- Toast : position fixée en bas, bg-ink, animation slide-up
- Figures/KPIs : `figure text-[40px]`

## Ce qui est hors scope

- Paiements Stripe et GeniusPay (Phase 2 reportée)
- Emails de notification (Phase 2)
- Notifications en temps réel / WebSocket
- Multi-tenant (un seul salon SIREXE 2026)
- Tests automatisés
- Déploiement
