# Phase 1 — Fondations + Formulaire Client

## Contexte

SIREXE Concierge est un SaaS de conciergerie pour voyageurs professionnels internationaux arrivant a Abidjan pour le salon SIREXE 2026 (mines, petrole, energie). Un prototype HTML complet existe deja dans le repertoire (`Sirexe Concierge.html` + `Sirexe Admin.html`). Cette phase porte le prototype en Next.js fonctionnel.

Le projet est decoupe en 3 phases :
- **Phase 1** (ce spec) : Setup projet, DB, i18n, formulaire client, pages editoriales
- Phase 2 : Paiements (Stripe + GeniusPay) + Emails (Resend + React Email)
- Phase 3 : Panel admin (NextAuth + dashboard + tarifs + commandes)

## Stack technique

- Next.js 14, App Router, TypeScript
- Tailwind CSS + shadcn/ui (customise palette SIREXE)
- Prisma + PostgreSQL local (Supabase prevu plus tard)
- next-intl pour i18n (FR, EN, AR avec RTL)

## Architecture

```
/app
  /[locale]/
    layout.tsx          -- fonts, RTL, i18n provider
    page.tsx            -- landing (ecran 1 du prototype)
    /reservation/
      page.tsx          -- wizard 3 etapes (ecrans 2-4)
    /services/
      page.tsx          -- catalogue editorial
    /salon/
      page.tsx          -- page evenement SIREXE 2026
    /assistance/
      page.tsx          -- support, FAQ, contacts
  /api/
    /services/route.ts  -- GET: liste services + tarifs actifs
    /commandes/route.ts -- POST: creer une commande
  layout.tsx            -- root layout, metadata, viewport
/components
  /layout/              -- Header, LangSwitcher, PrototypeNav
  /landing/             -- HeroCard, ArrivalsPanel, TrustStrip, ProgressSteps
  /form/                -- StepIdentity, StepServices, StepRecap, WizardShell
  /services/            -- TransportCard, HotelCard, MealToggle, ExtraPill, StickyCart
  /editorial/           -- ServiceBlock, PillarCard, ProgrammeGrid, FaqAccordion, ChannelCard
  /ui/                  -- shadcn/ui customises (Button, Input, Select, etc.)
/lib
  prisma.ts             -- singleton Prisma client
  i18n.ts               -- next-intl config (request locale)
  utils.ts              -- fmt() currency, RATE constants, cn() classnames
/prisma
  schema.prisma
  seed.ts               -- 22 services + tarifs du prototype
/messages
  fr.json
  en.json
  ar.json
/public
  /assets/              -- logo, images du prototype
tailwind.config.ts      -- palette etendue SIREXE
```

## Design system

Reproduction exacte du prototype HTML. Les tokens Tailwind etendus :

```
colors:
  ink:    #1A1A2E    -- primary, fond sombre
  ink2:   #252540    -- surface sureleve
  ink3:   #2D2D2D    -- texte corps
  gold:   #C9A84C    -- accent dore
  gold2:  #B89537    -- hover dore
  cream:  #F8F7F4    -- fond principal
  cream2: #EFEDE5    -- cards, zones secondaires
  line:   #E5E2D8    -- separateurs
  mute:   #6B6B72    -- texte secondaire
  ok:     #2E7D52    -- succes, energy pillar
  err:    #C0392B    -- erreur
  mining: #E87722    -- brand orange
  oil:    #0F0F1C    -- brand sombre
  energy: #2E7D52    -- brand vert

fonts:
  serif: Playfair Display (titres, h1-h4)
  sans:  Inter (corps, UI)

shadows:
  card:  none
  float: 0 12px 36px -22px rgba(26,26,46,.22)
```

Composants CSS du prototype portes en classes Tailwind ou composants React :
- `.figure` : Inter 500, tabular-nums, letter-spacing -0.02em
- `.hr` : hauteur 1px, fond rgba(26,26,46,.07)
- `.dot` / `.dot-lg` : pastilles rondes 6px / 8px
- `.switch` : toggle on/off 42x24px
- `.qty` : stepper quantite pill avec boutons -/+
- `.tag-pill` : extra selectionnable avec bordure arrondie
- `.pill-step` / `.pill-line` : stepper de progression
- `.cal-day` : cellule calendrier avec etats (start, end, in-range, muted)
- `.visa-radio` : radio card avec :has(input:checked) styling
- `.card-hover` : transition border-color 200ms
- `.btn-press` : translateY(1px) on active
- Animation `fadeUp` pour transitions entre ecrans
- Animation `draw` pour le check SVG de confirmation

## Schema Prisma

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Categorie {
  TRANSPORT
  HEBERGEMENT
  REPAS
  EXTRA
}

enum Unite {
  PAX
  NUIT
  TRAJET
  UNITE
}

enum Devise {
  XOF
  EUR
  USD
}

enum StatutCommande {
  EN_ATTENTE
  PAYEE
  CONFIRMEE
  ANNULEE
}

enum MethodePaiement {
  STRIPE
  GENIUSPAY
}

enum StatutPaiement {
  EN_ATTENTE
  REUSSI
  ECHOUE
}

model Service {
  id          String      @id @default(cuid())
  nom         String
  description String?
  categorie   Categorie
  prixBase    Decimal
  unite       Unite
  actif       Boolean     @default(true)
  ordre       Int         @default(0)
  tarifs      Tarif[]
  lignes      LigneCommande[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Tarif {
  id        String   @id @default(cuid())
  serviceId String
  service   Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  label     String
  prix      Decimal
  devise    Devise   @default(XOF)
  actif     Boolean  @default(true)
  lignes    LigneCommande[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Commande {
  id            String          @id @default(cuid())
  reference     String          @unique
  statut        StatutCommande  @default(EN_ATTENTE)
  langue        String          @default("fr")

  // Voyageur (embedded as fields, not separate table)
  prenom        String
  nom           String
  email         String
  telephone     String
  nationalite   String
  dateArrivee   DateTime
  dateDepart    DateTime
  nombrePersonnes Int

  // Vol & visa
  compagnie     String?
  numeroVol     String?
  heureArrivee  String?
  aeroport      String?         @default("FHB")
  passeport     String?
  typeVisa      String?
  statutVisa    String?         @default("ok")
  notes         String?

  // Totaux
  montantTotal  Decimal
  devise        Devise          @default(XOF)

  // Paiement
  methodePaiement  MethodePaiement?
  referencePaiement String?
  statutPaiement   StatutPaiement?

  lignes        LigneCommande[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
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
  prixUnitaire Decimal
  sousTotal    Decimal
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  nom          String
  role         String   @default("admin")
  createdAt    DateTime @default(now())
}
```

## Seed data

Les 22 services du prototype avec leurs tarifs en XOF :

**Transport (5):** Accueil VIP FHB (75000), Berline chauffeur 4h (120000), Van 7 places 8h (180000), Escorte securitaire (95000), Helicoptere offshore (850000)

**Hebergement (4):** Pullman Plateau 5* (185000/nuit), Sofitel Hotel Ivoire 5* (245000/nuit), Movenpick Abidjan 5* (175000/nuit), Noom Hotel 4* (135000/nuit)

**Repas (5):** Petit-dejeuner buffet (18000/pax), Dejeuner affaires (32000/pax), Diner gastronomique (55000/pax), Menu halal (0/inclus), Boxed lunch SIREXE (14000/pax)

**Extras (8):** SIM 4G 20Go (15000), Blanchisserie (22000), Bouquet accueil (18000), Interprete FR-AR 4h (90000), Photographe (120000), Excursion Grand-Bassam (65000), Soiree gala (80000), Visa Express 48h (45000)

## API Routes

### GET /api/services

Retourne tous les services actifs groupes par categorie, avec leurs tarifs actifs. Format :

```json
{
  "transport": [{ "id": "...", "nom": "...", "prixBase": 75000, "unite": "TRAJET", "tarifs": [...] }],
  "hebergement": [...],
  "repas": [...],
  "extra": [...]
}
```

### POST /api/commandes

Recoit le formulaire complet (voyageur + lignes de commande), valide avec Zod, cree la commande en DB, retourne la reference. Le paiement est gere en Phase 2 — pour l'instant la commande est creee avec statut EN_ATTENTE.

Body attendu :
```json
{
  "voyageur": { "prenom": "...", "nom": "...", "email": "...", ... },
  "lignes": [{ "serviceId": "...", "tarifId": "...", "quantite": 2 }],
  "devise": "XOF",
  "langue": "fr"
}
```

Validation Zod : email valide, dates coherentes (depart > arrivee), au moins 1 ligne, quantites > 0.

## i18n

Les 200+ cles de traduction du prototype (objet `DICT` dans le HTML) sont portees dans `messages/fr.json`, `en.json`, `ar.json`. Structure plate avec prefixes (ex: `nav.services`, `s2.f.first`, `svc.t1.name`).

RTL : le layout `[locale]/layout.tsx` applique `dir="rtl"` sur `<html>` quand locale === "ar". Les classes `flip-rtl` du prototype deviennent des conditionnels Tailwind (`rtl:scale-x-[-1]`).

Detection de langue : middleware next-intl qui redirige vers la locale du navigateur au premier acces.

## Pages

### Landing (page.tsx)
Reproduction exacte de l'ecran 1 : hero avec illustration SVG Abidjan (croissant dore, skyline, avion), panel arrivees prochaines, progress stepper, CTAs, trust strip.

### Reservation (reservation/page.tsx)
Wizard 3 etapes en composant client :
- Etape 1 : formulaire voyageur (identite, vol, visa, notes) avec mini-calendrier
- Etape 2 : selection services par onglets (Transport/Hebergement/Repas/Extras) avec panier sticky
- Etape 3 : recapitulatif avec switcher devise + boutons paiement (desactives en Phase 1, placeholder "Paiement disponible prochainement")

Etat gere par `useState` dans le composant wizard parent. Pas de state management externe.

### Services (services/page.tsx)
Page catalogue editorial : 4 sections alternees image/texte (Transport, Hebergement, Table, Experiences) avec prix tabulaires.

### Le salon (salon/page.tsx)
Banniere sombre SIREXE 2026 + chiffres cles, 3 piliers (mines/petrole/energie), programme previsionnel 4 jours, patronage ministeriel.

### Assistance (assistance/page.tsx)
Hero "24h/24", 3 cartes canaux (WhatsApp/Telephone/Email), bande urgence, FAQ en accordeon, infos bureau.

## Ce qui est hors scope Phase 1

- Paiement Stripe et GeniusPay (Phase 2)
- Envoi d'emails de confirmation (Phase 2)
- Page de confirmation post-paiement (Phase 2)
- Panel admin, auth, dashboard, editeur tarifs (Phase 3)
- Tests automatises (ajout apres Phase 3)
- Deploiement Vercel + Supabase (apres Phase 3)
