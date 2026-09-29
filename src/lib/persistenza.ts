import type { Progetto } from '../core';
import { progettoVuoto, serializzaProgetto, deserializzaProgetto } from '../core';

export const CHIAVE_STORAGE = 'cambusa-progetto';

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
    return progettoVuoto();
  }
}

export function salvaProgettoLocale(storage: StorageLike, progetto: Progetto): void {
  storage.setItem(CHIAVE_STORAGE, serializzaProgetto(progetto));
}
