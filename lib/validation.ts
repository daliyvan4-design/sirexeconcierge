import { z } from "zod";

export const ligneSchema = z.object({
  serviceId: z.string().min(1),
  tarifId: z.string().nullable().optional(),
  quantite: z.number().int().min(1),
});

export const commandeSchema = z.object({
  voyageur: z.object({
    prenom: z.string().min(1),
    nom: z.string().min(1),
    email: z.string().email(),
    telephone: z.string().min(5),
    nationalite: z.string().min(1),
    dateArrivee: z.string().refine((d) => !isNaN(Date.parse(d))),
    dateDepart: z.string().refine((d) => !isNaN(Date.parse(d))),
    nombrePersonnes: z.number().int().min(1).max(20),
    compagnie: z.string().optional(),
    numeroVol: z.string().optional(),
    heureArrivee: z.string().optional(),
    aeroport: z.string().optional(),
    passeport: z.string().optional(),
    typeVisa: z.string().optional(),
    statutVisa: z.string().optional(),
    notes: z.string().optional(),
  }),
  lignes: z.array(ligneSchema).min(1),
  devise: z.enum(["XOF", "EUR", "USD"]).default("XOF"),
  langue: z.enum(["fr", "en", "ar"]).default("fr"),
});

export type CommandeInput = z.infer<typeof commandeSchema>;
