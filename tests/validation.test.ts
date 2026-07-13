import { describe, it, expect } from "vitest";
import { commandeSchema, ligneSchema } from "@/lib/validation";

const validVoyageur = {
  prenom: "Amadou",
  nom: "Diallo",
  email: "amadou@test.com",
  telephone: "+2250701020304",
  nationalite: "Sénégalaise",
  dateArrivee: "2026-03-12T10:00:00Z",
  dateDepart: "2026-03-16T08:00:00Z",
  nombrePersonnes: 2,
};

const validLigne = {
  serviceId: "clxyz123",
  quantite: 1,
};

describe("ligneSchema", () => {
  it("accepts a valid line", () => {
    const result = ligneSchema.safeParse(validLigne);
    expect(result.success).toBe(true);
  });

  it("rejects empty serviceId", () => {
    const result = ligneSchema.safeParse({ serviceId: "", quantite: 1 });
    expect(result.success).toBe(false);
  });

  it("rejects zero quantity", () => {
    const result = ligneSchema.safeParse({ serviceId: "abc", quantite: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects negative quantity", () => {
    const result = ligneSchema.safeParse({ serviceId: "abc", quantite: -1 });
    expect(result.success).toBe(false);
  });

  it("accepts optional tarifId", () => {
    const result = ligneSchema.safeParse({ ...validLigne, tarifId: "tarif123" });
    expect(result.success).toBe(true);
  });

  it("accepts null tarifId", () => {
    const result = ligneSchema.safeParse({ ...validLigne, tarifId: null });
    expect(result.success).toBe(true);
  });
});

describe("commandeSchema", () => {
  const validCommande = {
    voyageur: validVoyageur,
    lignes: [validLigne],
  };

  it("accepts a valid commande", () => {
    const result = commandeSchema.safeParse(validCommande);
    expect(result.success).toBe(true);
  });

  it("defaults devise to XOF", () => {
    const result = commandeSchema.safeParse(validCommande);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.devise).toBe("XOF");
    }
  });

  it("defaults langue to fr", () => {
    const result = commandeSchema.safeParse(validCommande);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.langue).toBe("fr");
    }
  });

  it("accepts EUR and USD devises", () => {
    expect(commandeSchema.safeParse({ ...validCommande, devise: "EUR" }).success).toBe(true);
    expect(commandeSchema.safeParse({ ...validCommande, devise: "USD" }).success).toBe(true);
  });

  it("rejects invalid devise", () => {
    const result = commandeSchema.safeParse({ ...validCommande, devise: "GBP" });
    expect(result.success).toBe(false);
  });

  it("accepts all supported languages", () => {
    expect(commandeSchema.safeParse({ ...validCommande, langue: "fr" }).success).toBe(true);
    expect(commandeSchema.safeParse({ ...validCommande, langue: "en" }).success).toBe(true);
    expect(commandeSchema.safeParse({ ...validCommande, langue: "ar" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = commandeSchema.safeParse({
      ...validCommande,
      voyageur: { ...validVoyageur, email: "not-an-email" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing prenom", () => {
    const { prenom, ...rest } = validVoyageur;
    const result = commandeSchema.safeParse({
      ...validCommande,
      voyageur: rest,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty lignes array", () => {
    const result = commandeSchema.safeParse({
      ...validCommande,
      lignes: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects nombrePersonnes > 20", () => {
    const result = commandeSchema.safeParse({
      ...validCommande,
      voyageur: { ...validVoyageur, nombrePersonnes: 21 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects nombrePersonnes < 1", () => {
    const result = commandeSchema.safeParse({
      ...validCommande,
      voyageur: { ...validVoyageur, nombrePersonnes: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = commandeSchema.safeParse({
      ...validCommande,
      voyageur: { ...validVoyageur, dateArrivee: "not-a-date" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts INSTITUTIONNELLE reservation type", () => {
    const result = commandeSchema.safeParse({
      ...validCommande,
      typeReservation: "INSTITUTIONNELLE",
    });
    expect(result.success).toBe(true);
  });
});
