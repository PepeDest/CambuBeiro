import type { Progetto } from '../core';
import { progettoVuoto, serializzaProgetto, deserializzaProgetto } from '../core';

export const CHIAVE_STORAGE = 'cambusa-progetto';
/** Dove finisce una copia del progetto salvato che non si è potuto aprire (per non perderlo). */
export const CHIAVE_RISERVA = 'cambusa-progetto-riserva';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function caricaProgetto(storage: StorageLike): Progetto {
  const testo = storage.getItem(CHIAVE_STORAGE);
  if (testo === null) return progettoVuoto();
  try {
    return deserializzaProgetto(testo);
  } catch {
    // Il salvataggio automatico sovrascriverà il progetto illeggibile: prima lo mettiamo da parte.
    storage.setItem(CHIAVE_RISERVA, testo);
    return progettoVuoto();
  }
}

export function salvaProgettoLocale(storage: StorageLike, progetto: Progetto): void {
  storage.setItem(CHIAVE_STORAGE, serializzaProgetto(progetto));
}
