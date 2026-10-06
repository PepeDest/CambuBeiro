import type { Ricetta, Ingrediente, RigaRicetta, Pasto, Unita, Categoria, Allergene } from '../core';
import { PASTI, ALLERGENI } from '../core';
import { slugId } from './ids';

// Moduli della schermata Ricette e costruzione delle voci dell'utente.

export interface FormRicetta {
  nome: string;
  categoria: string;
  pasti: Record<Pasto, boolean>;
  righe: { ingredienteId: string; dosePersona: number | null }[];
}

export interface FormIngrediente {
  nome: string;
  unita: Unita;
  categoria: Categoria;
  durataGiorni: number;
  confQuantita: number;
  confEtichetta: string;
  allergeni: Record<Allergene, boolean>;
  vegetariano: boolean;
}

/** Riga nuova senza dose: va scritta a mano (una dose predefinita andrebbe bene per la pasta, non per le uova). */
export const rigaVuota = (): FormRicetta['righe'][number] => ({ ingredienteId: '', dosePersona: null });

export function formRicettaVuota(): FormRicetta {
  return {
    nome: '',
    categoria: 'primo',
    pasti: { colazione: false, pranzo: true, cena: true, merenda: false },
    righe: [rigaVuota()],
  };
}

export function formIngredienteVuoto(): FormIngrediente {
  return {
    nome: '',
    unita: 'g',
    categoria: 'secco',
    durataGiorni: 30,
    confQuantita: 1000,
    confEtichetta: 'confezione',
    allergeni: Object.fromEntries(ALLERGENI.map((a) => [a, false])) as Record<Allergene, boolean>,
    vegetariano: true,
  };
}

/** Ricetta dell'utente dal modulo, o l'errore da mostrare. `unitaDi` dà l'unità di un ingrediente. */
export function creaRicetta(
  f: FormRicetta, unitaDi: (ingredienteId: string) => Unita, idsEsistenti: string[],
): Ricetta | { errore: string } {
  const nome = f.nome.trim();
  const pasti = PASTI.filter((p) => f.pasti[p]);
  const scelte = f.righe.filter((r) => r.ingredienteId);
  if (scelte.some((r) => !(r.dosePersona !== null && r.dosePersona > 0))) {
    return { errore: 'Scrivi la dose a persona di ogni ingrediente scelto.' };
  }
  const ingredienti: RigaRicetta[] = scelte
    .map((r) => ({ ingredienteId: r.ingredienteId, dosePersona: r.dosePersona!, unita: unitaDi(r.ingredienteId) }));
  if (!nome || pasti.length === 0 || ingredienti.length === 0) {
    return { errore: 'Servono: un nome, almeno un pasto e almeno un ingrediente.' };
  }
  return { id: slugId(nome, idsEsistenti), nome, categoria: f.categoria, pasti, ingredienti, origine: 'utente' };
}

/** Ingrediente dell'utente dal modulo, o l'errore da mostrare. */
export function creaIngrediente(f: FormIngrediente, idsEsistenti: string[]): Ingrediente | { errore: string } {
  const nome = f.nome.trim();
  if (!nome) return { errore: "Serve un nome per l'ingrediente." };
  return {
    id: slugId(nome, idsEsistenti),
    nome,
    unita: f.unita,
    categoria: f.categoria,
    durataGiorni: Math.max(1, Math.round(f.durataGiorni || 1)),
    confezione: { quantita: Math.max(1, f.confQuantita), unita: f.unita, etichetta: f.confEtichetta.trim() || 'confezione' },
    allergeni: ALLERGENI.filter((a) => f.allergeni[a]),
    vegetariano: f.vegetariano,
  };
}
