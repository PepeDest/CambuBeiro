import { describe, it, expect } from 'vitest';
import { caricaProgetto, salvaProgettoLocale, CHIAVE_STORAGE, type StorageLike } from '../../src/lib/persistenza';
import { progettoVuoto } from '../../src/core';

function fakeStorage(iniziale: Record<string, string> = {}): StorageLike & { dati: Record<string, string> } {
  const dati = { ...iniziale };
  return { dati, getItem: (k) => (k in dati ? dati[k]! : null), setItem: (k, v) => { dati[k] = v; } };
}

describe('persistenza', () => {
  it('storage vuoto → progetto vuoto', () => {
    expect(caricaProgetto(fakeStorage())).toEqual(progettoVuoto());
  });
  it('salva poi carica → stesso progetto', () => {
    const s = fakeStorage();
    const p = progettoVuoto();
    p.campo.nome = 'Campo Estivo';
    salvaProgettoLocale(s, p);
    expect(caricaProgetto(s)).toEqual(p);
    expect(s.dati[CHIAVE_STORAGE]).toBeDefined();
  });
  it('contenuto rovinato → progetto vuoto (nessun crash)', () => {
    const s = fakeStorage({ [CHIAVE_STORAGE]: '{ rotto' });
    expect(caricaProgetto(s)).toEqual(progettoVuoto());
  });
});
