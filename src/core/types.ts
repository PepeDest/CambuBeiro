export type Unita = 'g' | 'ml' | 'pz';
export type Categoria = 'fresco' | 'secco' | 'scatolame';
export type Allergene =
  | 'glutine' | 'lattosio' | 'uova' | 'frutta_a_guscio'
  | 'pesce' | 'soia' | 'arachidi' | 'sedano' | 'senape' | 'crostacei';
export type Pasto = 'colazione' | 'pranzo' | 'cena' | 'merenda';

export interface Confezione { quantita: number; unita: Unita; etichetta: string; }

export interface Ingrediente {
  id: string;
  nome: string;
  unita: Unita;
  categoria: Categoria;
  durataGiorni: number;      // shelf life from purchase
  confezione: Confezione;
  allergeni: Allergene[];
  vegetariano: boolean;
}

export interface RigaRicetta { ingredienteId: string; dosePersona: number; unita: Unita; }

export interface Ricetta {
  id: string;
  nome: string;
  categoria: string;         // 'primo' | 'secondo' | 'contorno' | 'colazione' | 'merenda' | 'piatto_unico' | ...
  pasti: Pasto[];
  ingredienti: RigaRicetta[];
  origine: 'base' | 'utente';
  varianteDi?: string;       // id of the "parent" recipe, if this is a variant
}

export interface Presenze {
  adulti: number;
  bambini: number;
  vegetariani: number;                  // count, independent of adulti/bambini split
  allergici: Record<string, number>;    // allergen tag -> count, e.g. { glutine: 2 }
}

export interface Campo {
  nome: string;
  numeroGiorni: number;
  pastiAttivi: Record<Pasto, boolean>;
  riduzioneBambini: number;             // 0..1, default 0.30
  giorniSpesa: number[];                // 1-based day numbers, sorted ascending
  giornoTipo: Presenze;
}

export type Aggiustamento =
  | { tipo: 'variante'; ricettaVarianteId: string; numeroPersone: number }
  | { tipo: 'sostituzione'; ingredienteDaId: string; ingredienteAId: string; numeroPersone: number }
  | { tipo: 'rimozione'; ingredienteId: string; numeroPersone: number };

export interface Assegnazione { ricettaId: string; aggiustamenti: Aggiustamento[]; }

// Menu: day (1-based) -> meal -> list of assegnazioni
export type Menu = Record<number, Partial<Record<Pasto, Assegnazione[]>>>;

export interface Progetto {
  versioneFormato: number;
  campo: Campo;
  giorni: Record<number, Presenze>;     // per-day overrides; missing day => campo.giornoTipo
  menu: Menu;
  ricetteUtente: Ricetta[];
  ingredientiUtente: Ingrediente[];
}

// Shared calculation result shapes
export interface RigaFabbisogno { ingredienteId: string; quantita: number; unita: Unita; }

// Costanti condivise da motore, lib e schermate (un solo posto da modificare).
/** I pasti della giornata, nell'ordine in cui si calcolano e si mostrano. */
export const PASTI: Pasto[] = ['colazione', 'pranzo', 'cena', 'merenda'];
export const ETICHETTE_PASTO: Record<Pasto, string> = {
  colazione: 'Colazione', pranzo: 'Pranzo', cena: 'Cena', merenda: 'Merenda',
};
export const ALLERGENI: Allergene[] = [
  'glutine', 'lattosio', 'uova', 'pesce', 'frutta_a_guscio', 'soia', 'arachidi', 'sedano', 'senape', 'crostacei',
];
