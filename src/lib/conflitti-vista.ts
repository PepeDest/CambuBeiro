import type { Progetto, Pasto, Assegnazione, Aggiustamento } from '../core';
import { rilevaConflitti, presenzeGiorno } from '../core';
import { indiceRicette, indiceIngredienti, nomeRicetta, nomeIngrediente } from './catalogo';

export interface ConflittoVista {
  giorno: number; pasto: Pasto; ricettaId: string; nomeRicetta: string;
  tipo: 'allergene' | 'vegetariano'; dettaglio: string; personeInteressate: number; gestito: boolean;
}

export function trovaAssegnazione(p: Progetto, giorno: number, pasto: Pasto, ricettaId: string): Assegnazione | undefined {
  return (p.menu[giorno]?.[pasto] ?? []).find((a) => a.ricettaId === ricettaId);
}

/** Un piatto è "gestito" quando ha almeno un aggiustamento (l'app si fida dell'utente). */
export function piattoGestito(p: Progetto, giorno: number, pasto: Pasto, ricettaId: string): boolean {
  return (trovaAssegnazione(p, giorno, pasto, ricettaId)?.aggiustamenti.length ?? 0) > 0;
}

export function conflittiVista(p: Progetto): ConflittoVista[] {
  return rilevaConflitti(p, indiceRicette(p), indiceIngredienti(p)).map((c) => ({
    ...c,
    nomeRicetta: nomeRicetta(p, c.ricettaId),
    gestito: piattoGestito(p, c.giorno, c.pasto, c.ricettaId),
  }));
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

/** Costruisce l'aggiustamento dai campi del modulo, o restituisce l'errore da mostrare. */
export function creaAggiustamento(
  tipo: Aggiustamento['tipo'], c: CampiAggiustamento, numeroPersone: number,
): Aggiustamento | { errore: string } {
  if (tipo === 'variante') {
    return c.varianteId ? { tipo, ricettaVarianteId: c.varianteId, numeroPersone } : { errore: 'Scegli un piatto alternativo.' };
  }
  if (tipo === 'sostituzione') {
    return c.ingDaId && c.ingAId
      ? { tipo, ingredienteDaId: c.ingDaId, ingredienteAId: c.ingAId, numeroPersone }
      : { errore: 'Scegli entrambi gli ingredienti.' };
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
