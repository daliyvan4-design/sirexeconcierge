export interface ServiceItem {
  id: string;
  nom: string;
  nomEn: string;
  nomAr: string;
  description: string | null;
  descEn: string | null;
  descAr: string | null;
  categorie: string;
  prixBase: number;
  unite: string;
  icon: string | null;
  etoiles: number | null;
  quartier: string | null;
  badge: string | null;
  tarifs: { id: string; label: string; prix: number; devise: string }[];
}

export interface ServiceGroups {
  transport: ServiceItem[];
  hebergement: ServiceItem[];
  repas: ServiceItem[];
  extra: ServiceItem[];
}
