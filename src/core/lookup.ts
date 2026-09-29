import type { Progetto, Ingrediente, Ricetta, Presenze, Campo } from './types';

function indicizza<T extends { id: string }>(base: T[], utente: T[]): Map<string, T> {
  const m = new Map<string, T>();
  for (const x of base) m.set(x.id, x);
  for (const x of utente) m.set(x.id, x); // user overrides base
  return m;
}

export function indicizzaIngredienti(progetto: Progetto, base: Ingrediente[]): Map<string, Ingrediente> {
  return indicizza(base, progetto.ingredientiUtente);
}

export function indicizzaRicette(progetto: Progetto, base: Ricetta[]): Map<string, Ricetta> {
  return indicizza(base, progetto.ricetteUtente);
}

export function presenzeGiorno(progetto: Progetto, giorno: number): Presenze {
  return progetto.giorni[giorno] ?? progetto.campo.giornoTipo;
}

/** I giorni del campo: 1..numeroGiorni. */
export function giorniCampo(campo: Campo): number[] {
  return Array.from({ length: campo.numeroGiorni }, (_, i) => i + 1);
}
