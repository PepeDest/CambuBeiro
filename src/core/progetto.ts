import type { Progetto } from './types';

export const VERSIONE_FORMATO = 1;

export function progettoVuoto(): Progetto {
  return {
    versioneFormato: VERSIONE_FORMATO,
    campo: {
      nome: 'Nuovo campo',
      numeroGiorni: 7,
      pastiAttivi: { colazione: true, pranzo: true, cena: true, merenda: false },
      riduzioneBambini: 0.30,
      giorniSpesa: [1],
      giornoTipo: { adulti: 0, bambini: 0, vegetariani: 0, allergici: {} },
    },
    giorni: {},
    menu: {},
    ricetteUtente: [],
    ingredientiUtente: [],
  };
}

export function serializzaProgetto(p: Progetto): string {
  return JSON.stringify(p, null, 2);
}

export function deserializzaProgetto(testo: string): Progetto {
  let dati: unknown;
  try {
    dati = JSON.parse(testo);
  } catch {
    throw new Error('Il file non è un progetto valido (JSON non leggibile).');
  }
  if (dati === null || typeof dati !== 'object' || Array.isArray(dati)) {
    throw new Error('Il file non è un progetto valido.');
  }
  const p = dati as Partial<Progetto>;
  if (p.versioneFormato !== VERSIONE_FORMATO) {
    throw new Error(`Versione del file non compatibile (attesa ${VERSIONE_FORMATO}, trovata ${String(p.versioneFormato)}).`);
  }
  for (const chiave of ['campo', 'giorni', 'menu', 'ricetteUtente', 'ingredientiUtente'] as const) {
    if (p[chiave] === undefined) throw new Error(`File incompleto: manca "${chiave}".`);
  }
  return p as Progetto;
}
