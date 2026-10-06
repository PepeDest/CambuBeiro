import type { Progetto, Pasto, Assegnazione, Aggiustamento, Ingrediente } from '../core';
import { rilevaConflitti, personeCoperte, presenzeGiorno } from '../core';
import { indiceRicette, indiceIngredienti, ingredientiDisponibili, nomeRicetta, nomeIngrediente } from './catalogo';

export interface ConflittoVista {
  giorno: number; pasto: Pasto; ricettaId: string; nomeRicetta: string;
  tipo: 'allergene' | 'vegetariano'; dettaglio: string; personeInteressate: number;
  /** Persone davvero protette dagli aggiustamenti del piatto. */
  coperte: number;
  /** true quando tutte le persone interessate sono protette. */
  gestito: boolean;
}

export function trovaAssegnazione(p: Progetto, giorno: number, pasto: Pasto, ricettaId: string): Assegnazione | undefined {
  return (p.menu[giorno]?.[pasto] ?? []).find((a) => a.ricettaId === ricettaId);
}

export function conflittiVista(p: Progetto): ConflittoVista[] {
  const ricette = indiceRicette(p);
  const ingredienti = indiceIngredienti(p);
  return rilevaConflitti(p, ricette, ingredienti).map((c) => {
    const a = trovaAssegnazione(p, c.giorno, c.pasto, c.ricettaId);
    const coperte = a ? personeCoperte(c, a, ricette, ingredienti) : 0;
    return { ...c, nomeRicetta: nomeRicetta(p, c.ricettaId), coperte, gestito: coperte >= c.personeInteressate };
  });
}

export interface StatoConflitti {
  elenco: ConflittoVista[];
  nonGestiti: ConflittoVista[];
  /** 'warn' = conflitto da gestire, 'ok' = conflitto gestito, '' = nessun conflitto. */
  statoPiatto(giorno: number, pasto: Pasto, ricettaId: string): '' | 'warn' | 'ok';
  /** true se la cella ha almeno un conflitto da gestire. */
  cellaAttiva(giorno: number, pasto: Pasto): boolean;
}

/** Calcola una volta sola lo stato dei conflitti del campo, per griglia, riepilogo ed export. */
export function statoConflitti(p: Progetto): StatoConflitti {
  const elenco = conflittiVista(p);
  const nonGestiti = elenco.filter((c) => !c.gestito);
  const chiavePiatto = (g: number, pasto: Pasto, id: string) => `${g}|${pasto}|${id}`;
  const conConflitto = new Set(elenco.map((c) => chiavePiatto(c.giorno, c.pasto, c.ricettaId)));
  const daGestire = new Set(nonGestiti.map((c) => chiavePiatto(c.giorno, c.pasto, c.ricettaId)));
  const celleAttive = new Set(nonGestiti.map((c) => `${c.giorno}|${c.pasto}`));
  return {
    elenco,
    nonGestiti,
    statoPiatto: (g, pasto, id) => {
      const k = chiavePiatto(g, pasto, id);
      return daGestire.has(k) ? 'warn' : conConflitto.has(k) ? 'ok' : '';
    },
    cellaAttiva: (g, pasto) => celleAttive.has(`${g}|${pasto}`),
  };
}

export function personeImpegnate(a: Assegnazione): number {
  return a.aggiustamenti.reduce((s, x) => s + x.numeroPersone, 0);
}

export function personePresenti(p: Progetto, giorno: number): number {
  const pr = presenzeGiorno(p, giorno);
  return pr.adulti + pr.bambini;
}

/** Persone ancora assegnabili agli aggiustamenti di un piatto (mai negativo). */
export function personeDisponibili(p: Progetto, giorno: number, pasto: Pasto, ricettaId: string): number {
  const a = trovaAssegnazione(p, giorno, pasto, ricettaId);
  return Math.max(0, personePresenti(p, giorno) - (a ? personeImpegnate(a) : 0));
}

export function puoAggiungereAggiustamento(p: Progetto, giorno: number, pasto: Pasto, ricettaId: string, numeroPersone: number): boolean {
  return numeroPersone > 0 && numeroPersone <= personeDisponibili(p, giorno, pasto, ricettaId);
}

export interface CampiAggiustamento { varianteId: string; ingDaId: string; ingAId: string; ingRimId: string; }

/**
 * Gli ingredienti che possono sostituirne uno: solo quelli con la stessa unità (g, ml o pz),
 * perché la dose passa tale e quale al nuovo ingrediente. Senza ingrediente scelto: tutti.
 */
export function ingredientiSostitutivi(p: Progetto, ingDaId: string): Ingrediente[] {
  const unita = indiceIngredienti(p).get(ingDaId)?.unita;
  return ingredientiDisponibili(p).filter((i) => !ingDaId || (i.id !== ingDaId && (!unita || i.unita === unita)));
}

/** Costruisce l'aggiustamento dai campi del modulo, o restituisce l'errore da mostrare. */
export function creaAggiustamento(
  tipo: Aggiustamento['tipo'], c: CampiAggiustamento, numeroPersone: number, p: Progetto,
): Aggiustamento | { errore: string } {
  if (tipo === 'variante') {
    return c.varianteId ? { tipo, ricettaVarianteId: c.varianteId, numeroPersone } : { errore: 'Scegli un piatto alternativo.' };
  }
  if (tipo === 'sostituzione') {
    if (!c.ingDaId || !c.ingAId) return { errore: 'Scegli entrambi gli ingredienti.' };
    const ingredienti = indiceIngredienti(p);
    const da = ingredienti.get(c.ingDaId)?.unita;
    const a = ingredienti.get(c.ingAId)?.unita;
    if (da && a && da !== a) {
      return { errore: `Puoi sostituire solo con un ingrediente che si misura allo stesso modo (${da}).` };
    }
    return { tipo, ingredienteDaId: c.ingDaId, ingredienteAId: c.ingAId, numeroPersone };
  }
  return c.ingRimId ? { tipo, ingredienteId: c.ingRimId, numeroPersone } : { errore: 'Scegli un ingrediente da togliere.' };
}

export function descriviAggiustamento(a: Aggiustamento, p: Progetto): string {
  if (a.tipo === 'variante') return `Variante: ${nomeRicetta(p, a.ricettaVarianteId)} per ${a.numeroPersone} persone`;
  if (a.tipo === 'sostituzione') {
    return `Sostituzione: ${nomeIngrediente(p, a.ingredienteDaId)} → ${nomeIngrediente(p, a.ingredienteAId)} per ${a.numeroPersone} persone`;
  }
  return `Rimozione: ${nomeIngrediente(p, a.ingredienteId)} per ${a.numeroPersone} persone`;
}
