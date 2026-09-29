import type { Progetto, Ricetta, Ingrediente, Pasto } from '../core';
import { indicizzaRicette, indicizzaIngredienti } from '../core';
import { databaseBase } from '../data';

const collatore = new Intl.Collator('it');
/** Ordina per nome in ordine alfabetico italiano. */
export const perNome = (a: { nome: string }, b: { nome: string }): number => collatore.compare(a.nome, b.nome);

// Cache per identità degli array dell'utente: le azioni creano un array nuovo solo quando
// ricette/ingredienti dell'utente cambiano, quindi finché restano uguali indici ed elenchi si riusano.
// I valori restituiti sono condivisi: non modificarli.
function memo<V>(cache: WeakMap<object, V>, chiave: object, calcola: () => V): V {
  let v = cache.get(chiave);
  if (v === undefined) { v = calcola(); cache.set(chiave, v); }
  return v;
}
const cacheIndiceRicette = new WeakMap<object, Map<string, Ricetta>>();
const cacheIndiceIngredienti = new WeakMap<object, Map<string, Ingrediente>>();
const cacheElencoRicette = new WeakMap<object, Ricetta[]>();
const cacheElencoIngredienti = new WeakMap<object, Ingrediente[]>();

/** Ricette base + dell'utente (quelle dell'utente sostituiscono le base con lo stesso id). */
export function indiceRicette(p: Progetto): Map<string, Ricetta> {
  return memo(cacheIndiceRicette, p.ricetteUtente, () => indicizzaRicette(p, databaseBase.ricette));
}

export function indiceIngredienti(p: Progetto): Map<string, Ingrediente> {
  return memo(cacheIndiceIngredienti, p.ingredientiUtente, () => indicizzaIngredienti(p, databaseBase.ingredienti));
}

export function ricetteDisponibili(p: Progetto): Ricetta[] {
  return memo(cacheElencoRicette, p.ricetteUtente, () => [...indiceRicette(p).values()].sort(perNome));
}

export function ingredientiDisponibili(p: Progetto): Ingrediente[] {
  return memo(cacheElencoIngredienti, p.ingredientiUtente, () => [...indiceIngredienti(p).values()].sort(perNome));
}

export function nomeRicetta(p: Progetto, id: string): string {
  return indiceRicette(p).get(id)?.nome ?? id;
}

export function nomeIngrediente(p: Progetto, id: string): string {
  return indiceIngredienti(p).get(id)?.nome ?? id;
}

export function cercaRicette(p: Progetto, testo: string, pasto?: Pasto): Ricetta[] {
  const q = testo.trim().toLowerCase();
  return ricetteDisponibili(p).filter(
    (r) => (pasto === undefined || r.pasti.includes(pasto)) && (q === '' || r.nome.toLowerCase().includes(q)),
  );
}
