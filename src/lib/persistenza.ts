import type { Progetto } from '../core';
import { progettoVuoto, serializzaProgetto, deserializzaProgetto } from '../core';
import { ripulisciProgetto } from './ripulisci';

export const CHIAVE_STORAGE = 'cambusa-progetto';
/** Dove finisce una copia del progetto salvato che non si è potuto aprire (per non perderlo). */
export const CHIAVE_RISERVA = 'cambusa-progetto-riserva';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * La memoria locale del browser, se si può usare. Alcuni browser (o impostazioni di privacy)
 * la bloccano e già solo leggerla dà errore: in quel caso l'app funziona senza salvataggio automatico.
 */
export function apriStorage(prendi: () => Storage = () => globalThis.localStorage): StorageLike | undefined {
  try {
    const s = prendi();
    s.getItem(CHIAVE_STORAGE);
    return s;
  } catch {
    return undefined;
  }
}

export interface Caricamento {
  progetto: Progetto;
  /** Messaggi da mostrare all'utente. */
  avvisi: string[];
  /** Il testo del progetto salvato che non si è potuto aprire, se c'era. */
  riserva: string | null;
}

/** Il progetto salvato nel browser, già sistemato se viene da una versione vecchia dell'app. */
export function caricaConAvvisi(storage: StorageLike): Caricamento {
  const testo = storage.getItem(CHIAVE_STORAGE);
  if (testo === null) return { progetto: progettoVuoto(), avvisi: [], riserva: null };
  try {
    const { progetto, avvisi } = ripulisciProgetto(deserializzaProgetto(testo));
    return { progetto, avvisi, riserva: null };
  } catch {
    // Il salvataggio automatico sovrascriverà il progetto illeggibile: prima lo mettiamo da parte.
    try { storage.setItem(CHIAVE_RISERVA, testo); } catch { /* resta comunque scaricabile da `riserva` */ }
    return {
      progetto: progettoVuoto(),
      avvisi: ['Il progetto salvato in questo browser non si poteva aprire: ne ho tenuto una copia di riserva, puoi scaricarla qui.'],
      riserva: testo,
    };
  }
}

export function caricaProgetto(storage: StorageLike): Progetto {
  return caricaConAvvisi(storage).progetto;
}

/** Salva nel browser; false se non è riuscito (memoria piena o bloccata). */
export function salvaProgettoLocale(storage: StorageLike, progetto: Progetto): boolean {
  try {
    storage.setItem(CHIAVE_STORAGE, serializzaProgetto(progetto));
    return true;
  } catch {
    return false;
  }
}

/** Il progetto modificato in un'altra scheda del browser (evento "storage"), oppure null. */
export function progettoDaAltraScheda(e: { key: string | null; newValue: string | null }): Progetto | null {
  if (e.key !== CHIAVE_STORAGE || e.newValue === null) return null;
  try {
    return deserializzaProgetto(e.newValue);
  } catch {
    return null;
  }
}
