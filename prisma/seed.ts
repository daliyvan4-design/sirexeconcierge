import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.ligneCommande.deleteMany();
  await prisma.tarif.deleteMany();
  await prisma.service.deleteMany();
  await prisma.commande.deleteMany();

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
    {
      nom: "SIM 4G + data 20 Go",
      nomEn: "4G SIM + 20 GB data",
      nomAr: "شريحة 4G + بيانات 20 جيجا",
      description: "Carte SIM prépayée Orange CI, 20 Go data + appels locaux",
      descEn: "Prepaid Orange CI SIM card, 20 GB data + local calls",
      descAr: "بطاقة SIM مسبقة الدفع أورانج CI، 20 جيجا بيانات + مكالمات محلية",
      prixBase: 15000,
      unite: "pièce",
      icon: "smartphone",
    },
    {
      nom: "Service blanchisserie",
      nomEn: "Laundry service",
      nomAr: "خدمة الغسيل",
      description: "Pressing express livré à l'hôtel sous 24h",
      descEn: "Express dry cleaning delivered to hotel within 24h",
      descAr: "تنظيف جاف سريع يُسلَّم إلى الفندق خلال 24 ساعة",
      prixBase: 22000,
      unite: "lot",
      icon: "shirt",
    },
    {
      nom: "Bouquet d'accueil",
      nomEn: "Welcome bouquet",
      nomAr: "باقة ترحيب",
      description: "Bouquet de fleurs tropicales + carte de bienvenue personnalisée",
      descEn: "Tropical flower bouquet + personalized welcome card",
      descAr: "باقة زهور استوائية + بطاقة ترحيب مخصصة",
      prixBase: 18000,
      unite: "pièce",
      icon: "flower",
    },
    {
      nom: "Interprète FR↔AR · 4h",
      nomEn: "FR↔AR interpreter · 4h",
      nomAr: "مترجم فر↔عر · 4 ساعات",
      description: "Interprète certifié français-arabe, 4 heures minimum",
      descEn: "Certified French-Arabic interpreter, 4-hour minimum",
      descAr: "مترجم فرنسي-عربي معتمد، 4 ساعات كحد أدنى",
      prixBase: 90000,
      unite: "séance",
      icon: "languages",
    },
    {
      nom: "Photographe événementiel",
      nomEn: "Event photographer",
      nomAr: "مصور فعاليات",
      description: "Photographe professionnel, 200 photos HD livrées sous 48h",
      descEn: "Professional photographer, 200 HD photos delivered within 48h",
      descAr: "مصور محترف، 200 صورة عالية الدقة تُسلَّم خلال 48 ساعة",
      prixBase: 120000,
      unite: "séance",
      icon: "camera",
    },
    {
      nom: "Excursion Grand-Bassam",
      nomEn: "Grand-Bassam excursion",
      nomAr: "رحلة غران باسام",
      description: "Visite guidée de la ville historique UNESCO, transport inclus",
      descEn: "Guided tour of the UNESCO historic city, transport included",
      descAr: "جولة مع مرشد في المدينة التاريخية المدرجة في اليونسكو، النقل مشمول",
      prixBase: 65000,
      unite: "personne",
      icon: "palmtree",
    },
    {
      nom: "Soirée gala SIREXE",
      nomEn: "SIREXE gala evening",
      nomAr: "أمسية غالا SIREXE",
      description: "Invitation soirée de gala officielle SIREXE, tenue de soirée",
      descEn: "Official SIREXE gala evening invitation, formal attire",
      descAr: "دعوة لأمسية غالا SIREXE الرسمية، لباس رسمي",
      prixBase: 80000,
      unite: "personne",
      icon: "ticket",
    },
    {
      nom: "Visa Express · 48h",
      nomEn: "Express Visa · 48h",
      nomAr: "تأشيرة سريعة · 48 ساعة",
      description: "Assistance visa accéléré, traitement en 48h garanti",
      descEn: "Expedited visa assistance, guaranteed 48h processing",
      descAr: "مساعدة تأشيرة سريعة، معالجة مضمونة خلال 48 ساعة",
      prixBase: 45000,
      unite: "personne",
      icon: "shield-check",
    },
  ];

  for (let i = 0; i < extras.length; i++) {
    const e = extras[i];
    await prisma.service.create({
      data: {
        nom: e.nom,
        nomEn: e.nomEn,
        nomAr: e.nomAr,
        description: e.description,
        descEn: e.descEn,
        descAr: e.descAr,
        categorie: "extras",
        prixBase: e.prixBase,
        unite: e.unite,
        icon: e.icon,
        ordre: i + 1,
        tarifs: { create: { label: e.nom, prix: e.prixBase } },
      },
    });
  }

  // ── Admin user ──
  await prisma.adminUser.deleteMany();
  const hash = await bcrypt.hash("sirexe2026", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@sirexe.com",
      passwordHash: hash,
      nom: "Aïssa Koné",
      role: "admin",
    },
  });

  // ── Demo commandes (8 orders from prototype) ──
  await prisma.commande.deleteMany();
  const allServices = await prisma.service.findMany({ include: { tarifs: true } });
  const svcByName = (name: string) => allServices.find((s) => s.nom.includes(name));

  const demoOrders = [
    { ref: "SIREXE-26-A8F2", prenom: "Amadou", nom: "Diallo", email: "amadou.diallo@sonangaz.com", telephone: "+221771234567", nationalite: "🇸🇳 Sénégalaise", dateArrivee: "2026-03-12T23:40:00Z", dateDepart: "2026-03-16T08:00:00Z", nombrePersonnes: 2, compagnie: "Air France", numeroVol: "AF 528", montantTotal: 1245000, statut: "CONFIRMEE" },
    { ref: "SIREXE-26-B102", prenom: "Sarah", nom: "Mensah", email: "sarah.mensah@ghanamining.gh", telephone: "+233201234567", nationalite: "🇬🇭 Ghanéenne", dateArrivee: "2026-03-13T08:15:00Z", dateDepart: "2026-03-17T10:00:00Z", nombrePersonnes: 1, compagnie: "ASKY", numeroVol: "KP 022", montantTotal: 880000, statut: "EN_ATTENTE" },
    { ref: "SIREXE-26-C937", prenom: "Khalid", nom: "Al-Faisal", email: "k.alfaisal@adnoc.ae", telephone: "+971501234567", nationalite: "🇦🇪 Émiratie", dateArrivee: "2026-03-13T14:30:00Z", dateDepart: "2026-03-18T16:00:00Z", nombrePersonnes: 3, compagnie: "Emirates", numeroVol: "EK 787", montantTotal: 2480000, statut: "CONFIRMEE" },
    { ref: "SIREXE-26-D451", prenom: "Jean", nom: "Dupont", email: "j.dupont@totalenergies.fr", telephone: "+33612345678", nationalite: "🇫🇷 Française", dateArrivee: "2026-03-14T06:55:00Z", dateDepart: "2026-03-16T18:00:00Z", nombrePersonnes: 1, compagnie: "Air France", numeroVol: "AF 530", montantTotal: 425000, statut: "CONFIRMEE" },
    { ref: "SIREXE-26-E284", prenom: "Fatima", nom: "Bensalah", email: "f.bensalah@ocp.ma", telephone: "+212661234567", nationalite: "🇲🇦 Marocaine", dateArrivee: "2026-03-14T11:20:00Z", dateDepart: "2026-03-17T09:00:00Z", nombrePersonnes: 2, compagnie: "Royal Air Maroc", numeroVol: "AT 552", montantTotal: 1080000, statut: "EN_ATTENTE" },
    { ref: "SIREXE-26-F673", prenom: "Tunde", nom: "Olatunji", email: "t.olatunji@nnpc.ng", telephone: "+2348012345678", nationalite: "🇳🇬 Nigériane", dateArrivee: "2026-03-14T19:45:00Z", dateDepart: "2026-03-18T12:00:00Z", nombrePersonnes: 2, compagnie: "Arik Air", numeroVol: "W3 101", montantTotal: 1620000, statut: "CONFIRMEE" },
    { ref: "SIREXE-26-G129", prenom: "Mary", nom: "Johnson", email: "m.johnson@bp.co.uk", telephone: "+447911234567", nationalite: "🇬🇧 Britannique", dateArrivee: "2026-03-15T09:10:00Z", dateDepart: "2026-03-17T14:00:00Z", nombrePersonnes: 1, compagnie: "British Airways", numeroVol: "BA 079", montantTotal: 760000, statut: "ANNULEE" },
    { ref: "SIREXE-26-H805", prenom: "Omar", nom: "Sissoko", email: "o.sissoko@somilo.ml", telephone: "+22376123456", nationalite: "🇲🇱 Malienne", dateArrivee: "2026-03-15T15:35:00Z", dateDepart: "2026-03-19T08:00:00Z", nombrePersonnes: 4, compagnie: "ASKY", numeroVol: "KP 045", montantTotal: 1985000, statut: "CONFIRMEE" },
  ];

  for (const o of demoOrders) {
    await prisma.commande.create({
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
  }

  // ── Demo chauffeurs ──
  await prisma.chauffeur.deleteMany();
  const chauffeurs = [
    { nom: "Konan Yao", telephone: "+225 07 01 02 03", vehicule: "Mercedes E-Class", immatriculation: "AB 1234 CI", statut: "disponible" },
    { nom: "Ouattara Ibrahim", telephone: "+225 05 04 05 06", vehicule: "Toyota Land Cruiser", immatriculation: "CD 5678 CI", statut: "en_course" },
    { nom: "Bamba Moussa", telephone: "+225 01 07 08 09", vehicule: "Mercedes V-Class", immatriculation: "EF 9012 CI", statut: "disponible" },
    { nom: "Traoré Seydou", telephone: "+225 07 10 11 12", vehicule: "BMW Série 5", immatriculation: "GH 3456 CI", statut: "indisponible" },
  ];
  for (const c of chauffeurs) {
    await prisma.chauffeur.create({ data: c });
  }

  console.log("Seeded 22 services with tarifs, 1 admin, 8 demo orders, 4 chauffeurs.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
