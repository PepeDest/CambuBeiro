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

/** Il modulo compilato con una ricetta esistente, per modificarla o personalizzarla. */
export function formDaRicetta(r: Ricetta): FormRicetta {
  return {
    nome: r.nome,
    categoria: r.categoria,
    pasti: Object.fromEntries(PASTI.map((p) => [p, r.pasti.includes(p)])) as Record<Pasto, boolean>,
    righe: r.ingredienti.map((x) => ({ ingredienteId: x.ingredienteId, dosePersona: x.dosePersona })),
  };
}

/** Il modulo compilato con un ingrediente esistente, per modificarlo. */
export function formDaIngrediente(i: Ingrediente): FormIngrediente {
  return {
    nome: i.nome,
    unita: i.unita,
    categoria: i.categoria,
    durataGiorni: i.durataGiorni,
    confQuantita: i.confezione.quantita,
    confEtichetta: i.confezione.etichetta,
    allergeni: Object.fromEntries(ALLERGENI.map((a) => [a, i.allergeni.includes(a)])) as Record<Allergene, boolean>,
    vegetariano: i.vegetariano,
  };
}

/**
 * Ricetta dell'utente dal modulo, o l'errore da mostrare. `unitaDi` dà l'unità di un ingrediente.
 * Con `originale` la ricetta tiene il suo id: modifica una ricetta tua, oppure personalizza
 * una del ricettario (la tua versione prende il suo posto).
 */
export function creaRicetta(
  f: FormRicetta, unitaDi: (ingredienteId: string) => Unita, idsEsistenti: string[], originale?: Ricetta,
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
  return {
    id: originale?.id ?? slugId(nome, idsEsistenti), nome, categoria: f.categoria, pasti, ingredienti, origine: 'utente',
    ...(originale?.varianteDi ? { varianteDi: originale.varianteDi } : {}),
  };
}

/**
 * Ingrediente dell'utente dal modulo, o l'errore da mostrare. Con `originale` si modifica
 * quell'ingrediente (stesso id); se è già usato (`inUso`) l'unità non può cambiare, perché
 * le ricette ne indicano la dose in quell'unità.
 */
export function creaIngrediente(
  f: FormIngrediente, idsEsistenti: string[], originale?: Ingrediente, inUso = false,
): Ingrediente | { errore: string } {
  const nome = f.nome.trim();
  if (!nome) return { errore: "Serve un nome per l'ingrediente." };
  if (originale && inUso && f.unita !== originale.unita) {
    return { errore: `Questo ingrediente è già usato: non puoi cambiarne l’unità (${originale.unita}).` };
  }
  return {
    id: originale?.id ?? slugId(nome, idsEsistenti),
    nome,
    unita: f.unita,
    categoria: f.categoria,
    durataGiorni: Math.max(1, Math.round(f.durataGiorni || 1)),
    confezione: { quantita: Math.max(1, f.confQuantita), unita: f.unita, etichetta: f.confEtichetta.trim() || 'confezione' },
    allergeni: ALLERGENI.filter((a) => f.allergeni[a]),
    vegetariano: f.vegetariano,
  };
}
